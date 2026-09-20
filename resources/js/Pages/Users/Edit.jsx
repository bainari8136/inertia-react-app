import { Head, Link, Form } from '@inertiajs/react';
import Dashboard from './Dashboard';

export default function Edit({ user, roles }) {
    return (
        <Dashboard title="Edit user">
            <Head title="Edit user" />

            <div className="max-w-lg">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit user account</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <Form action={`/users/${user.id}`} method="PUT">
                        {({ errors, processing }) => (
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        defaultValue={user.name}
                                        required
                                        className="py-3 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        defaultValue={user.email}
                                        required
                                        className="py-3 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        New password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="py-3 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Leave blank to keep current password. If setting a new password, it must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.
                                    </p>
                                    {errors.password && (
                                        <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Confirm new password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        className="py-3 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        required
                                        defaultValue={user.role ?? 'Student'}
                                        className="py-3 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        {roles.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.role && <p className="mt-1.5 text-sm text-red-600">{errors.role}</p>}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="is_active"
                                        name="is_active"
                                        type="checkbox"
                                        value="1"
                                        defaultChecked={user.is_active}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                                    />
                                    <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                                        Account is active
                                    </label>
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2.5 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save changes'}
                                    </button>
                                    <Link href="/users" className="text-sm text-gray-600 hover:text-gray-900">
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
