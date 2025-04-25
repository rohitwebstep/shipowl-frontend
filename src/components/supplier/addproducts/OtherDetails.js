'use client';

import { useContext, useState } from 'react';
import { ProductContext } from './ProductContext';
import Swal from 'sweetalert2';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OtherDetails() {
  const { formData, setFormData } = useContext(ProductContext);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['tax_rate', 'rto_address', 'pickup_address'];
    
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = `${field.replace('_', ' ')} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const supplierData = JSON.parse(localStorage.getItem("shippingData"));
    if (!supplierData?.project?.active_panel === "supplier") {
        localStorage.clear("shippingData");
        router.push("/supplier/auth/login");
        return;
    }
  
    const token = supplierData?.security?.token;
    if (!token) {
        router.push("/supplier/auth/login");
        return;
    }
  
    try {
        Swal.fire({
            title: 'Creating Product...',
            text: 'Please wait while we save your Product.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
  
        const url = "https://sleeping-owl-we0m.onrender.com/api/product"; // Ensure the URL is correct
        const form = new FormData();

        for (const key in formData) {
          const value = formData[key];
      
          if (value === null || value === undefined || value === '') continue;
      
          // ✅ Send files
          if (value instanceof File) {
            form.append(key, value);
          }
      
          // ✅ Handle 'variants' as a single array stringified
          else if (key === 'variants') {
            form.append('variants', JSON.stringify(value));
          }
      
          // ✅ Other arrays like 'tags'
          else if (Array.isArray(value)) {
            form.append(key, JSON.stringify(value));
          }
      
          // ✅ Objects
          else if (typeof value === 'object') {
            form.append(key, JSON.stringify(value));
          }
      
          // ✅ Everything else (strings, numbers)
          else {
            form.append(key, value);
          }
        }
  
        const response = await fetch(url, {
            method: "POST", // Use POST for creating the resource
            headers: {
                "Authorization": `Bearer ${token}`
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
                    setFormData({});
                    setFiles(null);
                    router.push("/supplier/product");
                }
            });
        }
        router.push("/supplier/product");

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
    <form onSubmit={handleSubmit}>
      <div className="xl:w-11/12 mt-4 p-6 rounded-2xl bg-white">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="upc" className="font-bold block uppercase">
              UPC
            </label>
            <input
              type="text"
              name="upc"
              value={formData.upc || ''}
              onChange={handleChange}
              className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full"
            />
          </div>
          <div>
            <label htmlFor="ean" className="font-bold block uppercase">
              EAN
            </label>
            <input
              type="text"
              name="ean"
              value={formData.ean || ''}
              onChange={handleChange}
              className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full"
            />
          </div>
          <div>
            <label htmlFor="hsn_code" className="font-bold block uppercase">
              HSN Code
            </label>
            <input
              type="text"
              name="hsn_code"
              value={formData.hsn_code || ''}
              onChange={handleChange}
              className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label htmlFor="tax_rate" className="font-bold block">
              Tax Rate (GST) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="tax_rate"
              value={formData.tax_rate || ''}
              onChange={handleChange}
              className={`border p-3 mt-2 rounded-md w-full ${
                errors.tax_rate ? 'border-red-500' : 'border-[#DFEAF2]'
              }`}
            />
            {errors.tax_rate && <p className="text-red-500 text-sm mt-1">{errors.tax_rate}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="rto_address" className="font-bold block">
              RTO Address <span className="text-red-500">*</span>
            </label>
            <select
              name="rto_address"
              value={formData.rto_address || ''}
              onChange={handleChange}
              className={`border p-3 mt-2 rounded-md w-full ${
                errors.rto_address ? 'border-red-500' : 'border-[#DFEAF2]'
              }`}
            >
              <option value="">Select RTO Address</option>
              <option value="Address 1">Address 1</option>

            </select>
            {errors.rto_address && <p className="text-red-500 text-sm mt-1">{errors.rto_address}</p>}
          </div>

          <div>
            <label htmlFor="pickup_address" className="font-bold block">
              Pickup Address <span className="text-red-500">*</span>
            </label>
            <select
              name="pickup_address"
              value={formData.pickup_address || ''}
              onChange={handleChange}
              className={`border p-3 mt-2 rounded-md w-full ${
                errors.pickup_address ? 'border-red-500' : 'border-[#DFEAF2]'
              }`}
            >
              <option value="">Select Pickup Address</option>
              <option value="Address 1">Address 1</option>
            </select>
            {errors.pickup_address && <p className="text-red-500 text-sm mt-1">{errors.pickup_address}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white px-14 py-2 rounded-md"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            className="bg-[#8F9BBA] text-white px-14 py-2 rounded-md"
            onClick={() => router.push('/supplier/product')}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
