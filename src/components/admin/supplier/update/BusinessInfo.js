'use client';

import { useContext, useEffect, useState, useCallback } from 'react';
import { ProfileEditContext } from './ProfileEditContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
const BusinessInfo = () => {
  const { formData, setFormData,stateData,cityData, setCityData, setStateData, setActiveTab, countryData, fetchCountry } = useContext(ProfileEditContext);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const requiredFields = {
    companyName: 'Registered Company Name is required',
    brandName: 'Brand Name is required',
    billingAddress: 'Billing Address is required',
    billingPincode: 'Pincode is required',
    billingCountry: 'Country is required',
    billingState: 'State is required',
    billingCity: 'City is required',
    businessType: 'Business Type is required',
    clientEntryType: 'Client Entry Type is required',
    gstNumber: 'GST Number is required',
    companyPanNumber: 'PAN Number is required',
    aadharNumber: 'Aadhar Number is required',
    panCardHolderName: 'PAN Card Holder Name is required',
    aadharCardHolderName: 'Aadhar Card Holder Name is required',
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files?.length ? files : value, // Store multiple files if selected
    }));

    if (name === "billingCountry" && value) {
      fetchState(value);
    }

    if (name === "billingState" && value) {
      fetchCity(value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  useEffect(() => {
    fetchCountry();
  }, [fetchCountry]);

  const fetchState = useCallback(async (id) => {
    const adminData = JSON.parse(localStorage.getItem("shippingData"));
    if (adminData?.project?.active_panel !== "admin") {
      localStorage.removeItem("shippingData");
      router.push("/admin/auth/login");
      return;
    }

    const admintoken = adminData?.security?.token;
    if (!admintoken) {
      router.push("/admin/auth/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/location/country/${id}/states`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admintoken}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: result.message || result.error || "Your session has expired. Please log in again.",
        });
        throw new Error(result.message || result.error || "Something Wrong!");
      }

      setStateData(result?.states || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchCity = useCallback(async (id) => {
    const adminData = JSON.parse(localStorage.getItem("shippingData"));
    if (adminData?.project?.active_panel !== "admin") {
      localStorage.removeItem("shippingData");
      router.push("/admin/auth/login");
      return;
    }

    const admintoken = adminData?.security?.token;
    if (!admintoken) {
      router.push("/admin/auth/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/location/state/${id}/cities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admintoken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: result.message || result.error || "Your session has expired. Please log in again.",
        });
        throw new Error(result.message || result.error || "Something Wrong!");
      }

      setCityData(result?.cities || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);
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
    
                const url = `http://localhost:3001/api/supplier/${id}/company/${companyId}/image/${index}?type=${type}`;
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    for (let key in requiredFields) {
      if (!formData[key] || formData[key].toString().trim() === '') {
        newErrors[key] = requiredFields[key];
      }
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setActiveTab('account-info');
    }
  };

  const labelClasses = (field) => "block text-[#232323] font-bold mb-1";
  const inputClasses = (field) =>
    `w-full p-3 border rounded-lg font-bold ${errors[field] ? 'border-red-500' : 'border-[#DFEAF2]'} text-[#718EBF]`;

  const renderLabel = (label, field) => (
    <label className={labelClasses(field)}>
      {label}
      {requiredFields[field] && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const renderError = (field) =>
    errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>;

  return (
<form onSubmit={handleSubmit} className="bg-white lg:p-10 p-3 rounded-2xl">
  <div className="grid lg:grid-cols-3 py-5 gap-4">
    {/* Company Name, Brand Name, Short Brand Name */}
    <div>
      {renderLabel('Registered Company Name', 'companyName')}
      <input
        type="text"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        className={inputClasses('companyName')}
      />
      {renderError('companyName')}
    </div>

    <div>
      {renderLabel('Brand Name', 'brandName')}
      <input
        type="text"
        name="brandName"
        value={formData.brandName}
        onChange={handleChange}
        className={inputClasses('brandName')}
      />
      {renderError('brandName')}
    </div>

    <div>
      {renderLabel('Short Brand Name')}
      <input
        type="text"
        name="brandShortName"
        value={formData.brandShortName}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
      />
    </div>
  </div>

  {/* Billing Address */}
  <div>
    {renderLabel('Company Billing Address', 'billingAddress')}
    <input
      type="text"
      name="billingAddress"
      value={formData.billingAddress}
      onChange={handleChange}
      className={inputClasses('billingAddress')}
    />
    {renderError('billingAddress')}
  </div>

  {/* Pincode, State, City */}
  <div className="grid lg:grid-cols-3 py-5 gap-4">
    <div>
      {renderLabel('Pincode', 'billingPincode')}
      <input
        type="text"
        name="billingPincode"
        value={formData.billingPincode}
        onChange={handleChange}
        className={inputClasses('billingPincode')}
      />
      {renderError('billingPincode')}
    </div>

    <div>
      {renderLabel('Country', 'billingCountry')}
      <select
        name="billingCountry"
        value={formData.billingCountry}
        onChange={handleChange}
        className={inputClasses('billingCountry')}
      >
        <option value="">Select Country</option>
        {countryData.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
      {renderError('billingCountry')}
    </div>

    <div>
      {renderLabel('State', 'billingState')}
      <select
        name="billingState"
        value={formData.billingState}
        onChange={handleChange}
        className={inputClasses('billingState')}
      >
        <option value="">Select State</option>
        {stateData?.map((state) => (
          <option key={state.id} value={state.id}>
            {state.name}
          </option>
        ))}
      </select>
      {renderError('billingState')}
    </div>

 
  </div>

  {/* Business Type, Client Entry Type */}
  <div className="grid lg:grid-cols-3 gap-4">
  <div>
      {renderLabel('City', 'billingCity')}
      <select
        name="billingCity"
        value={formData.billingCity}
        onChange={handleChange}
        className={inputClasses('billingCity')}
      >
        <option value="">Select City</option>
        {cityData?.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
      {renderError('billingCity')}
    </div>
    <div>
      {renderLabel('Business Type', 'businessType')}
      <select
        name="businessType"
        value={formData.businessType}
        onChange={handleChange}
        className={inputClasses('businessType')}
      >
        <option value="">Select</option>
        <option value="Business">Business</option>
        <option value="Freelancer">Freelancer</option>
        <option value="Startup">Startup</option>
      </select>
      {renderError('businessType')}
    </div>

    <div>
      {renderLabel('Form of Client’s Entity', 'clientEntryType')}
      <select
        name="clientEntryType"
        value={formData.clientEntryType}
        onChange={handleChange}
        className={inputClasses('clientEntryType')}
      >
        <option value="">Select</option>
        <option value="Entrepreneurship">Entrepreneurship</option>
        <option value="Partnership">Partnership</option>
        <option value="Corporation">Corporation</option>
      </select>
      {renderError('clientEntryType')}
    </div>
  </div>

  {/* KYC Documents */}
  <div className="mt-6">
    <h3 className="font-semibold text-[#FF702C] py-5 underline text-sm">
      KYC Details – Provide minimum of 2 documents
    </h3>
    <div className="grid lg:grid-cols-3 gap-4 mt-2">
  {[
    { label: 'GST Number', name: 'gstNumber' },
    { label: 'Company PAN Card ID', name: 'companyPanNumber' },
    { label: 'Aadhar Card ID', name: 'aadharNumber' },
    { label: 'Name on PAN Card', name: 'panCardHolderName' },
    { label: 'Name Aadhar Card ID', name: 'aadharCardHolderName' }
  ].map(({ label, name, type = 'text' }) => (
    <div key={name}>
      {renderLabel(label, name)}
      <input
        type={type}
        name={name}
        {...(type === 'file' ? { multiple: true, onChange: handleChange } : { value: formData[name], onChange: handleChange })}
        className={inputClasses(name)}
      />
      {renderError(name)}
    </div>
  ))}
</div>

{/* Separate file input for "Upload GST Document" */}
<div className="mt-6">
  <div className="mb-4">
    {renderLabel('Upload GST Document', 'gstDocument')}
    <input
      type="file"
      name="gstDocument"
      multiple
      onChange={handleChange}
      className={inputClasses('gstDocument')}
    />
    {renderError('gstDocument')}
  </div>

  {/* File preview for GST Document */}
  {formData.gstDocument?.length > 0 && (
      <Swiper
      key={formData.id}
      modules={[Navigation]}
      slidesPerView={2}
      loop={formData.gstDocument?.split(',').length > 1}
      navigation={true}
      className="mySwiper w-full ms-2"
    >
      {formData.gstDocument?.split(',').map((img, index) => (
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
  )}
</div>

  </div>

  {/* PAN and Aadhar Upload */}
  <div className="grid md:grid-cols-2 py-5 gap-3">
  {/* PAN Card Image Upload */}
  <div>
    {renderLabel('Upload PAN card image', 'panCardImage')}
    <input
      type="file"
      name="panCardImage"
      multiple
      onChange={handleChange}
      className={inputClasses('panCardImage')}
    />
    <div className="py-6">
      <div className="mt-2">
        <Swiper
          key={formData.id}
          modules={[Navigation]}
          slidesPerView={2}
          loop={formData.panCardImage?.split(',').length > 1}
          navigation={true}
          className="mySwiper w-full ms-2"
        >
          {formData.panCardImage?.split(',').map((img, index) => (
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
    </div>
  </div>

  {/* Aadhar Card Image Upload */}
  <div>
    {renderLabel('Upload Aadhar card image', 'aadharCardImage')}
    <input
      type="file"
      name="aadharCardImage"
      multiple
      onChange={handleChange}
      className={inputClasses('aadharCardImage')}
    />
    <div className="py-6">
      <div className="mt-2">
        <Swiper
          key={formData.id}
          modules={[Navigation]}
          slidesPerView={2}
          loop={formData.aadharCardImage?.split(',').length > 1}
          navigation={true}
          className="mySwiper w-full ms-2"
        >
          {formData.aadharCardImage?.split(',').map((img, index) => (
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
    </div>
  </div>
</div>


  {/* Additional Documents */}
  <h3 className="font-semibold text-[#FF702C] underline text-sm pt-5">
    Additional Supporting Document
  </h3>

  <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 pt-3">
  {/* Other fields */}
  {[
    { label: 'Document ID', name: 'documentId' },
    { label: 'Name of document', name: 'documentName' }
  ].map(({ label, name, type = 'text' }) => (
    <div key={name}>
      {renderLabel(label, name)}
      <input
        type={type}
        name={name}
        {...(type === 'file' ? { multiple: true, onChange: handleChange } : { value: formData[name], onChange: handleChange })}
        className={inputClasses(name)}
      />
    </div>
  ))}

  {/* Document to upload with Swiper preview */}
  <div>
    {renderLabel('Document to upload', 'additionalDocumentUpload')}
    <input
      type="file"
      name="additionalDocumentUpload"
      multiple
      onChange={handleChange}
      className={inputClasses('additionalDocumentUpload')}
    />

    <div className="py-6">
      <div className="mt-2">
      <Swiper
          key={formData.id}
          modules={[Navigation]}
          slidesPerView={2}
          loop={formData.additionalDocumentUpload?.split(',').length > 1}
          navigation={true}
          className="mySwiper w-full ms-2"
        >
          {formData.additionalDocumentUpload?.split(',').map((img, index) => (
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
    </div>
  </div>

  {/* Document Image */}
  <div>
    {renderLabel('Document Image', 'documentImage')}
    <input
      type="file"
      name="documentImage"
      multiple
      onChange={handleChange}
      className={inputClasses('documentImage')}
    />

    <div className="py-6">
      <div className="mt-2">
      <Swiper
          key={formData.id}
          modules={[Navigation]}
          slidesPerView={2}
          loop={formData.documentImage?.split(',').length > 1}
          navigation={true}
          className="mySwiper w-full ms-2"
        >
          {formData.documentImage?.split(',').map((img, index) => (
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
    </div>
  </div>
</div>


  <div className="py-5">
    <button type="submit" className="px-5 p-2 bg-[#FF702C] text-white py-3 rounded-xl">
      Next
    </button>
  </div>
</form>


  );
};

export default BusinessInfo;