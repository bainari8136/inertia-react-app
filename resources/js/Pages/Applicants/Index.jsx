import { Head, Link, router, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import { can } from '../../lib/can';

const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

export default function Index({ applicants, filters, statuses }) {
    const { auth, flash } = usePage().props;
    const permissions = auth?.permissions ?? [];

    const search = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        router.get('/applicants', Object.fromEntries(form), { preserveState: true });
    };

    return (
        <Dashboard title="Applicants">
            <Head title="Applicants" />
            {flash?.status && <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>}

            <div className="mb-6 flex flex-wrap justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admission applications</h1>
                    <p className="text-sm text-gray-600 mt-1">Create and review applicant records</p>
                </div>
                {can(permissions, 'applicants.create') && (
                    <Link href="/applicants/create" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                        New applicant
                    </Link>
                )}
            </div>

            <form onSubmit={search} className="mb-4 flex flex-wrap gap-3">
                <input name="search" defaultValue={filters.search ?? ''} placeholder="Search name or email..." className="rounded-md border-gray-300 py-2 px-3 text-sm" />
                <select name="status" defaultValue={filters.status ?? ''} className="rounded-md border-gray-300 py-2 px-3 text-sm">
                    <option value="">All statuses</option>
                    {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <button type="submit" className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white">Filter</button>
            </form>

            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-500">Applicant</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Programme</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Status</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Applied</th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {applicants.data.map((a) => (
                            <tr key={a.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-900">{a.full_name}</p>
                                    <p className="text-gray-500">{a.email}</p>
                                </td>
                                <td className="px-6 py-4">{a.programme}</td>
                                <td className="px-6 py-4">
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[a.status] ?? ''}`}>{a.status}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{a.created_at}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/applicants/${a.id}`} className="text-indigo-600 font-medium hover:underline">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
}
