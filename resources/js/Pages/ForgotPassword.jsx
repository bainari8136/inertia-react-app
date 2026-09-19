import { Head, Link, Form, usePage } from '@inertiajs/react';

export default function ForgotPassword() {
    const { flash } = usePage().props;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <Head title="Forgot password" />

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Reset password</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your email and we will send you a reset link.
                    </p>
                </div>

                {flash?.status && (
                    <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.status}
                    </p>
                )}

                <Form action="/forgot-password" method="POST">
                    {({ errors, processing }) => (
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="py-3 px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-blue-500 sm:text-sm"
                                    required
                                    autoComplete="username"
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50"
                            >
                                {processing ? 'Sending...' : 'Email reset link'}
                            </button>

                            <div className="text-center text-sm text-gray-600">
                                <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
                                    Back to sign in
                                </Link>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </div>
    );
}
