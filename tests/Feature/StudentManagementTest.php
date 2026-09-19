<?php

namespace Tests\Feature;

use App\Models\Applicant;
use App\Models\Programme;
use App\Models\Student;
use App\Models\User;
use Database\Seeders\AcademicSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentManagementTest extends TestCase
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
        ]);
    }

    public function test_registrar_can_create_applicant(): void
    {
        $registrar = User::factory()->create();
        $registrar->assignRole('Registrar');
        $programme = Programme::first();

        $this->actingAs($registrar)
            ->post(route('applicants.store'), [
                'programme_id' => $programme->id,
                'first_name' => 'Jane',
                'last_name' => 'Doe',
                'email' => 'jane@university.test',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('applicants', [
            'email' => 'jane@university.test',
            'status' => Applicant::STATUS_PENDING,
        ]);
    }

    public function test_registrar_can_approve_admission_and_generate_registration_number(): void
    {
        $registrar = User::factory()->create();
        $registrar->assignRole('Registrar');

        $applicant = Applicant::create([
            'programme_id' => Programme::first()->id,
            'status' => Applicant::STATUS_PENDING,
            'first_name' => 'John',
            'last_name' => 'Smith',
            'email' => 'john@university.test',
        ]);

        $this->actingAs($registrar)
            ->post(route('applicants.approve', $applicant))
            ->assertRedirect();

        $student = Student::where('email', 'john@university.test')->first();
        $this->assertNotNull($student);
        $this->assertMatchesRegularExpression('/BSC-CS\/\d{4}\/\d{4}/', $student->registration_number);
        $this->assertEquals(Applicant::STATUS_APPROVED, $applicant->fresh()->status);
    }

    public function test_student_search_by_registration_number(): void
    {
        $registrar = User::factory()->create();
        $registrar->assignRole('Registrar');

        Student::create([
            'programme_id' => Programme::first()->id,
            'registration_number' => 'BSC-CS/2026/0001',
            'status' => Student::STATUS_ACTIVE,
            'first_name' => 'Ada',
            'last_name' => 'Lovelace',
            'email' => 'ada@university.test',
            'admitted_at' => now(),
        ]);

        $this->actingAs($registrar)
            ->get(route('students.index', ['search' => 'BSC-CS/2026/0001']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Students/Index')
                ->has('students.data', 1)
            );
    }

    public function test_admin_dashboard_shows_stats(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Super Administrator');

        Applicant::create([
            'programme_id' => Programme::first()->id,
            'status' => Applicant::STATUS_PENDING,
            'first_name' => 'Pending',
            'last_name' => 'User',
            'email' => 'pending@university.test',
        ]);

        $this->actingAs($admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Dashboard/Admin')
                ->where('stats.pending_admissions', 1)
            );
    }
}
