"use client"

import React, { useState } from 'react';
import Swal from 'sweetalert2';
function Create() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    status: '',
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, type, value, checked ,files} = e.target;

    if (type === 'file') {
      const fileArray = Array.from(files);
      setFormData(prev => ({ ...prev, images: fileArray }));
      setPreviewImages(fileArray.map(file => URL.createObjectURL(file)));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? (checked ? true : false) : value
    }));    }
  };
 

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.quantity || isNaN(formData.quantity)) newErrors.quantity = 'Valid quantity required';
    if (!formData.status) newErrors.status = 'Product status is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


   const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
  
          const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
          if (!dropshipperData?.project?.active_panel === "supplier") {
              localStorage.clear("shippingData");
              router.push("/supplier/auth/login");
              return;
          }
  
          const token = dropshipperData?.security?.token;
          if (!token) {
              router.push("/supplier/auth/login");
              return;
          }
  
          const errors = validate();
          if (Object.keys(errors).length > 0) {
              setErrors(errors);
              setLoading(false);
              return;
          }
  
          setErrors({});
  
          try {
              Swal.fire({
                  title:  'Creating Product...',
                  text: 'Please wait while we save your Product.',
                  allowOutsideClick: false,
                  didOpen: () => {
                      Swal.showLoading();
                  }
              });
  
              const form = new FormData();

              form.append("name", formData.name);
              form.append("description", formData.description);
              form.append("status", formData.status || true);
              form.append("quantity", formData.quantity);   

              if (formData.images.length > 0) {
                  formData.images.forEach((file, index) => {
                      form.append('image', file); // use 'images[]' if backend expects an array
                  });
              }
  
              const url ="http://https://sleeping-owl-we0m.onrender.com/api/product/request";
  
              const response = await fetch(url, {
                  method: "POST",
                  headers: {
                      "Authorization": `Bearer ${token}`,
                  },
                  body: form,
              });
  
              if (!response.ok) {
                  Swal.close();
                  const errorMessage = await response.json();
                  Swal.fire({
                      icon: "error",
                      title: "Creation Failed",
                      text: errorMessage.message || errorMessage.error || "An error occurred",
                  });
                  throw new Error(errorMessage.message || errorMessage.error || "Submission failed");
              }
  
              const result = await response.json();
              Swal.close();
  
              if (result) {
                  Swal.fire({
                      icon: "success",
                      title: "Product Created",
                      text: `The Product has been created successfully!`,
                      showConfirmButton: true,
                  }).then((res) => {
                      if (res.isConfirmed) {
                          setFormData({ name: '', description: '', image: '' });
                          setFiles(null);
                          router.push("/supplier/new-product-request");
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
          } finally {
              setLoading(false);
          }
      };

  console.log('formData',formData)

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* name */}
        <div>
          <label className="block font-medium">
            name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* quantity */}
        <div>
          <label className="block font-medium">
            quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity || ''}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
        </div>

        <div>
          
        <label className="flex mt-2 items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name='status'
                                className="sr-only"
                                checked={formData.status || ''}
                                onChange={handleChange}
                            />
                            <div
                                className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${formData.status ? "bg-orange-500" : ""
                                    }`}
                            >
                                <div
                                    className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${formData.status ? "translate-x-5" : ""
                                        }`}
                                ></div>
                            </div>
                            <span className="ms-2 text-sm text-gray-600">
                                Status
                            </span>
                        </label>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
        </div>

        {/* Images Upload */}
        <div>
          <label className="block font-medium">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.images ? 'border border-red-500 p-2 rounded' : 'mt-1 border-gray-300'}`}
          />
          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
          {previewImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {previewImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Create;
