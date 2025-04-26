'use client';

import { useContext, useState } from 'react';
import { ProfileContext } from './ProfileContext';
import profileImg from '@/app/images/editprofile.png';
import Image from 'next/image';

const ProfileEdit = () => {
    const { formData, setFormData, setActiveTab } = useContext(ProfileContext);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = 'Full Name is required';
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
        if (!formData.currentAddress) newErrors.currentAddress = 'Present Address is required';
        if (!formData.permanentAddress) newErrors.permanentAddress = 'Permanent Address is required';
        if (!formData.permanentCity) newErrors.permanentCity = 'City is required';
        if (!formData.permanentPostalCode) newErrors.permanentPostalCode = 'Postal Code is required';
        if (!formData.permanentCountry) newErrors.permanentCountry = 'Country is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            setActiveTab('business-info');
        }
    };

    const inputClasses = (field) =>
        `w-full p-3 border rounded-lg font-bold ${
            errors[field] ? 'border-red-500 text-red-500' : 'border-[#DFEAF2] text-[#718EBF]'
        }`;

    const labelClasses = (field) =>
        `block font-bold mb-1 ${errors[field] ? 'text-red-500' : 'text-[#232323]'}`;

    const handleCancel = () => {
        setErrors({}); // Clears errors
        // Optionally, reset the form data here if needed
        // setFormData(initialState);
    };

    return (
        <div className='md:flex gap-4 xl:w-10/12 py-10 bg-white rounded-tl-none rounded-tr-none p-3 xl:p-10 rounded-2xl'>
            <div className='md:w-2/12'>
                <div className="edit-img p-5">
                    <Image src={profileImg} alt="Profile image" />
                </div>
            </div>
            <div className='md:w-10/12'>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    {[
                        { label: 'Your Name', name: 'name', type: 'text' },
                        { label: 'User Name', name: 'username', type: 'text' },
                        { label: 'Email', name: 'email', type: 'email' },
                        { label: 'Password', name: 'password', type: 'password' },
                        { label: 'Date of Birth', name: 'dateOfBirth', type: 'date' },
                        { label: 'Present Address', name: 'currentAddress', type: 'text' },
                        { label: 'Permanent Address', name: 'permanentAddress', type: 'text' },
                        { label: 'City', name: 'permanentCity', type: 'text' },
                        { label: 'Postal Code', name: 'permanentPostalCode', type: 'text' },
                        { label: 'Country', name: 'permanentCountry', type: 'text' },
                    ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label className={labelClasses(name)}>{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className={inputClasses(name)}
                            />
                            {errors[name] && (
                                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg"
                    >
                        Next
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileEdit;
