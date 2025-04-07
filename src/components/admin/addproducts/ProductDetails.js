'use client';

import { useState } from 'react';

export default function ProductDetails() {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    sku: '',
    description: '',
    tags: '',
    brand: '',
    country: '',
    shipping: '',
    videoUrl: '',
    listAs: 'both',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="mt-4 lg:p-6 p-3  rounded-2xl bg-white">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        <div>
          <label className="block   text-[#232323] font-semibold">Product Category</label>
          <select
            name="category"
            className="w-full border border-[#DFEAF2] p-2 rounded-md text-[#718EBF] font-bold mt-2 outline-0"
            onChange={handleChange}
          >
            <option>Category</option>
          </select>
        </div>
        <div>
          <label className="block   text-[#232323] font-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            className="w-full border border-[#DFEAF2] p-2 rounded-md text-[#718EBF] font-bold mt-2 outline-0"
            placeholder="Name"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block   text-[#232323] font-semibold">Product Main SKU *</label>
          <input
            type="text"
            name="sku"
            className="w-full border border-[#DFEAF2] p-2 rounded-md text-[#718EBF] font-bold mt-2 outline-0"
            placeholder="SKU"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block   text-[#232323] font-semibold">Description *</label>
        <textarea
          name="description"
          className="w-full border border-[#DFEAF2] p-2 rounded-md text-[#718EBF] font-bold mt-2 outline-0 h-24"
          placeholder="Description"
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block   text-[#232323] font-semibold">Product Tags</label>
          <input
            type="text"
            name="tags"
            className="w-full border border-[#DFEAF2] p-2 rounded-md text-[#718EBF] font-bold mt-2 outline-0"
            placeholder="Tags"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block   text-[#232323] font-semibold">Brand *</label>
          <input
            type="text"
            name="brand"
            className="w-full border border-[#DFEAF2] p-2 rounded-md text-[#718EBF] font-bold mt-2 outline-0"
            placeholder="Brand"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block   text-[#232323] font-semibold">Country Of Origin *</label>
          <input
            type="text"
            name="country"
            className="w-full border border-[#DFEAF2] p-2 rounded-md text-[#718EBF] font-bold mt-2 outline-0"
            placeholder="San Jose"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block   text-[#232323] font-semibold">Shipping Country *</label>
          <input
            type="text"
            name="shipping"
            className="w-full border border-[#DFEAF2] p-2 rounded-md text-[#718EBF] font-bold mt-2 outline-0"
            placeholder="San Jose, California, USA"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block   text-[#232323] font-semibold">Product Video URL (*Only Upload mp4,mov url only)</label>
          <input
            type="text"
            name="videoUrl"
            className="w-full border border-[#DFEAF2] p-2 rounded-md text-[#718EBF] font-bold mt-2 outline-0"
            placeholder="USA"
            onChange={handleChange}
          />
        </div>
      <div className="mt-4">
        <label className="block   text-[#232323] font-semibold">List As</label>
        <div className="flex flex-wrap gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="listAs" value="warehouse" onChange={handleChange} /> Warehouse Model
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="listAs" value="rto" onChange={handleChange} /> RTO Model
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="listAs" value="both" defaultChecked onChange={handleChange} /> Both
          </label>
        </div>
      </div>
      </div>


      <div className="flex flex-wrap gap-4 mt-6">
        <button className="bg-orange-500 text-white px-14 py-2 rounded-md">Save</button>
        <button className="bg-[#8F9BBA] text-white px-14 py-2 rounded-md">Cancel</button>
      </div>
    </div>
  );
}