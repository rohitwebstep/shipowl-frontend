'use client';

import { useContext } from 'react';
import { ProfileContext } from './ProfileContext';
const BusinessInfo = () => {
  const { formData, handleChange } = useContext(ProfileContext);

  return (
    <div className='bg-white lg:p-10 p-3 rounded-tl-none rounded-tr-none  rounded-2xl'>

      <div className="grid lg:grid-cols-3 py-5 gap-4">
        <div>
          <label className="block text-[#232323] font-bold mb-1">Registered Company Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>

        <div>
          <label className="block text-[#232323] font-bold mb-1">Brand Name</label>
          <input
            type="text"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>

        <div>
          <label className="block text-[#232323] font-bold mb-1">Short Brand Name</label>
          <input
            type="text"
            name="shortBrandName"
            value={formData.shortBrandName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>
      </div>
      <div>

        <div>
          <label className="block text-[#232323] font-bold mb-1">Company Billing Address</label>
          <input
            type="text"
            name="companyBillingAddress"
            value={formData.companyBillingAddress}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 py-5 gap-4">
        <div>
          <label className="block text-[#232323] font-bold mb-1">Pincode</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>

        <div>
          <label className="block text-[#232323] font-bold mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
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
      </div>
      <div className="grid lg:grid-cols-3  gap-4">
        <div>
          <label className="block text-[#232323] font-bold mb-1">Business Type</label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          >
            <option value="Business">Business</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Startup">Startup</option>
          </select>
        </div>

        <div>
          <label className="block text-[#232323] font-bold mb-1">Form of Client’s Entity</label>
          <select
            name="clientEntity"
            value={formData.clientEntity}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          >
            <option value="Entrepreneurship">Entrepreneurship</option>
            <option value="Partnership">Partnership</option>
            <option value="Corporation">Corporation</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-[#FF702C] py-5 underline text-sm">KYC Details – Provide minimum of 2 documents</h3>
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
      <div className='grid md:grid-cols-2 py-5 gap-3'>

        
        <div>
          <label className="block text-[#232323] font-bold mb-1">Upload PAN card image</label>
          <input
            type="file"
            name="aadhar_card_images"
            onChange={handleChange}
            placeholder='Upload'
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>
        <div>
          <label className="block text-[#232323] font-bold mb-1">Upload Adhar card image</label>
          <input
            type="file"
            name="pan_card_images"
            onChange={handleChange}
            placeholder='Upload'
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>
      </div>

      <h3 className="font-semibold text-[#FF702C] underline text-sm pt-5">Additional Supporting Document</h3>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 pt-3">
        
      <div>
            <label className="block text-[#232323] font-bold mb-1">Document to upload</label>
            <input
              type="text"
              name="panCardName"
              value={formData.panCardName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
            />
          </div>
          <div>
            <label className="block text-[#232323] font-bold mb-1">Document ID</label>
            <input
              type="text"
              name="panCardName"
              value={formData.panCardName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
            />
          </div>
          <div>
            <label className="block text-[#232323] font-bold mb-1">Name of document</label>
            <input
              type="text"
              name="panCardName"
              value={formData.panCardName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
            />
          </div>
          <div>
          <label className="block text-[#232323] font-bold mb-1">Document Image</label>
          <input
            type="file"
            name="aadhar_card_images"
            onChange={handleChange}
            placeholder='Upload'
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">Save</button>
        <button className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
      </div>
    </div>
  );
};

export default BusinessInfo;
