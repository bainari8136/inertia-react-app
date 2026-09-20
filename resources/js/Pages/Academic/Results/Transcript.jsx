import { Head, Link } from '@inertiajs/react';

export default function Transcript({ transcript }) {
    const { student, cgpa, semesters } = transcript;

    const totalEarnedCredits = semesters.reduce((sum, sem) => sum + (sem.total_credits || 0), 0);

    const getClassification = (score) => {
        if (score >= 4.4) return 'First Class';
        if (score >= 3.5) return 'Upper Second Class';
        if (score >= 2.7) return 'Lower Second Class';
        if (score >= 2.0) return 'Pass';
        return 'Fail';
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
            <Head title={`Academic Transcript - ${student?.registration_number}`} />

            {/* Action Bar (hidden when printing) */}
            <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
                <Link
                    href="/academic/my-results"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                    &larr; Back to Results
                </Link>

                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Official Transcript
                </button>
            </div>

            {/* Transcript Document Sheet */}
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-md print:shadow-none print:p-0 print:rounded-none border print:border-none border-gray-200 text-gray-900 text-sm">
                {/* Official University Header */}
                <div className="text-center border-b-2 border-gray-900 pb-6 mb-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-900 text-white font-serif font-black text-2xl mb-3 shadow-inner">
                        U
                    </div>
                    <h1 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wider text-gray-900">
                        INSTITUTE OF JUDICIAL ADMINISTRATION
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mt-0.5">
                        Office of the Academic Registrar &bull; Examinations Directorate
                    </p>
                    <p className="text-xs text-gray-500 mt-1">P.O. Box 20, Lushoto, Tanga, Tanzania</p>
                    <div className="mt-4 inline-block bg-gray-900 text-white px-4 py-1 text-xs font-bold uppercase tracking-wider">
                        Official Academic Transcript
                    </div>
                </div>

                {/* Student Particulars */}
                <div className="grid grid-cols-2 gap-4 border border-gray-300 p-4 mb-6 text-xs bg-gray-50/50">
                    <div>
                        <div className="grid grid-cols-3 gap-1 py-1">
                            <span className="font-semibold text-gray-600">Student Name:</span>
                            <span className="col-span-2 font-bold text-gray-900 uppercase">{student?.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 py-1">
                            <span className="font-semibold text-gray-600">Registration No:</span>
                            <span className="col-span-2 font-mono font-bold text-indigo-900">{student?.registration_number}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 py-1">
                            <span className="font-semibold text-gray-600">Academic Status:</span>
                            <span className="col-span-2 font-semibold capitalize text-green-700">{student?.status}</span>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-3 gap-1 py-1">
                            <span className="font-semibold text-gray-600">Programme:</span>
                            <span className="col-span-2 font-medium text-gray-900">{student?.programme}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 py-1">
                            <span className="font-semibold text-gray-600">Faculty/Dept:</span>
                            <span className="col-span-2 font-medium text-gray-800">{student?.faculty || 'Judicial Studies'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 py-1">
                            <span className="font-semibold text-gray-600">Admission Date:</span>
                            <span className="col-span-2 text-gray-700">{student?.admitted_at || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Academic Record by Semester */}
                {semesters.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded mb-6">
                        No examination records found for this student.
                    </div>
                ) : (
                    <div className="space-y-6 mb-8">
                        {semesters.map((sem) => (
                            <div key={sem.semester_id} className="border border-gray-300 rounded overflow-hidden">
                                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center justify-between text-xs">
                                    <span className="font-bold text-gray-900 uppercase">
                                        {sem.semester_name} - {sem.academic_year}
                                    </span>
                                    <div className="flex gap-4 font-semibold">
                                        <span>Credits: {sem.total_credits}</span>
                                        <span>GPA: {Number(sem.gpa).toFixed(2)}</span>
                                        <span>Standing: {sem.standing}</span>
                                    </div>
                                </div>

                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-[11px]">
                                            <th className="p-2 w-24">Code</th>
                                            <th className="p-2">Course Title</th>
                                            <th className="p-2 text-center w-20">Credits</th>
                                            <th className="p-2 text-center w-16">Grade</th>
                                            <th className="p-2 text-center w-20">Grade Points</th>
                                            <th className="p-2 text-center w-24">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {sem.courses.map((c, i) => (
                                            <tr key={c.code + i}>
                                                <td className="p-2 font-mono font-medium">{c.code}</td>
                                                <td className="p-2">{c.name}</td>
                                                <td className="p-2 text-center">{c.credit_hours}</td>
                                                <td className="p-2 text-center font-bold">{c.grade}</td>
                                                <td className="p-2 text-center font-medium">{Number(c.grade_points).toFixed(1)}</td>
                                                <td className="p-2 text-center text-gray-700">{c.remark}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}

                {/* Overall Graduation / Cumulative Summary */}
                <div className="border-2 border-gray-900 p-4 mb-8 bg-gray-50">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        Cumulative Performance Summary
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="border-r border-gray-300">
                            <span className="block text-xs text-gray-600">Total Credits Earned</span>
                            <span className="block text-xl font-bold text-gray-900 mt-0.5">{totalEarnedCredits}</span>
                        </div>
                        <div className="border-r border-gray-300">
                            <span className="block text-xs text-gray-600">Cumulative GPA (CGPA)</span>
                            <span className="block text-xl font-extrabold text-indigo-950 mt-0.5">{Number(cgpa).toFixed(2)}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-600">Overall Classification</span>
                            <span className="block text-lg font-bold text-gray-900 mt-0.5">{getClassification(cgpa)}</span>
                        </div>
                    </div>
                </div>

                {/* Grading Scale & Legend */}
                <div className="border border-gray-300 p-3 mb-10 text-[10px] text-gray-600">
                    <p className="font-bold text-gray-800 uppercase mb-1">Key to Grading System:</p>
                    <p>
                        A (70-100%, 5.0 GP - Excellent) &bull; B+ (60-69.9%, 4.0 GP - Very Good) &bull; B (50-59.9%, 3.0 GP - Good) &bull;
                        C (40-49.9%, 2.0 GP - Pass) &bull; D (35-39.9%, 1.0 GP - Supplementary) &bull; F (0-34.9%, 0.0 GP - Fail)
                    </p>
                </div>

                {/* Signatures & Seal */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-400 text-xs text-center">
                    <div>
                        <div className="border-b border-gray-900 mb-2 h-12"></div>
                        <p className="font-bold text-gray-900">Head of Department</p>
                        <p className="text-[10px] text-gray-500">Signature & Date</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="h-16 w-16 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-[10px] text-gray-400 uppercase font-semibold">
                            Official Seal
                        </div>
                    </div>
                    <div>
                        <div className="border-b border-gray-900 mb-2 h-12"></div>
                        <p className="font-bold text-gray-900">Academic Registrar</p>
                        <p className="text-[10px] text-gray-500">Signature & Date</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
