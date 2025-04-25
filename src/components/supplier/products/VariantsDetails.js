'use client';

import { useContext, useEffect } from 'react';
import { Plus, Minus, ImageIcon } from 'lucide-react';
import { ProductContextEdit } from './ProductContextEdit';

export default function VariantDetails() {
  const { fetchCountry,formData,setFormData,countryData,setActiveTab } = useContext(ProductContextEdit);

  const handleChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    const numericFields = ['qty', 'suggested_price', 'shipowl_price', 'rto_suggested_price', 'rto_price'];
  
    updatedVariants[index][field] = numericFields.includes(field)
      ? value === '' ? '' : Number(value)
      : value;
  
    setFormData({ ...formData, variants: updatedVariants });
  };
  
  

  useEffect(()=>{
    fetchCountry();
  },[fetchCountry])

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const imageKey = `variant_images_${index}`;
      setFormData((prev) => ({
        ...prev,
        [imageKey]:file,
      }));
    }
  };
  

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          image: null,
          color: '',
          sku: '',
          qty: 1,
          currency: '',
          article_id: '',
          suggested_price:"",
          shipowl_price:"",
          rto_suggested_price:"",
          rto_price:""
        },
      ],
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updatedVariants });
  };
  const handleSubmit =()=>{
    setActiveTab("shipping-details");
  }

  return (
    <div className="mt-4 p-6 rounded-xl bg-white">
      <div className="md:flex mb-6 justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#2B3674] mb-4">Variant Details</h2>
        <button className="bg-[#4318FF] text-white px-4 py-2 rounded-md mt-4 " onClick={handleSubmit}>Next</button>
      </div>

      <div className="lg:grid lg:grid-cols-9 hidden overflow-auto grid-cols-1 gap-6 items-center justify-between border-b border-[#E9EDF7] pb-2 mb-4 text-gray-600 text-sm font-semibold">
        <span className="text-[#A3AED0] whitespace-nowrap">Color</span>
        <span className="text-[#A3AED0] whitespace-nowrap">SKU & Quantity</span>
        <span className="text-[#A3AED0] whitespace-nowrap">Currency</span>
        <span className="text-[#A3AED0] whitespace-nowrap">Warehouse Model</span>
        <span className="text-[#A3AED0] whitespace-nowrap">RTO Model</span>
        <span className="text-[#A3AED0] whitespace-nowrap">Product Link</span>
        <span className="text-[#A3AED0] whitespace-nowrap">Article Id</span>
        <span className="text-[#A3AED0] whitespace-nowrap text-right">Images</span>
        <div className="flex justify-end">
          <button className="bg-green-500 flex justify-end text-white p-2 rounded-lg" onClick={addVariant}>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-end md:hidden">
        <button className="bg-green-500 text-white p-2 rounded-lg" onClick={addVariant}>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {formData.variants.map((variant, index) => (
        <div key={index} className="md:grid lg:grid-cols-9 overflow-auto md:grid-cols-2 gap-6 justify-between mb-4 border-b border-[#E9EDF7] pb-4">
          {/* Color */}
          <div>
            <span className="text-orange-500 font-semibold whitespace-nowrap lg:hidden block">Color</span>
            <select
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
              value={variant.color}
              onChange={(e) => handleChange(index, 'color', e.target.value)}
            >
              <option value="">Select Color</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
            </select>
          </div>

          <div>
            <span className="text-orange-500 font-semibold whitespace-nowrap lg:hidden block">SKU & Quantity</span>
            <input
              type="text"
              placeholder="SKU"
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2] mb-2"
              value={variant.sku}
              onChange={(e) => handleChange(index, 'sku', e.target.value)}
            />
            <input
              type="number"
              placeholder="QTY"
              className="border p-2 rounded-xl text-[#718EBF] font-bold border-[#DFEAF2] w-full"
              value={variant.qty}
              onChange={(e) => handleChange(index, 'qty', e.target.value)}
            />
          </div>

          <div>
            <span className="text-orange-500 font-semibold whitespace-nowrap lg:hidden block">Currency</span>
            <select
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
              value={variant.currency}
              onChange={(e) => handleChange(index, 'currency', e.target.value)}
            >
              {countryData.map((item,index)=>{
                return(

                  <option key={index} value={item.id}>{item.currency}</option>
                )
              })}
            </select>
          </div>

           <div className="flex flex-col gap-2">
          <span className='text-orange-500 font-semibold whitespace-nowrap lg:hidden block'>Warehouse Model</span>
          <div>
            <label className='text-[#A3AED0] text-sm'>Suggested Price</label>
            <input
              type="text"
              placeholder="Suggested Price"
              className="border p-2 rounded-xl text-[#718EBF] font-bold border-[#DFEAF2] w-full"
              value={variant.suggested_price || ''}
              onChange={(e) => handleChange(index, 'suggested_price', e.target.value)}
            />
          </div>
          <div>
            <label className='text-[#A3AED0] text-sm'>ShipOwl Cost Price (ex. GST)</label>
            <input
              type="text"
              placeholder="B2B Price"
              className="border p-2 rounded-xl text-[#718EBF] font-bold border-[#DFEAF2] w-full"
              value={variant.shipowl_price || ''}
              onChange={(e) => handleChange(index, 'shipowl_price', e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className='text-orange-500 font-semibold whitespace-nowrap lg:hidden block'>RTO Model</span>
          <div>
            <label className='text-[#A3AED0] text-sm'>Suggested Price</label>
            <input
              type="text"
              placeholder="Product MRP"
              className="border p-2 rounded-xl text-[#718EBF] font-bold border-[#DFEAF2] w-full"
              value={variant.rto_suggested_price || ''}
              onChange={(e) => handleChange(index, 'rto_suggested_price', e.target.value)}
            />
          </div>
          <div>
            <label className='text-[#A3AED0] text-sm'>ShipOwl Cost Price (ex. GST)</label>
            <input
              type="text"
              placeholder="B2B Price"
              className="border p-2 rounded-xl text-[#718EBF] font-bold border-[#DFEAF2] w-full"
              value={variant.rto_price || ''}
              onChange={(e) => handleChange(index, 'rto_price', e.target.value)}
            />
          </div>
        </div>

          <div>
            <span className="text-orange-500 font-semibold whitespace-nowrap lg:hidden block">Product Link</span>
            <input
              type="text"
              placeholder="Link"
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
              value={variant.product_link}
              onChange={(e) => handleChange(index, 'product_link', e.target.value)}
            />
          </div>

          {/* Article Id */}
          <div>
            <span className="text-orange-500 font-semibold whitespace-nowrap lg:hidden block">Article Id</span>
            <input
              type="text"
              placeholder="Article Id"
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
              value={variant.article_id}
              onChange={(e) => handleChange(index, 'article_id', e.target.value)}
            />
          </div>

          <div className="md:flex justify-end">
  <span className="text-orange-500 font-semibold whitespace-nowrap lg:hidden block">Images</span>
  <div className="relative border border-[#DFEAF2] rounded-lg p-2 w-16 h-16 flex items-center justify-center">
    
      <ImageIcon className="w-8 h-8 text-gray-400" />
  
    <input
      type="file"
      className="absolute opacity-0 w-full h-full cursor-pointer"
      onChange={(e) => handleFileChange(e, index)}
    />
  </div>
</div>


          {/* Remove Variant */}
          <div className="flex items-start justify-end gap-2">
            <button className="bg-red-500 text-white p-2 rounded" onClick={() => removeVariant(index)}>
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
