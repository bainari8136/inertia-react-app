import { Head, Link } from '@inertiajs/react';

export default function Show({ data, canManage }) {
    const { cohort, programmes } = data;

    const allGraduands = programmes.flatMap((p) => p.graduands || []);

    const firstClassCount = allGraduands.filter((g) => g.classification === 'First Class').length;
    const upperSecondCount = allGraduands.filter((g) => g.classification === 'Upper Second Class').length;
    const lowerSecondCount = allGraduands.filter((g) => g.classification === 'Lower Second Class').length;
    const passCount = allGraduands.filter((g) => g.classification === 'Pass').length;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
            <Head title={`Graduation List - ${cohort.name}`} />

            {/* Action Bar (hidden when printing) */}
            <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between print:hidden">
                <Link
                    href="/graduation"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                    &larr; Back to Graduation Cohorts
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Graduation Booklet
                    </button>
                </div>
            </div>

            {/* Document Paper */}
            <div className="max-w-5xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-md print:shadow-none print:p-0 print:rounded-none border print:border-none border-gray-200 text-gray-900 text-sm">
                {/* Header */}
                <div className="text-center border-b-2 border-gray-900 pb-6 mb-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-900 text-white font-serif font-black text-2xl mb-3 shadow-inner">
                        U
                    </div>
                    <h1 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wider text-gray-900">
                        INSTITUTE OF JUDICIAL ADMINISTRATION
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mt-0.5">
                        Office of the Academic Registrar &bull; Examinations & Graduation Secretariat
                    </p>
                    <p className="text-xs text-gray-500 mt-1">P.O. Box 20, Lushoto, Tanga, Tanzania</p>
                    <div className="mt-4 inline-block bg-gray-900 text-white px-5 py-1 text-xs font-bold uppercase tracking-wider">
                        Official Graduation Congregation Roll
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mt-3">{cohort.name}</h2>
                    <p className="text-xs text-gray-600">
                        Academic Year: <span className="font-semibold">{cohort.academic_year}</span> &bull; Ceremony Date: <span className="font-semibold">{cohort.ceremony_date}</span>
                    </p>
                </div>

                {/* Statistics Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 border border-gray-300 p-4 mb-8 text-center text-xs bg-gray-50">
                    <div>
                        <span className="text-gray-500 block">Total Graduands</span>
                        <span className="text-lg font-extrabold text-indigo-950">{cohort.total_graduands}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block">First Class</span>
                        <span className="text-lg font-bold text-emerald-700">{firstClassCount}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block">Upper Second</span>
                        <span className="text-lg font-bold text-blue-700">{upperSecondCount}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block">Lower Second</span>
                        <span className="text-lg font-bold text-amber-700">{lowerSecondCount}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block">Pass</span>
                        <span className="text-lg font-bold text-gray-700">{passCount}</span>
                    </div>
                </div>

                {/* Programmes Breakdown */}
                {programmes.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 border border-dashed border-gray-300 rounded mb-8 text-xs">
                        No graduands have completed full institutional clearance for this ceremony cohort yet.
                    </div>
                ) : (
                    <div className="space-y-8 mb-10">
                        {programmes.map((prog) => (
                            <div key={prog.programme_name} className="border border-gray-300 rounded overflow-hidden">
                                <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-300 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="font-bold text-gray-900 uppercase">
                                            {prog.programme_name} ({prog.programme_code || 'PROG'})
                                        </span>
                                        <span className="text-gray-500 ml-2">&bull; {prog.faculty || 'Faculty of Law'}</span>
                                    </div>
                                    <span className="font-semibold text-indigo-900">
                                        Graduands: {prog.graduands.length}
                                    </span>
                                </div>

                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-[11px]">
                                            <th className="p-2.5 w-10 text-center">#</th>
                                            <th className="p-2.5">Reg Number</th>
                                            <th className="p-2.5">Candidate Name</th>
                                            <th className="p-2.5 text-center">Gender</th>
                                            <th className="p-2.5 text-center">CGPA</th>
                                            <th className="p-2.5">Award / Classification</th>
                                            <th className="p-2.5 font-mono">Clearance Serial</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {prog.graduands.map((g, idx) => (
                                            <tr key={g.id}>
                                                <td className="p-2.5 text-center text-gray-400">{idx + 1}</td>
                                                <td className="p-2.5 font-mono font-medium text-indigo-900">{g.registration_number}</td>
                                                <td className="p-2.5 font-bold uppercase text-gray-900">{g.name}</td>
                                                <td className="p-2.5 text-center capitalize">{g.gender || '-'}</td>
                                                <td className="p-2.5 text-center font-extrabold">{Number(g.cgpa).toFixed(2)}</td>
                                                <td className="p-2.5 font-semibold text-gray-800">{g.classification}</td>
                                                <td className="p-2.5 font-mono text-[11px] text-emerald-800">{g.certificate_number}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}

                {/* Sign-off footer */}
                <div className="grid grid-cols-2 gap-12 pt-8 border-t border-gray-400 text-xs text-center">
                    <div>
                        <div className="border-b border-gray-900 mb-2 h-12"></div>
                        <p className="font-bold text-gray-900">Academic Registrar</p>
                        <p className="text-[10px] text-gray-500">Secretary to Academic Council</p>
                    </div>

                    <div>
                        <div className="border-b border-gray-900 mb-2 h-12"></div>
                        <p className="font-bold text-gray-900">Principal / Vice Chancellor</p>
                        <p className="text-[10px] text-gray-500">Chairman of Academic Council</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
