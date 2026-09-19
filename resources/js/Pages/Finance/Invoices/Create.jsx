import { Head, Link, Form } from '@inertiajs/react';
import Dashboard from '../../Users/Dashboard';
import { useState } from 'react';

export default function Create({ students, feeStructures }) {
    const [useFee, setUseFee] = useState(true);

    return (
        <Dashboard title="Generate invoice">
            <Head title="Generate invoice" />
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Generate invoice</h1>

            <div className="max-w-lg bg-white rounded-xl border p-6">
                <Form method="post" action="/finance/invoices" className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                        <select name="student_id" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm">
                            <option value="">Select student</option>
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4 text-sm">
                        <label className="flex items-center gap-2">
                            <input type="radio" checked={useFee} onChange={() => setUseFee(true)} /> From fee structure
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" checked={!useFee} onChange={() => setUseFee(false)} /> Custom amount
                        </label>
                    </div>

                    {useFee ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fee structure</label>
                            <select name="fee_structure_id" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm">
                                <option value="">Select fee</option>
                                {feeStructures.map((f) => (
                                    <option key={f.id} value={f.id}>{f.label}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <>
                            <input name="description" placeholder="Description" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                            <input type="number" name="amount" step="0.01" min="0" placeholder="Amount" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                            <input type="date" name="due_date" className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                        </>
                    )}

                    <div className="flex gap-4 pt-2">
                        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white">Generate</button>
                        <Link href="/finance/invoices" className="text-sm text-gray-600 self-center">Cancel</Link>
                    </div>
                </Form>
            </div>
        </Dashboard>
    );
}
