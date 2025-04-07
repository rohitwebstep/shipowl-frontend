'use client';

import Image from 'next/image';
import productImage from '@/app/images/product-img.png'
const products = [
  {
    id: 1,
    name: 'Product Name',
    price: 450,
    orders: 200,
    image: productImage, // Replace with actual image path
  },
  {
    id: 2,
    name: 'Product Name',
    price: 450,
    orders: 200,
    image: productImage, // Replace with actual image path
  },
];

export default function NewProducts() {
  return (
    <div className="">
      <div className="flex flex-wrap lg:justify-end space-x-3 gap-3 justify-center mb-6">
        <button className="bg-[#05CD99] text-white px-8 py-2 rounded-md">Export</button>
        <button className="bg-[#3965FF] text-white px-8 py-2 rounded-md">Import</button>
        <button className="bg-[#F98F5C] text-white px-8 py-2 rounded-md">Add New</button>
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 products-grid gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-[#B9B9B9]">
            <Image
              src={product.image}
              alt={product.name}
              className="w-full"
            />
            <div className="mt-3 p-3">
              <div className='flex justify-between'>
                <div>
                  <h2 className="text-lg font-semibold nunito">{product.name}</h2></div>
                <div>
                  <p className="text-black font-bold nunito text-right">₹ {product.price}</p>
                  <p className="text-sm text-[#202224] nunito text-right">Exp. Orders : {product.orders}</p>
                </div>
              </div>
              <button className="mt-2 bg-blue-500 nunito text-white px-4 py-2 rounded w-auto font-semibold ">Add to list</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
