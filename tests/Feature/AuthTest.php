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
                'password' => 'NewP@ssword2!',
                'password_confirmation' => 'NewP@ssword2!',
            ])
            ->assertRedirect(route('password.change'))
            ->assertSessionHas('status');

        $this->assertTrue(Hash::check('NewP@ssword2!', $user->fresh()->password));
    }

    public function test_password_change_fails_when_password_does_not_meet_complexity(): void
    {
        $user = User::factory()->create([
            'password' => 'CurrentP@ss1!',
        ]);

        $this->actingAs($user)
            ->from(route('password.change'))
            ->put(route('password.change.update'), [
                'current_password' => 'CurrentP@ss1!',
                'password' => 'simple',
                'password_confirmation' => 'simple',
            ])
            ->assertRedirect(route('password.change'))
            ->assertSessionHasErrors('password');
    }

    public function test_password_change_fails_when_new_password_matches_current(): void
    {
        $user = User::factory()->create([
            'password' => 'CurrentP@ss1!',
        ]);

        $this->actingAs($user)
            ->from(route('password.change'))
            ->put(route('password.change.update'), [
                'current_password' => 'CurrentP@ss1!',
                'password' => 'CurrentP@ss1!',
                'password_confirmation' => 'CurrentP@ss1!',
            ])
            ->assertRedirect(route('password.change'))
            ->assertSessionHasErrors(['password' => 'The new password must be different from your current password.']);
    }

    public function test_login_is_throttled_after_consecutive_failed_attempts(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->post(route('login'), [
                'email' => 'throttled@university.test',
                'password' => 'wrong-pass',
            ])->assertSessionHasErrors('email');
        }

        $response = $this->post(route('login'), [
            'email' => 'throttled@university.test',
            'password' => 'wrong-pass',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertStringContainsString('Too many login attempts', session('errors')->first('email'));
    }
}
