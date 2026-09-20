import { Head, Link, Form, usePage } from '@inertiajs/react';
import Dashboard from './Users/Dashboard';

export default function ChangePassword() {
    const { flash } = usePage().props;

    return (
        <Dashboard title="Change password">
            <Head title="Change password" />

            <div className="max-w-lg">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Change password</h1>
                <p className="text-sm text-gray-600 mb-6">
                    Choose a strong, secure password that meets university security policies.
                </p>

                {flash?.status && (
                    <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.status}
                    </p>
                )}

                <div className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50/50 p-4 text-xs text-indigo-900">
                    <p className="font-semibold mb-1">Password Policy Requirements:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-indigo-800">
                        <li>Minimum 8 characters</li>
                        <li>At least one uppercase and one lowercase letter</li>
                        <li>At least one number (0-9)</li>
                        <li>At least one special character or symbol (e.g. !@#$%^&*)</li>
                        <li>Must be different from your current password</li>
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <Form action="/change-password" method="PUT">
                        {({ errors, processing }) => (
                            <div className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="current_password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Current password
                                    </label>
                                    <input
                                        id="current_password"
                                        type="password"
                                        name="current_password"
                                        required
                                        className="py-3 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm"
                                        autoComplete="current-password"
                                    />
                                    {errors.current_password && (
                                        <p className="mt-1.5 text-sm text-red-600">{errors.current_password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        New password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        className="py-3 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm"
                                        autoComplete="new-password"
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
                                        Confirm new password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        required
                                        className="py-3 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm"
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update password'}
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
