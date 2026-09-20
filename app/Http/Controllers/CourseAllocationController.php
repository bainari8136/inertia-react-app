<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseAllocation;
use App\Models\Semester;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseAllocationController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', CourseAllocation::class);

        $user = $request->user();

        $query = CourseAllocation::query()
            ->with(['course.programme', 'semester.academicYear', 'lecturer'])
            ->latest();

        if ($user->hasRole('Lecturer') && ! $user->can('allocations.manage')) {
            $query->where('lecturer_id', $user->id);
        }

        if ($request->filled('semester_id')) {
            $query->where('semester_id', $request->integer('semester_id'));
        }

        $allocations = $query->paginate(15)->withQueryString()->through(fn (CourseAllocation $a) => [
            'id' => $a->id,
            'course_code' => $a->course?->code,
            'course_name' => $a->course?->name,
            'programme' => $a->course?->programme?->name,
            'semester' => $a->semester?->name,
            'academic_year' => $a->semester?->academicYear?->name,
            'lecturer_name' => $a->lecturer?->name,
            'lecturer_email' => $a->lecturer?->email,
            'class_group' => $a->class_group,
        ]);

        return Inertia::render('Academic/Allocations/Index', [
            'allocations' => $allocations,
            'courses' => Course::orderBy('code')->get(['id', 'code', 'name']),
            'semesters' => Semester::with('academicYear')->orderByDesc('starts_on')->get()->map(fn ($s) => [
                'id' => $s->id,
                'label' => "{$s->name} ({$s->academicYear?->name})",
            ]),
            'lecturers' => User::role('Lecturer')->orderBy('name')->get(['id', 'name', 'email']),
            'canManage' => $user->can('allocations.manage'),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', CourseAllocation::class);

        $data = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'semester_id' => ['required', 'exists:semesters,id'],
            'lecturer_id' => ['required', 'exists:users,id'],
            'class_group' => ['nullable', 'string', 'max:50'],
        ]);

        CourseAllocation::firstOrCreate([
            'course_id' => $data['course_id'],
            'semester_id' => $data['semester_id'],
            'lecturer_id' => $data['lecturer_id'],
            'class_group' => $data['class_group'] ?? 'Main',
        ]);

        return back()->with('status', 'Course allocated to lecturer successfully.');
    }

    public function destroy(CourseAllocation $allocation)
    {
        $this->authorize('delete', $allocation);

        $allocation->delete();

        return back()->with('status', 'Course allocation removed.');
    }
}
