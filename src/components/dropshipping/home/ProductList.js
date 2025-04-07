import product from '@/app/assets/product1.png';
import product1 from '@/app/assets/product2.png';
import product2 from '@/app/assets/product3.png';
import product3 from '@/app/assets/product4.png';
import product4 from '@/app/assets/product5.png';
import Image from 'next/image';
import coupen from '@/app/assets/coupen.png'
import gift from '@/app/assets/gift.png'
import ship from '@/app/assets/delivery.png'
import { IoIosArrowForward } from "react-icons/io";

const products = [
  { name: "Smart Watch", price: "₹10499", image: product1, rating: 890, code: 435 },
  { name: "Handbag", price: "₹10499", image: product2, rating: 890, code: 435 },
  { name: "Handbag", price: "₹10499", image: product2, rating: 890, code: 435 },
  { name: "Skincare", price: "₹10499", image: product3, rating: 890, code: 435 },
  { name: "Plant Care", price: "₹10499", image: product4, rating: 890, code: 435 },
];

const ProductList = () => {
  return (
    <section className="lg:p-6">
      <div className="container">
        <div className='xl:flex gap-3'>
          <div className="md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:w-[87%] justify-center gap-4">
            <div className="">
              <label className="block text-sm font-medium text-[#777980] mb-1 public-sans">Search Product</label>
              <input
                type="text"
                placeholder="Search"
                className="w-full p-[11px] border  border-[#E0E2E7] text-[#858D9D] rounded-md bg-white focus:outline-none public-sans "
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-[#777980] mb-1 public-sans">Product Category</label>
              <select className="w-full p-3 border border-[#E0E2E7] text-[#858D9D] rounded-md bg-white focus:outline-none public-sans ">
                <option>Select...</option>
              </select>
            </div>
            <div className="">
              <label className="block text-sm font-medium text-[#777980] mb-1 public-sans">Select Price Range</label>
              <select className="w-full p-3 border border-[#E0E2E7] text-[#858D9D] rounded-md bg-white focus:outline-none public-sans ">
                <option>Select...</option>
              </select>
            </div>
            <div className="">
              <label className="block text-sm font-medium text-[#777980] mb-1 public-sans">Sold Units</label>
              <select className="w-full p-3 border border-[#E0E2E7] text-[#858D9D] rounded-md bg-white focus:outline-none public-sans ">
                <option>Select...</option>
              </select>
            </div>
            <div className="">
              <label className="block text-sm font-medium text-[#777980] mb-1 public-sans">Delivery Rate</label>
              <select className="w-full p-3 border border-[#E0E2E7] text-[#858D9D] rounded-md bg-white focus:outline-none public-sans ">
                <option>Select...</option>
              </select>
            </div>
          </div>
         

            <div className="xl:w-[13%]  mt-3 lg:mt-0  flex items-end justify-end">
              <button className="w-full bg-[#1D1F2C]  text-white p-3  px-2 rounded-md hover:bg-gray-800 public-sans lg:w-auto">Search Product</button>
            </div>
        </div>

        <div className="flex justify-between items-center my-4">
          <h2 className="md:text-3xl text-lg font-lato font-semibold text-[#F98F5C]">Newly Launched <span className='text-sm text-gray-500'>(100 Products)</span></h2>
          <a href="#" className="text-[16px] text-[#222222] hover:text-orange-500 flex items-center gap-2 font-lato">View All <IoIosArrowForward className='text-[#F98F5C]' /></a>
        </div>
        <div className="md:w-[350px] border-b-3 border-[#F98F5C] mb-4"></div>
        <div className="products-grid grid xl:grid-cols-5 lg:grid-cols-4  gap-4  xl:gap-10 lg:gap-4">

          {/* Product Cards */}
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm">
              <Image src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-2" />
              <div className='p-3'>
                <div className='flex justify-between'>
                  <p className="text-lg font-semibold font-lato">{product.price}</p>
                  <div className="coupen-box flex gap-2 items-center">
                    <Image src={coupen} className='w-5' alt='Coupen' />
                    <span className='text-[#249B3E] font-lato font-bold text-[12px]'>{product.code}</span>
                  </div>
                </div>
                <p className="text-[12px] text-[#ADADAD] font-lato">{product.name}</p>
                <div className="flex items-center border-t pt-2 mt-5 border-[#EDEDED] justify-between  text-sm text-gray-600">
                  <div className='flex items-center gap-1'>
                    <Image src={gift} className='w-5' alt="Gift" />
                    <span className='font-lato text-[#2C3454] font-bold'> 100-10k</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Image src={ship} className='w-5' alt='Shipping' />
                    <span className='font-lato text-[#2C3454] font-bold'>{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
