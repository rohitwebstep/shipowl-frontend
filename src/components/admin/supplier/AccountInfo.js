'use client';

import { useContext } from 'react';
import { ProfileContext } from './ProfileContext';
import BankAccountList from './BankAccountList';
const AccountInfo = () => {
  const { formData, handleChange } = useContext(ProfileContext);

  return (
    <>
    
    <div className='bg-white lg:p-10 p-3 rounded-tr-none rounded-tl-none  rounded-2xl'>
      <div className="grid lg:grid-cols-3 gap-4 py-5">
        <div>
          <label className="block text-[#232323] font-bold mb-1">Account Holder Name</label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>

        <div>
          <label className="block text-[#232323] font-bold mb-1">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>

        <div>
          <label className="block text-[#232323] font-bold mb-1">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>

        <div>
          <label className="block text-[#232323] font-bold mb-1">Bank Branch</label>
          <input
            type="text"
            name="bankBranch"
            value={formData.bankBranch}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>

        <div>
          <label className="block text-[#232323] font-bold mb-1">Account Type</label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          >
            <option value="">Select Type</option>
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
            <option value="Business">Business</option>
          </select>
        </div>

        <div>
          <label className="block text-[#232323] font-bold mb-1">IFSC Code</label>
          <input
            type="text"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>
        <div>
          <label className="block text-[#232323] font-bold mb-1">Cancelled Cheque Image</label>
          <input
            type="file"
            name="check_images"
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
    <BankAccountList/>
    </>

  );
};

export default AccountInfo;
