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
    { name: "Skincare", price: "₹10499", image: product3, rating: 890, code: 435 },
    { name: "Plant Care", price: "₹10499", image: product4, rating: 890, code: 435 },
];

const PotentialHeros = () => {
    return (
        <section className="xl:p-6 pt-6">
            <div className="container">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="md:text-[24px] text-lg  text-[#F98F5C] font-lato font-bold">Potential Heros</h2>
                    <a href="#" className="text-[16px] text-[#222222] hover:text-orange-500 flex items-center ₹ gap-2">View All <IoIosArrowForward className='text-[#F98F5C]' /></a>
                </div>
                <div className="md:w-[293px] border-b-3 border-[#F98F5C] mt-1 mb-4"></div>
                <div className="products-grid grid xl:grid-cols-5  lg:grid-cols-4 gap-4 xl:gap-10 lg:gap-4">
                    {/* First Card */}
                    <div className="h-full rounded-xl shadow-xl overflow-hidden">
                        <Image src={product} alt="Best of Newly Launched" className="w-full max-h-[248px] object-cover" />
                        <div className=" bg-[#212B36] bg-opacity-50  p-4 text-center text-white">
                            <p className="text-[18px] font-semibold font-lato">Best of Newly Launched</p>
                            <p className="text-[15px] text-[#F98F5C] font-lato">10+ Products</p>
                        </div>
                    </div>
                    {/* Product Cards */}
                    {products.map((product, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm font-lato">
                            <Image src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-2" />
                            <div className='p-3 md:pb-0'>
                                <div className='flex justify-between'>
                                    <p className="text-lg font-extrabold font-lato">{product.price}</p>
                                    <div className="coupen-box flex gap-2 items-center">
                                        <Image src={coupen} className='w-5' alt='Coupen' />
                                        <span className='text-[#249B3E] font-lato font-bold text-[12px]'>{product.code}</span>
                                    </div>
                                </div>
                                <p className="text-[12px] text-[#ADADAD] font-lato font-semibold">{product.name}</p>
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

export default PotentialHeros;
