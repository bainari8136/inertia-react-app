import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import { formatMoney } from '../../lib/money';

export default function MyClearance({ student, clearance, openCohorts }) {
    const { flash = {} } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        graduation_cohort_id: openCohorts[0]?.id || '',
        type: 'graduation',
    });

    const handleInitiate = (e) => {
        e.preventDefault();
        post('/clearance');
    };

    const approvedCount = clearance?.stages?.filter((s) => s.status === 'approved').length || 0;
    const totalCount = clearance?.stages?.length || 6;
    const progressPercent = Math.round((approvedCount / totalCount) * 100);

    return (
        <Dashboard title="My Clearance">
            <Head title="My Clearance & Graduation" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Graduation & Institutional Clearance</h1>
                    <p className="text-sm text-gray-600">Track and manage your university departmental clearance status.</p>
                </div>

                {clearance?.status === 'approved' && (
                    <Link
                        href={`/clearance/${clearance.id}/certificate`}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Official Clearance Certificate
                    </Link>
                )}
            </div>

            {flash?.status && (
                <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                    {flash.status}
                </div>
            )}

            {/* Student Profile Card */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                            {student.registration_number}
                        </span>
                        <h2 className="text-xl font-bold text-gray-900 mt-2">{student.name}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">{student.programme}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 text-xs">
                        <div>
                            <span className="text-gray-500 block">Current CGPA:</span>
                            <span className="text-lg font-extrabold text-indigo-950">{Number(student.cgpa).toFixed(2)}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Fee Balance:</span>
                            <span className={`text-lg font-bold ${student.fee_balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                {formatMoney(student.fee_balance)}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Status:</span>
                            <span className="capitalize font-semibold text-gray-800">{student.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* If no clearance initiated yet */}
            {!clearance ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
                    <div className="max-w-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Initiate Clearance Request</h3>
                        <p className="text-xs text-gray-600 mb-6">
                            Start your official university clearance for graduation or institutional departure. This will create verification requests across the Academic Department, Library, Hostel, Finance, Dean of Students, and Academic Registrar.
                        </p>

                        {student.fee_balance > 0 && (
                            <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
                                <span className="font-bold">Notice:</span> You have an outstanding balance of {formatMoney(student.fee_balance)}. Finance clearance will require settlement of institutional dues.
                            </div>
                        )}

                        <form onSubmit={handleInitiate} className="space-y-4">
                            <div>
                                <label htmlFor="cohortSelect" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Graduation Ceremony Cohort
                                </label>
                                {openCohorts.length > 0 ? (
                                    <select
                                        id="cohortSelect"
                                        value={data.graduation_cohort_id}
                                        onChange={(e) => setData('graduation_cohort_id', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 py-2 px-3 text-xs focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {openCohorts.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} &bull; Ceremony: {c.ceremony_date}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-xs text-gray-500 italic">No upcoming graduation ceremonies currently open for clearance.</p>
                                )}
                                {errors.graduation_cohort_id && <p className="text-xs text-red-600 mt-1">{errors.graduation_cohort_id}</p>}
                            </div>

                            <div>
                                <label htmlFor="clearanceType" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Clearance Type
                                </label>
                                <select
                                    id="clearanceType"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 py-2 px-3 text-xs focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="graduation">Graduation Clearance (Completion of Studies)</option>
                                    <option value="departure">Institutional Departure (Completion / Discontinuation)</option>
                                    <option value="transfer">Inter-Institutional Transfer</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition"
                            >
                                {processing ? 'Initiating...' : 'Submit Clearance Application &rarr;'}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Progress Bar & Header */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    Clearance Progress: {approvedCount} of {totalCount} Departments Approved
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Cohort: <span className="font-semibold text-gray-800">{clearance.cohort_name || 'Departure'}</span> &bull; Submitted on {clearance.submitted_at}
                                </p>
                            </div>

                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                                    clearance.status === 'approved'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : clearance.status === 'rejected'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-amber-100 text-amber-800'
                                }`}
                            >
                                {clearance.status.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Progress meter */}
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${
                                    clearance.status === 'approved' ? 'bg-emerald-600' : 'bg-indigo-600'
                                }`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Department Stages Matrix */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                                Departmental Clearance Verifications
                            </h3>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {clearance.stages.map((stage, idx) => {
                                const isApproved = stage.status === 'approved';
                                const isRejected = stage.status === 'rejected';

                                return (
                                    <div key={stage.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-xs ${
                                                    isApproved
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : isRejected
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                {isApproved ? '✓' : isRejected ? '✕' : idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900">{stage.label}</h4>
                                                {stage.remarks && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        <span className="font-semibold text-gray-700">Note:</span> {stage.remarks}
                                                    </p>
                                                )}
                                                {stage.cleared_at && (
                                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                                        Cleared by {stage.cleared_by} on {stage.cleared_at}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider self-end sm:self-center ${
                                                isApproved
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : isRejected
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {stage.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </Dashboard>
    );
}
