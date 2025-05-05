'use client';

import { useState, useContext } from 'react';
import { UploadCloud } from 'lucide-react';
import { ProductContextEdit } from './ProductContextEdit';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import Image from "next/image";
import 'swiper/css/navigation';
export default function ShippingDetails() {
  const { formData,files, setFiles,validateForm2, setFormData, shippingErrors, fileFields,setActiveTab } = useContext(ProductContextEdit);



  const handleFileChange = (e, key) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => ({
      ...prev,
      [key]: selectedFiles,
    }));
  };
  
  


  const handleImageDelete = async (index) => {
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

          const url = `http://localhost:3001/api/product/${id}/image/${index}`;

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
                      fetchCategory(); // Refresh formData with updated images
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
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm2()) {
      setActiveTab('other-details');
    }
  };

  return (
    <div className="xl:w-11/12 mt-4 xl:p-6 p-3 rounded-2xl bg-white">
      <form onSubmit={handleSubmit}>
        <div className="md:grid-cols-1 grid my-4">
          <div>
            <label className="text-[#232323] font-bold block">
              Shipping Time (in Days) <span className="text-red-500">*</span>
            </label>
            <select
              name="shipping_time"
              className={`border ${shippingErrors.shipping_time ? 'border-red-500' : 'border-[#DFEAF2]'} mt-2 w-full p-3 rounded-xl`}
              value={formData.shipping_time || ''}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="5">5 Days</option>
            </select>
            {shippingErrors.shipping_time && <p className="text-red-500 text-sm">{shippingErrors.shipping_time}</p>}
          </div>
        </div>

        <div className="grid xl:grid-cols-5 md:grid-cols-2 gap-4 mb-4">
          {['weight', 'package_length', 'package_width', 'package_height', 'chargable_weight'].map((field) => (
            <div key={field}>
              <label className="text-[#232323] font-bold block">
                {field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder={field.includes('weight') ? 'GM' : 'CM'}
                className={`border placeholder-black placeholder:text-right ${
                  shippingErrors[field] ? 'border-red-500' : 'border-[#DFEAF2]'
                } mt-2 w-full p-3 rounded-xl`}
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
              />
              {shippingErrors[field] && <p className="text-red-500 text-sm">{shippingErrors[field]}</p>}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-8 my-8">
        {fileFields.map(({ label, key }) => (
          <div key={key} className="flex flex-col space-y-2 w-full md:w-[250px]">
            <label className="text-[#232323] font-bold block mb-1">
              {label} <span className="text-red-500">*</span>
            </label>

            <div className="relative border-2 border-dashed border-red-300 rounded-xl p-4 w-full h-36 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
              <UploadCloud className="w-6 h-6 text-[#232323] mb-2" />
              <span className="text-xs text-[#232323] text-center">
                {Array.isArray(files[key]) && files[key].length > 0
                  ? files[key]
                      .map((file, i) => file.name || `File ${i + 1}`)
                      .join(', ')
                  : 'Upload'}
              </span>
              <input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFileChange(e, key)}
              />
            </div>

            {formData[key] && (
              <div className="mt-3 w-full">
                <Swiper
                  key={key}
                  modules={[Navigation]}
                  slidesPerView={2}
                  spaceBetween={12}
                  loop={
                    Array.isArray(formData[key])
                      ? formData[key].length > 1
                      : formData[key].split(',').length > 1
                  }
                  navigation={true}
                  className="mySwiper"
                >
                  {(Array.isArray(formData[key])
                    ? formData[key]
                    : formData[key].split(',').map((url) => url.trim())
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
                              handleImageDelete(index, key);
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

            {shippingErrors[key] && (
              <p className="text-red-500 text-sm">{shippingErrors[key]}</p>
            )}
          </div>
        ))}

</div>


        <div className="flex flex-wrap gap-4">
          <button type="submit" className="bg-orange-500 text-white px-14 py-2 rounded-md">
            Next
          </button>
          <button type="button" className="bg-[#8F9BBA] text-white px-14 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
