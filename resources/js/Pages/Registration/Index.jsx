import { Head, Link, Form, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';

export default function Index({ registrations, openSemester, canRegister }) {
    const { flash } = usePage().props;

    return (
        <Dashboard title="Course registration">
            <Head title="Course registration" />
            {flash?.status && <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>}

            <div className="mb-6 flex flex-wrap justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Semester registration</h1>
                    <p className="text-sm text-gray-600 mt-1">Register for courses each semester</p>
                </div>
                {canRegister && openSemester?.registration_open && (
                    <Form method="post" action="/registration/start">
                        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                            {registrations.length ? 'Continue registration' : 'Start registration'}
                        </button>
                    </Form>
                )}
            </div>

            {openSemester && (
                <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
                    <p className="font-medium">{openSemester.name} · {openSemester.academic_year}</p>
                    <p className="mt-1">
                        Registration {openSemester.registration_open ? 'open' : 'closed'}
                        {openSemester.closes_at && openSemester.registration_open && (
                            <> — closes {new Date(openSemester.closes_at).toLocaleString()}</>
                        )}
                    </p>
                </div>
            )}

            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-500">Semester</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Courses</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Credits</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Status</th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {registrations.length ? registrations.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-medium">{r.semester}</p>
                                    <p className="text-gray-500 text-xs">{r.academic_year}</p>
                                </td>
                                <td className="px-6 py-4">{r.course_count}</td>
                                <td className="px-6 py-4">{r.total_credits}</td>
                                <td className="px-6 py-4 capitalize">{r.status}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/registration/${r.id}`} className="text-indigo-600 font-medium hover:underline">View</Link>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No registrations yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
}
