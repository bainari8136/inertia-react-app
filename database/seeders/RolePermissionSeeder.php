<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $all = PermissionSeeder::PERMISSIONS;

        $financePerms = [
            'fees.view',
            'fees.manage',
            'invoices.view',
            'invoices.create',
            'payments.record',
            'finance.reports',
        ];

        $studentMgmt = [
            'applicants.view',
            'applicants.create',
            'applicants.update',
            'applicants.admit',
            'students.view',
            'students.update',
            'students.manage-status',
            'academic.manage',
            'registrations.view',
            'registrations.approve',
        ];

        Role::findByName('Super Administrator', 'web')->syncPermissions($all);

        Role::findByName('Finance Officer', 'web')->syncPermissions([
            'users.view',
            'students.view',
            'registrations.view',
            ...$financePerms,
        ]);

        Role::findByName('Human Resource Officer', 'web')->syncPermissions([
            'users.view',
            'users.create',
            'users.update',
            'users.activate',
        ]);

        Role::findByName('Procurement Officer', 'web')->syncPermissions(['users.view']);
        Role::findByName('Lecturer', 'web')->syncPermissions([
            'students.view',
            'registrations.view',
            'allocations.view',
            'marks.enter',
            'results.view',
        ]);
        Role::findByName('Head of Department', 'web')->syncPermissions([
            'users.view',
            'students.view',
            'applicants.view',
            'registrations.view',
            'registrations.approve',
            'fees.view',
            'invoices.view',
            'allocations.manage',
            'allocations.view',
            'marks.publish',
            'results.view',
        ]);
        Role::findByName('Registrar', 'web')->syncPermissions([
            'users.view',
            'users.create',
            'users.update',
            'users.activate',
            'roles.view',
            ...$studentMgmt,
            'fees.view',
            'invoices.view',
            'allocations.manage',
            'allocations.view',
            'marks.publish',
            'results.view',
        ]);
        Role::findByName('Student', 'web')->syncPermissions([
            'registrations.register',
            'invoices.view-own',
            'results.view-own',
        ]);
    }
}
