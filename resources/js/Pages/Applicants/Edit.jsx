import { Head, Link, Form } from '@inertiajs/react';
import Dashboard from '../Users/Dashboard';
import ApplicantFields from '../../components/ApplicantFields';

export default function Edit({ applicant, programmes }) {
    return (
        <Dashboard title="Edit applicant">
            <Head title="Edit applicant" />
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit applicant</h1>

            <div className="max-w-3xl bg-white rounded-xl border p-6">
                <Form action={`/applicants/${applicant.id}`} method="PUT" encType="multipart/form-data">
                    {({ errors, processing }) => (
                        <div className="space-y-5">
                            <ApplicantFields applicant={applicant} programmes={programmes} errors={errors} />
                            <div className="flex gap-4 pt-2">
                                <button type="submit" disabled={processing} className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50">
                                    {processing ? 'Saving...' : 'Update'}
                                </button>
                                <Link href={`/applicants/${applicant.id}`} className="text-sm text-gray-600 hover:text-gray-900 self-center">Cancel</Link>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </Dashboard>
    );
}
