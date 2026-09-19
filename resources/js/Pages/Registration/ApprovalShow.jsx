import { Head, Link, Form } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';

export default function ApprovalShow({ registration }) {
    const isPending = registration.status === 'pending';

    return (
        <Dashboard title="Review registration">
            <Head title="Review registration" />

            <Link href="/registration-approvals" className="text-sm text-indigo-600 hover:underline">← Back to approvals</Link>

            <div className="mt-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{registration.student_name}</h1>
                <p className="font-mono text-sm text-indigo-600">{registration.registration_number}</p>
                <p className="text-sm text-gray-600">{registration.programme} · {registration.semester} ({registration.academic_year})</p>
                <p className="text-sm capitalize mt-1">Status: {registration.status}</p>
            </div>

            <div className="bg-white rounded-xl border p-5 mb-6">
                <h2 className="font-semibold mb-3">Courses ({registration.total_credits} credits)</h2>
                <ul className="divide-y">
                    {registration.courses.map((c, i) => (
                        <li key={i} className="py-2 flex justify-between text-sm">
                            <span><strong>{c.code}</strong> — {c.name}</span>
                            <span className="text-gray-500">{c.credit_hours} cr</span>
                        </li>
                    ))}
                </ul>
            </div>

            {isPending && (
                <div className="flex flex-wrap gap-4">
                    <Form method="post" action={`/registration-approvals/${registration.id}/approve`}>
                        <button type="submit" className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">Approve registration</button>
                    </Form>
                    <Form method="post" action={`/registration-approvals/${registration.id}/reject`} className="flex gap-2 items-end">
                        {({ errors }) => (
                            <>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Rejection reason</label>
                                    <input name="rejection_reason" required className="rounded-md border-gray-300 py-2 px-2 text-sm w-72" />
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
