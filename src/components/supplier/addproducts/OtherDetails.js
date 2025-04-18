'use client';
import { useContext } from 'react';
import { ProductContext } from './ProductContext';

export default function OtherDetails() {
 const {formData,setFormData} = useContext(ProductContext)


 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


  return (
    <div className="xl:w-11/12 mt-4 p-6  rounded-2xl bg-white">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="upc" className='font-bold block uppercase'>UPC</label>
          <input type="text" className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.upc} name='upc' onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="ean" className='font-bold block uppercase'>ean</label>
          <input type="text" className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.ean} onChange={handleChange} name='ean' />
        </div>
        <div>
          <label htmlFor="hsnCode" className='font-bold block '>HSN Code</label>
          <input type="text" className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.hsn_code} onChange={handleChange} name="hsn_code"/>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label htmlFor="taxRate" className='font-bold block '>Tax Rate (GST) *</label>
          <input type="text" className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.tax_rate} onChange={handleChange} name="tax_rate" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="rtoAddress" className='font-bold block '>RTO Address *</label>
          <select className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.rto_address} name='rto_address' onChange={handleChange}>
            <option>RTO Address *</option>
          </select>
        </div>
        <div>
          <label htmlFor="pickupAddress" className='font-bold block '>Pickup Address *</label>
          <select className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.pickup_address} onChange={handleChange} name='pickup_address'>
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
