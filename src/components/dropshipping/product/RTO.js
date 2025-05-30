"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Image from 'next/image';
import productimg from '@/app/assets/product1.png';
import { HashLoader } from 'react-spinners';

export default function RTO() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchRTO = useCallback(async () => {
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
            const response = await fetch(
                `http://localhost:3001/api/dropshipper/product/rto/inventory`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${dropshippertoken}`,
                    },
                }
            );

            if (!response.ok) {
                const errorMessage = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Something went wrong!",
                    text:
                        errorMessage.error ||
                        errorMessage.message ||
                        "Your session has expired. Please log in again.",
                });
                throw new Error(
                    errorMessage.message || errorMessage.error || "Something went wrong!"
                );
            }

            const result = await response.json();
            if (result) {
                setProducts(result?.inventories || []);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchRTO();
    }, [fetchRTO]);

    return (
        <div className="p-4">
            {loading ? (
                <div className="flex items-center justify-center h-[80vh]">
                    <HashLoader size={60} color="#F97316" loading={true} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((item, index) => {
                        const orders = item?.orderItem;
                        const variant = item?.dropshipperProductVariant?.supplierProductVariant?.variant;
                        const imageUrl = variant?.images?.[0]?.url || "/no-image.png";

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
                            >
                                <div className="relative h-56 w-full">
                                    <Image
                                        src={productimg}
                                        alt={variant?.name || "Product Image"}
                                        fill
                                        className="object-cover p-3 rounded-2xl"
                                    />
                                </div>
                                <div className="p-4  ">
                                    <p>
                                        <span className="font-bold text-lg"> ₹ {orders?.price}</span>
                                    </p>
                                    <h5 className="text-md font-semibold">{variant?.name}</h5>
                                    <div className="grid grid-cols-3 py-3 items-center border-t border-gray-400 justify-between text-gray-700 r">
                                        <p>
                                            Qty: <span className="font-medium">{orders?.quantity}</span>
                                        </p>
                                        <p>
                                            Total: <span className="font-medium">{orders?.total}</span>
                                        </p>
                                        <p className=" text-gray-600">Color: {variant?.color}</p>


                                    </div>
                                    <div className="flex gap-2">
                                        <p className=" text-gray-600">Sku: {variant?.sku}</p>
                                        <p className=" text-gray-600">Modal: {variant?.modal}</p>
                                    </div>


                                </div>
                            </div>

                        );
                    })}
                </div>
            )}
        </div>
    );
}
