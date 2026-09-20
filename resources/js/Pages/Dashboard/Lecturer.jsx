import { Head, Link } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import StatCard from '../../components/StatCard';

export default function Lecturer({ stats }) {
    return (
        <Dashboard title="Dashboard">
            <Head title="Lecturer Dashboard" />
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Lecturer Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard label="Assigned courses" value={stats.assigned_courses} hint="Allocated teaching units" />
                <StatCard label="Students (active)" value={stats.student_count} />
                <StatCard label="Pending grading" value={stats.pending_grading} hint="Unpublished course results" />
            </div>

            <div className="flex flex-wrap gap-4">
                <Link href="/academic/marks" className="text-indigo-600 text-sm font-medium hover:underline">
                    Enter & View Marks &rarr;
                </Link>
                <Link href="/academic/allocations" className="text-indigo-600 text-sm font-medium hover:underline">
                    My Course Allocations
                </Link>
                <Link href="/students" className="text-indigo-600 text-sm font-medium hover:underline">
                    Browse Student List
                </Link>
            </div>
        </Dashboard>
    );
}
