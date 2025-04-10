'use client';

import { useContext } from 'react';
import { DropshipperProfileContext } from './DropshipperProfileContext';
const AddressDetails = () => {
  const { formData, handleChange } = useContext(DropshipperProfileContext);

  return (
    <div className='bg-white lg:p-10 p-3 rounded-tl-none rounded-tr-none  rounded-2xl'>

      <div className="grid lg:grid-cols-2 py-5 gap-4">
        <div>
          <label className="block text-[#232323] font-bold mb-1">Street</label>
          <input
            type="text"
            name="street"
            value={formData.street}
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
      <div>

     
      </div>
      <div className="grid lg:grid-cols-2 pb-5 gap-4">
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
        <div>
          <label className="block text-[#232323] font-bold mb-1">Zip / Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>
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

      <div className="flex space-x-4 mt-6">
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">Save</button>
        <button className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
      </div>
    </div>
  );
};

export default AddressDetails;
