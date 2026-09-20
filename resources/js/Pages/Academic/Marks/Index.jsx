import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Dashboard from '../../Users/Dashboard';

export default function Index({ allocations }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAllocations = allocations.filter((a) => {
        const term = searchTerm.toLowerCase();
        return (
            (a.course_code && a.course_code.toLowerCase().includes(term)) ||
            (a.course_name && a.course_name.toLowerCase().includes(term)) ||
            (a.programme && a.programme.toLowerCase().includes(term)) ||
            (a.lecturer_name && a.lecturer_name.toLowerCase().includes(term)) ||
            (a.semester && a.semester.toLowerCase().includes(term))
        );
    });

    return (
        <Dashboard title="Marks Entry">
            <Head title="Marks Entry" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Marks Entry</h1>
                    <p className="text-sm text-gray-600">Select an allocated course to grade assessments and enter examination marks.</p>
                </div>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by course code, name, lecturer, or semester..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {filteredAllocations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No allocated courses found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? 'Try adjusting your search criteria.' : 'No course allocations are currently assigned to you.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAllocations.map((item) => {
                        const isFullyPublished = item.enrolled_count > 0 && item.published_count === item.enrolled_count;
                        const isPartiallyPublished = item.published_count > 0 && item.published_count < item.enrolled_count;

                        return (
                            <div
                                key={item.id}
                                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:shadow-md transition"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                            {item.course_code}
                                        </span>
                                        {isFullyPublished ? (
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                                                Published
                                            </span>
                                        ) : isPartiallyPublished ? (
                                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                                                Partial
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                                Draft / Grading
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-1">{item.course_name}</h3>
                                    <p className="text-xs text-gray-500 mb-3">{item.programme || 'General Programme'}</p>

                                    <div className="space-y-1.5 border-t border-gray-100 pt-3 text-xs text-gray-600">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Semester:</span>
                                            <span className="font-medium text-gray-800">{item.semester} ({item.academic_year})</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Lecturer:</span>
                                            <span className="font-medium text-gray-800">{item.lecturer_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Enrolled Students:</span>
                                            <span className="font-semibold text-indigo-600">{item.enrolled_count}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <Link
                                        href={`/academic/marks/${item.id}`}
                                        className="inline-flex items-center justify-center w-full rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        Open Grade Sheet &rarr;
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Dashboard>
    );
}
