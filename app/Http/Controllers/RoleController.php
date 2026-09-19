<?php

namespace App\Http\Controllers;

use Database\Seeders\PermissionSeeder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Role::class);

        $roles = Role::query()
            ->where('guard_name', 'web')
            ->withCount('permissions')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions_count' => $role->permissions_count,
            ]);

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
        ]);
    }

    public function edit(Role $role)
    {
        $this->authorize('update', $role);

        return Inertia::render('Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->values()->all(),
            ],
            'permissions' => PermissionSeeder::PERMISSIONS,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $this->authorize('update', $role);

        if ($role->name === 'Super Administrator') {
            return back()->withErrors([
                'role' => 'Permissions for the Super Administrator role cannot be modified.',
            ]);
        }

        $data = $request->validate([
            'permissions' => ['array'],
            'permissions.*' => ['string', 'in:'.implode(',', PermissionSeeder::PERMISSIONS)],
        ]);

        $role->syncPermissions($data['permissions'] ?? []);

        return redirect()
            ->route('roles.index')
            ->with('status', 'Role permissions updated successfully.');
    }
}
