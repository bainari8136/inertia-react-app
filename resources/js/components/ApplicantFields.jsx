export default function ApplicantFields({ applicant, programmes, errors = {} }) {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700">Programme</label>
                <select
                    name="programme_id"
                    required
                    defaultValue={applicant?.programme_id ?? ''}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm"
                >
                    <option value="">Select programme</option>
                    {programmes.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.label ?? p.name}
                        </option>
                    ))}
                </select>
                {errors.programme_id && <p className="mt-1 text-sm text-red-600">{errors.programme_id}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First name</label>
                    <input name="first_name" required defaultValue={applicant?.first_name ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Middle name</label>
                    <input name="middle_name" defaultValue={applicant?.middle_name ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last name</label>
                    <input name="last_name" required defaultValue={applicant?.last_name ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" required defaultValue={applicant?.email ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input name="phone" defaultValue={applicant?.phone ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date of birth</label>
                    <input type="date" name="date_of_birth" defaultValue={applicant?.date_of_birth ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select name="gender" defaultValue={applicant?.gender ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input name="address" defaultValue={applicant?.address ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input name="city" defaultValue={applicant?.city ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input name="country" defaultValue={applicant?.country ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Guardian information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input name="guardian_name" defaultValue={applicant?.guardian_name ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input name="guardian_phone" defaultValue={applicant?.guardian_phone ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Relationship</label>
                        <input name="guardian_relationship" defaultValue={applicant?.guardian_relationship ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Academic history</label>
                <textarea name="academic_history" rows={4} defaultValue={applicant?.academic_history ?? ''} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 text-sm" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Admission documents</label>
                <input type="file" name="documents[]" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="mt-1 block w-full text-sm" />
                <p className="mt-1 text-xs text-gray-500">PDF, DOCX, JPG, PNG (max 10MB each)</p>
            </div>
        </>
    );
}
