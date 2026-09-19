import { Head, Link, Form, usePage } from '@inertiajs/react';
import Dashboard from '../../Users/Dashboard';
import { formatMoney } from '../../../lib/money';

export default function Show({ invoice, paymentMethods, canRecordPayment }) {
    const { flash } = usePage().props;
    const canPay = canRecordPayment && invoice.balance > 0 && invoice.status !== 'cancelled';

    return (
        <Dashboard title="Invoice">
            <Head title={invoice.invoice_number} />
            {flash?.status && <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>}

            <Link href="/finance/invoices" className="text-sm text-indigo-600 hover:underline">← Back to invoices</Link>

            <div className="mt-4 mb-6 flex flex-wrap justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-mono text-gray-900">{invoice.invoice_number}</h1>
                    <p className="text-sm text-gray-600 capitalize mt-1">{invoice.status}</p>
                </div>
                {invoice.status !== 'cancelled' && invoice.status !== 'paid' && canRecordPayment && invoice.amount_paid === 0 && (
                    <Form method="post" action={`/finance/invoices/${invoice.id}/cancel`}>
                        <button type="submit" className="text-sm text-red-600 hover:underline">Cancel invoice</button>
                    </Form>
                )}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl border p-5 space-y-2 text-sm">
                    <p><span className="text-gray-500">Student:</span> <strong>{invoice.student_name}</strong> ({invoice.registration_number})</p>
                    <p><span className="text-gray-500">Programme:</span> {invoice.programme}</p>
                    <p><span className="text-gray-500">Description:</span> {invoice.description}</p>
                    <p><span className="text-gray-500">Issued:</span> {invoice.issued_at} by {invoice.issued_by}</p>
                    {invoice.due_date && <p><span className="text-gray-500">Due:</span> {invoice.due_date}</p>}
                    <div className="pt-3 border-t grid grid-cols-3 gap-2 text-center">
                        <div><p className="text-xs text-gray-500">Total</p><p className="font-bold">{formatMoney(invoice.amount)}</p></div>
                        <div><p className="text-xs text-gray-500">Paid</p><p className="font-bold text-green-700">{formatMoney(invoice.amount_paid)}</p></div>
                        <div><p className="text-xs text-gray-500">Balance</p><p className="font-bold text-amber-700">{formatMoney(invoice.balance)}</p></div>
                    </div>
                </div>

                {canPay && (
                    <div className="bg-white rounded-xl border p-5">
                        <h2 className="font-semibold mb-4">Record payment</h2>
                        <Form method="post" action={`/finance/invoices/${invoice.id}/payments`} className="space-y-3">
                            <input type="number" name="amount" step="0.01" max={invoice.balance} defaultValue={invoice.balance} required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                            <select name="payment_method" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm">
                                {paymentMethods.map((m) => (
                                    <option key={m} value={m}>{m.replace('_', ' ')}</option>
                                ))}
                            </select>
                            <input name="reference" placeholder="Reference / transaction ID" className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                            <button type="submit" className="w-full rounded-md bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700">Record payment</button>
                        </Form>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl border p-5">
                <h2 className="font-semibold mb-4">Payment history</h2>
                {invoice.payments?.length ? (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500 border-b">
                                <th className="pb-2">Receipt</th>
                                <th className="pb-2">Amount</th>
                                <th className="pb-2">Method</th>
                                <th className="pb-2">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {invoice.payments.map((p) => (
                                <tr key={p.id}>
                                    <td className="py-2 font-mono">{p.receipt_number}</td>
                                    <td className="py-2">{formatMoney(p.amount)}</td>
                                    <td className="py-2 capitalize">{p.payment_method?.replace('_', ' ')}</td>
                                    <td className="py-2 text-gray-600">{p.paid_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-sm text-gray-500">No payments recorded yet.</p>
                )}
            </div>
        </Dashboard>
    );
}
