import { Head } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import StatCard from '../../components/StatCard';
import { formatMoney } from '../../lib/money';

export default function Reports({ stats, recentPayments, topOutstanding }) {
    return (
        <Dashboard title="Finance reports">
            <Head title="Finance reports" />
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Financial reports</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total revenue" value={formatMoney(stats.total_revenue)} />
                <StatCard label="Outstanding balances" value={formatMoney(stats.total_outstanding)} />
                <StatCard label="Invoices issued" value={stats.invoices_issued} />
                <StatCard label="Invoices paid" value={stats.invoices_paid} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border p-5">
                    <h2 className="font-semibold mb-4">Recent payments</h2>
                    <ul className="divide-y text-sm">
                        {recentPayments.map((p, i) => (
                            <li key={i} className="py-2 flex justify-between gap-4">
                                <div>
                                    <p className="font-mono text-xs text-indigo-600">{p.receipt_number}</p>
                                    <p className="font-medium">{p.student}</p>
                                    <p className="text-xs text-gray-500">{p.invoice_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{formatMoney(p.amount)}</p>
                                    <p className="text-xs text-gray-500">{p.paid_at}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-xl border p-5">
                    <h2 className="font-semibold mb-4">Top outstanding balances</h2>
                    <ul className="divide-y text-sm">
                        {topOutstanding.map((i, idx) => (
                            <li key={idx} className="py-2 flex justify-between gap-4">
                                <div>
                                    <p className="font-medium">{i.student_name}</p>
                                    <p className="text-xs text-gray-500 font-mono">{i.invoice_number}</p>
                                </div>
                                <p className="font-semibold text-amber-700">{formatMoney(i.balance)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Dashboard>
    );
}
