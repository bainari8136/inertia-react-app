import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Dashboard from '../../Users/Dashboard';

export default function Index({ allocations, canPublish }) {
    const { flash = {} } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [publishingId, setPublishingId] = useState(null);

    const handlePublish = (allocationId, courseCode) => {
        if (!confirm(`Are you sure you want to approve and publish results for ${courseCode}? Student GPAs and Transcripts will be updated immediately.`)) {
            return;
        }
        setPublishingId(allocationId);
        router.post(
            `/academic/results/${allocationId}/publish`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setPublishingId(null),
            }
        );
    };

    const filtered = allocations.filter((a) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            (a.course_code && a.course_code.toLowerCase().includes(term)) ||
            (a.course_name && a.course_name.toLowerCase().includes(term)) ||
            (a.programme && a.programme.toLowerCase().includes(term)) ||
            (a.lecturer_name && a.lecturer_name.toLowerCase().includes(term));

        const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalCourses = allocations.length;
    const submittedCourses = allocations.filter((a) => a.status === 'submitted').length;
    const publishedCourses = allocations.filter((a) => a.status === 'published').length;
    const draftCourses = allocations.filter((a) => a.status === 'draft').length;

    return (
        <Dashboard title="Exam Results Moderation">
            <Head title="Exam Results Moderation" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Examination Results & Moderation</h1>
                    <p className="text-sm text-gray-600">Review submitted course marks, approve grades, and publish semester results.</p>
                </div>
            </div>

            {flash?.status && (
                <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                    {flash.status}
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
                    <p className="text-xs font-medium text-gray-500">Total Courses</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalCourses}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
                    <p className="text-xs font-medium text-amber-600">Submitted for Moderation</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">{submittedCourses}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
                    <p className="text-xs font-medium text-emerald-600">Published</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">{publishedCourses}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
                    <p className="text-xs font-medium text-gray-500">Draft / Grading</p>
                    <p className="text-2xl font-bold text-gray-700 mt-1">{draftCourses}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by course code, name, lecturer, or programme..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="statusFilter" className="text-xs font-medium text-gray-600 whitespace-nowrap">
                        Status:
                    </label>
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="submitted">Submitted (Moderation)</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>

            {/* Results Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold uppercase tracking-wider text-[11px]">
                                <th className="p-3">Course</th>
                                <th className="p-3">Programme</th>
                                <th className="p-3">Semester</th>
                                <th className="p-3">Lecturer</th>
                                <th className="p-3 text-center">Students</th>
                                <th className="p-3 text-center">Submitted</th>
                                <th className="p-3 text-center">Published</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-gray-500">
                                        No courses found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((a) => (
                                    <tr key={a.id} className="hover:bg-slate-50 transition">
                                        <td className="p-3">
                                            <div className="font-semibold text-gray-900">{a.course_code}</div>
                                            <div className="text-[11px] text-gray-500 line-clamp-1">{a.course_name}</div>
                                        </td>
                                        <td className="p-3 text-gray-600">{a.programme || 'General'}</td>
                                        <td className="p-3 text-gray-600">
                                            {a.semester} <span className="text-[11px] text-gray-400">({a.academic_year})</span>
                                        </td>
                                        <td className="p-3 font-medium text-gray-800">{a.lecturer_name}</td>
                                        <td className="p-3 text-center font-semibold text-gray-800">{a.total_students}</td>
                                        <td className="p-3 text-center font-medium text-amber-700">{a.submitted_count}</td>
                                        <td className="p-3 text-center font-medium text-emerald-700">{a.published_count}</td>
                                        <td className="p-3 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                                    a.status === 'published'
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : a.status === 'submitted'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {a.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/academic/marks/${a.id}`}
                                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-2xs hover:bg-gray-50"
                                                >
                                                    Inspect
                                                </Link>

                                                {canPublish && a.status !== 'published' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePublish(a.id, a.course_code)}
                                                        disabled={publishingId === a.id}
                                                        className="inline-flex items-center rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                                                    >
                                                        {publishingId === a.id ? 'Publishing...' : 'Publish'}
                                                    </button>
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
