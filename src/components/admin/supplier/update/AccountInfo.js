'use client';

import { useContext, useState } from 'react';
import { ProfileEditContext } from './ProfileEditContext';
import BankAccountList from './BankAccountList';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
const AccountInfo = () => {
  const { formData, setFormData,cancelledChequeImages,setCancelledChequeImages } = useContext(ProfileEditContext);
  const [errors, setErrors] = useState([{}]);
  const [loading,setLoading] = useState(false);

    const router = useRouter();
    console.log('cancelledChequeImages',cancelledChequeImages)

  const handleChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedAccounts = [...formData.bankAccounts];
    updatedAccounts[index][name] = files ? files[0] : value;
    setFormData({ ...formData, bankAccounts: updatedAccounts });

    const updatedErrors = [...errors];
    if (value || files?.length) {
      if (updatedErrors[index]) updatedErrors[index][name] = '';
    }
    setErrors(updatedErrors);
  };

  const validate = () => {
    const newErrors = formData.bankAccounts.map(account => {
      const accountErrors = {};
      for (let field in account) {
        if (!account[field]) {
          accountErrors[field] = 'This field is required';
        }
      }
      return accountErrors;
    });

    setErrors(newErrors);
    return newErrors.every(err => Object.keys(err).length === 0);
  };

  const handleRemove = (indexToRemove) => {
    const updatedAccounts = formData.bankAccounts.filter((_, i) => i !== indexToRemove);
    const updatedErrors = errors.filter((_, i) => i !== indexToRemove);
    setFormData({ ...formData, bankAccounts: updatedAccounts });
    setErrors(updatedErrors);
  };

  const handleAddMore = () => {
    setFormData({
      ...formData,
      bankAccounts: [
        ...formData.bankAccounts,
        {
          accountHolderName: '',
          accountNumber: '',
          bankName: '',
          bankBranch: '',
          accountType: '',
          ifscCode: '',
        },
      ],
    });

    setErrors([...errors, {}]);
  };

  const handleSubmit = async (e) => {
    if (validate()) {
     e.preventDefault();
    setLoading(true);
    console.log('formData',formData)
  
    const adminData = JSON.parse(localStorage.getItem("shippingData"));
    if (!adminData?.project?.active_panel === "admin") {
        localStorage.clear("shippingData");
        router.push("/admin/auth/login");
        return;
    }
  
    const token = adminData?.security?.token;
    if (!token) {
        router.push("/admin/auth/login");
        return;
    }
  
    try {
        Swal.fire({
            title: 'Creating Supplier...',
            text: 'Please wait while we save your Supplier.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
  
        const url = "http://localhost:3001/api/supplier"; // Ensure the URL is correct
        const form = new FormData();
        for (const key in formData) {
          const value = formData[key];
        
          if (value === null || value === undefined || value === '') continue;
        
          // ✅ Special handling for date fields
          if (key === 'dateOfBirth' && value) {
            const dateObj = new Date(value);
            const day = String(dateObj.getDate()).padStart(2, '0'); // e.g., "26"
            const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // e.g., "04"
            const year = dateObj.getFullYear(); // e.g., "2025"
            const formattedDate = `${day}-${month}-${year}`; // 👉 "26-04-2025"
            form.append(key, formattedDate);
          }
        
          // ✅ Files
          else if (value instanceof File) {
            form.append(key, value);
          }
        
          // ✅ bankAccounts array
          else if (key === 'bankAccounts') {
            form.append('bankAccounts', JSON.stringify(value));
          }
        
          // ✅ Other arrays
          else if (Array.isArray(value)) {
            form.append(key, JSON.stringify(value));
          }
        
          // ✅ Objects
          else if (typeof value === 'object') {
            form.append(key, JSON.stringify(value));
          }
        
          // ✅ Strings, numbers
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
                title: "admin Created",
                text: `The admin has been created successfully!`,
                showConfirmButton: true,
            }).then((res) => {
                if (res.isConfirmed) {
                    setFormData({});
                    setFiles(null);
                    router.push("/admin/supplier/list");
                }
            });
        }
        router.push("/admin/supplier/list");

    } catch (error) {
        console.error("Error:", error);
        Swal.close();
        Swal.fire({
            icon: "error",
            title: "Submission Error",
            text: error.message || "Something went wrong. Please try again.",
        });
        setErrors(error.message || "Submission failed.");
    } finally {
        setLoading(false);
    }    }
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
  
              const url = `http://localhost:3001/api/brand/${id}/image/${index}`;
  
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
                          fetchbrand(); // Refresh formData with updated images
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
  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const imageKey = `cancelledChequeImage${index}`;
      setFormData((prev) => ({
        ...prev,
        [imageKey]:file,
      }));
    }
  };
 
  return (
    <div className="bg-white lg:p-10 p-3 rounded-tr-none rounded-tl-none rounded-2xl">
      {formData.bankAccounts.map((account, index) => (
        <div key={index} className="grid lg:grid-cols-3 gap-4 py-5">
          {[ 
            ['Account Holder Name', 'accountHolderName'],
            ['Account Number', 'accountNumber'],
            ['Bank Name', 'bankName'],
            ['Bank Branch', 'bankBranch'],
            ['IFSC Code', 'ifscCode'],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="block text-[#232323] font-bold mb-1">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={name}
                value={account[name]}
                onChange={(e) => handleChange(index, e)}
                className={`w-full p-3 border rounded-lg font-bold ${
                  errors[index]?.[name]
                    ? 'border-red-500 text-red-500'
                    : 'border-[#DFEAF2] text-[#718EBF]'
                }`}
              />
              {errors[index]?.[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[index][name]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-[#232323] font-bold mb-1">
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              name="accountType"
              value={account.accountType}
              onChange={(e) => handleChange(index, e)}
              className={`w-full p-3 border rounded-lg font-bold ${
                errors[index]?.accountType
                  ? 'border-red-500 text-red-500'
                  : 'border-[#DFEAF2] text-[#718EBF]'
              }`}
            >
              <option value="">Select Type</option>
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
              <option value="Business">Business</option>
            </select>
            {errors[index]?.accountType && (
              <p className="text-red-500 text-sm mt-1">{errors[index].accountType}</p>
            )}
          </div>

          <div>
            <label className="block text-[#232323] font-bold mb-1">
              Cancelled Cheque Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e,index)}
              className={`w-full p-3 border rounded-lg font-bold ${
                errors[index]?.cancelledChequeImage_0
                  ? 'border-red-500 text-red-500'
                  : 'border-[#DFEAF2] text-[#718EBF]'
              }`}
            />
              {formData?.cancelledChequeImage_0 && (
                  <div className="mt-2">
                      <Swiper
                          key={formData.id}
                          modules={[Navigation]}
                          slidesPerView={2}
                          loop={formData.image?.split(',').length > 1}
                          navigation={true}
                          className="mySwiper w-full ms-2"
                      >
                          {formData.image?.split(',').map((img, index) => (
                              <SwiperSlide key={index} className="relative gap-3">
                                  {/* Delete Button */}
                                  <button
                                      type="button"
                                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                                      onClick={() => {
                                          Swal.fire({
                                              title: 'Are you sure?',
                                              text: `Do you want to delete this image?`,
                                              icon: 'warning',
                                              showCancelButton: true,
                                              confirmButtonColor: '#d33',
                                              cancelButtonColor: '#3085d6',
                                              confirmButtonText: 'Yes, delete it!'
                                          }).then((result) => {
                                              if (result.isConfirmed) {

                                                  handleImageDelete(index); // Call your delete function
                                              }
                                          });
                                      }}
                                  >
                                      ✕
                                  </button>

                                  {/* Image */}
                                  <Image
                                      src={`https://placehold.co/600x400?text=${index + 1}` || img.trim()}
                                      alt={`Image ${index + 1}`}
                                      width={500}
                                      height={500}
                                      className="me-3 p-2 object-cover rounded"
                                  />
                              </SwiperSlide>
                          ))}
                      </Swiper>
                  </div>

              )}
            {errors[index]?.cancelledChequeImage && (
              <p className="text-red-500 text-sm mt-1">{errors[index].cancelledChequeImage}</p>
            )}
          </div>

          {/* Only show Remove button if it's not the first (index 0) account */}
          {index !== 0 && formData.bankAccounts.length > 1 && (
            <div className="lg:col-span-3 flex justify-end mt-2">
              <button
                onClick={() => handleRemove(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddMore}
        className="mb-5 px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        + Add More
      </button>

      <div className="flex space-x-4 mt-6">
        <button onClick={handleSubmit} className="px-4 py-2 bg-orange-500 text-white rounded-lg">
          Save
        </button>
        <button className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
      </div>

      <BankAccountList />
    </div>
  );
};

export default AccountInfo;
