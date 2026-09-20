import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';

export default function Index({ clearances, cohorts, filters, canApprove }) {
    const { flash = {} } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [cohortFilter, setCohortFilter] = useState(filters.cohort_id || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');

    const handleFilterChange = (key, value) => {
        const newFilters = {
            ...filters,
            status: statusFilter,
            cohort_id: cohortFilter,
            type: typeFilter,
            [key]: value,
        };

        if (key === 'status') setStatusFilter(value);
        if (key === 'cohort_id') setCohortFilter(value);
        if (key === 'type') setTypeFilter(value);

        router.get('/clearance', Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v)), {
            preserveState: true,
            replace: true,
        });
    };

    const deptAbbr = {
        academic: 'ACAD',
        library: 'LIB',
        hostel: 'HOST',
        finance: 'FIN',
        dean_of_students: 'WELF',
        registrar: 'REG',
    };

    const filteredData = (clearances.data || []).filter((item) => {
        const term = searchTerm.toLowerCase();
        return (
            !searchTerm ||
            (item.student_name && item.student_name.toLowerCase().includes(term)) ||
            (item.registration_number && item.registration_number.toLowerCase().includes(term)) ||
            (item.programme && item.programme.toLowerCase().includes(term)) ||
            (item.certificate_number && item.certificate_number.toLowerCase().includes(term))
        );
    });

    return (
        <Dashboard title="Clearance Management">
            <Head title="Clearance Management" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Clearance Management</h1>
                    <p className="text-sm text-gray-600">Review, verify and approve multi-departmental clearances for graduating and departing students.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/graduation"
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50"
                    >
                        Graduation Cohorts &rarr;
                    </Link>
                </div>
            </div>

            {flash?.status && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                    {flash.status}
                </div>
            )}

            {/* Filter Bar */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                <div>
                    <label htmlFor="search" className="block text-xs font-medium text-gray-600 mb-1">Search</label>
                    <input
                        id="search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Name, Reg No, Certificate..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                    <select
                        id="status"
                        value={statusFilter}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="in_progress">In Progress</option>
                        <option value="approved">Approved / Cleared</option>
                        <option value="rejected">Rejected / Held</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="cohort" className="block text-xs font-medium text-gray-600 mb-1">Graduation Cohort</label>
                    <select
                        id="cohort"
                        value={cohortFilter}
                        onChange={(e) => handleFilterChange('cohort_id', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="">All Cohorts</option>
                        {cohorts.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="type" className="block text-xs font-medium text-gray-600 mb-1">Clearance Type</label>
                    <select
                        id="type"
                        value={typeFilter}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-1.5 px-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="">All Types</option>
                        <option value="graduation">Graduation</option>
                        <option value="departure">Departure</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold uppercase tracking-wider text-[11px]">
                                <th className="p-3">Student</th>
                                <th className="p-3">Programme</th>
                                <th className="p-3">Cohort / Type</th>
                                <th className="p-3 text-center">CGPA & Award</th>
                                <th className="p-3 text-center">Dept Clearance Stages</th>
                                <th className="p-3 text-center">Overall Status</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        No clearance requests found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition">
                                        <td className="p-3">
                                            <div className="font-bold text-gray-900">{item.student_name}</div>
                                            <div className="font-mono text-indigo-600 text-[11px]">{item.registration_number}</div>
                                        </td>
                                        <td className="p-3 text-gray-600 max-w-xs truncate">
                                            {item.programme || 'General Programme'}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-medium text-gray-800">{item.cohort_name || 'General Departure'}</div>
                                            <div className="text-[10px] text-gray-400 capitalize">{item.type} &bull; {item.submitted_at}</div>
                                        </td>
                                        <td className="p-3 text-center">
                                            {item.overall_cgpa ? (
                                                <div>
                                                    <span className="font-extrabold text-indigo-700">{Number(item.overall_cgpa).toFixed(2)}</span>
                                                    <div className="text-[10px] text-gray-500">{item.degree_classification}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="inline-flex items-center gap-1">
                                                {item.stages_summary.map((stg) => {
                                                    const isApproved = stg.status === 'approved';
                                                    const isRejected = stg.status === 'rejected';

                                                    return (
                                                        <span
                                                            key={stg.department}
                                                            title={`${deptAbbr[stg.department] || stg.department}: ${stg.status}`}
                                                            className={`inline-flex items-center justify-center h-5 w-8 rounded text-[10px] font-bold ${
                                                                isApproved
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : isRejected
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-gray-100 text-gray-500'
                                                            }`}
                                                        >
                                                            {deptAbbr[stg.department] || stg.department.slice(0, 3).toUpperCase()}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                                    item.status === 'approved'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : item.status === 'rejected'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                }`}
                                            >
                                                {item.status.replace('_', ' ')}
                                            </span>
                                            {item.certificate_number && (
                                                <div className="font-mono text-[9px] text-emerald-700 font-semibold mt-0.5">
                                                    {item.certificate_number}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/clearance/${item.id}`}
                                                    className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                                                >
                                                    Review &rarr;
                                                </Link>
                                                {item.status === 'approved' && (
                                                    <Link
                                                        href={`/clearance/${item.id}/certificate`}
                                                        className="inline-flex items-center rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                                                    >
                                                        Cert
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Dashboard>
    );
}
