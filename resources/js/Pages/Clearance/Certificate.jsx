import { Head, Link } from '@inertiajs/react';

export default function Certificate({ clearance }) {
    const { student, stages } = clearance;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
            <Head title={`Clearance Certificate - ${student?.registration_number}`} />

            {/* Action Bar (hidden when printing) */}
            <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
                <Link
                    href="/clearance"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                    &larr; Back to Clearance
                </Link>

                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Certificate
                </button>
            </div>

            {/* Certificate Document */}
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
                        Academic Registry & Directorate of Student Services
                    </p>
                    <p className="text-xs text-gray-500 mt-1">P.O. Box 20, Lushoto, Tanga, Tanzania</p>
                    <div className="mt-4 inline-block bg-gray-900 text-white px-5 py-1 text-xs font-bold uppercase tracking-wider">
                        Institutional Clearance Certificate
                    </div>
                </div>

                {/* Certificate Number & Date */}
                <div className="flex justify-between items-center text-xs mb-6 pb-2 border-b border-gray-200">
                    <div>
                        <span className="text-gray-500">Certificate Serial:</span>{' '}
                        <span className="font-mono font-bold text-indigo-900 text-sm">{clearance.certificate_number}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Issued Date:</span>{' '}
                        <span className="font-bold text-gray-800">{clearance.completed_at}</span>
                    </div>
                </div>

                {/* Student Particulars */}
                <div className="border border-gray-300 p-4 mb-6 text-xs bg-gray-50/50">
                    <div className="grid grid-cols-2 gap-4">
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
                                <span className="font-semibold text-gray-600">Clearance Type:</span>
                                <span className="col-span-2 font-semibold capitalize text-gray-800">{clearance.type}</span>
                            </div>
                        </div>

                        <div>
                            <div className="grid grid-cols-3 gap-1 py-1">
                                <span className="font-semibold text-gray-600">Programme:</span>
                                <span className="col-span-2 font-medium text-gray-900">{student?.programme}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 py-1">
                                <span className="font-semibold text-gray-600">Cumulative GPA:</span>
                                <span className="col-span-2 font-extrabold text-indigo-950 text-sm">
                                    {Number(clearance.overall_cgpa).toFixed(2)} ({clearance.degree_classification})
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 py-1">
                                <span className="font-semibold text-gray-600">Graduation Cohort:</span>
                                <span className="col-span-2 font-medium text-gray-800">{clearance.cohort_name || 'General Clearance'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certification Statement */}
                <p className="text-xs text-gray-700 leading-relaxed mb-6 text-justify">
                    This is to certify that the student named above has satisfactorily fulfilled all administrative, academic, residential, financial, and library requirements of the Institute of Judicial Administration. All institutional property, library assets, hostel items, and keys have been surrendered, and all tuition and student charges are cleared in full.
                </p>

                {/* Departmental Verification Sign-off Grid */}
                <div className="border border-gray-300 rounded overflow-hidden mb-8">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-800">
                        Departmental Approvals & Verification Record
                    </div>

                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-[11px]">
                                <th className="p-2.5">Department</th>
                                <th className="p-2.5 text-center">Status</th>
                                <th className="p-2.5">Authorized Officer</th>
                                <th className="p-2.5">Date Cleared</th>
                                <th className="p-2.5">Official Stamp / Signature</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stages.map((stg) => (
                                <tr key={stg.department}>
                                    <td className="p-2.5 font-semibold text-gray-900">{stg.label}</td>
                                    <td className="p-2.5 text-center">
                                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                                            CLEARED
                                        </span>
                                    </td>
                                    <td className="p-2.5 font-medium text-gray-700">{stg.cleared_by || 'Departmental Officer'}</td>
                                    <td className="p-2.5 text-gray-600">{stg.cleared_at || clearance.completed_at}</td>
                                    <td className="p-2.5">
                                        <div className="h-7 w-28 border border-dashed border-gray-300 rounded flex items-center justify-center text-[9px] text-gray-400">
                                            Verified
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Institutional Signatures & Seal */}
                <div className="grid grid-cols-3 gap-8 pt-6 border-t border-gray-400 text-xs text-center mt-8">
                    <div>
                        <div className="border-b border-gray-900 mb-2 h-12"></div>
                        <p className="font-bold text-gray-900">Dean of Students</p>
                        <p className="text-[10px] text-gray-500">Signature & Date</p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className="h-20 w-20 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-[10px] text-gray-400 uppercase font-semibold text-center p-2">
                            Official Registry Seal
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
