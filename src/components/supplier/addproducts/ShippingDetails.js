'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function ShippingDetails() {
  const [formData, setFormData] = useState({
    shippingTime: '',
    weight: '',
    packageLength: '',
    packageWidth: '',
    packageHeight: '',
    chargeableWeight: 'Weight',

  });
  const [files, setFiles] = useState({});

  const handleFileChange = (event, key) => {
    const file = event.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file.name }));
    }
  };

  const uploadFields = [
    'Package Weight Image',
    'Package Length Image',
    'Package Width Image',
    'Package Height Image',
    'Upload Product Details Video',
    'Upload Training Guidance Video',
  ];
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className=" xl:w-11/12 mt-4 xl:p-6 p-3  rounded-2xl bg-white">
      <div className='md:grid-cols-1 grid my-4'>
        <div>
          <label className='text-[#232323] font-bold block'>Shipping Time (in Days)</label>
          <select className="border border-[#DFEAF2] mt-2 w-full p-3 rounded-xl" value={formData.shippingTime} onChange={(e) => handleChange('shippingTime', e.target.value)}>
            <option>Category</option>
          </select>
        </div>
      </div>

      <div className="grid xl:grid-cols-5 md:grid-cols-2 gap-4 mb-4">
        <div> <label className='text-[#232323] font-bold block'>Weight (in gm)*</label>  <input type="text" placeholder="CM" className="border placeholder-black placeholder:text-right border-[#DFEAF2] mt-2 w-full p-3 rounded-xl" value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} /></div>
        <div> <label className='text-[#232323] font-bold block'>Package Length</label>  <input type="text" placeholder="CM" className="border placeholder-black placeholder:text-right border-[#DFEAF2] mt-2 w-full p-3 rounded-xl" value={formData.packageLength} onChange={(e) => handleChange('packageLength', e.target.value)} /></div>
        <div> <label className='text-[#232323] font-bold block'>Package Width</label>  <input type="text" placeholder="CM" className="border placeholder-black placeholder:text-right border-[#DFEAF2] mt-2 w-full p-3 rounded-xl" value={formData.packageWidth} onChange={(e) => handleChange('packageWidth', e.target.value)} /></div>
        <div> <label className='text-[#232323] font-bold block'>Package Height</label>  <input type="text" placeholder="CM" className="border placeholder-black placeholder:text-right border-[#DFEAF2] mt-2 w-full p-3 rounded-xl" value={formData.packageHeight} onChange={(e) => handleChange('packageHeight', e.target.value)} /></div>
        <div> <label className='text-[#232323] font-bold block'>Chargeable Weight</label>  <input type="text" placeholder="CM" className="border placeholder-black placeholder:text-right border-[#DFEAF2] mt-2 w-full p-3 rounded-xl" value={formData.chargeableWeight} onChange={(e) => handleChange('chargeableWeight', e.target.value)} /></div>
      </div>
      <div className="flex flex-wrap gap-8 my-8">
        {uploadFields.map((label, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <label className='text-[#232323] font-bold block'>{label}</label>
            <div className="border-1 relative border-dashed border-red-300 rounded-xl p-6 w-48 h-32 flex flex-col items-center justify-center">
              <UploadCloud className="w-8 h-8 text-[#232323]" />
              <span className="text-xs text-[#232323]">{files[label] || 'Upload'}</span>
              <input
                type="file"
                className="absolute opacity-0 w-full h-full cursor-pointer"
                onChange={(e) => handleFileChange(e, label)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        <button className="bg-orange-500 text-white px-14 py-2 rounded-md">Save</button>
        <button className="bg-[#8F9BBA] text-white px-14 py-2 rounded-md">Cancel</button>
      </div>
    </div >
  );
}
