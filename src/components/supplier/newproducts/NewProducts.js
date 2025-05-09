'use client';

import Image from 'next/image';
import productImage from '@/app/images/product-img.png'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupplier } from '../middleware/SupplierMiddleWareContext';
import { useEffect, useState,useCallback } from 'react';


export default function NewProducts() {
      const { verifySupplierAuth } = useSupplier();
      const [productsRequest,setProductsRequest] = useState([]);
      const [loading,setLoading] = useState(null);
     const router = useRouter();
        const fetchProducts = useCallback(async () => {
              const supplierData = JSON.parse(localStorage.getItem("shippingData"));
      
              if (supplierData?.project?.active_panel !== "supplier") {
                  localStorage.removeItem("shippingData");
                  router.push("/supplier/auth/login");
                  return;
              }
      
              const suppliertoken = supplierData?.security?.token;
              if (!suppliertoken) {
                  router.push("/supplier/auth/login");
                  return;
              }
      
              try {
                  setLoading(true);
                  const response = await fetch(
                      `https://sleeping-owl-we0m.onrender.com/api/product/request`,
                      {
                          method: "GET",
                          headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${suppliertoken}`,
                          },
                      }
                  );
      
                  if (!response.ok) {
                      const errorMessage = await response.json();
                      Swal.fire({
                          icon: "error",
                          title: "Something Wrong!",
                          text:
                              errorMessage.error ||
                              errorMessage.message ||
                              "Your session has expired. Please log in again.",
                      });
                      throw new Error(
                          errorMessage.message || errorMessage.error || "Something Wrong!"
                      );
                  }
      
                  const result = await response.json();
                  if (result) {
                      setProductsRequest(result?.productRequests || []);
                  }
              } catch (error) {
                  console.error("Error fetching categories:", error);
              } finally {
                  setLoading(false);
              }
          }, [router, setProductsRequest]);
          useEffect(() => {
            const fetchData = async () => {
              await verifySupplierAuth();
              await fetchProducts();
            };
            fetchData();
          }, []);
          
      
  
  return (
    <div className="">
      <div className="flex flex-wrap md:justify-end  gap-3 justify-center mb-6">
        <button className="bg-[#05CD99] text-white lg:px-8 p-4 py-2 rounded-md">Export</button>
        <button className="bg-[#3965FF] text-white lg:px-8 p-4 py-2 rounded-md">Import</button>
        <Link href="/dropshipping/source/product/create">
  <button className="bg-[#F98F5C] text-white lg:px-8 p-4 py-2 rounded-md">
    Add New
  </button>
</Link> 
        </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 products-grid gap-6">
        {productsRequest.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-[#B9B9B9]">
            <Image
              src={productImage || product.image}
              alt={product.name}
              className="w-full"
            />
            <div className="mt-3 p-3">
              <div className='flex justify-between'>
                <div>
                  <h2 className="text-lg font-semibold nunito">{product.name}</h2></div>
                <div>
                  <p className="text-black font-bold nunito text-right">₹ {product.expectedPrice}</p>
                  <p className="text-sm text-[#202224] nunito text-right">Exp. Orders : {product.expectedDailyOrders}</p>
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
