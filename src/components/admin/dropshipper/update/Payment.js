'use client';

import { useContext, useState } from 'react';
import { useRouter ,useSearchParams} from 'next/navigation';
import Swal from 'sweetalert2';
import { DropshipperProfileContext } from '../DropshipperProfileContext';
import Image from 'next/image';
import { HashLoader } from 'react-spinners';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
const Payment = () => {
   const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { formData, setFormData,fetchSupplier,setActiveTab } = useContext(DropshipperProfileContext);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
      if (loading) {
          return (
              <div className="flex items-center justify-center h-[80vh]">
                  <HashLoader size={60} color="#F97316" loading={true} />
              </div>
          );
      }

  const handleChange = (index = null, e) => {
    const { name, value, files } = e.target;
  
    if (['panCardImage', 'aadharCardImage', 'gstDocument'].includes(name)) {
      if (files && files.length > 0) {
        setFiles((prev) => ({
          ...prev,
          [name]: Array.from(files), // Store all selected files
        }));
      }
    } else if (index !== null && name) {
      const updatedAccounts = [...formData.bankAccounts];
      updatedAccounts[index][name] = value;
      setFormData((prev) => ({ ...prev, bankAccounts: updatedAccounts }));
    } else if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const handleAddBankAccount = () => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: [
        ...prev.bankAccounts,
        {
          accountHolderName: '',
          accountNumber: '',
          bankName: '',
          bankBranch: '',
          ifscCode: '',
          accountType: '',
          paymentMethod: '',
        },
      ],
    }));
  };
     const handleImageDelete = async (index,type) => {
              setLoading(true);
      
              const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
              if (dropshipperData?.project?.active_panel !== "admin") {
                  localStorage.removeItem("shippingData");
                  router.push("/admin/auth/login");
                  return;
              }
      
              const token = dropshipperData?.security?.token;
              if (!token) {
                  router.push("/admin/auth/login");
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
      
                  const url = `https://sleeping-owl-we0m.onrender.com/api/dropshipper/${formData.id}/company/${formData.companyid}/image/${index}?type=${type}`;
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
                      fetchSupplier();
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

  const handleRemove = (index) => {
    const updatedAccounts = formData.bankAccounts.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, bankAccounts: updatedAccounts }));
  };

  const validate = () => {
    const newErrors = {};

    formData.bankAccounts.forEach((account, index) => {
      if (!account.accountHolderName) newErrors[`accountHolderName-${index}`] = 'Required';
      if (!account.accountNumber) newErrors[`accountNumber-${index}`] = 'Required';
      if (!account.bankName) newErrors[`bankName-${index}`] = 'Required';
      if (!account.bankBranch) newErrors[`bankBranch-${index}`] = 'Required';
      if (!account.ifscCode) newErrors[`ifscCode-${index}`] = 'Required';
      if (!account.paymentMethod) newErrors[`paymentMethod-${index}`] = 'Required';
    });

    if (!formData.gstNumber) newErrors.gstNumber = 'Required';
    if (!formData.panCardHolderName) newErrors.panCardHolderName = 'Required';
    if (!formData.aadharCardHolderName) newErrors.aadharCardHolderName = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);

  const adminData = JSON.parse(localStorage.getItem('shippingData'));
  if (adminData?.project?.active_panel !== 'admin') {
    localStorage.clear();
    router.push('/admin/auth/login');
    return;
  }

  const token = adminData?.security?.token;
  if (!token) {
    router.push('/admin/auth/login');
    return;
  }

  try {
    Swal.fire({
      title: 'Updating Dropshipper...',
      text: 'Please wait while we save your changes.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const url = `https://sleeping-owl-we0m.onrender.com/api/dropshipper/${id}`;
    const form = new FormData();

    // Append uploaded files (new)

       for (const key in files) {
          const value = files[key];
          console.log('key',key)

          // Skip null, undefined, or empty values
          if (value === null || value === undefined || value === '') continue;
      
          // Special handling for file inputs
          if (['panCardImage', 'gstDocument', 'aadharCardImage', 'profilePicture'].includes(key)) {
              if (Array.isArray(value)) {
                  // Append each file in the array
                  value.forEach(file => {
                      form.append(key, file, file.name);
                  });
              } else if (value instanceof File) {
                  // Single file input
                  form.append(key, value, value.name);
              }
          }
      }
        for (const key in formData) {
          const value = formData[key];
          if (value === null || value === undefined || value === '') continue;
          if (['panCardImage', 'gstDocument', 'aadharCardImage', 'profilePicture'].includes(key)) {
            continue;
        }
    }
    // Append other formData values
    for (const key in formData) {
      const value = formData[key];

      if (value === null || value === undefined || value === '') continue;

      if (key === 'bankAccounts') {
        form.append('bankAccounts', JSON.stringify(value));
      } else if (
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        form.append(key, JSON.stringify(value));
      } else if (
        !['panCardImage', 'gstDocument', 'aadharCardImage', 'profilePicture'].includes(key)
      ) {
        form.append(key, value);
      }
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    Swal.close();

    if (!response.ok) {
      const errorMessage = await response.json();
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: errorMessage.message || errorMessage.error || 'An error occurred',
      });
      throw new Error(errorMessage.message || errorMessage.error || 'Update failed');
    }

    const result = await response.json();

    if (result) {
      Swal.fire({
        icon: 'success',
        title: 'Dropshipper Updated',
        text: 'The dropshipper has been updated successfully!',
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          setFormData({});
          router.push('/admin/dropshipper/list');
        }
      });
    }
    setActiveTab('account_details');
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Submission Error',
      text: error.message || 'Something went wrong. Please try again.',
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-white lg:p-10 p-3 rounded-2xl">
      <h3 className="font-semibold text-[#FF702C] underline text-sm">Bank Account Details</h3>

      {Array.isArray(formData.bankAccounts) &&
  formData.bankAccounts.map((account, index) => (
        <div key={index} className="grid lg:grid-cols-3 gap-4 py-5 border p-3 rounded-md mb-3">
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
                value={account[name] || ''}
                onChange={(e) => handleChange(index, e)}
                className={`w-full p-3 border rounded-lg font-bold ${
                  errors[`${name}-${index}`] ? 'border-red-500 text-red-500' : 'border-[#DFEAF2] text-[#718EBF]'
                }`}
              />
              {errors[`${name}-${index}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`${name}-${index}`]}</p>
              )}
            </div>
          ))}

          {/* Account Type */}
          <div>
            <label className="block text-[#232323] font-bold mb-1">
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              name="accountType"
              value={account.accountType || ''}
              onChange={(e) => handleChange(index, e)}
              className="w-full p-3 border rounded-lg font-bold border-[#DFEAF2] text-[#718EBF]"
            >
              <option value="">Select Type</option>
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
              <option value="Business">Business</option>
            </select>
          </div>

          {/* Preferred Payment Method */}
          <div>
            <label className="block text-[#232323] font-bold mb-1">
              Preferred Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              name="paymentMethod"
              value={account.paymentMethod || ''}
              onChange={(e) => handleChange(index, e)}
              className="w-full p-3 border rounded-lg font-bold border-[#DFEAF2] text-[#718EBF]"
            >
              <option value="">Select Method</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Paypal">Paypal</option>
              <option value="Stripe">Stripe</option>
              <option value="COD">COD</option>
            </select>
          </div>

          {/* Remove Button */}
          {index > 0 && (
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="bg-red-500 text-white underline px-4 py-2 rounded"
              >
                Remove Account
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="py-4">
        <button
          type="button"
          onClick={handleAddBankAccount}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Add More Bank Account
        </button>
      </div>

      {/* KYC Details */}
      <div>
        <h3 className="font-semibold text-[#FF702C] py-5 underline text-sm">KYC Details</h3>
        <div className="grid lg:grid-cols-3 gap-4 mt-2">
          {[
            { name: 'gstNumber', label: 'GST Number' },
            { name: 'panCardHolderName', label: 'Name on PAN Card' },
            { name: 'aadharCardHolderName', label: 'Name on Aadhar Card' },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-[#232323] font-bold mb-1">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={name}
                value={formData[name] || ''}
                onChange={(e) => handleChange(null, e)}
                className={`w-full p-3 border rounded-lg font-bold ${
                  errors[name] ? 'border-red-500' : 'border-[#DFEAF2]'
                } text-[#718EBF]`}
              />
              {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
          ))}

          {/* File Uploads */}
          {['panCardImage', 'aadharCardImage', 'gstDocument'].map((name) => (
  <div key={name} className="mb-6">
    <label className="block text-[#232323] font-bold mb-1">
      {name.replace(/([A-Z])/g, ' $1')} Upload
    </label>
    <input
      type="file"
      name={name}
      multiple
      onChange={(e) => handleChange(name, e)}
      className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
    />

    {formData[name]?.length > 0 && (
      <Swiper
        key={name}
        modules={[Navigation]}
        slidesPerView={2}
        loop={formData[name].split(',').length > 1}
        navigation
        className="mySwiper w-full mt-3"
      >
        {formData[name].split(',').map((img, index) => (
          <SwiperSlide key={index} className="relative">
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
                  confirmButtonText: 'Yes, delete it!',
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleImageDelete(index, name);
                  }
                });
              }}
            >
              ✕
            </button>
            <Image
              src={ `https://placehold.co/600x400?text=${index + 1}` || img.trim()}
              alt={`Image ${index + 1}`}
              width={500}
              height={500}
              className="me-3 p-2 object-cover rounded"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    )}
  </div>
))}

        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Payment;
