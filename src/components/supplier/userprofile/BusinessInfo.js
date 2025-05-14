'use client';

import { useContext, useEffect, useState, useCallback } from 'react';
import { ProfileContext } from './ProfileContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Select from 'react-select';

const BusinessInfo = () => {
  const { formData, requiredFields,businessErrors,validateBusiness, setBusinessErrors,setFiles,setFormData,stateData,cityData, setCityData, setStateData, setActiveTab, countryData, fetchCountry } = useContext(ProfileContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    // Handle file input (multiple files)
    if (files) {
      setFiles((prev) => ({
        ...prev,
        [name]: Array.from(files), // Store files as an array
      }));
    } else {
      // Handle text input (single value)
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Store value for text-based inputs
      }));
    }
  
    // Optional: Fetch states and cities based on country and state selections
    if (name === "billingCountry" && value) {
      fetchState(value); // fetch states based on country selection
    }
  
    if (name === "billingState" && value) {
      fetchCity(value); // fetch cities based on state selection
    }
  
    // Clear the field-specific error message
    setBusinessErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', // Reset error for the field
    }));
  };
  
  useEffect(() => {
    fetchCountry();
  }, [fetchCountry]);

  const fetchState = useCallback(async (id) => {
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
        `https://sleeping-owl-we0m.onrender.com/api/location/country/${id}/states`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${suppliertoken}`,
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
      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/location/state/${id}/cities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${suppliertoken}`,
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
    const handleImageDelete = async (index,type) => {
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
    
                const url = `https://sleeping-owl-we0m.onrender.com/api/supplier/${formData.id}/company/${formData.companyid}/image/${index}?type=${type}`;
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
            } finally {
                setLoading(false);
            }
        };

        const handleSubmit = (e) => {
          e.preventDefault();
          if (validateBusiness()) {
            setActiveTab('account-info');
          }
          setBusinessErrors()
        };
  const labelClasses = (field) => "block text-[#232323] font-bold mb-1";
  const inputClasses = (field) =>
    `w-full p-3 border rounded-lg font-bold ${businessErrors[field] ? 'border-red-500' : 'border-[#DFEAF2]'} text-[#718EBF]`;

  const renderLabel = (label, field) => (
    <label className={labelClasses(field)}>
      {label}
      {requiredFields[field] && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const renderError = (field) =>
    businessErrors[field] && <p className="text-red-500 text-sm mt-1">{businessErrors[field]}</p>;
  const countryOptions = countryData.map((country) => ({
    value: country.id,
    label: country.name,
  }));
  
  const stateOptions = stateData?.map((state) => ({
    value: state.id,
    label: state.name,
  }));
  
  const cityOptions = cityData?.map((city) => ({
    value: city.id,
    label: city.name,
  }));
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
         
          <Select
           name="billingCountry"
           value={countryOptions.find(opt => opt.value === formData.billingCountry) || null}
           onChange={(selected) => handleChange({ target: { name: "billingCountry", value: selected?.value } })}
           options={countryOptions}
           placeholder="Select Country"
         />
         {renderError('billingCountry')}
       </div>
   
       <div>
         {renderLabel('State', 'billingState')}
         <Select
           name="billingState"
           value={stateOptions.find(opt => opt.value === formData.billingState) || null}
           onChange={(selected) => handleChange({ target: { name: "billingState", value: selected?.value } })}
           options={stateOptions}
          
           placeholder="Select State"
         />
         {renderError('billingState')}
       </div>

  
  </div>

  {/* Business Type, Client Entry Type */}
  <div className="grid lg:grid-cols-3 gap-4">
  <div>
        {renderLabel('City', 'billingCity')}
        
        <Select
          name="billingCity"
          value={cityOptions.find(opt => opt.value === formData.billingCity) || null}
          onChange={(selected) => handleChange({ target: { name: "billingCity", value: selected?.value } })}
          options={cityOptions}
         
          placeholder="Select City"
        />
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
    slidesPerView={5}
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

                            handleImageDelete(index,'gstDocument'); // Call your delete function
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
      {formData.panCardImage.length>0 && (
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
                      handleImageDelete(index,'panCardImage'); // Call your delete function
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
      {formData.aadharCardImage.length>0 && (

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
                      handleImageDelete(index,'aadharCardImage'); // Call your delete function
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
      {formData?.additionalDocumentUpload.length >0 && (
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
                      handleImageDelete(index,'additionalDocumentUpload'); // Call your delete function
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
    {formData?.documentImage.length >0 && (

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
                      handleImageDelete(index,'documentImage'); // Call your delete function
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