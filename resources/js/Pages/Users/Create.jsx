import { Head, Link, Form } from '@inertiajs/react';
import Dashboard from './Dashboard';

export default function Create({ roles }) {
    return (
        <Dashboard title="Create user">
            <Head title="Create user" />

            <div className="max-w-lg">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create user account</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <Form action="/users" method="POST">
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
                                        required
                                        className="py-3 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="py-3 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    {errors.password && (
                                        <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Confirm password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        required
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
                                        className="py-3 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm"
                                        defaultValue="Student"
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
                                        defaultChecked
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
                                        {processing ? 'Creating...' : 'Create user'}
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
