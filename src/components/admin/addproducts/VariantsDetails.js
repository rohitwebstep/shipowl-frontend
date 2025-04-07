'use client';

import { useState } from 'react';
import { Plus, Minus, ImageIcon } from 'lucide-react';
import Image from 'next/image';
export default function VariantDetails() {
  const [variants, setVariants] = useState([
    { color: '', sku: '', qty: '', currency: 'INR', productLink: '', articleId: '', image: null },
  ]);

  const handleChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      setVariants((prev) => {
        const updated = [...prev];
        updated[index].image = URL.createObjectURL(file);
        return updated;
      });
    }
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { color: '', sku: '', qty: '', currency: 'INR', productLink: '', articleId: '', image: null },
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4 p-6 rounded-xl bg-white">
      <div className="md:flex mb-6 justify-between items-center">
      <h2 className="text-2xl font-semibold text-[#2B3674] mb-4">Variant Details</h2>
      <button className="bg-[#4318FF] text-white px-4 py-2 rounded-md mt-4">Save Data</button>
      </div>
    
      <div className="lg:grid lg:grid-cols-9 hidden   overflow-auto grid-cols-1 gap-6 items-center justify-between border-b border-[#E9EDF7] pb-2 mb-4 text-gray-600 text-sm font-semibold">
      <span className='text-[#A3AED0] whitespace-nowrap'>Color</span>
        <span className='text-[#A3AED0] whitespace-nowrap'>SKU & Quantity</span>
        <span className='text-[#A3AED0] whitespace-nowrap'>Currency</span>
        <span className='text-[#A3AED0] whitespace-nowrap'>Warehouse Model</span>
        <span className='text-[#A3AED0] whitespace-nowrap'>RTO Model</span>
        <span className='text-[#A3AED0] whitespace-nowrap'>Product Link</span>
        <span className='text-[#A3AED0] whitespace-nowrap '>Article Id</span>
        <span className='text-[#A3AED0] whitespace-nowrap text-right'>Images</span>
        <div className='flex justify-end'><button className="bg-green-500 flex justify-end  text-white p-2 rounded-lg" onClick={addVariant}>
          <Plus className="w-4 h-4" />
        </button></div>
      </div>

      <div className='flex justify-end md:hidden '><button className="bg-green-500 flex justify-end  text-white p-2 rounded-lg" onClick={addVariant}>
          <Plus className="w-4 h-4" />
        </button></div>
      {variants.map((variant, index) => (
        <div key={index} className="md:grid lg:grid-cols-9 overflow-auto md:grid-cols-2 gap-6  justify-between mb-4 border-b border-[#E9EDF7] pb-4">
          <div className=''>
          <span className='text-orange-500 font-semibold whitespace-nowrap lg:hidden block'>Color</span>
            <select
              type="text"
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
              value={variant.color}
              onChange={(e) => handleChange(index, 'color', e.target.value)}
            >
              <option value="Color"> Color</option>
            </select>

          </div>
          <div className=''>
          <span className='text-orange-500 font-semibold whitespace-nowrap lg:hidden block'>SKU & Quantity</span>
            <input
              type="text"
              placeholder="SKU"
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2] mb-2 "
              value={variant.sku}
              onChange={(e) => handleChange(index, 'sku', e.target.value)}
            />
            <input
              type="text"
              placeholder="QTY"
              className="border p-2 rounded-xl text-[#718EBF] font-bold  border-[#DFEAF2] w-full"
              value={variant.qty}
              onChange={(e) => handleChange(index, 'qty', e.target.value)}
            />
          </div>
          <div className=''>
          <span className='text-orange-500 font-semibold whitespace-nowrap lg:hidden block'>Currency</span>

            <select
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
              value={variant.currency}
              onChange={(e) => handleChange(index, 'currency', e.target.value)}
            >
              <option>INR</option>
              <option>USD</option>
            </select>
          </div>
          <div className="md:flex flex-col gap-2 ">
          <span className='text-orange-500 font-semibold whitespace-nowrap lg:hidden block'>Warehouse Model</span>
         <div><label htmlFor="" className='text-[#A3AED0] text-sm'>Suggested Price</label>   <button className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]  ">Product MRP</button></div>
         <div><label htmlFor="" className='text-[#A3AED0] text-sm'>Suggested Price</label>   <button className="border p-2 rounded-xl text-[#718EBF] font-bold  border-[#DFEAF2]  w-full">B2B Price</button></div>
          </div>
          <div className="flex flex-col gap-2 ">
          <span className='text-orange-500 font-semibold whitespace-nowrap lg:hidden block'>RTO Model</span>
         <div><label htmlFor="" className='text-[#A3AED0] text-sm'>Suggested Price</label>   <button className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]  ">Product MRP</button></div>
         <div><label htmlFor="" className='text-[#A3AED0] text-sm'>Suggested Price</label>  <button className="border p-2 rounded-xl text-[#718EBF] font-bold  border-[#DFEAF2]  w-full">B2B Price</button></div>
          </div>
          <div className=''>
          <span className='text-orange-500 font-semibold whitespace-nowrap lg:hidden block'>Product Link</span>
            <input
              type="text"
              placeholder="Link"
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
              value={variant.productLink}
              onChange={(e) => handleChange(index, 'productLink', e.target.value)}
            />
          </div>
          <div className='' >
          <span className='text-orange-500 font-semibold whitespace-nowrap lg:hidden block'>Article Id</span>

            <input
              type="text"
              placeholder="Link"
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
              value={variant.articleId}
              onChange={(e) => handleChange(index, 'articleId', e.target.value)}
            />
          </div>
         <div className='md:flex justify-end '>
         <span className='text-orange-500 font-semibold whitespace-nowrap lg:hidden block'>Images</span>
         <div className="relative border border-[#DFEAF2] rounded-lg p-2 w-16 h-16 flex items-center justify-center">
            {variant.image ? (
              <Image src={variant.image} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-400" />
            )}
            <input
              type="file"
              className="absolute opacity-0 w-full h-full cursor-pointer"
              onChange={(e) => handleFileChange(e, index)}
            />
          </div>
          </div>
          <div className="flex items-start justify-end gap-2 ">
            <button className="bg-red-500 text-white p-2 rounded" onClick={() => removeVariant(index)}>
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
     
    </div>
  );
}
