import { useState, useEffect } from 'react';
import { Head, Link, usePage, Form } from '@inertiajs/react';
import { can } from '../../lib/can';

function NavIcon({ name, className = 'h-5 w-5 shrink-0' }) {
    switch (name) {
        case 'dashboard':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            );
        case 'applicants':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            );
        case 'students':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
                </svg>
            );
        case 'registration':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
        case 'approvals':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            );
        case 'semesters':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            );
        case 'courses':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            );
        case 'fees':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            );
        case 'invoices':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
            );
        case 'reports':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            );
        case 'users':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            );
        case 'roles':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            );
        case 'allocations':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            );
        case 'marks':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            );
        case 'results':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            );
        case 'my-results':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
        case 'password':
            return (
                <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            );
        default:
            return null;
    }
}

export default function Dashboard({ children, title = 'Dashboard' }) {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
    const user = auth?.user;
    const permissions = auth?.permissions ?? [];

    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('erp_sidebar_collapsed') === 'true';
        }
        return false;
    });

    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setMobileOpen(false);
    }, [currentUrl]);

    const toggleDesktopCollapse = () => {
        setCollapsed((prev) => {
            const next = !prev;
            if (typeof window !== 'undefined') {
                localStorage.setItem('erp_sidebar_collapsed', String(next));
            }
            return next;
        });
    };

    const isLinkActive = (href) => {
        if (href === '/dashboard') {
            return currentUrl === '/dashboard';
        }
        return currentUrl.startsWith(href);
    };

    const navigationItems = [
        { label: 'Dashboard', href: '/dashboard', icon: 'dashboard', show: true },
        { label: 'Applicants', href: '/applicants', icon: 'applicants', show: can(permissions, 'applicants.view') },
        { label: 'Students', href: '/students', icon: 'students', show: can(permissions, 'students.view') },
        {
            label: 'My registration',
            href: '/registration',
            icon: 'registration',
            show: can(permissions, 'registrations.register') || user?.roles?.includes('Student'),
        },
        {
            label: 'Reg. approvals',
            href: '/registration-approvals',
            icon: 'approvals',
            show: can(permissions, 'registrations.approve'),
        },
        { label: 'Semesters', href: '/academic/semesters', icon: 'semesters', show: can(permissions, 'academic.manage') },
        { label: 'Courses', href: '/academic/courses', icon: 'courses', show: can(permissions, 'academic.manage') },
        {
            label: 'Course Allocations',
            href: '/academic/allocations',
            icon: 'allocations',
            show: can(permissions, 'allocations.view') || can(permissions, 'allocations.manage'),
        },
        {
            label: 'Marks Entry',
            href: '/academic/marks',
            icon: 'marks',
            show: can(permissions, 'marks.enter') || can(permissions, 'marks.publish'),
        },
        {
            label: 'Exam Results',
            href: '/academic/results',
            icon: 'results',
            show: can(permissions, 'results.view') || can(permissions, 'marks.publish'),
        },
        {
            label: 'My Results',
            href: '/academic/my-results',
            icon: 'my-results',
            show: can(permissions, 'results.view-own') || user?.roles?.includes('Student'),
        },
        {
            label: 'Fee structures',
            href: '/finance/fee-structures',
            icon: 'fees',
            show: can(permissions, 'fees.view') || can(permissions, 'fees.manage'),
        },
        {
            label: 'Invoices',
            href: '/finance/invoices',
            icon: 'invoices',
            show: can(permissions, 'invoices.view') || can(permissions, 'invoices.view-own'),
        },
        { label: 'Finance reports', href: '/finance/reports', icon: 'reports', show: can(permissions, 'finance.reports') },
        { label: 'Users', href: '/users', icon: 'users', show: can(permissions, 'users.view') },
        { label: 'Roles', href: '/roles', icon: 'roles', show: can(permissions, 'roles.view') },
        { label: 'Change password', href: '/change-password', icon: 'password', show: true },
    ].filter((item) => item.show);

    return (
        <>
            <Head title={title} />

            <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 text-slate-800">
                {/* Header */}
                <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 z-20 shadow-xs">
                    <div className="flex items-center gap-3">
                        {/* Mobile drawer toggle */}
                        <button
                            type="button"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Open mobile menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Desktop collapse toggle */}
                        <button
                            type="button"
                            onClick={toggleDesktopCollapse}
                            className="hidden md:inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                {collapsed ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                )}
                            </svg>
                        </button>

                        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-sm">
                                U
                            </span>
                            <span className="hidden sm:inline">University ERP</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
                            <p className="text-xs text-slate-500">{user?.roles?.[0] ?? user?.email}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <Form method="post" action="/logout">
                            <button type="submit" className="ml-2 text-sm text-red-600 hover:underline">
                                Logout
                            </button>
                        </Form>
                    </div>
                </header>

                {/* Mobile Drawer Backdrop */}
                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
                        onClick={() => setMobileOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Mobile Drawer */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
                        mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
                        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold text-indigo-600">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-sm">
                                U
                            </span>
                            <span>University ERP</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            aria-label="Close sidebar"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {navigationItems.map((item) => {
                            const active = isLinkActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                        active
                                            ? 'bg-indigo-50 text-indigo-600 font-semibold'
                                            : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <NavIcon
                                        name={item.icon}
                                        className={`h-5 w-5 shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400'}`}
                                    />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-slate-200 p-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase">Logged in as</p>
                        <p className="text-sm font-medium text-slate-700 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.roles?.[0] ?? user?.email}</p>
                    </div>
                </aside>

                {/* Main Body */}
                <div className="flex h-[calc(100vh-4rem)] w-full">
                    {/* Desktop Sidebar (Collapsible) */}
                    <aside
                        className={`hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out justify-between ${
                            collapsed ? 'w-20 p-2' : 'w-64 p-4'
                        }`}
                    >
                        <nav className="space-y-1 overflow-y-auto overflow-x-hidden">
                            {navigationItems.map((item) => {
                                const active = isLinkActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group relative flex items-center rounded-lg py-2.5 text-sm font-medium transition ${
                                            collapsed ? 'justify-center px-2' : 'px-3 gap-3'
                                        } ${
                                            active
                                                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                                                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <NavIcon
                                            name={item.icon}
                                            className={`h-5 w-5 shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}
                                        />
                                        {!collapsed && <span className="truncate">{item.label}</span>}

                                        {/* Floating Tooltip when collapsed */}
                                        {collapsed && (
                                            <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg group-hover:block z-50">
                                                {item.label}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Bottom Footer with toggle & user info */}
                        <div className="border-t border-slate-100 pt-3 space-y-2">
                            <button
                                type="button"
                                onClick={toggleDesktopCollapse}
                                className={`flex w-full items-center rounded-lg py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition ${
                                    collapsed ? 'justify-center px-2' : 'px-3 gap-3'
                                }`}
                                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            >
                                <svg
                                    className="h-4 w-4 shrink-0 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    {collapsed ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                    )}
                                </svg>
                                {!collapsed && <span>Collapse sidebar</span>}
                            </button>

                            <div
                                className={`flex items-center rounded-lg bg-slate-50 ${
                                    collapsed ? 'justify-center p-2' : 'p-2.5 gap-2.5'
                                }`}
                                title={collapsed ? `${user?.name} (${user?.roles?.[0] ?? ''})` : undefined}
                            >
                                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                {!collapsed && (
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-slate-700 truncate">{user?.name}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{user?.roles?.[0] ?? user?.email}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="mx-auto max-w-7xl">{children}</div>
                    </main>
                </div>
            </div>
        </>
    );
}
