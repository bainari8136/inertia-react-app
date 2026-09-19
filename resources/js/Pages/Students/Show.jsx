import { Head, Link, Form, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';

export default function Show({ student, statuses, can: permissions }) {
    const { flash } = usePage().props;

    return (
        <Dashboard title="Student profile">
            <Head title={student.registration_number} />
            {flash?.status && <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>}

            <div className="mb-6 flex flex-wrap justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{student.first_name} {student.last_name}</h1>
                    <p className="font-mono text-sm text-indigo-600 mt-1">{student.registration_number}</p>
                    <p className="text-sm text-gray-600 capitalize">{student.status} · {student.programme}</p>
                </div>
                {permissions.update && (
                    <Link href={`/students/${student.id}/edit`} className="rounded-md border px-4 py-2 text-sm">Edit profile</Link>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card title="Personal">
                    <Info label="Email" value={student.email} />
                    <Info label="Phone" value={student.phone} />
                    <Info label="Date of birth" value={student.date_of_birth} />
                    <Info label="Gender" value={student.gender} />
                    <Info label="Admitted" value={student.admitted_at} />
                </Card>
                <Card title="Contact">
                    <Info label="Address" value={[student.address, student.city, student.country].filter(Boolean).join(', ')} />
                </Card>
                <Card title="Guardian">
                    <Info label="Name" value={student.guardian_name} />
                    <Info label="Phone" value={student.guardian_phone} />
                    <Info label="Relationship" value={student.guardian_relationship} />
                </Card>
                <Card title="Academic">
                    <Info label="Faculty" value={student.faculty} />
                    <Info label="Department" value={student.department} />
                    <p className="text-sm text-gray-700 whitespace-pre-wrap mt-2">{student.academic_history || 'No academic history recorded.'}</p>
                </Card>
                <Card title="Documents">
                    {student.documents?.length ? (
                        <ul className="text-sm space-y-1">{student.documents.map((d) => <li key={d.id}>{d.original_name}</li>)}</ul>
                    ) : (
                        <p className="text-sm text-gray-500">No documents</p>
                    )}
                </Card>
            </div>

            {permissions.manageStatus && (
                <div className="bg-white rounded-xl border p-5">
                    <h2 className="font-semibold mb-3">Update status</h2>
                    <Form action={`/students/${student.id}/status`} method="PATCH" className="flex gap-3 items-end">
                        <select name="status" defaultValue={student.status} className="rounded-md border-gray-300 py-2 px-2 text-sm">
                            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white">Update status</button>
                    </Form>
                </div>
            )}
        </Dashboard>
    );
}

function Card({ title, children }) {
    return <div className="bg-white rounded-xl border p-5"><h2 className="font-semibold text-gray-900 mb-3">{title}</h2>{children}</div>;
}

function Info({ label, value }) {
    return (
        <div className="mb-2">
            <span className="text-xs text-gray-500">{label}</span>
            <p className="text-sm text-gray-800">{value || '—'}</p>
        </div>
    );
}
