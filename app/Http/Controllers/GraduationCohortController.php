<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\ClearanceRequest;
use App\Models\GraduationCohort;
use App\Services\ClearanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GraduationCohortController extends Controller
{
    public function __construct(
        private ClearanceService $clearanceService,
    ) {}

    public function index(Request $request)
    {
        abort_unless($request->user()->can('graduation.manage') || $request->user()->can('clearance.view'), 403);

        $cohorts = GraduationCohort::query()
            ->with('academicYear')
            ->withCount([
                'clearanceRequests',
                'clearanceRequests as cleared_count' => fn ($q) => $q->where('status', ClearanceRequest::STATUS_APPROVED),
            ])
            ->orderByDesc('ceremony_date')
            ->get()
            ->map(fn (GraduationCohort $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'academic_year' => $c->academicYear?->name,
                'ceremony_date' => $c->ceremony_date?->toFormattedDateString(),
                'status' => $c->status,
                'is_active' => $c->is_active,
                'total_candidates' => $c->clearance_requests_count,
                'cleared_graduands' => $c->cleared_count,
            ]);

        $academicYears = AcademicYear::orderByDesc('starts_on')->get(['id', 'name']);

        return Inertia::render('Graduation/Index', [
            'cohorts' => $cohorts,
            'academicYears' => $academicYears,
            'canManage' => $request->user()->can('graduation.manage'),
        ]);
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->can('graduation.manage'), 403);

        $validated = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'name' => ['required', 'string', 'max:255'],
            'ceremony_date' => ['required', 'date'],
            'status' => ['required', 'in:upcoming,open_for_clearance,concluded'],
        ]);

        GraduationCohort::create($validated);

        return back()->with('status', 'Graduation ceremony cohort created successfully.');
    }

    public function show(Request $request, GraduationCohort $cohort)
    {
        abort_unless($request->user()->can('graduation.manage') || $request->user()->can('clearance.view'), 403);

        $graduationData = $this->clearanceService->getGraduationList($cohort);

        return Inertia::render('Graduation/Show', [
            'data' => $graduationData,
            'canManage' => $request->user()->can('graduation.manage'),
        ]);
    }
}
