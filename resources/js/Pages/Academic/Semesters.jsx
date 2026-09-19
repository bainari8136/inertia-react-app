import { Head, Form, usePage } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';

export default function Semesters({ semesters, academicYears }) {
    const { flash } = usePage().props;

    return (
        <Dashboard title="Semesters">
            <Head title="Academic semesters" />
            {flash?.status && <p className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">{flash.status}</p>}

            <h1 className="text-3xl font-bold text-gray-900 mb-6">Academic calendar</h1>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl border p-5">
                    <h2 className="font-semibold mb-4">Add academic year</h2>
                    <Form method="post" action="/academic/years" className="space-y-3">
                        <input name="name" placeholder="e.g. 2025/2026" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" name="starts_on" required className="rounded-md border-gray-300 py-2 px-2 text-sm" />
                            <input type="date" name="ends_on" required className="rounded-md border-gray-300 py-2 px-2 text-sm" />
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" name="is_current" value="1" /> Current year
                        </label>
                        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white">Save year</button>
                    </Form>
                </div>

                <div className="bg-white rounded-xl border p-5">
                    <h2 className="font-semibold mb-4">Add semester</h2>
                    <Form method="post" action="/academic/semesters" className="space-y-3">
                        <select name="academic_year_id" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm">
                            <option value="">Academic year</option>
                            {academicYears.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                        </select>
                        <input name="name" placeholder="Semester name" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" name="starts_on" required className="rounded-md border-gray-300 py-2 px-2 text-sm" />
                            <input type="date" name="ends_on" required className="rounded-md border-gray-300 py-2 px-2 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-500">Registration opens</label>
                                <input type="date" name="registration_opens_at" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Registration closes</label>
                                <input type="date" name="registration_closes_at" required className="w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" name="is_current" value="1" /> Current semester
                        </label>
                        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white">Save semester</button>
                    </Form>
                </div>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-500">Semester</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Period</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Registration window</th>
                            <th className="px-6 py-3 font-semibold text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {semesters.map((s) => (
                            <tr key={s.id}>
                                <td className="px-6 py-4 font-medium">{s.name} <span className="text-gray-500">({s.academic_year})</span></td>
                                <td className="px-6 py-4 text-gray-600">{s.starts_on} — {s.ends_on}</td>
                                <td className="px-6 py-4 text-gray-600 text-xs">{s.registration_opens_at} — {s.registration_closes_at}</td>
                                <td className="px-6 py-4">
                                    {s.is_current && <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full mr-1">Current</span>}
                                    {s.registration_open && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Open</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
}
