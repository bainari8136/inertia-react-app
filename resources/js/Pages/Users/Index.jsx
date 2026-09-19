import { Head, Link, Form, usePage } from '@inertiajs/react';
import Dashboard from './Dashboard';
import { can } from '../../lib/can';

export default function Index({ users }) {
    const { auth, flash } = usePage().props;
    const permissions = auth?.permissions ?? [];

    return (
        <Dashboard title="Users">
            <Head title="Users" />

            {flash?.status && (
                <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>
            )}

            <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-950 tracking-tight">User accounts</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage system users and access</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                        Total: {users.length}
                    </span>
                    {can(permissions, 'users.create') && (
                        <Link
                            href="/users/create"
                            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Create user
                        </Link>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                                    S.N.
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-400">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {user.roles?.[0] ?? '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={
                                                    user.is_active
                                                        ? 'inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800'
                                                        : 'inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800'
                                                }
                                            >
                                                {user.is_active ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right space-x-3">
                                            {can(permissions, 'users.update') && (
                                                <Link
                                                    href={`/users/${user.id}/edit`}
                                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                            {can(permissions, 'users.activate') && (
                                                <Form
                                                    action={`/users/${user.id}/toggle-active`}
                                                    method="PATCH"
                                                    className="inline"
                                                >
                                                    <button
                                                        type="submit"
                                                        className={
                                                            user.is_active
                                                                ? 'text-red-600 hover:text-red-800 font-medium'
                                                                : 'text-green-600 hover:text-green-800 font-medium'
                                                        }
                                                    >
                                                        {user.is_active ? 'Disable' : 'Activate'}
                                                    </button>
                                                </Form>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Dashboard>
    );
}
