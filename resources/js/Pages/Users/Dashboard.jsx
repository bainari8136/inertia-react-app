import { Head, Link, usePage, Form } from '@inertiajs/react';
import { can } from '../../lib/can';

export default function Dashboard({ children, title = 'Dashboard' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const permissions = auth?.permissions ?? [];

    const navLink = 'flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition';

    return (
        <>
            <Head title={title} />

            <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 text-slate-800">
                <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 z-10 shadow-sm">
                    <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
                        University ERP
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
                            <p className="text-xs text-slate-500">{user?.roles?.[0] ?? user?.email}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <Form method="post" action="/logout">
                            <button type="submit" className="ml-2 text-sm text-red-600 hover:underline">Logout</button>
                        </Form>
                    </div>
                </header>

                <div className="flex h-[calc(100vh-4rem)] w-full">
                    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white p-4 md:flex justify-between">
                        <nav className="space-y-1">
                            <Link href="/dashboard" className={navLink}>Dashboard</Link>
                            {can(permissions, 'applicants.view') && (
                                <Link href="/applicants" className={navLink}>Applicants</Link>
                            )}
                            {can(permissions, 'students.view') && (
                                <Link href="/students" className={navLink}>Students</Link>
                            )}
                            {(can(permissions, 'registrations.register') || user?.roles?.includes('Student')) && (
                                <Link href="/registration" className={navLink}>My registration</Link>
                            )}
                            {can(permissions, 'registrations.approve') && (
                                <Link href="/registration-approvals" className={navLink}>Reg. approvals</Link>
                            )}
                            {can(permissions, 'academic.manage') && (
                                <>
                                    <Link href="/academic/semesters" className={navLink}>Semesters</Link>
                                    <Link href="/academic/courses" className={navLink}>Courses</Link>
                                </>
                            )}
                            {(can(permissions, 'fees.view') || can(permissions, 'fees.manage')) && (
                                <Link href="/finance/fee-structures" className={navLink}>Fee structures</Link>
                            )}
                            {(can(permissions, 'invoices.view') || can(permissions, 'invoices.view-own')) && (
                                <Link href="/finance/invoices" className={navLink}>Invoices</Link>
                            )}
                            {can(permissions, 'finance.reports') && (
                                <Link href="/finance/reports" className={navLink}>Finance reports</Link>
                            )}
                            {can(permissions, 'users.view') && (
                                <Link href="/users" className={navLink}>Users</Link>
                            )}
                            {can(permissions, 'roles.view') && (
                                <Link href="/roles" className={navLink}>Roles</Link>
                            )}
                            <Link href="/change-password" className={navLink}>Change password</Link>
                        </nav>

                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs font-semibold text-slate-400 uppercase">Logged in as</p>
                            <p className="text-sm font-medium text-slate-700 truncate">{user?.name}</p>
                        </div>
                    </aside>

                    <main className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="mx-auto max-w-7xl">{children}</div>
                    </main>
                </div>
            </div>
        </>
    );
}
