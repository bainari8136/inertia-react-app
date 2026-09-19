import { Head, Link, router, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';

const statusColors = {
    active: 'bg-green-100 text-green-800',
    deferred: 'bg-amber-100 text-amber-800',
    suspended: 'bg-red-100 text-red-800',
    graduated: 'bg-blue-100 text-blue-800',
    withdrawn: 'bg-gray-100 text-gray-800',
};

export default function Index({ students, filters, programmes, statuses }) {
    const { flash } = usePage().props;

    const search = (e) => {
        e.preventDefault();
        router.get('/students', Object.fromEntries(new FormData(e.target)), { preserveState: true });
    };

    return (
        <Dashboard title="Students">
            <Head title="Students" />
            {flash?.status && <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>}

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                <p className="text-sm text-gray-600 mt-1">Search by registration number, name, or programme</p>
            </div>

            <form onSubmit={search} className="mb-4 flex flex-wrap gap-3">
                <input name="search" defaultValue={filters.search ?? ''} placeholder="Reg. number, name, email..." className="rounded-md border-gray-300 py-2 px-3 text-sm" />
                <select name="programme_id" defaultValue={filters.programme_id ?? ''} className="rounded-md border-gray-300 py-2 px-3 text-sm">
                    <option value="">All programmes</option>
                    {programmes.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <select name="status" defaultValue={filters.status ?? ''} className="rounded-md border-gray-300 py-2 px-3 text-sm">
                    <option value="">All statuses</option>
                    {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <button type="submit" className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white">Search</button>
            </form>

            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-500">Reg. number</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Name</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Programme</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Status</th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {students.data.length ? students.data.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-gray-800">{s.registration_number}</td>
                                <td className="px-6 py-4">
                                    <p className="font-medium">{s.full_name}</p>
                                    <p className="text-gray-500">{s.email}</p>
                                </td>
                                <td className="px-6 py-4">{s.programme}</td>
                                <td className="px-6 py-4">
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[s.status] ?? ''}`}>{s.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/students/${s.id}`} className="text-indigo-600 font-medium hover:underline">View</Link>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No students found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
}
