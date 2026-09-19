import { Head, Form, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import { formatMoney } from '../../lib/money';

export default function FeeStructures({ feeStructures, programmes, semesters, canManage }) {
    const { flash } = usePage().props;

    return (
        <Dashboard title="Fee structures">
            <Head title="Fee structures" />
            {flash?.status && <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>}

            <h1 className="text-3xl font-bold text-gray-900 mb-6">Fee structures</h1>

            {canManage && (
                <div className="bg-white rounded-xl border p-5 mb-6 max-w-xl">
                    <h2 className="font-semibold mb-4">Add fee structure</h2>
                    <Form method="post" action="/finance/fee-structures" className="space-y-3">
                        <select name="programme_id" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm">
                            <option value="">Programme</option>
                            {programmes.map((p) => (
                                <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                            ))}
                        </select>
                        <select name="semester_id" className="w-full rounded-md border-gray-300 py-2 px-2 text-sm">
                            <option value="">All semesters (annual fee)</option>
                            {semesters.map((s) => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                        </select>
                        <input name="name" placeholder="Fee name" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                        <textarea name="description" placeholder="Description" rows={2} className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                        <input type="number" name="amount" step="0.01" min="0" placeholder="Amount" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" name="is_active" value="1" defaultChecked /> Active
                        </label>
                        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white">Save</button>
                    </Form>
                </div>
            )}

            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-500">Name</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Programme</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Semester</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Amount</th>
                            {canManage && <th className="px-6 py-3 text-right font-semibold text-gray-500">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {feeStructures.map((f) => (
                            <tr key={f.id}>
                                <td className="px-6 py-4 font-medium">{f.name}</td>
                                <td className="px-6 py-4">{f.programme}</td>
                                <td className="px-6 py-4 text-gray-600">{f.semester ?? '—'}</td>
                                <td className="px-6 py-4">{formatMoney(f.amount)}</td>
                                {canManage && (
                                    <td className="px-6 py-4 text-right">
                                        <Form method="post" action={`/finance/fee-structures/${f.id}/bulk-invoice`} className="inline">
                                            <button type="submit" className="text-indigo-600 text-sm font-medium hover:underline">
                                                Generate invoices
                                            </button>
                                        </Form>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
}
