'use client';
import { useContext } from 'react';
import { ProductContext } from './ProductContext';

export default function OtherDetails() {
 const {formData,setFormData} = useContext(ProductContext)


 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
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

      const url = "https://shipping-owl-vd4s.vercel.app/api/product"; // Ensure the URL is correct
      const form = new FormData();

      // Iterate over each field in formData
      for (const key in formData) {
          const value = formData[key];
          form.append('variants', JSON.stringify(formData.variants));

          // Skip empty/null/undefined values
          if (value === null || value === undefined || value === '') continue;

          // Handle objects inside arrays (like variants)
          if (Array.isArray(value)) {
              value.forEach((item, index) => {
                  if (typeof item === 'object') {
                      // If the item is an object, stringifying it
                      form.append(`${key}[${index}]`, JSON.stringify(item));
                  } else {
                      // Otherwise, just append the value directly
                      form.append(`${key}[${index}]`, item);
                  }
              });
          }

          // Handle non-array objects (like variant_images_0)
          else if (typeof value === 'object') {
              // If it's an object, stringifying it
              form.append(key, JSON.stringify(value));
          }

          // Handle file fields (images/videos)
          else if (value instanceof File) {
              form.append(key, value);
          }

          // Handle regular fields (like strings or numbers)
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
    <form className='' onSubmit={handleSubmit}>
    <div className="xl:w-11/12 mt-4 p-6  rounded-2xl bg-white">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="upc" className='font-bold block uppercase'>UPC</label>
          <input type="text" className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.upc} name='upc' onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="ean" className='font-bold block uppercase'>ean</label>
          <input type="text" className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.ean} onChange={handleChange} name='ean' />
        </div>
        <div>
          <label htmlFor="hsnCode" className='font-bold block '>HSN Code</label>
          <input type="text" className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.hsn_code} onChange={handleChange} name="hsn_code"/>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label htmlFor="taxRate" className='font-bold block '>Tax Rate (GST) *</label>
          <input type="text" className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.tax_rate} onChange={handleChange} name="tax_rate" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="rtoAddress" className='font-bold block '>RTO Address *</label>
          <select className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.rto_address} name='rto_address' onChange={handleChange}>
            <option>RTO Address *</option>
          </select>
        </div>
        <div>
          <label htmlFor="pickupAddress" className='font-bold block '>Pickup Address *</label>
          <select className="border border-[#DFEAF2] p-3 mt-2 rounded-md w-full" value={formData.pickup_address} onChange={handleChange} name='pickup_address'>
            <option>Pickup Address *</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <button className="bg-orange-500 text-white px-14 py-2 rounded-md">Save</button>
        <button className="bg-[#8F9BBA] text-white px-14 py-2 rounded-md">Cancel</button>
      </div>
    </div>
    </form>
  );
}
