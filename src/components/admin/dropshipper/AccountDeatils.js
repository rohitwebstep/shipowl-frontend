'use client';

import { useContext } from 'react';
import { DropshipperProfileContext } from './DropshipperProfileContext';
import profileImg from '@/app/images/editprofile.png';
import Image from 'next/image';
const AccountDeatils = () => {
    const { formData, handleChange } = useContext(DropshipperProfileContext);

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
                        <label className="block text-[#232323] font-bold mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
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
                        <label className="block text-[#232323] font-bold mb-1">Phone Number</label>
                        <input
                            type="mobile"
                            name="mobile"
                            value={formData.mobile}
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
                        <label className="block text-[#232323] font-bold mb-1">Website Url</label>
                        <input
                            type="text"
                            name="website_url"
                            value={formData.website_url}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-[#232323] font-bold mb-1">Referral Code</label>
                        <input
                            type="text"
                            name="ref_code"
                            value={formData.ref_code}
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

export default AccountDeatils;
