<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RoleSeeder::class,
            PermissionSeeder::class,
            RolePermissionSeeder::class,
        ]);
    }

    public function test_registrar_can_create_user(): void
    {
        $registrar = User::factory()->create();
        $registrar->assignRole('Registrar');

        $this->actingAs($registrar)
            ->post(route('users.store'), [
                'name' => 'New Staff',
                'email' => 'staff@university.test',
                'password' => 'SecureP@ss123!',
                'password_confirmation' => 'SecureP@ss123!',
                'role' => 'Lecturer',
                'is_active' => true,
            ])
            ->assertRedirect(route('users.index'));

        $this->assertDatabaseHas('users', [
            'email' => 'staff@university.test',
            'is_active' => true,
        ]);

        $this->assertTrue(
            User::where('email', 'staff@university.test')->first()->hasRole('Lecturer')
        );
    }

    public function test_user_creation_fails_when_password_does_not_meet_policy(): void
    {
        $registrar = User::factory()->create();
        $registrar->assignRole('Registrar');

        $this->actingAs($registrar)
            ->from(route('users.create'))
            ->post(route('users.store'), [
                'name' => 'Weak User',
                'email' => 'weak@university.test',
                'password' => 'weak',
                'password_confirmation' => 'weak',
                'role' => 'Lecturer',
                'is_active' => true,
            ])
            ->assertRedirect(route('users.create'))
            ->assertSessionHasErrors('password');

        $this->assertDatabaseMissing('users', [
            'email' => 'weak@university.test',
        ]);
    }

    public function test_student_cannot_view_users(): void
    {
        $student = User::factory()->create();
        $student->assignRole('Student');

        $this->actingAs($student)
            ->get(route('users.index'))
            ->assertForbidden();
    }

    public function test_registrar_can_disable_user(): void
    {
        $registrar = User::factory()->create();
        $registrar->assignRole('Registrar');

        $target = User::factory()->create(['is_active' => true]);

        $this->actingAs($registrar)
            ->from(route('users.index'))
            ->patch(route('users.toggle-active', $target))
            ->assertRedirect(route('users.index'));

        $this->assertFalse($target->fresh()->is_active);
    }

    public function test_user_cannot_disable_own_account(): void
    {
        $registrar = User::factory()->create(['is_active' => true]);
        $registrar->assignRole('Registrar');

        $this->actingAs($registrar)
            ->from(route('users.index'))
            ->patch(route('users.toggle-active', $registrar))
            ->assertRedirect(route('users.index'))
            ->assertSessionHasErrors('user');

        $this->assertTrue($registrar->fresh()->is_active);
    }

    public function test_super_admin_can_manage_role_permissions(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Super Administrator');

        $role = \Spatie\Permission\Models\Role::findByName('Lecturer', 'web');

        $this->actingAs($admin)
            ->put(route('roles.update', $role), [
                'permissions' => ['users.view'],
            ])
            ->assertRedirect(route('roles.index'));

        $this->assertTrue($role->fresh()->hasPermissionTo('users.view'));
    }
}
