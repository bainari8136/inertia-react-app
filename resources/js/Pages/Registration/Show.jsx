import { Head, Link, Form, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';

export default function Show({ registration, availableCourses, maxCredits }) {
    const { flash } = usePage().props;

    return (
        <Dashboard title="Registration">
            <Head title="Registration details" />
            {flash?.status && <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>}

            <div className="mb-6">
                <Link href="/registration" className="text-sm text-indigo-600 hover:underline">← Back to registrations</Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">{registration.semester}</h1>
                <p className="text-sm text-gray-600 capitalize">{registration.status} · {registration.total_credits} / {maxCredits} credits</p>
            </div>

            {registration.rejection_reason && (
                <p className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">{registration.rejection_reason}</p>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border p-5">
                    <h2 className="font-semibold mb-4">Registered courses</h2>
                    {registration.courses?.length ? (
                        <ul className="divide-y">
                            {registration.courses.map((c) => (
                                <li key={c.id} className="py-3 flex justify-between items-center gap-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{c.code}</p>
                                        <p className="text-sm text-gray-600">{c.name}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-500">{c.credit_hours} cr</span>
                                        {registration.is_editable && (
                                            <Form method="delete" action={`/registration/${registration.id}/courses/${c.id}`}>
                                                <button type="submit" className="text-sm text-red-600 hover:underline">Drop</button>
                                            </Form>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No courses added yet.</p>
                    )}

                    {registration.is_editable && (
                        <Form method="post" action={`/registration/${registration.id}/submit`} className="mt-6 pt-4 border-t">
                            <button type="submit" className="w-full rounded-md bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700">
                                Submit for approval
                            </button>
                        </Form>
                    )}
                </div>

                {registration.is_editable && (
                    <div className="bg-white rounded-xl border p-5">
                        <h2 className="font-semibold mb-4">Add course</h2>
                        {availableCourses.length ? (
                            <ul className="space-y-2">
                                {availableCourses.map((c) => (
                                    <li key={c.id} className="flex justify-between items-center rounded-lg border px-4 py-3">
                                        <div>
                                            <p className="font-medium">{c.code}</p>
                                            <p className="text-xs text-gray-600">{c.name} · {c.credit_hours} credits</p>
                                        </div>
                                        <Form method="post" action={`/registration/${registration.id}/courses`}>
                                            <input type="hidden" name="course_id" value={c.id} />
                                            <button type="submit" className="text-sm text-indigo-600 font-medium hover:underline">Add</button>
                                        </Form>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">All available courses have been added.</p>
                        )}
                    </div>
                )}
            </div>
        </Dashboard>
    );
}
