import { Head, Form, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';

export default function Courses({ courses, programmes, canManage }) {
    const { flash } = usePage().props;

    return (
        <Dashboard title="Courses">
            <Head title="Courses" />
            {flash?.status && <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>}

            <h1 className="text-3xl font-bold text-gray-900 mb-6">Courses</h1>

            {canManage && (
                <div className="max-w-md bg-white rounded-xl border p-5 mb-6">
                    <h2 className="font-semibold mb-4">Add course</h2>
                    <Form method="post" action="/academic/courses" className="space-y-3">
                        <select name="programme_id" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm">
                            <option value="">Programme</option>
                            {programmes.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                        </select>
                        <input name="code" placeholder="Course code" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                        <input name="name" placeholder="Course name" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                        <input type="number" name="credit_hours" defaultValue={3} min={1} max={12} required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white">Save course</button>
                    </Form>
                </div>
            )}

            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-500">Code</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Name</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Programme</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Credits</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {courses.map((c) => (
                            <tr key={c.id}>
                                <td className="px-6 py-4 font-mono font-medium">{c.code}</td>
                                <td className="px-6 py-4">{c.name}</td>
                                <td className="px-6 py-4 text-gray-600">{c.programme}</td>
                                <td className="px-6 py-4">{c.credit_hours}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
}
