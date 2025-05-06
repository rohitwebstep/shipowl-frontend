'use client';

import { useContext, useEffect, useState } from 'react';
import { Plus, Minus, ImageIcon } from 'lucide-react';
import { ProductContextEdit } from './ProductContextEdit';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import Swal from "sweetalert2";
export default function VariantDetails() {
  const { fetchCountry, formData, setFormData, countryData, setActiveTab } = useContext(ProductContextEdit);

  useEffect(() => {
    fetchCountry();
  }, []); // Avoid using fetchCountry directly in dependencies

  const numericFields = ['qty', 'suggested_price', 'shipowl_price', 'rto_suggested_price', 'rto_price'];

  const handleChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = numericFields.includes(field)
      ? value === '' ? '' : Number(value)
      : value;
    setFormData({ ...formData, variants: updatedVariants });
  };

const handleFileChange = (event, index) => {
  const selectedFiles = Array.from(event.target.files);
  if (selectedFiles.length > 0) {
    const imageKey = `variant_images_${index}`;
    setFormData((prev) => ({
      ...prev,
      [imageKey]: [...(prev[imageKey] || []), ...selectedFiles],
    }));
  }
};
const [loading,setLoading] = useState(null);

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          color: '',
          sku: '',
          qty: 1,
          currency: 'INR',
          product_link: '',
          articleId: '',
          suggested_price: '',
          shipowl_price: '',
          rto_suggested_price: '',
          rto_price: '',
          image: null,
        },
      ],
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleSubmit = () => {
    setActiveTab('shipping-details');
  };

    const handleImageDelete = async (index,type,variantId) => {
          setLoading(true);
  
          const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
          if (dropshipperData?.project?.active_panel !== "supplier") {
              localStorage.removeItem("shippingData");
              router.push("/supplier/auth/login");
              return;
          }
  
          const token = dropshipperData?.security?.token;
          if (!token) {
              router.push("/supplier/auth/login");
              return;
          }
  
          try {
              Swal.fire({
                  title: 'Deleting Image...',
                  text: 'Please wait while we remove the image.',
                  allowOutsideClick: false,
                  didOpen: () => {
                      Swal.showLoading();
                  }
              });
  
              const url = `http://localhost:3001/api/product/${variantId}/image/${index}?type=${type}`;
  
              const response = await fetch(url, {
                  method: "DELETE",
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
  
              if (!response.ok) {
                  Swal.close();
                  const errorMessage = await response.json();
                  Swal.fire({
                      icon: "error",
                      title: "Delete Failed",
                      text: errorMessage.message || errorMessage.error || "An error occurred",
                  });
                  throw new Error(errorMessage.message || errorMessage.error || "Submission failed");
              }
  
              const result = await response.json();
              Swal.close();
  
              if (result) {
                  Swal.fire({
                      icon: "success",
                      title: "Image Deleted",
                      text: `The image has been deleted successfully!`,
                      showConfirmButton: true,
                  }).then((res) => {
                      if (res.isConfirmed) {
                      }
                  });
              }
          } catch (error) {
              console.error("Error:", error);
              Swal.close();
              Swal.fire({
                  icon: "error",
                  title: "Submission Error",
                  text: error.message || "Something went wrong. Please try again.",
              });
              setError(error.message || "Submission failed.");
          } finally {
              setLoading(false);
          }
      };
  return (
    <div className="mt-4 p-6 rounded-xl bg-white">
      <div className="md:flex mb-6 justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#2B3674] mb-4">Variant Details</h2>
        <button className="bg-[#4318FF] text-white px-4 py-2 rounded-md mt-4" onClick={handleSubmit}>
          Next
        </button>
      </div>

      {/* Header Row for Desktop */}
      <div className="lg:grid lg:grid-cols-9 hidden overflow-auto grid-cols-1 gap-6 items-center justify-between border-b border-[#E9EDF7] pb-2 mb-4 text-gray-600 text-sm font-semibold">
        <span className="text-[#A3AED0] whitespace-nowrap">Color</span>
        <span className="text-[#A3AED0] whitespace-nowrap">SKU & Quantity</span>
        <span className="text-[#A3AED0] whitespace-nowrap">Currency</span>
        <span className="text-[#A3AED0] whitespace-nowrap">Warehouse Model</span>
        <span className="text-[#A3AED0] whitespace-nowrap">RTO Model</span>
        <span className="text-[#A3AED0] whitespace-nowrap">Product Link</span>
        <span className="text-[#A3AED0] whitespace-nowrap">Article Id</span>
        <span className="text-[#A3AED0] whitespace-nowrap text-right">Images</span>
        <div className="flex justify-end">
          <button className="bg-green-500 text-white p-2 rounded-lg" onClick={addVariant}>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Variant Button for Mobile */}
      <div className="flex justify-end md:hidden">
        <button className="bg-green-500 text-white p-2 rounded-lg" onClick={addVariant}>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Variants */}
      {Array.isArray(formData.variants) && formData.variants.map((variant, index) => (
        <div
          key={index}
          className="md:grid lg:grid-cols-9 overflow-auto md:grid-cols-2 gap-6 justify-between mb-4 border-b border-[#E9EDF7] pb-4"
        >
          {/* Color */}
          <div>
            <span className="text-orange-500 font-semibold lg:hidden block">Color</span>
            <select
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
              value={variant.color}
              onChange={(e) => handleChange(index, 'color', e.target.value)}
            >
              <option value="">Select Color</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
            </select>
          </div>

          {/* SKU & QTY */}
          <div>
            <span className="text-orange-500 font-semibold lg:hidden block">SKU & Quantity</span>
            <input
              type="text"
              placeholder="SKU"
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2] mb-2"
              value={variant.sku}
              onChange={(e) => handleChange(index, 'sku', e.target.value)}
            />
            <input
              type="number"
              placeholder="QTY"
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
              value={variant.qty}
              onChange={(e) => handleChange(index, 'qty', e.target.value)}
            />
          </div>

          {/* Currency */}
          <div>
            <span className="text-orange-500 font-semibold lg:hidden block">Currency</span>
            <select
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
              value={variant.currency}
              onChange={(e) => handleChange(index, 'currency', e.target.value)}
            >
              {countryData.map((item, i) => (
                <option key={i} value={item.id}>
                  {item.currency}
                </option>
              ))}
            </select>
          </div>

          {/* Warehouse Model */}
          <div className="flex flex-col gap-2">
            <span className="text-orange-500 font-semibold lg:hidden block">Warehouse Model</span>
            <label className="text-[#A3AED0] text-sm">Suggested Price</label>
            <input
              type="number"
              placeholder="Suggested Price"
              className="border p-2 rounded-xl text-[#718EBF] font-bold border-[#DFEAF2] w-full"
              value={variant.suggested_price || ''}
              onChange={(e) => handleChange(index, 'suggested_price', e.target.value)}
            />
            <label className="text-[#A3AED0] text-sm">ShipOwl Cost Price (ex. GST)</label>
            <input
              type="number"
              placeholder="B2B Price"
              className="border p-2 rounded-xl text-[#718EBF] font-bold border-[#DFEAF2] w-full"
              value={variant.shipowl_price || ''}
              onChange={(e) => handleChange(index, 'shipowl_price', e.target.value)}
            />
          </div>

          {/* RTO Model */}
          <div className="flex flex-col gap-2">
            <span className="text-orange-500 font-semibold lg:hidden block">RTO Model</span>
            <label className="text-[#A3AED0] text-sm">Suggested Price</label>
            <input
              type="number"
              placeholder="Product MRP"
              className="border p-2 rounded-xl text-[#718EBF] font-bold border-[#DFEAF2] w-full"
              value={variant.rto_suggested_price || ''}
              onChange={(e) => handleChange(index, 'rto_suggested_price', e.target.value)}
            />
            <label className="text-[#A3AED0] text-sm">ShipOwl Cost Price (ex. GST)</label>
            <input
              type="number"
              placeholder="B2B Price"
              className="border p-2 rounded-xl text-[#718EBF] font-bold border-[#DFEAF2] w-full"
              value={variant.rto_price || ''}
              onChange={(e) => handleChange(index, 'rto_price', e.target.value)}
            />
          </div>

          {/* Product Link */}
          <div>
            <span className="text-orange-500 font-semibold lg:hidden block">Product Link</span>
            <input
  type="text"
  placeholder="Link"
  id="product_link"
  className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
  value={variant.product_link || ''}
  onChange={(e) => handleChange(index, 'product_link', e.target.value)}
/>

          </div>

          {/* Article ID */}
          <div>
            <span className="text-orange-500 font-semibold lg:hidden block">Article Id</span>
            <input
              type="text"
              placeholder="Article Id"
              className="border p-2 rounded-xl text-[#718EBF] font-bold w-full border-[#DFEAF2]"
              value={variant.articleId || ''}
              onChange={(e) => handleChange(index, 'articleId', e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="md:flex flex-wrap justify-end">
            <span className="text-orange-500 font-semibold lg:hidden block">Images</span>
            <div className="relative border border-[#DFEAF2] rounded-lg p-2 w-16 h-16 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <input
                type="file"
                multiple
                className="absolute opacity-0 w-full h-full cursor-pointer"
                onChange={(e) => handleFileChange(e, index)}
              />
            </div>
            {variant.variant_images && (
              <div className="mt-3 w-full">
                <Swiper
                  key={index}
                  modules={[Navigation]}
                  slidesPerView={1}
                  spaceBetween={12}
                  loop={
                    Array.isArray(variant.variant_images)
                      ? variant.variant_images.length > 1
                      : variant.variant_images.split(',').length > 1
                  }
                  navigation={true}
                  className="mySwiper"
                >
                  {(Array.isArray(variant.variant_images)
                    ? variant.variant_images
                    : variant.variant_images.split(',').map((url) => url.trim())
                  ).map((file, index) => (
                    <SwiperSlide key={index} className="relative group">
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center z-10 opacity-90 hover:opacity-100"
                        onClick={() => {
                          Swal.fire({
                            title: 'Are you sure?',
                            text: 'Do you want to delete this image?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Yes, delete it!',
                          }).then((result) => {
                            if (result.isConfirmed) {
                              handleImageDelete(index, 'variant_image',variant.id);
                            }
                          });
                        }}
                      >
                        ✕
                      </button>

                      <Image
                        src={`https://placehold.co/600x400?text=${index + 1}`
                         
                        }
                        alt={`Image ${index + 1}`}
                        width={500}
                        height={500}
                        className="rounded-lg object-cover w-full h-32"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
  
          </div>

          {/* Remove Button */}
          <div className="flex items-start justify-end gap-2">
            <button className="bg-red-500 text-white p-2 rounded" onClick={() => removeVariant(index)}>
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
