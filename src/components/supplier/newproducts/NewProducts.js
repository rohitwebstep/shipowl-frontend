'use client';

import Image from 'next/image';
import productImage from '@/app/images/product-img.png';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupplier } from '../middleware/SupplierMiddleWareContext';
import { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import { HashLoader } from 'react-spinners';

export default function NewProducts() {
  const { verifySupplierAuth } = useSupplier();
  const [productsRequest, setProductsRequest] = useState([]);
  const [loading, setLoading] = useState(null);
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
      const response = await fetch(`http://localhost:3001/api/product/request`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${suppliertoken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        Swal.fire({
          icon: "error",
          title: "Something Went Wrong!",
          text:
            errorMessage.error ||
            errorMessage.message ||
            "Your session has expired. Please log in again.",
        });
        throw new Error(errorMessage.message || errorMessage.error || "Something Went Wrong!");
      }

      const result = await response.json();
      if (result) {
        setProductsRequest(result?.productRequests || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      await verifySupplierAuth();
      await fetchProducts();
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <HashLoader size={60} color="#F97316" loading={true} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap md:justify-end justify-center gap-3 mb-6">
        <button className="bg-[#05CD99] text-white lg:px-8 p-4 py-2 rounded-md">Export</button>
        <button className="bg-[#3965FF] text-white lg:px-8 p-4 py-2 rounded-md">Import</button>
        <Link href="http://localhost:3000/dropshipping/product/source/create">
          <button className="bg-[#F98F5C] text-white lg:px-8 p-4 py-2 rounded-md">
            Add New
          </button>
        </Link>
      </div>

      {productsRequest.length > 0 ? (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {productsRequest.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#B9B9B9]"
            >
              <Image
                src={product.image || productImage}
                alt={product.name || "Product"}
                width={400}
                height={300}
                className="w-full object-cover"
              />
              <div className="mt-3 p-3">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-semibold nunito">{product.name}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-black font-bold nunito">₹ {product.expectedPrice}</p>
                    <p className="text-sm text-[#202224] nunito">Exp. Orders: {product.expectedDailyOrders}</p>
                  </div>
                </div>
                <button className="mt-2 bg-blue-500 nunito text-white px-4 py-2 rounded font-semibold">
                  Add to list
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No Products Found</p>
      )}
    </div>
  );
}
