import { Head, Link } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import StatCard from '../../components/StatCard';
import { formatMoney } from '../../lib/money';

export default function Student({ student, stats }) {
    return (
        <Dashboard title="Dashboard">
            <Head title="Student Dashboard" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
            {student ? (
                <p className="text-sm text-gray-600 mb-6">
                    {student.full_name} · {student.registration_number} · {student.programme}
                </p>
            ) : (
                <p className="text-sm text-amber-700 mb-6">No student profile linked to your account yet.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard label="Registered courses" value={stats.registered_courses} hint="Active enrolled courses" />
                <StatCard label="Fee balance" value={formatMoney(stats.fee_balance)} />
                <StatCard label="Results published" value={stats.results_published} hint="Published course grades" />
            </div>

            <div className="flex flex-wrap gap-4">
                <Link href="/academic/my-results" className="text-indigo-600 text-sm font-medium hover:underline">
                    My Examination Results &rarr;
                </Link>
                <Link href="/clearance/my-clearance" className="text-indigo-600 text-sm font-medium hover:underline">
                    Clearance & Graduation &rarr;
                </Link>
                {student && (
                    <Link href={`/students/${student.id}/transcript`} className="text-indigo-600 text-sm font-medium hover:underline">
                        Academic Transcript
                    </Link>
                )}
                <Link href="/registration" className="text-indigo-600 text-sm font-medium hover:underline">
                    Course Registration
                </Link>
                <Link href="/finance/invoices" className="text-indigo-600 text-sm font-medium hover:underline">
                    My Invoices
                </Link>
                {student && (
                    <Link href={`/students/${student.id}`} className="text-indigo-600 text-sm font-medium hover:underline">
                        View My Profile
                    </Link>
                )}
            </div>
        </Dashboard>
    );
}
