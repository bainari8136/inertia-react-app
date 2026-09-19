<?php

namespace App\Http\Controllers;

use App\Models\FeeStructure;
use App\Models\Programme;
use App\Models\Semester;
use App\Services\FinanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeeStructureController extends Controller
{
    public function __construct(
        private FinanceService $financeService,
    ) {}

    public function index()
    {
        $this->authorize('viewAny', FeeStructure::class);

        $fees = FeeStructure::query()
            ->with(['programme:id,name,code', 'semester:id,name'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (FeeStructure $f) => [
                'id' => $f->id,
                'name' => $f->name,
                'amount' => (float) $f->amount,
                'programme' => $f->programme?->name,
                'semester' => $f->semester?->name,
                'is_active' => $f->is_active,
            ]);

        return Inertia::render('Finance/FeeStructures', [
            'feeStructures' => $fees,
            'programmes' => Programme::orderBy('name')->get(['id', 'name', 'code']),
            'semesters' => Semester::with('academicYear')->orderByDesc('starts_on')->get()->map(fn ($s) => [
                'id' => $s->id,
                'label' => "{$s->name} ({$s->academicYear?->name})",
            ]),
            'canManage' => request()->user()->can('manage', FeeStructure::class),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('manage', FeeStructure::class);

        $data = $request->validate([
            'programme_id' => ['required', 'exists:programmes,id'],
            'semester_id' => ['nullable', 'exists:semesters,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'amount' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        FeeStructure::create([
            ...$data,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('status', 'Fee structure created successfully.');
    }

    public function update(Request $request, FeeStructure $feeStructure)
    {
        $this->authorize('manage', FeeStructure::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'amount' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $feeStructure->update([
            ...$data,
            'is_active' => $request->boolean('is_active', $feeStructure->is_active),
        ]);

        return back()->with('status', 'Fee structure updated successfully.');
    }

    public function bulkInvoice(Request $request, FeeStructure $feeStructure)
    {
        $this->authorize('create', \App\Models\Invoice::class);

        $created = $this->financeService->bulkInvoiceForProgramme($feeStructure, $request->user());

        return back()->with('status', count($created).' invoice(s) generated for active students.');
    }
}
