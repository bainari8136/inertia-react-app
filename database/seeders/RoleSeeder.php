<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * MVP roles from FEATURES.md.
     *
     * @var list<string>
     */
    public const ROLES = [
        'Super Administrator',
        'Registrar',
        'Finance Officer',
        'Human Resource Officer',
        'Procurement Officer',
        'Lecturer',
        'Head of Department',
        'Student',
    ];

    public function run(): void
    {
        foreach (self::ROLES as $name) {
            Role::firstOrCreate([
                'name' => $name,
                'guard_name' => 'web',
            ]);
        }
    }
}
