'use client';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import { Navigation } from 'swiper/modules';
import productimg from '@/app/assets/product.png';
import product1img from '@/app/assets/watch.png';
import product2img from '@/app/assets/watch2.png';
import { FaCalculator } from "react-icons/fa";
import { BsBoxSeam, BsTruck } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdInventory } from "react-icons/md";
import { GiWeight } from "react-icons/gi";
import { HiShieldCheck } from "react-icons/hi";
import img1 from '@/app/assets/quality.png'
import img2 from '@/app/assets/free-delivery.png'
import img3 from '@/app/assets/cod.png'
import img4 from '@/app/assets/return.png'
import { LuArrowUpRight } from "react-icons/lu";
import product1 from '@/app/assets/product6.png';
import coupen from '@/app/assets/coupen.png'
import gift from '@/app/assets/gift.png'
import ship from '@/app/assets/delivery.png'
import { IoIosReturnLeft } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";

const ProductDetails = () => {
  const images = [
    productimg,
    product1img,
    product2img,
    productimg,
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const products = [
    { name: "Smart Watch", price: "₹10499", image: product1, rating: 890, code: 435, buttontext: 'Bluedart Retail' },
    { name: "Handbag", price: "₹10499", image: product1, rating: 890, code: 435, buttontext: 'INCcut Retail' },
    { name: "Skincare", price: "₹10499", image: product1, rating: 890, code: 435, buttontext: 'Shipowl Retail' },
    { name: "Plant Care", price: "₹10499", image: product1, rating: 890, code: 435, buttontext: 'Shiprock Retail' },
    { name: "Plant Care", price: "₹10499", image: product1, rating: 890, code: 435, buttontext: 'Newgen Retail' },
  ];
  return (
    <>
      <div className="container mx-auto  gap-4 justify-between  rounded-lg flex flex-col md:flex-row">
        {/* Image Slider */}
        <div className='w-full md:w-4/12'>
          <div className=" rounded-lg bg-white border border-[#E0E2E7] p-4">
            <div className="rounded-lg p-4 flex justify-center">
              <Image src={selectedImage} alt="Productimg" className="w-80 h-80 object-cover" />
            </div>
            <Swiper
              spaceBetween={10}
              slidesPerView={4}
              navigation
              modules={[Navigation]}
              className="mt-4"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={image}
                    alt={`Thumbnail ${index}`}
                    className={`w-20 h-20 object-cover cursor-pointer rounded-lg  ${selectedImage === image ? 'border-blue-500' : 'border-gray-300'}`}
                    onClick={() => setSelectedImage(image)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>


        {/* Product Info */}
        <div className="w-full md:w-8/12 bg-white rounded-lg border border-[#E0E2E7] p-6">
          <h2 className="text-2xl font-bold text-[#2C3454] pb-4">Smartwatch E2</h2>
          <p className="text-gray-600">Sold: <span className='text-black'>1,316 </span>| Rating: ⭐ <span className='text-black'>4.5/5</span> | Stock: <span className='text-black'>25</span>  | Message: <span className='text-black'>140</span></p>
          <div className='md:flex justify-between pb-8 pt-2'>
            <p className='text-[#858D9D]'>C-Code: <span className='text-black'>#302012</span></p>
            <p className='text-[#858D9D]'>Created: <span className='text-black'>14 January</span></p>
          </div>
          <div className="xl:flex  gap-3 items-start justify-between">
            <div>

              <div className='md:flex gap-3 items-end'>
                <div>
                  <h2 className="text-2xl font-bold">₹372</h2>
                  <p className="text-gray-500 flex items-center text-sm">
                    <a href="" className='underline text-sm'>Including GST & Shipping Charges</a> <AiOutlineInfoCircle className="ml-1" />
                  </p>
                </div>
                <div className="flex items-center bg-purple-100 p-2 rounded-md mt-3 cursor-pointer">
                  <FaCalculator className="text-purple-700 mr-2 text-2xl" />
                  <span className="text-black underline font-semibold text-sm">Calculate <br /> Expected Profit</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-2 rounded-md mt-3 flex items-center cursor-pointer">
                <span className="bg-pink-500 text-white rounded-full px-2 py-1 mr-2">💰</span>
                <span className="font-semibold underline">Get upto ₹124 discount per order</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4  mt-4 text-gray-700 text-sm">
              <div className="flex items-center"><BsBoxSeam className="mr-2 text-green-600" /> Units Sold: <strong className="ml-1">Upto 100</strong></div>
              <div className="flex items-center"><BsTruck className="mr-2 text-blue-600" /> Delivery Rate: --</div>
              <div className="flex items-center"><MdInventory className="mr-2 text-green-600" /> Inventory: <strong className="ml-1">68</strong></div>
              <div className="flex items-center"><GiWeight className="mr-2 text-brown-600" /> Weight: <strong className="ml-1">200 g</strong></div>
              <div className="flex items-center"><HiShieldCheck className="mr-2 text-blue-600" /> Supplier Score: <strong className="ml-1">4/5</strong></div>
              <div className="flex items-center"><span className="mr-2 text-purple-600">📦</span> Product GST: <strong className="ml-1">18%</strong></div>
            </div>



          </div>
          <h3 className="mt-4 font-medium text-[#858D9D]  text-[16px]">Variants</h3>
          <button className="mt-2 px-4 py-2 border rounded-md">Free Size</button>

          <div className="mt-4 border-t border-[#E0E2E7] pt-0">
            <h3 className='text-[#858D9D]  text-[16px] pt-5 '>Color Variant</h3>
            <div className="flex flex-wrap gap-3 mt-2">

              <button className='flex gap-2 items-center border rounded-md p-3 py-2'><span className="w-6 h-6 rounded-full bg-black cursor-pointer"></span>Black</button>
              <button className='flex gap-2 items-center border rounded-md p-3 py-2'> <span className="w-6 h-6 rounded-full bg-gray-500 cursor-pointer"></span>Gray</button>
              <button className='flex gap-2 items-center border rounded-md p-3 py-2'> <span className="w-6 h-6 rounded-full bg-red-500 cursor-pointer"></span>Red</button>
            </div>
          </div>
          <p className='pt-5 text-[#858D9D]  text-[16px]'>Desciption:</p>
          <p className="mt-2 mb-3 text-[#1D1F2C]">Smartwatch for men women notify you incoming calls, SMS notifications. when you connect the smartphone with fitness tracker. Connect fitness tracker with your phone, you will never miss a call and a message. The smart watches for android phones will vibrate to alert you if your phone receives any notifications. You can reject calls and view message directly from your watch. A best gift for family and friends</p>
          <p className='text-[#858D9D]  text-[16px]'>Platform Assurance</p>
          <div className="xl:grid lg:grid-cols-4 flex my-5 md:my-0 overflow-auto  gap-8">
            <div className="col"><Image src={img1} alt="" className='md:p-3 max-w-[150px] xl:max-w-full lg:w-full' /></div>
            <div className="col"><Image src={img2} alt="" className='md:p-3 max-w-[150px] xl:max-w-full lg:w-full' /></div>
            <div className="col"><Image src={img3} alt="" className='md:p-3 max-w-[150px] xl:max-w-full lg:w-full' /></div>
            <div className="col"><Image src={img4} alt="" className='md:p-3 max-w-[150px] xl:max-w-full lg:w-full' /></div>
          </div>
          <div className="">
            <h3 className="text-[#858D9D]  text-[16px]">Weight & Dimension:</h3>
            <p className="text-black font-medium pt-2">
              0.25kg / 10 CM, 10 CM, 7 CM <span className="text-gray-500">(H,L,W)</span>
            </p>

            <div className="mt-4 grid md:grid-cols-2 border-t border-[#E0E2E7] pt-4 items-stretch gap-3">
              <button className="bg-black text-white px-6 py-3 text-xl flex items-center justify-center w-full sm:w-autofont-semibold">
                <LuArrowUpRight className="mr-2" /> Push To Shopify
              </button>

              <div className="bg-gray-100 p-3 rounded-md gap-2 flex items-start w-full sm:w-auto text-sm text-gray-600">
                <IoIosReturnLeft className="text-5xl text-gray-500" />
                <p className='text-sm'>
                  RTO & RVP charges are applicable and vary depending on the product weight.
                  <a href="#" className="text-black underline font-semibold">View charges for this product</a>
                </p>
                <MdKeyboardArrowDown className="text-5xl text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className='py-5'>

        <h4 className='text-2xl text-black mb-3 font-semibold'>From different sellers </h4>
        <div className="products-grid grid xl:grid-cols-5 lg:grid-cols-4  gap-4  xl:gap-10 lg:gap-4">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="product-img relative">
                <Image src={product.image} alt={product.name} className="w-full max-h-[230px] object-cover rounded-xl mb-2" />
                <button className='bg-[#2C3454] text-white rounded-md absolute px-4 py-2 top-3 left-4'>{product.buttontext}</button>
              </div>
              <div className='p-3 '>
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
      </section>
    </>


  );
};

export default ProductDetails;
