import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Dashboard from '../../Users/Dashboard';

export default function Show({ allocation, assessmentTypes, students, canPublish }) {
    const { flash = {} } = usePage().props;
    // Local editable marks state: map of `resultId_assessmentTypeId` -> score value
    const [marksState, setMarksState] = useState(() => {
        const initial = {};
        students.forEach((s) => {
            assessmentTypes.forEach((type) => {
                const key = `${s.result_id}_${type.id}`;
                const val = s.marks[type.id];
                initial[key] = val !== undefined && val !== null ? val : '';
            });
        });
        return initial;
    });

    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleMarkChange = (resultId, assessmentTypeId, val) => {
        setMarksState((prev) => ({
            ...prev,
            [`${resultId}_${assessmentTypeId}`]: val,
        }));
    };

    const handleSaveMarks = (e) => {
        e?.preventDefault();
        setSaving(true);

        const payload = [];
        students.forEach((s) => {
            assessmentTypes.forEach((type) => {
                const key = `${s.result_id}_${type.id}`;
                const val = marksState[key];
                if (val !== '' && val !== null && val !== undefined) {
                    payload.push({
                        result_id: s.result_id,
                        assessment_type_id: type.id,
                        score: parseFloat(val),
                    });
                }
            });
        });

        router.post(
            `/academic/marks/${allocation.id}`,
            { marks: payload },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            }
        );
    };

    const handleSubmitForModeration = () => {
        if (!confirm('Are you sure you want to submit all recorded marks for moderation?')) {
            return;
        }
        setSubmitting(true);
        router.post(
            `/academic/marks/${allocation.id}/submit`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setSubmitting(false),
            }
        );
    };

    const handlePublishResults = () => {
        if (!confirm('Publish all results for this course? Student GPAs and CGPAs will be recalculated and made visible immediately.')) {
            return;
        }
        router.post(
            `/academic/results/${allocation.id}/publish`,
            {},
            { preserveScroll: true }
        );
    };

    const filteredStudents = students.filter((s) => {
        const term = searchTerm.toLowerCase();
        return (
            (s.student_name && s.student_name.toLowerCase().includes(term)) ||
            (s.registration_number && s.registration_number.toLowerCase().includes(term))
        );
    });

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

    return (
        <Dashboard title={`Marks - ${allocation.course_code}`}>
            <Head title={`Marks Sheet - ${allocation.course_code}`} />

            {/* Header info */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/academic/marks" className="text-xs font-semibold text-indigo-600 hover:underline">
                            &larr; Back to Allocations
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {allocation.course_code} - {allocation.course_name}
                    </h1>
                    <p className="text-sm text-gray-600">
                        {allocation.programme} &bull; {allocation.semester} ({allocation.academic_year}) &bull;{' '}
                        <span className="font-medium text-gray-800">{allocation.credit_hours} Credits</span> &bull; Lecturer:{' '}
                        <span className="font-medium text-gray-800">{allocation.lecturer_name}</span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleSaveMarks}
                        disabled={saving}
                        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition"
                    >
                        {saving ? 'Saving Marks...' : 'Save Draft Marks'}
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmitForModeration}
                        disabled={submitting}
                        className="inline-flex items-center rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 transition"
                    >
                        {submitting ? 'Submitting...' : 'Submit for Moderation'}
                    </button>

                    {canPublish && (
                        <button
                            type="button"
                            onClick={handlePublishResults}
                            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        >
                            Publish Results
                        </button>
                    )}
                </div>
            </div>

            {/* Status alerts */}
            {flash?.status && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                    {flash.status}
                </div>
            )}

            {/* Assessment Types Summary */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {assessmentTypes.map((type) => (
                    <div key={type.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 text-sm">{type.name} ({type.code})</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                                {type.weight_percentage}% Weight
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Category: <span className="capitalize">{type.category.replace('_', ' ')}</span> &bull; Max: {type.max_score}
                        </p>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="mb-4 flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter student by Reg No. or name..."
                    className="w-full sm:w-80 rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-xs text-gray-500 self-center">
                    Showing {filteredStudents.length} of {students.length} students enrolled
                </span>
            </div>

            {/* Marks Sheet Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold uppercase tracking-wider text-[11px]">
                                <th className="p-3 w-10 text-center">#</th>
                                <th className="p-3">Student Reg No</th>
                                <th className="p-3">Student Name</th>
                                {assessmentTypes.map((type) => (
                                    <th key={type.id} className="p-3 text-center min-w-[90px]">
                                        {type.name}
                                        <div className="text-[10px] text-gray-500 font-normal">({type.weight_percentage}%)</div>
                                    </th>
                                ))}
                                <th className="p-3 text-center bg-gray-100/70">CA (40%)</th>
                                <th className="p-3 text-center bg-gray-100/70">Exam (60%)</th>
                                <th className="p-3 text-center bg-indigo-50 font-bold text-indigo-900">Total (100%)</th>
                                <th className="p-3 text-center bg-indigo-50 font-bold text-indigo-900">Grade</th>
                                <th className="p-3 text-center bg-indigo-50 font-bold text-indigo-900">GP</th>
                                <th className="p-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={6 + assessmentTypes.length} className="p-8 text-center text-gray-500">
                                        No registered students found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((s, idx) => (
                                    <tr key={s.registration_id} className="hover:bg-slate-50 transition">
                                        <td className="p-3 text-center text-gray-400">{idx + 1}</td>
                                        <td className="p-3 font-mono font-medium text-indigo-600">
                                            {s.registration_number}
                                        </td>
                                        <td className="p-3 font-medium text-gray-900">{s.student_name}</td>
                                        {assessmentTypes.map((type) => {
                                            const fieldKey = `${s.result_id}_${type.id}`;
                                            return (
                                                <td key={type.id} className="p-2 text-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={type.max_score}
                                                        step="0.1"
                                                        value={marksState[fieldKey] ?? ''}
                                                        onChange={(e) =>
                                                            handleMarkChange(s.result_id, type.id, e.target.value)
                                                        }
                                                        className="w-16 rounded border border-gray-300 py-1 px-1.5 text-center text-xs font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                        placeholder="0"
                                                    />
                                                </td>
                                            );
                                        })}
                                        <td className="p-3 text-center font-semibold bg-gray-50/70 text-gray-700">
                                            {s.coursework_score !== null ? Number(s.coursework_score).toFixed(1) : '-'}
                                        </td>
                                        <td className="p-3 text-center font-semibold bg-gray-50/70 text-gray-700">
                                            {s.exam_score !== null ? Number(s.exam_score).toFixed(1) : '-'}
                                        </td>
                                        <td className="p-3 text-center font-bold bg-indigo-50/40 text-indigo-900">
                                            {s.total_score !== null ? Number(s.total_score).toFixed(1) : '-'}
                                        </td>
                                        <td className="p-3 text-center bg-indigo-50/40">
                                            {s.grade ? (
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs ${getGradeBadge(s.grade)}`}>
                                                    {s.grade}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-center font-semibold bg-indigo-50/40 text-gray-800">
                                            {s.grade_points !== null ? Number(s.grade_points).toFixed(1) : '-'}
                                        </td>
                                        <td className="p-3 text-center">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                                                    s.status === 'published'
                                                        ? 'bg-green-100 text-green-800'
                                                        : s.status === 'submitted'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {s.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                        Tip: Click <span className="font-semibold text-gray-700">"Save Draft Marks"</span> to compute weighted CA, Final Exam, Letter Grade & Grade Points.
                    </p>
                    <button
                        type="button"
                        onClick={handleSaveMarks}
                        disabled={saving}
                        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Draft Marks'}
                    </button>
                </div>
            </div>
        </Dashboard>
    );
}
