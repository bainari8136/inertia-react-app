<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * @var list<string>
     */
    public const PERMISSIONS = [
        'users.view',
        'users.create',
        'users.update',
        'users.activate',
        'roles.view',
        'roles.manage',
        'applicants.view',
        'applicants.create',
        'applicants.update',
        'applicants.admit',
        'students.view',
        'students.update',
        'students.manage-status',
        'academic.manage',
        'registrations.view',
        'registrations.register',
        'registrations.approve',
        'fees.view',
        'fees.manage',
        'invoices.view',
        'invoices.view-own',
        'invoices.create',
        'payments.record',
        'finance.reports',
        'allocations.view',
        'allocations.manage',
        'marks.enter',
        'marks.publish',
        'results.view',
        'results.view-own',
        'clearance.request',
        'clearance.view',
        'clearance.approve',
        'clearance.certificate',
        'graduation.manage',
    ];

    public function run(): void
    {
        foreach (self::PERMISSIONS as $name) {
            Permission::firstOrCreate([
                'name' => $name,
                'guard_name' => 'web',
            ]);
        }
    }
}
