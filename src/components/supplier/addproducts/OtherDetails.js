'use client';

import { useState } from 'react';

export default function OtherDetails() {
  const [formData, setFormData] = useState({
    upc: '',
    ean: '',
    hsnCode: '',
    taxRate: '',
    rtoAddress: '',
    pickupAddress: '',
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="xl:w-11/12 mt-4 p-6  rounded-2xl bg-white">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="upc" className='font-bold block uppercase'>UPC</label>
          <input type="text" className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.upc} onChange={(e) => handleChange('upc', e.target.value)} />
        </div>
        <div>
          <label htmlFor="ean" className='font-bold block uppercase'>ean</label>
          <input type="text" className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.ean} onChange={(e) => handleChange('ean', e.target.value)} />
        </div>
        <div>
          <label htmlFor="hsnCode" className='font-bold block '>HSN Code</label>
          <input type="text" className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.hsnCode} onChange={(e) => handleChange('hsnCode', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label htmlFor="taxRate" className='font-bold block '>Tax Rate (GST) *</label>
          <input type="text" className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.taxRate} onChange={(e) => handleChange('taxRate', e.target.value)} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
      <div>
      <label htmlFor="rtoAddress" className='font-bold block '>RTO Address *</label>
        <select className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.rtoAddress} onChange={(e) => handleChange('rtoAddress', e.target.value)}>
          <option>RTO Address *</option>
        </select>
        </div>
        <div>
        <label htmlFor="pickupAddress" className='font-bold block '>Pickup Address *</label>
        <select className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.pickupAddress} onChange={(e) => handleChange('pickupAddress', e.target.value)}>
          <option>Pickup Address *</option>
        </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <button className="bg-orange-500 text-white px-14 py-2 rounded-md">Save</button>
        <button className="bg-[#8F9BBA] text-white px-14 py-2 rounded-md">Cancel</button>
      </div>
    </div>
  );
}
