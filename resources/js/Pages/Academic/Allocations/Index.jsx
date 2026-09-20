import { useState } from 'react';
import { Head, Link, Form } from '@inertiajs/react';
import Dashboard from '../../Users/Dashboard';

export default function Index({ allocations, courses, semesters, lecturers, canManage }) {
    const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || '');
    const [selectedSemester, setSelectedSemester] = useState(semesters[0]?.id || '');
    const [selectedLecturer, setSelectedLecturer] = useState(lecturers[0]?.id || '');
    const [classGroup, setClassGroup] = useState('Main');

    return (
        <Dashboard title="Course Allocations">
            <Head title="Course Allocations" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Course Allocations</h1>
                    <p className="text-sm text-gray-600">Assign lecturers to teach courses for specific semesters.</p>
                </div>
            </div>

            {canManage && (
                <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Allocate Course to Lecturer</h2>
                    <Form action="/academic/allocations" method="POST">
                        {({ processing, errors }) => (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label htmlFor="course_id" className="block text-xs font-medium text-gray-700 mb-1">
                                        Course
                                    </label>
                                    <select
                                        id="course_id"
                                        name="course_id"
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.code} - {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.course_id && <p className="text-xs text-red-600 mt-1">{errors.course_id}</p>}
                                </div>

                                <div>
                                    <label htmlFor="semester_id" className="block text-xs font-medium text-gray-700 mb-1">
                                        Semester
                                    </label>
                                    <select
                                        id="semester_id"
                                        name="semester_id"
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {semesters.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.semester_id && <p className="text-xs text-red-600 mt-1">{errors.semester_id}</p>}
                                </div>

                                <div>
                                    <label htmlFor="lecturer_id" className="block text-xs font-medium text-gray-700 mb-1">
                                        Lecturer
                                    </label>
                                    <select
                                        id="lecturer_id"
                                        name="lecturer_id"
                                        value={selectedLecturer}
                                        onChange={(e) => setSelectedLecturer(e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {lecturers.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                {l.name} ({l.email})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.lecturer_id && <p className="text-xs text-red-600 mt-1">{errors.lecturer_id}</p>}
                                </div>

                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <label htmlFor="class_group" className="block text-xs font-medium text-gray-700 mb-1">
                                            Class Group
                                        </label>
                                        <input
                                            id="class_group"
                                            name="class_group"
                                            type="text"
                                            value={classGroup}
                                            onChange={(e) => setClassGroup(e.target.value)}
                                            placeholder="e.g. Main, Stream A"
                                            className="w-full rounded-lg border-gray-300 py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition shrink-0"
                                    >
                                        {processing ? 'Assigning...' : 'Assign'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-3.5">Course</th>
                            <th className="px-6 py-3.5">Programme</th>
                            <th className="px-6 py-3.5">Semester</th>
                            <th className="px-6 py-3.5">Lecturer</th>
                            <th className="px-6 py-3.5">Group</th>
                            {canManage && <th className="px-6 py-3.5 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-700">
                        {allocations.data?.length === 0 ? (
                            <tr>
                                <td colSpan={canManage ? 6 : 5} className="px-6 py-8 text-center text-gray-500">
                                    No course allocations found.
                                </td>
                            </tr>
                        ) : (
                            allocations.data?.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="font-semibold">{item.course_code}</div>
                                        <div className="text-xs text-gray-500">{item.course_name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{item.programme}</td>
                                    <td className="px-6 py-4">
                                        <div>{item.semester}</div>
                                        <div className="text-xs text-gray-400">{item.academic_year}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{item.lecturer_name}</div>
                                        <div className="text-xs text-gray-500">{item.lecturer_email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                                            {item.class_group}
                                        </span>
                                    </td>
                                    {canManage && (
                                        <td className="px-6 py-4 text-right">
                                            <Form action={`/academic/allocations/${item.id}`} method="DELETE">
                                                {({ processing }) => (
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </Form>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
}
