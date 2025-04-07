'use client';

import { useContext } from 'react';
import { ProfileContext } from './ProfileContext';
import profileImg from '@/app/images/editprofile.png';
import Image from 'next/image';
const ProfileEdit = () => {
    const { formData, handleChange } = useContext(ProfileContext);

    return (
        <div className='md:flex gap-4 xl:w-10/12 py-10 bg-white rounded-tl-none rounded-tr-none p-3  xl:p-10 rounded-2xl'>
            <div className='md:w-2/12'>
                <div className="edit-img p-5">
                    <Image src={profileImg} alt="User" />
                </div>

            </div>
            <div className='md:w-10/12'>

                <div className="grid md:grid-cols-2 grid-cols-1  gap-4">
                    <div>
                        <label className="block text-[#232323] font-bold mb-1">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-[#232323] font-bold mb-1">User Name</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-[#232323] font-bold mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-[#232323] font-bold mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-[#232323] font-bold mb-1">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-[#232323] font-bold mb-1">Present Address</label>
                        <input
                            type="text"
                            name="presentAddress"
                            value={formData.presentAddress}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-[#232323] font-bold mb-1">Permanent Address</label>
                        <input
                            type="text"
                            name="permanentAddress"
                            value={formData.permanentAddress}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-[#232323] font-bold mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-[#232323] font-bold mb-1">Postal Code</label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-[#232323] font-bold mb-1">Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
                        />
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">Save</button>
                    <button className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
                </div>
            </div>

        </div>
    );
};

export default ProfileEdit;
