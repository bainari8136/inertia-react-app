import { Head, Link } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import { usePage } from '@inertiajs/react';
import { can } from '../../lib/can';

export default function Staff({ user }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions ?? [];

    return (
        <Dashboard title="Dashboard">
            <Head title="Dashboard" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name}</h1>
            <p className="text-sm text-gray-600 mb-6">{user.roles?.join(', ')}</p>

            <div className="rounded-xl border bg-white p-6">
                <h2 className="font-semibold text-gray-900 mb-3">Quick links</h2>
                <ul className="space-y-2 text-sm">
                    {can(permissions, 'students.view') && (
                        <li>
                            <Link href="/students" className="text-indigo-600 hover:underline">
                                Students
                            </Link>
                        </li>
                    )}
                    {can(permissions, 'applicants.view') && (
                        <li>
                            <Link href="/applicants" className="text-indigo-600 hover:underline">
                                Applicants
                            </Link>
                        </li>
                    )}
                    {can(permissions, 'registrations.approve') && (
                        <li>
                            <Link href="/registration-approvals" className="text-indigo-600 hover:underline">
                                Registration approvals
                            </Link>
                        </li>
                    )}
                    {(can(permissions, 'registrations.register') || user?.roles?.includes('Student')) && (
                        <li>
                            <Link href="/registration" className="text-indigo-600 hover:underline">
                                Course registration
                            </Link>
                        </li>
                    )}
                    {can(permissions, 'users.view') && (
                        <li>
                            <Link href="/users" className="text-indigo-600 hover:underline">
                                Users
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link href="/change-password" className="text-indigo-600 hover:underline">
                            Change password
                        </Link>
                    </li>
                </ul>
            </div>
        </Dashboard>
    );
}
