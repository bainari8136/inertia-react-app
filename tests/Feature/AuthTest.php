<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
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

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('users.index'))->assertRedirect(route('login.form'));
    }

    public function test_user_can_login_and_logout(): void
    {
        $user = User::factory()->create([
            'email' => 'staff@university.test',
            'password' => 'password123',
            'is_active' => true,
        ]);
        $user->assignRole('Registrar');

        $this->post(route('login'), [
            'email' => 'staff@university.test',
            'password' => 'password123',
        ])->assertRedirect(route('dashboard'));

        $this->assertAuthenticatedAs($user);

        $this->post(route('logout'))->assertRedirect(route('login.form'));
        $this->assertGuest();
    }

    public function test_inactive_user_cannot_login(): void
    {
        User::factory()->create([
            'email' => 'inactive@university.test',
            'password' => 'password123',
            'is_active' => false,
        ]);

        $this->from(route('login.form'))
            ->post(route('login'), [
                'email' => 'inactive@university.test',
                'password' => 'password123',
            ])
            ->assertRedirect(route('login.form'))
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_authenticated_user_can_change_password(): void
    {
        $user = User::factory()->create([
            'password' => 'old-password1',
        ]);

        $this->actingAs($user)
            ->from(route('password.change'))
            ->put(route('password.change.update'), [
                'current_password' => 'old-password1',
                'password' => 'new-password2',
                'password_confirmation' => 'new-password2',
            ])
            ->assertRedirect(route('password.change'))
            ->assertSessionHas('status');

        $this->assertTrue(Hash::check('new-password2', $user->fresh()->password));
    }
}
