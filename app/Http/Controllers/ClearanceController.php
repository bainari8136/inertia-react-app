<?php

namespace App\Http\Controllers;

use App\Models\ClearanceRequest;
use App\Models\ClearanceStage;
use App\Models\GraduationCohort;
use App\Models\Student;
use App\Services\ClearanceService;
use App\Services\FinanceService;
use App\Services\GradingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClearanceController extends Controller
{
    public function __construct(
        private ClearanceService $clearanceService,
        private FinanceService $financeService,
        private GradingService $gradingService,
    ) {}

    public function index(Request $request)
    {
        abort_unless($request->user()->can('clearance.view'), 403);

        $query = ClearanceRequest::query()
            ->with(['student.programme', 'graduationCohort', 'stages.clearedBy'])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('cohort_id')) {
            $query->where('graduation_cohort_id', $request->cohort_id);
        }

        $clearances = $query->paginate(20)->through(fn (ClearanceRequest $c) => [
            'id' => $c->id,
            'student_id' => $c->student_id,
            'student_name' => $c->student?->fullName(),
            'registration_number' => $c->student?->registration_number,
            'programme' => $c->student?->programme?->name,
            'cohort_name' => $c->graduationCohort?->name,
            'type' => $c->type,
            'status' => $c->status,
            'overall_cgpa' => (float) $c->overall_cgpa,
            'degree_classification' => $c->degree_classification,
            'certificate_number' => $c->certificate_number,
            'submitted_at' => $c->submitted_at?->toFormattedDateString(),
            'completed_at' => $c->completed_at?->toFormattedDateString(),
            'stages_summary' => $c->stages->map(fn (ClearanceStage $s) => [
                'department' => $s->department,
                'status' => $s->status,
            ]),
        ]);

        $cohorts = GraduationCohort::orderByDesc('ceremony_date')->get(['id', 'name']);

        return Inertia::render('Clearance/Index', [
            'clearances' => $clearances,
            'cohorts' => $cohorts,
            'filters' => $request->only(['status', 'type', 'cohort_id']),
            'canApprove' => $request->user()->can('clearance.approve'),
        ]);
    }

    public function show(Request $request, ClearanceRequest $clearance)
    {
        abort_unless($request->user()->can('clearance.view'), 403);

        $clearance->load([
            'student.programme.department.faculty',
            'graduationCohort.academicYear',
            'stages.clearedBy',
        ]);

        $student = $clearance->student;
        $feeBalance = $this->financeService->studentOutstandingBalance($student);
        $cgpa = $this->gradingService->calculateCumulativeGpa($student);

        $isRegistrar = $request->user()->hasAnyRole(['Super Administrator', 'Registrar']);

        return Inertia::render('Clearance/Show', [
            'clearance' => [
                'id' => $clearance->id,
                'type' => $clearance->type,
                'status' => $clearance->status,
                'overall_cgpa' => (float) $clearance->overall_cgpa,
                'degree_classification' => $clearance->degree_classification,
                'certificate_number' => $clearance->certificate_number,
                'submitted_at' => $clearance->submitted_at?->toFormattedDateString(),
                'completed_at' => $clearance->completed_at?->toFormattedDateString(),
                'final_remarks' => $clearance->final_remarks,
                'cohort' => $clearance->graduationCohort ? [
                    'id' => $clearance->graduationCohort->id,
                    'name' => $clearance->graduationCohort->name,
                    'ceremony_date' => $clearance->graduationCohort->ceremony_date?->toFormattedDateString(),
                ] : null,
                'student' => [
                    'id' => $student->id,
                    'registration_number' => $student->registration_number,
                    'name' => $student->fullName(),
                    'programme' => $student->programme?->name,
                    'faculty' => $student->programme?->department?->faculty?->name,
                    'status' => $student->status,
                    'fee_balance' => $feeBalance,
                    'current_cgpa' => $cgpa,
                ],
                'stages' => $clearance->stages->map(fn (ClearanceStage $s) => [
                    'id' => $s->id,
                    'department' => $s->department,
                    'label' => $s->departmentLabel(),
                    'status' => $s->status,
                    'remarks' => $s->remarks,
                    'cleared_by' => $s->clearedBy?->name,
                    'cleared_at' => $s->cleared_at?->toFormattedDateString(),
                ]),
            ],
            'canApprove' => $request->user()->can('clearance.approve'),
            'isRegistrar' => $isRegistrar,
        ]);
    }

    public function myClearance(Request $request)
    {
        $user = $request->user();
        abort_unless($user->can('clearance.request') || $user->hasRole('Student'), 403);

        $student = $user->student;
        abort_if(! $student, 404, 'No student profile linked to this account.');

        $student->load(['programme.department.faculty']);

        $activeClearance = ClearanceRequest::query()
            ->where('student_id', $student->id)
            ->with(['stages.clearedBy', 'graduationCohort'])
            ->latest()
            ->first();

        $openCohorts = GraduationCohort::where('status', GraduationCohort::STATUS_OPEN)
            ->where('is_active', true)
            ->get();

        $feeBalance = $this->financeService->studentOutstandingBalance($student);
        $cgpa = $this->gradingService->calculateCumulativeGpa($student);

        return Inertia::render('Clearance/MyClearance', [
            'student' => [
                'id' => $student->id,
                'registration_number' => $student->registration_number,
                'name' => $student->fullName(),
                'programme' => $student->programme?->name,
                'status' => $student->status,
                'fee_balance' => $feeBalance,
                'cgpa' => $cgpa,
            ],
            'clearance' => $activeClearance ? [
                'id' => $activeClearance->id,
                'type' => $activeClearance->type,
                'status' => $activeClearance->status,
                'overall_cgpa' => (float) $activeClearance->overall_cgpa,
                'degree_classification' => $activeClearance->degree_classification,
                'certificate_number' => $activeClearance->certificate_number,
                'submitted_at' => $activeClearance->submitted_at?->toFormattedDateString(),
                'completed_at' => $activeClearance->completed_at?->toFormattedDateString(),
                'final_remarks' => $activeClearance->final_remarks,
                'cohort_name' => $activeClearance->graduationCohort?->name,
                'stages' => $activeClearance->stages->map(fn (ClearanceStage $s) => [
                    'id' => $s->id,
                    'department' => $s->department,
                    'label' => $s->departmentLabel(),
                    'status' => $s->status,
                    'remarks' => $s->remarks,
                    'cleared_by' => $s->clearedBy?->name,
                    'cleared_at' => $s->cleared_at?->toFormattedDateString(),
                ]),
            ] : null,
            'openCohorts' => $openCohorts,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        abort_unless($user->can('clearance.request') || $user->hasRole('Student'), 403);

        $student = $user->student;
        abort_if(! $student, 404);

        $validated = $request->validate([
            'graduation_cohort_id' => ['nullable', 'exists:graduation_cohorts,id'],
            'type' => ['required', 'in:graduation,departure,transfer'],
        ]);

        $cohort = ! empty($validated['graduation_cohort_id'])
            ? GraduationCohort::find($validated['graduation_cohort_id'])
            : null;

        $this->clearanceService->initiateClearance($student, $cohort, $validated['type']);

        return back()->with('status', 'Clearance request initiated successfully. Departmental stages are now active.');
    }

    public function approveStage(Request $request, ClearanceStage $stage)
    {
        abort_unless($request->user()->can('clearance.approve'), 403);

        $validated = $request->validate([
            'remarks' => ['nullable', 'string', 'max:500'],
        ]);

        $this->clearanceService->updateStage(
            $stage,
            ClearanceStage::STATUS_APPROVED,
            $validated['remarks'] ?? 'Cleared with no holds or outstanding liabilities.',
            $request->user()
        );

        return back()->with('status', "{$stage->departmentLabel()} clearance marked as APPROVED.");
    }

    public function rejectStage(Request $request, ClearanceStage $stage)
    {
        abort_unless($request->user()->can('clearance.approve'), 403);

        $validated = $request->validate([
            'remarks' => ['required', 'string', 'max:500'],
        ]);

        $this->clearanceService->updateStage(
            $stage,
            ClearanceStage::STATUS_REJECTED,
            $validated['remarks'],
            $request->user()
        );

        return back()->with('status', "{$stage->departmentLabel()} clearance marked as HELD / REJECTED.");
    }

    public function certificate(Request $request, ClearanceRequest $clearance)
    {
        $user = $request->user();
        if ($user->hasRole('Student')) {
            abort_if($user->student?->id !== $clearance->student_id, 403);
        } else {
            abort_unless($user->can('clearance.certificate'), 403);
        }

        abort_unless($clearance->status === ClearanceRequest::STATUS_APPROVED, 404, 'Clearance certificate is not yet approved or generated.');

        $clearance->load([
            'student.programme.department.faculty',
            'graduationCohort.academicYear',
            'stages.clearedBy',
        ]);

        return Inertia::render('Clearance/Certificate', [
            'clearance' => [
                'id' => $clearance->id,
                'certificate_number' => $clearance->certificate_number,
                'type' => $clearance->type,
                'completed_at' => $clearance->completed_at?->toFormattedDateString(),
                'overall_cgpa' => (float) $clearance->overall_cgpa,
                'degree_classification' => $clearance->degree_classification,
                'cohort_name' => $clearance->graduationCohort?->name,
                'student' => [
                    'name' => $clearance->student?->fullName(),
                    'registration_number' => $clearance->student?->registration_number,
                    'gender' => $clearance->student?->gender,
                    'programme' => $clearance->student?->programme?->name,
                    'programme_code' => $clearance->student?->programme?->code,
                    'faculty' => $clearance->student?->programme?->department?->faculty?->name,
                    'admitted_at' => $clearance->student?->admitted_at?->toDateString(),
                ],
                'stages' => $clearance->stages->map(fn (ClearanceStage $s) => [
                    'department' => $s->department,
                    'label' => $s->departmentLabel(),
                    'status' => $s->status,
                    'cleared_by' => $s->clearedBy?->name,
                    'cleared_at' => $s->cleared_at?->toFormattedDateString(),
                    'remarks' => $s->remarks,
                ]),
            ],
        ]);
    }
}
