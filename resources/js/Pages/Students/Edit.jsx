import { Head, Link, Form } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import ApplicantFields from '../../components/ApplicantFields';

export default function Edit({ student, programmes }) {

    return (
        <Dashboard title="Edit student">
            <Head title="Edit student" />
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit student profile</h1>

            <div className="max-w-3xl bg-white rounded-xl border p-6">
                <Form action={`/students/${student.id}`} method="PUT" encType="multipart/form-data">
                    {({ errors, processing }) => (
                        <div className="space-y-5">
                            <p className="text-sm text-gray-600">Registration: <span className="font-mono">{student.registration_number}</span></p>
                            <ApplicantFields applicant={student} programmes={programmes} errors={errors} />
                            <div className="flex gap-4 pt-2">
                                <button type="submit" disabled={processing} className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50">Save</button>
                                <Link href={`/students/${student.id}`} className="text-sm text-gray-600 self-center">Cancel</Link>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </Dashboard>
    );
}
