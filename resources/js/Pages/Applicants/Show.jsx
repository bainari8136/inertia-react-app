import { Head, Link, Form, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import { can } from '../../lib/can';

export default function Show({ applicant }) {
    const { auth, flash } = usePage().props;
    const permissions = auth?.permissions ?? [];
    const isPending = applicant.status === 'pending';

    return (
        <Dashboard title="Applicant">
            <Head title={applicant.first_name} />
            {flash?.status && <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>}

            <div className="mb-6 flex flex-wrap justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{applicant.first_name} {applicant.last_name}</h1>
                    <p className="text-sm text-gray-600">{applicant.programme} · <span className="capitalize">{applicant.status}</span></p>
                </div>
                <div className="flex gap-2">
                    {isPending && can(permissions, 'applicants.update') && (
                        <Link href={`/applicants/${applicant.id}/edit`} className="rounded-md border px-4 py-2 text-sm">Edit</Link>
                    )}
                    {applicant.student_id && (
                        <Link href={`/students/${applicant.student_id}`} className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white">
                            View student
                        </Link>
                    )}
                </div>
            </div>

            {applicant.registration_number && (
                <p className="mb-4 text-sm text-green-700 font-medium">Registration number: {applicant.registration_number}</p>
            )}

            {applicant.rejection_reason && (
                <p className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">{applicant.rejection_reason}</p>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <Section title="Contact">
                    <Row label="Email" value={applicant.email} />
                    <Row label="Phone" value={applicant.phone} />
                    <Row label="Address" value={[applicant.address, applicant.city, applicant.country].filter(Boolean).join(', ')} />
                </Section>
                <Section title="Guardian">
                    <Row label="Name" value={applicant.guardian_name} />
                    <Row label="Phone" value={applicant.guardian_phone} />
                    <Row label="Relationship" value={applicant.guardian_relationship} />
                </Section>
                <Section title="Academic history">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{applicant.academic_history || '—'}</p>
                </Section>
                <Section title="Documents">
                    {applicant.documents?.length ? (
                        <ul className="text-sm space-y-1">
                            {applicant.documents.map((d) => (
                                <li key={d.id} className="text-gray-700">{d.original_name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No documents uploaded</p>
                    )}
                </Section>
            </div>

            {isPending && can(permissions, 'applicants.admit') && (
                <div className="mt-8 flex flex-wrap gap-4 border-t pt-6">
                    <Form action={`/applicants/${applicant.id}/approve`} method="POST">
                        <button type="submit" className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
                            Approve admission
                        </button>
                    </Form>
                    <Form action={`/applicants/${applicant.id}/reject`} method="POST" className="flex gap-2 items-end">
                        {({ errors }) => (
                            <>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Rejection reason</label>
                                    <input name="rejection_reason" required className="rounded-md border-gray-300 py-2 px-2 text-sm w-64" />
                                    {errors.rejection_reason && <p className="text-xs text-red-600">{errors.rejection_reason}</p>}
                                </div>
                                <button type="submit" className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">Reject</button>
                            </>
                        )}
                    </Form>
                </div>
            )}
        </Dashboard>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold text-gray-900 mb-3">{title}</h2>
            {children}
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="mb-2">
            <span className="text-xs text-gray-500">{label}</span>
            <p className="text-sm text-gray-800">{value || '—'}</p>
        </div>
    );
}
