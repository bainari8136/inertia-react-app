<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Course;
use App\Models\Programme;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicController extends Controller
{
    public function semesters()
    {
        $this->authorize('manage', Semester::class);

        $semesters = Semester::query()
            ->with('academicYear:id,name')
            ->orderByDesc('starts_on')
            ->get()
            ->map(fn (Semester $s) => [
                'id' => $s->id,
                'name' => $s->name,
                'academic_year' => $s->academicYear?->name,
                'starts_on' => $s->starts_on->toDateString(),
                'ends_on' => $s->ends_on->toDateString(),
                'registration_opens_at' => $s->registration_opens_at?->toDateTimeString(),
                'registration_closes_at' => $s->registration_closes_at?->toDateTimeString(),
                'is_current' => $s->is_current,
                'registration_open' => $s->isRegistrationOpen(),
            ]);

        return Inertia::render('Academic/Semesters', [
            'semesters' => $semesters,
            'academicYears' => AcademicYear::orderByDesc('starts_on')->get(['id', 'name']),
        ]);
    }

    public function storeSemester(Request $request)
    {
        $this->authorize('manage', Semester::class);

        $data = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'name' => ['required', 'string', 'max:255'],
            'starts_on' => ['required', 'date'],
            'ends_on' => ['required', 'date', 'after:starts_on'],
            'registration_opens_at' => ['required', 'date'],
            'registration_closes_at' => ['required', 'date', 'after:registration_opens_at'],
            'is_current' => ['boolean'],
        ]);

        if ($request->boolean('is_current')) {
            Semester::query()->update(['is_current' => false]);
        }

        Semester::create([
            ...$data,
            'registration_opens_at' => $data['registration_opens_at'],
            'registration_closes_at' => $data['registration_closes_at'],
            'is_current' => $request->boolean('is_current'),
        ]);

        return back()->with('status', 'Semester created successfully.');
    }

    public function storeAcademicYear(Request $request)
    {
        $this->authorize('manage', Semester::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'starts_on' => ['required', 'date'],
            'ends_on' => ['required', 'date', 'after:starts_on'],
            'is_current' => ['boolean'],
        ]);

        if ($request->boolean('is_current')) {
            AcademicYear::query()->update(['is_current' => false]);
        }

        AcademicYear::create([
            ...$data,
            'is_current' => $request->boolean('is_current'),
        ]);

        return back()->with('status', 'Academic year created successfully.');
    }

    public function courses()
    {
        $this->authorize('viewAny', Course::class);

        $courses = Course::query()
            ->with('programme:id,name,code')
            ->orderBy('code')
            ->get()
            ->map(fn (Course $c) => [
                'id' => $c->id,
                'code' => $c->code,
                'name' => $c->name,
                'credit_hours' => $c->credit_hours,
                'programme' => $c->programme?->name,
            ]);

        return Inertia::render('Academic/Courses', [
            'courses' => $courses,
            'programmes' => Programme::orderBy('name')->get(['id', 'name', 'code']),
            'canManage' => request()->user()->can('academic.manage'),
        ]);
    }

    public function storeCourse(Request $request)
    {
        $this->authorize('manage', Course::class);

        $request->validate([
            'programme_id' => ['required', 'exists:programmes,id'],
            'code' => ['required', 'string', 'max:20'],
            'name' => ['required', 'string', 'max:255'],
            'credit_hours' => ['required', 'integer', 'min:1', 'max:12'],
        ]);

        Course::create($request->only('programme_id', 'code', 'name', 'credit_hours'));

        return back()->with('status', 'Course created successfully.');
    }
}
