'use client';

import { useState, useContext } from 'react';
import { UploadCloud } from 'lucide-react';
import { ProductContext } from './ProductContext';

export default function ShippingDetails() {
  const { formData, setFormData } = useContext(ProductContext);

  const [errors, setErrors] = useState({}); // State to track validation errors

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

  // Validate function to check if required fields are filled
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['weight', 'package_length', 'package_width', 'package_height', 'chargable_weight'];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace('_', ' ').toUpperCase()} is required`;
      }
    });

    // Validate file upload fields
    fileFields.forEach(({ key }) => {
      if (!formData[key]) {
        newErrors[key] = `Please upload a file for ${key.replace('_', ' ')}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If the form is invalid, prevent submission
    if (!validateForm()) {
      return;
    }

    // Proceed with the form submission if valid
    // Handle the form submission here...
  };

  return (
    <div className="xl:w-11/12 mt-4 xl:p-6 p-3 rounded-2xl bg-white">
      <form onSubmit={handleSubmit}>
        <div className="md:grid-cols-1 grid my-4">
          <div>
            <label className="text-[#232323] font-bold block">
              Shipping Time (in Days) <span className="text-red-500">*</span>
            </label>
            <select
              name="shipping_time"
              className={`border ${errors.shipping_time ? 'border-red-500' : 'border-[#DFEAF2]'} mt-2 w-full p-3 rounded-xl`}
              value={formData.shipping_time}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="5">5 Days</option>
            </select>
            {errors.shipping_time && <p className="text-red-500 text-sm">{errors.shipping_time}</p>}
          </div>
        </div>

        <div className="grid xl:grid-cols-5 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[#232323] font-bold block">
              Weight (in gm)* <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="GM"
              className={`border placeholder-black placeholder:text-right ${errors.weight ? 'border-red-500' : 'border-[#DFEAF2]'} mt-2 w-full p-3 rounded-xl`}
              name="weight"
              value={formData.weight}
              onChange={handleChange}
            />
            {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
          </div>
          <div>
            <label className="text-[#232323] font-bold block">
              Package Length <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="CM"
              className={`border placeholder-black placeholder:text-right ${errors.package_length ? 'border-red-500' : 'border-[#DFEAF2]'} mt-2 w-full p-3 rounded-xl`}
              name="package_length"
              value={formData.package_length}
              onChange={handleChange}
            />
            {errors.package_length && <p className="text-red-500 text-sm">{errors.package_length}</p>}
          </div>
          <div>
            <label className="text-[#232323] font-bold block">
              Package Width <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="CM"
              className={`border placeholder-black placeholder:text-right ${errors.package_width ? 'border-red-500' : 'border-[#DFEAF2]'} mt-2 w-full p-3 rounded-xl`}
              name="package_width"
              value={formData.package_width}
              onChange={handleChange}
            />
            {errors.package_width && <p className="text-red-500 text-sm">{errors.package_width}</p>}
          </div>
          <div>
            <label className="text-[#232323] font-bold block">
              Package Height <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="CM"
              className={`border placeholder-black placeholder:text-right ${errors.package_height ? 'border-red-500' : 'border-[#DFEAF2]'} mt-2 w-full p-3 rounded-xl`}
              name="package_height"
              value={formData.package_height}
              onChange={handleChange}
            />
            {errors.package_height && <p className="text-red-500 text-sm">{errors.package_height}</p>}
          </div>
          <div>
            <label className="text-[#232323] font-bold block">
              Chargeable Weight <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="GM"
              className={`border placeholder-black placeholder:text-right ${errors.chargable_weight ? 'border-red-500' : 'border-[#DFEAF2]'} mt-2 w-full p-3 rounded-xl`}
              name="chargable_weight"
              value={formData.chargable_weight}
              onChange={handleChange}
            />
            {errors.chargable_weight && <p className="text-red-500 text-sm">{errors.chargable_weight}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-8 my-8">
          {fileFields.map(({ label, key }) => (
            <div key={key} className="flex flex-col space-y-2">
              <label className="text-[#232323] font-bold block">
                {label} <span className="text-red-500">*</span>
              </label>
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
              {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <button type="submit" className="bg-orange-500 text-white px-14 py-2 rounded-md">
            Save
          </button>
          <button type="button" className="bg-[#8F9BBA] text-white px-14 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
