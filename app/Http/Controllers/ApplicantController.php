<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Models\Programme;
use App\Services\AdmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicantController extends Controller
{
    public function __construct(
        private AdmissionService $admissionService,
    ) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', Applicant::class);

        $applicants = Applicant::query()
            ->with('programme:id,name,code')
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->string('search');
                $q->where(function ($inner) use ($search) {
                    $inner->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Applicant $a) => [
                'id' => $a->id,
                'full_name' => $a->fullName(),
                'email' => $a->email,
                'programme' => $a->programme?->name,
                'status' => $a->status,
                'created_at' => $a->created_at?->toDateString(),
            ]);

        return Inertia::render('Applicants/Index', [
            'applicants' => $applicants,
            'filters' => $request->only(['search', 'status']),
            'statuses' => [
                Applicant::STATUS_PENDING,
                Applicant::STATUS_APPROVED,
                Applicant::STATUS_REJECTED,
            ],
        ]);
    }

    public function create()
    {
        $this->authorize('create', Applicant::class);

        return Inertia::render('Applicants/Create', [
            'programmes' => $this->programmeOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Applicant::class);

        $data = $this->validatedApplicantData($request);
        $applicant = Applicant::create($data);

        $this->storeDocuments($applicant, $request);

        return redirect()
            ->route('applicants.show', $applicant)
            ->with('status', 'Applicant record created successfully.');
    }

    public function show(Applicant $applicant)
    {
        $this->authorize('view', $applicant);

        $applicant->load(['programme.department.faculty', 'documents', 'student']);

        return Inertia::render('Applicants/Show', [
            'applicant' => $this->applicantPayload($applicant),
        ]);
    }

    public function edit(Applicant $applicant)
    {
        $this->authorize('update', $applicant);

        return Inertia::render('Applicants/Edit', [
            'applicant' => $this->applicantPayload($applicant),
            'programmes' => $this->programmeOptions(),
        ]);
    }

    public function update(Request $request, Applicant $applicant)
    {
        $this->authorize('update', $applicant);

        $applicant->update($this->validatedApplicantData($request));
        $this->storeDocuments($applicant, $request);

        return redirect()
            ->route('applicants.show', $applicant)
            ->with('status', 'Applicant record updated successfully.');
    }

    public function approve(Request $request, Applicant $applicant)
    {
        $this->authorize('admit', $applicant);

        $request->validate([
            'create_user_account' => ['boolean'],
        ]);

        $student = $this->admissionService->approve(
            $applicant,
            $request->user(),
            $request->boolean('create_user_account', true),
        );

        return redirect()
            ->route('students.show', $student)
            ->with('status', "Admission approved. Registration number: {$student->registration_number}");
    }

    public function reject(Request $request, Applicant $applicant)
    {
        $this->authorize('admit', $applicant);

        $data = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:1000'],
        ]);

        $this->admissionService->reject($applicant, $request->user(), $data['rejection_reason']);

        return redirect()
            ->route('applicants.show', $applicant)
            ->with('status', 'Application rejected.');
    }

    /** @return array<string, mixed> */
    private function validatedApplicantData(Request $request): array
    {
        return $request->validate([
            'programme_id' => ['required', 'exists:programmes,id'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:50'],
            'guardian_relationship' => ['nullable', 'string', 'max:100'],
            'academic_history' => ['nullable', 'string'],
        ]);
    }

    private function storeDocuments(Applicant $applicant, Request $request): void
    {
        if (! $request->hasFile('documents')) {
            return;
        }

        foreach ($request->file('documents') as $file) {
            $path = $file->store('admission-documents', 'local');
            $applicant->documents()->create([
                'document_type' => 'admission',
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $path,
            ]);
        }
    }

    /** @return list<array{id: int, name: string, label: string}> */
    private function programmeOptions(): array
    {
        return Programme::query()
            ->with('department')
            ->orderBy('name')
            ->get()
            ->map(fn (Programme $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'label' => "{$p->name} ({$p->code})",
            ])
            ->values()
            ->all();
    }

    /** @return array<string, mixed> */
    private function applicantPayload(Applicant $applicant): array
    {
        return [
            'id' => $applicant->id,
            'status' => $applicant->status,
            'programme_id' => $applicant->programme_id,
            'programme' => $applicant->programme?->name,
            'first_name' => $applicant->first_name,
            'last_name' => $applicant->last_name,
            'middle_name' => $applicant->middle_name,
            'email' => $applicant->email,
            'phone' => $applicant->phone,
            'date_of_birth' => $applicant->date_of_birth?->toDateString(),
            'gender' => $applicant->gender,
            'address' => $applicant->address,
            'city' => $applicant->city,
            'country' => $applicant->country,
            'guardian_name' => $applicant->guardian_name,
            'guardian_phone' => $applicant->guardian_phone,
            'guardian_relationship' => $applicant->guardian_relationship,
            'academic_history' => $applicant->academic_history,
            'rejection_reason' => $applicant->rejection_reason,
            'student_id' => $applicant->student?->id,
            'registration_number' => $applicant->student?->registration_number,
            'documents' => $applicant->documents->map(fn ($d) => [
                'id' => $d->id,
                'original_name' => $d->original_name,
                'document_type' => $d->document_type,
            ]),
        ];
    }
}
