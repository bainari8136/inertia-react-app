import { Head, Link, router, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';

export default function Approvals({ registrations, filters, statuses }) {
    const { flash } = usePage().props;

    const filter = (e) => {
        e.preventDefault();
        router.get('/registration-approvals', Object.fromEntries(new FormData(e.target)), { preserveState: true });
    };

    return (
        <Dashboard title="Registration approvals">
            <Head title="Registration approvals" />
            {flash?.status && <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>}

            <h1 className="text-3xl font-bold text-gray-900 mb-6">Registration approvals</h1>

            <form onSubmit={filter} className="mb-4 flex gap-3">
                <select name="status" defaultValue={filters.status ?? 'pending'} className="rounded-md border-gray-300 py-2 px-3 text-sm">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="submit" className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white">Filter</button>
            </form>

            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-500">Student</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Semester</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Courses</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Status</th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {registrations.data.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-medium">{r.student_name}</p>
                                    <p className="text-xs text-gray-500 font-mono">{r.registration_number}</p>
                                </td>
                                <td className="px-6 py-4">{r.semester}</td>
                                <td className="px-6 py-4">{r.course_count} ({r.total_credits} cr)</td>
                                <td className="px-6 py-4 capitalize">{r.status}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/registration-approvals/${r.id}`} className="text-indigo-600 font-medium hover:underline">Review</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
}
