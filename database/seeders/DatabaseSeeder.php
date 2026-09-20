<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
            RolePermissionSeeder::class,
            AcademicSeeder::class,
            RegistrationCalendarSeeder::class,
            FinanceSeeder::class,
            ExaminationSeeder::class,
        ]);

        $user = User::query()->firstOrCreate(
            ['email' => 'bainari@example.com'],
            [
                'name' => 'bainari',
                'password' => '12345678',
                'is_active' => true,
            ]
        );

        if (! $user->hasRole('Super Administrator')) {
            $user->assignRole('Super Administrator');
        }
    }
}
