'use client';

import { useState, useContext } from 'react';
import { UploadCloud } from 'lucide-react';
import { ProductContext } from './ProductContext';

export default function ShippingDetails() {
  const { formData, setFormData } = useContext(ProductContext);

  const fileFields = [
    { label: 'Package Weight Image', key: 'package_weight_image' },
    { label: 'Package Length Image', key: 'package_length_image' },
    { label: 'Package Width Image', key: 'package_width_image' },
    { label: 'Package Height Image', key: 'package_height_image' },
    { label: 'Upload Product Details Video', key: 'product_detail_video' },
    { label: 'Upload Training Guidance Video', key: 'upload_training_guidance_video' },
  ];

  const handleFileChange = (event, key) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [key]: file.name,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="xl:w-11/12 mt-4 xl:p-6 p-3 rounded-2xl bg-white">
      <div className="md:grid-cols-1 grid my-4">
        <div>
          <label className="text-[#232323] font-bold block">Shipping Time (in Days)</label>
          <select
            name="shipping_time"
            className="border border-[#DFEAF2] mt-2 w-full p-3 rounded-xl"
            value={formData.shipping_time}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="1">1 Day</option>
            <option value="3">3 Days</option>
            <option value="5">5 Days</option>
          </select>
        </div>
      </div>

      <div className="grid xl:grid-cols-5 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[#232323] font-bold block">Weight (in gm)*</label>
          <input
            type="text"
            placeholder="GM"
            className="border placeholder-black placeholder:text-right border-[#DFEAF2] mt-2 w-full p-3 rounded-xl"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-[#232323] font-bold block">Package Length</label>
          <input
            type="text"
            placeholder="CM"
            className="border placeholder-black placeholder:text-right border-[#DFEAF2] mt-2 w-full p-3 rounded-xl"
            name="package_length"
            value={formData.package_length}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-[#232323] font-bold block">Package Width</label>
          <input
            type="text"
            placeholder="CM"
            className="border placeholder-black placeholder:text-right border-[#DFEAF2] mt-2 w-full p-3 rounded-xl"
            name="package_width"
            value={formData.package_width}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-[#232323] font-bold block">Package Height</label>
          <input
            type="text"
            placeholder="CM"
            className="border placeholder-black placeholder:text-right border-[#DFEAF2] mt-2 w-full p-3 rounded-xl"
            name="package_height"
            value={formData.package_height}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-[#232323] font-bold block">Chargeable Weight</label>
          <input
            type="text"
            placeholder="GM"
            className="border placeholder-black placeholder:text-right border-[#DFEAF2] mt-2 w-full p-3 rounded-xl"
            name="chargable_weight"
            value={formData.chargable_weight}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-8 my-8">
        {fileFields.map(({ label, key }) => (
          <div key={key} className="flex flex-col space-y-2">
            <label className="text-[#232323] font-bold block">{label}</label>
            <div className="border-1 relative border-dashed border-red-300 rounded-xl p-6 w-48 h-32 flex flex-col items-center justify-center">
              <UploadCloud className="w-8 h-8 text-[#232323]" />
              <span className="text-xs text-[#232323]">
                {formData[key] ? formData[key] : 'Upload'}
              </span>
              <input
                type="file"
                className="absolute opacity-0 w-full h-full cursor-pointer"
                onChange={(e) => handleFileChange(e, key)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <button className="bg-orange-500 text-white px-14 py-2 rounded-md">Save</button>
        <button className="bg-[#8F9BBA] text-white px-14 py-2 rounded-md">Cancel</button>
      </div>
    </div>
  );
}
