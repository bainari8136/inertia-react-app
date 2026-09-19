<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Student::class);

        $students = Student::query()
            ->with('programme:id,name,code')
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->string('search');
                $q->where(function ($inner) use ($search) {
                    $inner->where('registration_number', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('programme_id'), fn ($q) => $q->where('programme_id', $request->integer('programme_id')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->orderBy('last_name')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Student $s) => [
                'id' => $s->id,
                'registration_number' => $s->registration_number,
                'full_name' => $s->fullName(),
                'email' => $s->email,
                'programme' => $s->programme?->name,
                'status' => $s->status,
            ]);

        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => $request->only(['search', 'programme_id', 'status']),
            'programmes' => Programme::orderBy('name')->get(['id', 'name']),
            'statuses' => Student::STATUSES,
        ]);
    }

    public function show(Student $student)
    {
        $this->authorize('view', $student);

        $student->load(['programme.department.faculty', 'documents', 'user']);

        return Inertia::render('Students/Show', [
            'student' => $this->studentPayload($student),
            'statuses' => Student::STATUSES,
            'can' => [
                'update' => request()->user()->can('update', $student),
                'manageStatus' => request()->user()->can('manageStatus', $student),
            ],
        ]);
    }

    public function edit(Student $student)
    {
        $this->authorize('update', $student);

        $student->load('programme');

        return Inertia::render('Students/Edit', [
            'student' => $this->studentPayload($student),
            'programmes' => Programme::query()
                ->orderBy('name')
                ->get()
                ->map(fn (Programme $p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'label' => "{$p->name} ({$p->code})",
                ]),
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $this->authorize('update', $student);

        $data = $request->validate([
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

        $student->update($data);

        if ($student->user) {
            $student->user->update([
                'name' => $student->fresh()->fullName(),
                'email' => $data['email'],
            ]);
        }

        $this->storeDocuments($student, $request);

        return redirect()
            ->route('students.show', $student)
            ->with('status', 'Student profile updated successfully.');
    }

    public function updateStatus(Request $request, Student $student)
    {
        $this->authorize('manageStatus', $student);

        $data = $request->validate([
            'status' => ['required', 'in:'.implode(',', Student::STATUSES)],
        ]);

        $student->update(['status' => $data['status']]);

        return back()->with('status', 'Student status updated successfully.');
    }

    private function storeDocuments(Student $student, Request $request): void
    {
        if (! $request->hasFile('documents')) {
            return;
        }

        foreach ($request->file('documents') as $file) {
            $path = $file->store('student-documents', 'local');
            $student->documents()->create([
                'document_type' => 'profile',
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $path,
            ]);
        }
    }

    /** @return array<string, mixed> */
    private function studentPayload(Student $student): array
    {
        return [
            'id' => $student->id,
            'registration_number' => $student->registration_number,
            'status' => $student->status,
            'programme_id' => $student->programme_id,
            'programme' => $student->programme?->name,
            'department' => $student->programme?->department?->name,
            'faculty' => $student->programme?->department?->faculty?->name,
            'first_name' => $student->first_name,
            'last_name' => $student->last_name,
            'middle_name' => $student->middle_name,
            'email' => $student->email,
            'phone' => $student->phone,
            'date_of_birth' => $student->date_of_birth?->toDateString(),
            'gender' => $student->gender,
            'address' => $student->address,
            'city' => $student->city,
            'country' => $student->country,
            'guardian_name' => $student->guardian_name,
            'guardian_phone' => $student->guardian_phone,
            'guardian_relationship' => $student->guardian_relationship,
            'academic_history' => $student->academic_history,
            'admitted_at' => $student->admitted_at?->toDateString(),
            'documents' => $student->documents->map(fn ($d) => [
                'id' => $d->id,
                'original_name' => $d->original_name,
                'document_type' => $d->document_type,
            ]),
        ];
    }
}
