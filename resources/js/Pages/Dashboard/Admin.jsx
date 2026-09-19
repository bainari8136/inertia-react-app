import { Head, Link } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import StatCard from '../../components/StatCard';
import { formatMoney } from '../../lib/money';

export default function Admin({ stats }) {
    return (
        <Dashboard title="Dashboard">
            <Head title="Administrator Dashboard" />
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Administrator Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                <StatCard label="Total students" value={stats.total_students} />
                <StatCard label="Total staff" value={stats.total_staff} />
                <StatCard label="Revenue" value={formatMoney(stats.revenue_summary)} />
                <StatCard label="Outstanding" value={formatMoney(stats.total_outstanding)} />
                <StatCard label="Pending approvals" value={stats.pending_approvals} hint="Admissions + course registrations" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border bg-white p-6">
                    <h2 className="font-semibold text-gray-900 mb-2">Quick actions</h2>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/applicants" className="text-indigo-600 hover:underline">
                                Review applications ({stats.pending_admissions} pending)
                            </Link>
                        </li>
                        <li>
                            <Link href="/finance/reports" className="text-indigo-600 hover:underline">
                                Finance reports
                            </Link>
                        </li>
                        <li>
                            <Link href="/finance/invoices" className="text-indigo-600 hover:underline">
                                Invoices & payments
                            </Link>
                        </li>
                        <li>
                            <Link href="/registration-approvals" className="text-indigo-600 hover:underline">
                                Course registration approvals ({stats.pending_registrations} pending)
                            </Link>
                        </li>
                        <li>
                            <Link href="/students" className="text-indigo-600 hover:underline">
                                View all students
                            </Link>
                        </li>
                        <li>
                            <Link href="/users" className="text-indigo-600 hover:underline">
                                Manage users
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </Dashboard>
    );
}
