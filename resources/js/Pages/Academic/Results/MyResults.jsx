import { Head, Link } from '@inertiajs/react';
import Dashboard from '../../Users/Dashboard';

export default function MyResults({ transcript }) {
    const { student, cgpa, semesters } = transcript;

    const getGradeBadge = (grade) => {
        switch (grade) {
            case 'A':
                return 'bg-emerald-100 text-emerald-800 font-bold';
            case 'B+':
            case 'B':
                return 'bg-blue-100 text-blue-800 font-semibold';
            case 'C':
                return 'bg-amber-100 text-amber-800 font-medium';
            case 'D':
                return 'bg-orange-100 text-orange-800 font-medium';
            case 'F':
                return 'bg-red-100 text-red-800 font-bold';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStandingBadge = (standing) => {
        switch (standing) {
            case 'Pass':
                return 'bg-emerald-100 text-emerald-800';
            case 'Supplementary':
                return 'bg-amber-100 text-amber-800';
            case 'Probation':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <Dashboard title="My Academic Results">
            <Head title="My Academic Results" />

            {/* Top header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Academic Results & Performance</h1>
                    <p className="text-sm text-gray-600">Review your semester examination grades, semester GPA, and cumulative performance.</p>
                </div>
                {student && (
                    <Link
                        href={`/students/${student.id}/transcript`}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-600 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        View Official Transcript
                    </Link>
                )}
            </div>

            {/* Student Overview Card */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-mono font-semibold text-indigo-700">
                            {student?.registration_number}
                        </span>
                        <h2 className="text-xl font-bold text-gray-900">{student?.name}</h2>
                        <p className="text-xs text-gray-500">
                            {student?.programme} {student?.faculty ? `&bull; ${student.faculty}` : ''}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                        <div className="text-center md:text-right">
                            <p className="text-xs text-gray-500 font-medium">Cumulative GPA (CGPA)</p>
                            <p className="text-3xl font-extrabold text-indigo-600">{Number(cgpa).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Semesters Results List */}
            {semesters.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No published results available</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Your semester examination results have not yet been published by the academic department.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {semesters.map((sem) => (
                        <div key={sem.semester_id} className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                            {/* Semester Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">
                                        {sem.semester_name} <span className="text-xs font-normal text-gray-500">({sem.academic_year})</span>
                                    </h3>
                                    <p className="text-xs text-gray-500">Total Credits: {sem.total_credits}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="text-xs text-gray-500 mr-2">Semester GPA:</span>
                                        <span className="text-base font-bold text-gray-900">{Number(sem.gpa).toFixed(2)}</span>
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStandingBadge(sem.standing)}`}>
                                        {sem.standing}
                                    </span>
                                </div>
                            </div>

                            {/* Semester Courses Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                                            <th className="p-3 w-10 text-center">#</th>
                                            <th className="p-3">Course Code</th>
                                            <th className="p-3">Course Title</th>
                                            <th className="p-3 text-center">Credit Hours</th>
                                            <th className="p-3 text-center">Grade</th>
                                            <th className="p-3 text-center">Grade Points</th>
                                            <th className="p-3 text-center">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {sem.courses.map((course, idx) => (
                                            <tr key={course.code + idx} className="hover:bg-slate-50 transition">
                                                <td className="p-3 text-center text-gray-400">{idx + 1}</td>
                                                <td className="p-3 font-mono font-medium text-indigo-600">{course.code}</td>
                                                <td className="p-3 font-medium text-gray-900">{course.name}</td>
                                                <td className="p-3 text-center font-medium text-gray-700">{course.credit_hours}</td>
                                                <td className="p-3 text-center">
                                                    {course.published ? (
                                                        <span className={`inline-block px-2 py-0.5 rounded text-xs ${getGradeBadge(course.grade)}`}>
                                                            {course.grade}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">Pending</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center font-semibold text-gray-800">
                                                    {course.published ? Number(course.grade_points).toFixed(1) : '-'}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {course.published ? (
                                                        <span className="text-xs text-gray-700">{course.remark}</span>
                                                    ) : (
                                                        <span className="text-xs text-amber-600">Pending Publish</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Dashboard>
    );
}
