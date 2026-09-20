import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import { formatMoney } from '../../lib/money';

export default function Show({ clearance, canApprove, isRegistrar }) {
    const { flash = {} } = usePage().props;
    const { student, cohort, stages } = clearance;

    const [activeStageId, setActiveStageId] = useState(null);
    const [actionType, setActionType] = useState(null); // 'approve' | 'reject'
    const [remarks, setRemarks] = useState('');
    const [processing, setProcessing] = useState(false);

    const nonRegistrarStages = stages.filter((s) => s.department !== 'registrar');
    const allPriorApproved = nonRegistrarStages.every((s) => s.status === 'approved');

    const openActionModal = (stageId, type, currentRemarks) => {
        setActiveStageId(stageId);
        setActionType(type);
        setRemarks(currentRemarks || (type === 'approve' ? 'Cleared with no liabilities.' : ''));
    };

    const closeActionModal = () => {
        setActiveStageId(null);
        setActionType(null);
        setRemarks('');
    };

    const handleStageSubmit = (e) => {
        e.preventDefault();
        if (!activeStageId || !actionType) return;

        setProcessing(true);
        const url = `/clearance/stages/${activeStageId}/${actionType}`;

        router.post(
            url,
            { remarks },
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    closeActionModal();
                },
            }
        );
    };

    return (
        <Dashboard title={`Clearance - ${student.registration_number}`}>
            <Head title={`Clearance Details - ${student.name}`} />

            {/* Top Navigation */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/clearance" className="text-xs font-semibold text-indigo-600 hover:underline">
                            &larr; Back to Clearance List
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Student Clearance Dossier
                    </h1>
                    <p className="text-sm text-gray-600">
                        Application ID: #{clearance.id} &bull; Type: <span className="capitalize font-semibold">{clearance.type}</span>
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {clearance.status === 'approved' && (
                        <Link
                            href={`/clearance/${clearance.id}/certificate`}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            View Official Certificate
                        </Link>
                    )}
                </div>
            </div>

            {flash?.status && (
                <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                    {flash.status}
                </div>
            )}

            {/* Student & Academic Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs md:col-span-2">
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                {student.registration_number}
                            </span>
                            <h2 className="text-xl font-bold text-gray-900 mt-2">{student.name}</h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {student.programme} &bull; {student.faculty || 'Faculty of Law & Judicial Studies'}
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

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 text-xs">
                        <div>
                            <span className="text-gray-500 block">Graduation Cohort:</span>
                            <span className="font-semibold text-gray-800">{cohort?.name || 'N/A (Departure)'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Ceremony Date:</span>
                            <span className="font-semibold text-gray-800">{cohort?.ceremony_date || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Submitted On:</span>
                            <span className="font-semibold text-gray-800">{clearance.submitted_at}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Certificate No:</span>
                            <span className="font-mono font-bold text-emerald-700">{clearance.certificate_number || 'Pending'}</span>
                        </div>
                    </div>
                </div>

                {/* Academic & Financial Status */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Academic & Finance Standing</h3>
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                <span className="text-gray-600">Overall CGPA:</span>
                                <span className="font-bold text-gray-900 text-sm">{Number(student.current_cgpa).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                <span className="text-gray-600">Classification:</span>
                                <span className="font-semibold text-indigo-700">{clearance.degree_classification || 'Calculating'}</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-gray-100">
                                <span className="text-gray-600">Outstanding Balance:</span>
                                <span className={`font-bold ${student.fee_balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {formatMoney(student.fee_balance)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-gray-600">Student Status:</span>
                                <span className="capitalize font-semibold text-gray-800">{student.status}</span>
                            </div>
                        </div>
                    </div>

                    {clearance.final_remarks && (
                        <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-700 border border-gray-200">
                            <span className="font-semibold block text-gray-800">Final Remarks:</span>
                            {clearance.final_remarks}
                        </div>
                    )}
                </div>
            </div>

            {/* Departmental Clearance Stages */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Multi-Department Clearance Stages</h3>
                    <p className="text-xs text-gray-500">
                        {stages.filter((s) => s.status === 'approved').length} of {stages.length} departments cleared
                    </p>
                </div>

                <div className="space-y-4">
                    {stages.map((stage, idx) => {
                        const isApproved = stage.status === 'approved';
                        const isRejected = stage.status === 'rejected';
                        const isRegStage = stage.department === 'registrar';
                        const canRegistrarApprove = !isRegStage || allPriorApproved;

                        return (
                            <div
                                key={stage.id}
                                className={`rounded-xl border p-5 bg-white shadow-2xs transition ${
                                    isApproved
                                        ? 'border-emerald-200'
                                        : isRejected
                                        ? 'border-red-200'
                                        : 'border-gray-200'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-xs ${
                                                isApproved
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : isRejected
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-gray-900">{stage.label}</h4>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                                        isApproved
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : isRejected
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-amber-100 text-amber-800'
                                                    }`}
                                                >
                                                    {stage.status}
                                                </span>
                                            </div>

                                            {stage.remarks && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    <span className="font-medium text-gray-700">Remarks:</span> {stage.remarks}
                                                </p>
                                            )}

                                            {stage.cleared_by && (
                                                <p className="text-[11px] text-gray-400 mt-1">
                                                    Cleared by <span className="font-medium text-gray-600">{stage.cleared_by}</span> on {stage.cleared_at}
                                                </p>
                                            )}

                                            {isRegStage && !allPriorApproved && (
                                                <p className="text-xs text-amber-700 font-medium mt-1">
                                                    &bull; Requires all 5 preceding departmental clearances before Registrar final sign-off.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {canApprove && (
                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            <button
                                                type="button"
                                                onClick={() => openActionModal(stage.id, 'approve', stage.remarks)}
                                                disabled={!canRegistrarApprove}
                                                className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-40"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openActionModal(stage.id, 'reject', stage.remarks)}
                                                className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                Hold / Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Modal */}
            {activeStageId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-gray-100">
                        <h3 className="text-base font-bold text-gray-900 mb-2">
                            {actionType === 'approve' ? 'Approve Department Clearance' : 'Flag Hold / Reject Clearance'}
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">
                            {actionType === 'approve'
                                ? 'Verify that the student has fulfilled all obligations and has zero outstanding holds.'
                                : 'Specify the exact reason or financial liability for holding the student clearance.'}
                        </p>

                        <form onSubmit={handleStageSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="remarksInput" className="block text-xs font-medium text-gray-700 mb-1">
                                    Remarks / Notes {actionType === 'reject' && <span className="text-red-500">*</span>}
                                </label>
                                <textarea
                                    id="remarksInput"
                                    rows={3}
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    required={actionType === 'reject'}
                                    placeholder={actionType === 'approve' ? 'Cleared with no issues...' : 'Reason for hold (e.g. Unreturned textbook, key missing)...'}
                                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeActionModal}
                                    disabled={processing}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`rounded-lg px-4 py-2 text-xs font-semibold text-white ${
                                        actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    {processing ? 'Processing...' : actionType === 'approve' ? 'Confirm Approval' : 'Confirm Hold'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Dashboard>
    );
}
