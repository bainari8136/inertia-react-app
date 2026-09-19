import { Head, Link, Form } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';

const permissionLabels = {
    'users.view': 'View users',
    'users.create': 'Create users',
    'users.update': 'Update users',
    'users.activate': 'Activate / disable users',
    'roles.view': 'View roles',
    'roles.manage': 'Manage role permissions',
    'applicants.view': 'View applicants',
    'applicants.create': 'Create applicants',
    'applicants.update': 'Update applicants',
    'applicants.admit': 'Approve / reject admission',
    'students.view': 'View students',
    'students.update': 'Update student profiles',
    'students.manage-status': 'Manage student status',
    'academic.manage': 'Manage academic calendar & courses',
    'registrations.view': 'View registrations',
    'registrations.register': 'Register for courses (student)',
    'registrations.approve': 'Approve course registrations',
    'fees.view': 'View fee structures',
    'fees.manage': 'Manage fee structures',
    'invoices.view': 'View all invoices',
    'invoices.view-own': 'View own invoices (student)',
    'invoices.create': 'Generate invoices',
    'payments.record': 'Record payments',
    'finance.reports': 'View finance reports',
};

export default function Edit({ role, permissions }) {
    const assigned = new Set(role.permissions);

    return (
        <Dashboard title={`Edit ${role.name}`}>
            <Head title={`Permissions — ${role.name}`} />

            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Role permissions</h1>
                <p className="text-sm text-gray-600 mb-6">{role.name}</p>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <Form action={`/roles/${role.id}`} method="PUT">
                        {({ errors, processing }) => (
                            <div className="space-y-4">
                                {permissions.map((permission) => (
                                    <label
                                        key={permission}
                                        className="flex items-center gap-3 rounded-lg border border-gray-100 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            name="permissions[]"
                                            value={permission}
                                            defaultChecked={assigned.has(permission)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                                        />
                                        <span className="text-sm text-gray-800">
                                            {permissionLabels[permission] ?? permission}
                                        </span>
                                    </label>
                                ))}

                                {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2.5 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save permissions'}
                                    </button>
                                    <Link href="/roles" className="text-sm text-gray-600 hover:text-gray-900">
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </Dashboard>
    );
}
