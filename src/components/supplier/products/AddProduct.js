"use client";

import { useEffect, useState, useContext, useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import ProductDetails from './ProductDetails';
import VariantsDetails from './VariantsDetails';
import ShippingDetails from './ShippingDetails';
import OtherDetails from './OtherDetails';
import { ProductContextEdit } from "./ProductContextEdit";
import Swal from 'sweetalert2';

const AddProduct = () => {
  
  const [loading, setLoading] = useState(false);
  const {activeTab, setActiveTab,setFormData } = useContext(ProductContextEdit);
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");

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
      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/product/${id}`, {
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
          title: "Something went wrong!",
          text: errorMessage.message || "Your session has expired. Please log in again.",
        });
        throw new Error(errorMessage.message);
      }

      const result = await response.json();
      const products = result?.product || {};

      setFormData({
        category: products.categoryId || '',
        name: products.name || '',
        main_sku: products.main_sku || '',
        description: products.description || '',
        tags: (() => {
          try {
            const parsed = JSON.parse(products.tags);
            return Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            return [];
          }
        })(),
        brand: products.brandId || '',
        origin_country: products.originCountryId || '',
        shipping_country: products.shippingCountryId || '',
        video_url: products.video_url || '',
        list_as: products.list_as || '',
        variant_images_0: '',
        variants: (products.variants || []).map((variant) => ({
          id: variant.id || '',
          color: variant.color || '',
          sku: variant.sku || '',
          qty: variant.qty || 1,
          currency: variant.currency || '',
          article_id: variant.article_id || '',
          product_link: variant.product_link || '',
          suggested_price: variant.suggested_price || '',
          shipowl_price: variant.shipowl_price || '',
          rto_suggested_price: variant.rto_suggested_price || '',
          rto_price: variant.rto_price || '',
        })),
        shipping_time: products.shipping_time || '',
        weight: products.weight || '',
        package_length: products.package_length || '',
        package_width: products.package_width || '',
        package_height: products.package_height || '',
        chargable_weight: products.chargeable_weight || '',
        package_weight_image: '',
        package_length_image:  '',
        package_width_image:  '',
        package_height_image:'',
        product_detail_video:  '',
        upload_training_guidance_video: '',
        upc: products.upc || '',
        ean: products.ean || '',
        hsn_code: products.hsnCode || '',
        tax_rate: products.taxRate || '',
        rto_address: products.rtoAddress || '',
        pickup_address: products.pickupAddress || '',
      });
      
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }, [router, id, setFormData]);

  useEffect(() => {
    if (id) fetchProducts();
  }, [fetchProducts, id]);

  const tabs = [
    { id: "product-details", label: "Product Details" },
    { id: "variants-details", label: "Variants Details" },
    { id: "shipping-details", label: "Shipping Details" },
    { id: "other-details", label: "Other Details" },
  ];

  return (
    <div className="w-full xl:p-6">
      <div className="bg-white rounded-3xl p-5">
        <div className="flex border-b overflow-auto border-[#F4F5F7]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-lg whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-4 border-orange-500 font-bold text-orange-500"
                  : "text-[#718EBF] font-medium"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "product-details" && <ProductDetails />}
        {activeTab === "variants-details" && <VariantsDetails />}
        {activeTab === "shipping-details" && <ShippingDetails />}
        {activeTab === "other-details" && <OtherDetails />}
      </div>
    </div>
  );
};

export default AddProduct;
