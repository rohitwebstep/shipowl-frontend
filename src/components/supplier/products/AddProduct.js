"use client";

import { useState } from "react";
import ProductDetails from './addproducts/ProductDetails'
import VariantsDetails from './addproducts/VariantsDetails'
import ShippingDetails from './addproducts/ShippingDetails'
import OtherDetails from './OtherDetails'
import { ProductContext } from "./ProductContext";
import { useSearchParams } from 'next/navigation'

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("product-details");
 const {formData,setFormData} = useContext(ProductContext);
 const searchParams = useSearchParams();

    const id = searchParams.get('id');

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
                 `https://sleeping-owl-we0m.onrender.com/api/product/${id}`,
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
                     title: "Session Expired",
                     text: errorMessage.message || "Your session has expired. Please log in again.",
                 });
                 throw new Error(errorMessage.message);
             }
 
             const result = await response.json();
             const products = result?.product || {};
             
             setFormData({
               category: products.category || '',
               name: products.name || '',
               main_sku: products.main_sku || '',
               description: products.description || '',
               tags: products.tags || [{}],
               brands: products.brands || '',
               origin_country: products.origin_country || '',
               shipping_country: products.shipping_country || '',
               video_url: products.video_url || '',
               list_as: products.list_as || '',
               variant_images_0: products.variant_images_0 || '',
               variants: (products.variants || []).map((variant) => ({
                 color: variant.color || '',
                 sku: variant.sku || '',
                 qty: variant.qty || 1,
                 currency: variant.currency || '',
                 article_id: variant.article_id || '',
                 suggested_price: variant.suggested_price || '',
                 shipowl_price: variant.shipowl_price || '',
                 rto_suggested_price: variant.rto_suggested_price || '',
                 rto_price: variant.rto_price || '',
               })),
               Shipping_time: products.Shipping_time || '',
               weight: products.weight || '',
               package_length: products.package_length || '',
               package_width: products.package_width || '',
               package_height: products.package_height || '',
               chargable_weight: products.chargable_weight || '',
               package_weight_image: products.package_weight_image || '',
               package_length_image: products.package_length_image || '',
               package_width_image: products.package_width_image || '',
               package_height_image: products.package_height_image || '',
               product_detail_video: products.product_detail_video || '',
               upload_training_guidance_video: products.upload_training_guidance_video || '',
               upc: products.upc || '',
               ean: products.ean || '',
               hsn_code: products.hsn_code || '',
               tax_rate: products.tax_rate || '',
               rto_address: products.rto_address || '',
               pickup_address: products.pickup_address || '',
             });
             
         } catch (error) {
             console.error("Error fetching warehouse:", error);
         } finally {
             setLoading(false);
         }
     }, [router, id]);

     

  const tabs = [
    { id: "product-details", label: "Product Details" },
    { id: "variants-details", label: "Variants Details" },
    { id: "shipping-details", label: "Shipping Details" },
    { id: "other-details", label: "Other Details" },
  ];

  return (
    <div className="w-full xl:p-6">
      <div className="bg-white rounded-3xl p-5">


        <div className="flex border-b overflow-auto  border-[#F4F5F7]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-lg whitespace-nowrap  ${activeTab === tab.id
                  ? "border-b-3 border-orange-500  font-bold text-orange-500"
                  : "text-[#718EBF] font-medium"
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="">
        {activeTab === "product-details" && <ProductDetails />}
        {activeTab === "variants-details" && <VariantsDetails />}
        {activeTab === "shipping-details" && <ShippingDetails />}
        {activeTab === "other-details" && <OtherDetails />}
      </div>
    </div>
  );
};



export default Tabs;
