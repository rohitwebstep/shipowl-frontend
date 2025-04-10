'use client';

import { useContext } from 'react';
import { DropshipperProfileContext } from './DropshipperProfileContext';
const Payment = () => {
  const { formData, handleChange } = useContext(DropshipperProfileContext);

  return (
    <>

      <div className='bg-white lg:p-10 p-3 rounded-tr-none rounded-tl-none  rounded-2xl'>
        <div className="py-5">
          <div>
            <label className="block text-[#232323] font-bold mb-1">Preferred Payment Method

            </label>
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
            >
              <option value="">Select Type</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Paypal">Paypal</option>
              <option value="Stripe">Stripe</option>
              <option value="COD">COD</option>
            </select>
          </div>
        </div>

        <h3 className="font-semibold text-[#FF702C]  underline text-sm">Bank Account Details</h3>
        <div className="grid lg:grid-cols-2 gap-4 py-5">
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
        <div className="">
          <h3 className="font-semibold text-[#FF702C] py-5 underline text-sm">KYC Details</h3>
          <div className="grid lg:grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-[#232323] font-bold mb-1">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
              />
            </div>

            <div>
              <label className="block text-[#232323] font-bold mb-1">Company PAN Card ID</label>
              <input
                type="text"
                name="panCardID"
                value={formData.panCardID}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
              />
            </div>
            <div>
              <label className="block text-[#232323] font-bold mb-1">Adhar Card ID</label>
              <input
                type="text"
                name="aadharCardId"
                value={formData.aadharCardId}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
              />
            </div>
            <div>
              <label className="block text-[#232323] font-bold mb-1">Upload GST Document</label>
              <input
                type="file"
                name="gstDocument"
                onChange={handleChange}
                placeholder='Upload'
                className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
              />
            </div>

            <div>
              <label className="block text-[#232323] font-bold mb-1">Name on PAN Card</label>
              <input
                type="text"
                name="panCardName"
                value={formData.panCardName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
              />
            </div>

            <div>
              <label className="block text-[#232323] font-bold mb-1">Name Adhar Card ID</label>
              <input
                type="text"
                name="aadharCardName"
                value={formData.aadharCardName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
              />
            </div>


          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">Save</button>
          <button className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
        </div>

      </div>
    </>

  );
};

export default Payment;
