import { Head, Link, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import { can } from '../../lib/can';

export default function Index({ roles }) {
    const { auth, flash } = usePage().props;
    const permissions = auth?.permissions ?? [];

    return (
        <Dashboard title="Roles">
            <Head title="Roles" />

            {flash?.status && (
                <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>
            )}

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-950 tracking-tight">Roles</h1>
                <p className="mt-1 text-sm text-gray-600">Role-based access control for the ERP</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Permissions</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {roles.map((role) => (
                            <tr key={role.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{role.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{role.permissions_count}</td>
                                <td className="px-6 py-4 text-sm text-right">
                                    {can(permissions, 'roles.manage') && role.name !== 'Super Administrator' ? (
                                        <Link
                                            href={`/roles/${role.id}/edit`}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            Manage permissions
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400 text-sm">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
}
