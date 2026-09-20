import { useState } from 'react';
import { Head, Link, Form, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';

export default function Index({ cohorts, academicYears, canManage }) {
    const { flash = {} } = usePage().props;
    const [name, setName] = useState('');
    const [academicYearId, setAcademicYearId] = useState(academicYears[0]?.id || '');
    const [ceremonyDate, setCeremonyDate] = useState('');
    const [status, setStatus] = useState('open_for_clearance');

    return (
        <Dashboard title="Graduation Ceremonies">
            <Head title="Graduation Ceremonies" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Graduation Ceremonies & Cohorts</h1>
                    <p className="text-sm text-gray-600">Configure graduation congregations and view official conferment lists.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/clearance"
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50"
                    >
                        Student Clearance Queue &rarr;
                    </Link>
                </div>
            </div>

            {flash?.status && (
                <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                    {flash.status}
                </div>
            )}

            {/* Create Ceremony Cohort Form */}
            {canManage && (
                <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Create Graduation Ceremony Cohort</h2>
                    <Form action="/graduation" method="POST">
                        {({ processing, errors }) => (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label htmlFor="cohortName" className="block text-xs font-medium text-gray-700 mb-1">
                                        Ceremony / Cohort Name
                                    </label>
                                    <input
                                        id="cohortName"
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="e.g. 24th Graduation Ceremony 2026"
                                        className="w-full rounded-lg border-gray-300 py-2 px-3 text-xs focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="academicYearSelect" className="block text-xs font-medium text-gray-700 mb-1">
                                        Academic Year
                                    </label>
                                    <select
                                        id="academicYearSelect"
                                        name="academic_year_id"
                                        value={academicYearId}
                                        onChange={(e) => setAcademicYearId(e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 py-2 px-3 text-xs focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {academicYears.map((y) => (
                                            <option key={y.id} value={y.id}>
                                                {y.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.academic_year_id && <p className="text-xs text-red-600 mt-1">{errors.academic_year_id}</p>}
                                </div>

                                <div>
                                    <label htmlFor="ceremonyDateInput" className="block text-xs font-medium text-gray-700 mb-1">
                                        Ceremony Date
                                    </label>
                                    <input
                                        id="ceremonyDateInput"
                                        type="date"
                                        name="ceremony_date"
                                        value={ceremonyDate}
                                        onChange={(e) => setCeremonyDate(e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 py-2 px-3 text-xs focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.ceremony_date && <p className="text-xs text-red-600 mt-1">{errors.ceremony_date}</p>}
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label htmlFor="statusSelect" className="block text-xs font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            id="statusSelect"
                                            name="status"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 py-2 px-3 text-xs focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="open_for_clearance">Open for Clearance</option>
                                            <option value="upcoming">Upcoming</option>
                                            <option value="concluded">Concluded</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
            )}

            {/* Cohorts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cohorts.length === 0 ? (
                    <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 text-xs">
                        No graduation ceremony cohorts configured yet.
                    </div>
                ) : (
                    cohorts.map((c) => (
                        <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                                        {c.academic_year}
                                    </span>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                            c.status === 'open_for_clearance'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : c.status === 'concluded'
                                                ? 'bg-gray-100 text-gray-700'
                                                : 'bg-amber-100 text-amber-800'
                                        }`}
                                    >
                                        {c.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-gray-900 line-clamp-2">{c.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">Ceremony Date: {c.ceremony_date}</p>

                                <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 mt-4 text-xs">
                                    <div>
                                        <span className="text-gray-500 block">Total Applied:</span>
                                        <span className="font-bold text-gray-800 text-sm">{c.total_candidates}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Cleared Graduands:</span>
                                        <span className="font-bold text-emerald-600 text-sm">{c.cleared_graduands}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-100">
                                <Link
                                    href={`/graduation/${c.id}`}
                                    className="inline-flex items-center justify-center w-full rounded-lg bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                                >
                                    Conferment Booklet & List &rarr;
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Dashboard>
    );
}
