<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Programme;
use App\Models\Semester;
use App\Models\SemesterRegistration;
use App\Models\Student;
use App\Models\User;
use App\Services\RegistrationService;
use Database\Seeders\AcademicSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RegistrationCalendarSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseRegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RoleSeeder::class,
            PermissionSeeder::class,
            RolePermissionSeeder::class,
            AcademicSeeder::class,
            RegistrationCalendarSeeder::class,
        ]);
    }

    public function test_student_can_register_for_courses_and_submit(): void
    {
        $programme = Programme::where('code', 'BSC-CS')->first();
        $studentUser = User::factory()->create();
        $studentUser->assignRole('Student');

        $student = Student::create([
            'user_id' => $studentUser->id,
            'programme_id' => $programme->id,
            'registration_number' => 'BSC-CS/2026/0099',
            'status' => Student::STATUS_ACTIVE,
            'first_name' => 'Test',
            'last_name' => 'Student',
            'email' => 'student@university.test',
            'admitted_at' => now(),
        ]);

        $semester = Semester::query()->current()->first();
        $course = Course::where('programme_id', $programme->id)->first();

        $this->actingAs($studentUser)
            ->post(route('registration.start'))
            ->assertRedirect();

        $registration = SemesterRegistration::where('student_id', $student->id)->first();
        $this->assertNotNull($registration);

        $this->actingAs($studentUser)
            ->post(route('registration.courses.add', $registration), [
                'course_id' => $course->id,
            ])
            ->assertRedirect();

        $this->actingAs($studentUser)
            ->post(route('registration.submit', $registration))
            ->assertRedirect(route('registration.index'));

        $this->assertEquals(SemesterRegistration::STATUS_PENDING, $registration->fresh()->status);
    }

    public function test_registrar_can_approve_registration(): void
    {
        $programme = Programme::where('code', 'BSC-CS')->first();
        $student = Student::create([
            'programme_id' => $programme->id,
            'registration_number' => 'BSC-CS/2026/0100',
            'status' => Student::STATUS_ACTIVE,
            'first_name' => 'Approve',
            'last_name' => 'Me',
            'email' => 'approve@university.test',
            'admitted_at' => now(),
        ]);

        $semester = Semester::query()->current()->first();
        $service = app(RegistrationService::class);
        $registration = $service->findOrCreateDraft($student, $semester);
        $course = Course::where('programme_id', $programme->id)->first();
        $service->addCourse($registration, $course);
        $service->submit($registration);

        $registrar = User::factory()->create();
        $registrar->assignRole('Registrar');

        $this->actingAs($registrar)
            ->post(route('registration-approvals.approve', $registration))
            ->assertRedirect(route('registration-approvals.index'));

        $this->assertEquals(SemesterRegistration::STATUS_APPROVED, $registration->fresh()->status);
    }
}
