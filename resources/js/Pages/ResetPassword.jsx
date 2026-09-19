import { Head, Form } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <Head title="Set new password" />

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Set new password</h2>
                </div>

                <Form action="/reset-password" method="POST">
                    {({ errors, processing }) => (
                        <div className="space-y-5">
                            <input type="hidden" name="token" value={token} />
                            <input type="hidden" name="email" value={email} />

                            <div>
                                <label htmlFor="email-display" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email-display"
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="py-3 px-2 mt-1 block w-full rounded-md border-gray-200 bg-gray-50 text-gray-600 sm:text-sm"
                                />
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
                                    Confirm password
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

                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email}</p>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Reset password'}
                            </button>
                        </div>
                    )}
                </Form>
            </div>
        </div>
    );
}
