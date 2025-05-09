'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { IoIosArrowForward } from 'react-icons/io';
import { HashLoader } from 'react-spinners';

import productimg from '@/app/assets/product1.png';
import coupen from '@/app/assets/coupen.png';
import gift from '@/app/assets/gift.png';
import ship from '@/app/assets/delivery.png';

const NewlyLaunched = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const fetchProduct = useCallback(async () => {
    const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));

    if (dropshipperData?.project?.active_panel !== "dropshipper") {
      localStorage.removeItem("shippingData");
      router.push("/dropshipping/auth/login");
      return;
    }

    const dropshippertoken = dropshipperData?.security?.token;
    if (!dropshippertoken) {
      router.push("/dropshipping/auth/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dropshippertoken}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Something Wrong!",
          text: result.error || result.message || "Your session has expired. Please log in again.",
        });
        throw new Error(result.message || result.error || "Something Wrong!");
      }

      setProducts(result?.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);
  const viewProduct = (item) => {
    router.push(`/dropshipping/product/?id=${item.id}`);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <HashLoader size={60} color="#F97316" loading={true} />
      </div>
    );
  }
  return (
    <section className="xl:p-6 pt-6">
      <div className="container">
        <div className="flex justify-between items-center mb-4">
          <h2 className="md:text-[24px] text-lg text-[#F98F5C] font-lato font-bold">Newly Launched</h2>
          <Link href="/dropshipping/product-list" className="text-[16px] text-[#222222] hover:text-orange-500 flex items-center gap-2 font-lato">
            View All <IoIosArrowForward className='text-[#F98F5C]' />
          </Link>
        </div>
        <div className="md:w-[293px] border-b-3 border-[#F98F5C] mt-1 mb-4"></div>

        <div className="products-grid grid xl:grid-cols-5 lg:grid-cols-4 gap-4 xl:gap-6 lg:gap-4">
          {/* Static Card */}
          <div className="h-full rounded-xl shadow-xl overflow-hidden">
            <Image src={productimg} alt="Best of Newly Launched" className="w-full max-h-[248px] object-cover" />
            <div className="bg-[#212B36] bg-opacity-50 p-4 px-2 text-center text-white">
              <p className="text-[16px] font-semibold font-lato">Best of Newly Launched</p>
              <p className="text-[15px] text-[#F98F5C] font-lato">10+ Products</p>
            </div>
          </div>

          {products.map((product, index) => {
    const variant = product.variants?.[0];
    const imageUrl = variant?.image?.split(",")?.[0]?.trim() || "/default-image.png";

    return (
        <div key={index} onClick={()=>viewProduct(product)} className="bg-white rounded-xl cursor-pointer shadow-sm">
            <Image
                src={productimg || imageUrl}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <div className='p-3 mb:pb-0'>
                <div className='flex justify-between'>
                    <p className="text-lg font-extrabold font-lato">₹{variant?.shipowl_price ?? "N/A"}</p>
                    <div className="coupen-box flex gap-2 items-center">
                        <Image src={coupen} className='w-5' alt='Coupon' />
                        <span className='text-[#249B3E] font-lato font-bold text-[12px]'>WELCOME10</span>
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
                        <span className='font-lato text-[#2C3454] font-bold'>4.5</span>
                    </div>
                </div>
            </div>
        </div>
    );
})}

        </div>
      </div>
    </section>
  );
};

export default NewlyLaunched;
