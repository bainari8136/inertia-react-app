import { Head, Link, router, usePage } from '@inertiajs/react';
import Dashboard from '../../Users/Dashboard';
import { formatMoney } from '../../../lib/money';

const statusColors = {
    issued: 'bg-amber-100 text-amber-800',
    partial: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
};

export default function Index({ invoices, filters, statuses, canCreate }) {
    const { flash } = usePage().props;

    const search = (e) => {
        e.preventDefault();
        router.get('/finance/invoices', Object.fromEntries(new FormData(e.target)), { preserveState: true });
    };

    return (
        <Dashboard title="Invoices">
            <Head title="Invoices" />
            {flash?.status && <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>}

            <div className="mb-6 flex flex-wrap justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
                {canCreate && (
                    <Link href="/finance/invoices/create" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
                        Generate invoice
                    </Link>
                )}
            </div>

            <form onSubmit={search} className="mb-4 flex flex-wrap gap-3">
                <input name="search" defaultValue={filters.search ?? ''} placeholder="Invoice # or student..." className="rounded-md border-gray-300 py-2 px-3 text-sm" />
                <select name="status" defaultValue={filters.status ?? ''} className="rounded-md border-gray-300 py-2 px-3 text-sm">
                    <option value="">All statuses</option>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="outstanding" value="1" defaultChecked={filters.outstanding} /> Outstanding only
                </label>
                <button type="submit" className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white">Filter</button>
            </form>

            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-500">Invoice</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Student</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Amount</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Balance</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Status</th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {invoices.data.length ? invoices.data.map((i) => (
                            <tr key={i.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-sm">{i.invoice_number}</td>
                                <td className="px-6 py-4">
                                    <p className="font-medium">{i.student_name}</p>
                                    <p className="text-xs text-gray-500">{i.registration_number}</p>
                                </td>
                                <td className="px-6 py-4">{formatMoney(i.amount)}</td>
                                <td className="px-6 py-4 font-medium text-amber-700">{formatMoney(i.balance)}</td>
                                <td className="px-6 py-4">
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[i.status] ?? ''}`}>{i.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/finance/invoices/${i.id}`} className="text-indigo-600 font-medium hover:underline">View</Link>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">No invoices found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
}
