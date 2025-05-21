'use client';

import { useContext, useEffect, useState, useCallback } from 'react';
import { ProfileContext } from './ProfileContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Select from 'react-select';

const BusinessInfo = () => {
  const [cityData, setCityData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const { formData, setFormData, businessErrors, setBusinessErrors, setActiveTab, validateBusiness, requiredFields, countryData, fetchCountry } = useContext(ProfileContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [stateLoading, setStateLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      // Handle file input (multiple files)
      setFormData((prev) => ({
        ...prev,
        [name]: Array.from(files), // Store files as an array (e.g., for 'panCardImage')
      }));
    } else {
      // Handle text input
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Store value for text-based inputs
      }));
    }

    // Optional: Fetch states and cities based on country and state selections
    if (name === "billingCountry" && value) {
      fetchState(value);
    }

    if (name === "billingState" && value) {
      fetchCity(value);
    }

    // Clear the field-specific error message
    setBusinessErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchCountry();
      setLoading(false);
    };

    fetchData();
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
      setStateLoading(true);
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
      setStateLoading(false);
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
      setCityLoading(true);
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
      setCityLoading(false);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateBusiness()) return;

    setLoading(true);

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
        didOpen: () => Swal.showLoading()
      });

      const url = "http://localhost:3001/api/supplier";
      const form = new FormData();

      for (const key in formData) {
        const value = formData[key];

        if (value === null || value === undefined || value === '') continue;

        if (
          ['panCardImage', 'gstDocument', 'additionalDocumentUpload', 'documentImage', 'aadharCardImage', 'profilePicture'].includes(key)
        ) {
          if (Array.isArray(value)) {
            value.forEach(file => form.append(key, file, file.name));
          } else if (value instanceof File) {
            form.append(key, value, value.name);
          }
        } else if (key === 'dateOfBirth' && value) {
          const formattedDate = new Date(value).toLocaleDateString('en-GB');
          form.append(key, formattedDate);
        } else if (value instanceof FileList) {
          Array.from(value).forEach(file => form.append(key, file));

        } else if (Array.isArray(value) || typeof value === 'object') {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, value);
        }
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: form,
      });

      const result = await response.json();
      if (!response.ok) {
        Swal.close();

        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: result.message || result.error || "An error occurred",
        });

        if (result.error && typeof result.error === 'object') {
          const entries = Object.entries(result.error);
          let focused = false;

          entries.forEach(([key, message]) => {
            setErrors((prev) => ({
              ...prev,
              [key]: message,
            }));

            if (!focused) {
              const tab = getTabByFieldName(key); // make sure this is imported or defined above
              if (tab) setActiveTab(tab);

              setTimeout(() => {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) input.focus();
              }, 300);

              focused = true;
            }
          });
        }

        throw new Error(result.message || result.error || "Submission failed");
      }

      Swal.close();

      if (result) {
        Swal.fire({
          icon: "success",
          title: "Supplier Created",
          text: `The supplier has been created successfully!`,
          showConfirmButton: true,
        }).then((res) => {
          if (res.isConfirmed) {
            setFormData({});
            router.push("/admin/supplier/list");
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

      setAccountErrors({});
    } finally {
      setLoading(false);
    }
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
    <form onSubmit={handleSubmit} className="bg-white lg:p-10 p-3 md:w-10/12 rounded-tl-none rounded-tr-none rounded-2xl">
      <div className="grid lg:grid-cols-3 py-5 gap-4">
        {/* Company Name, Brand Name, Short Brand Name */}
        <div>
          {renderLabel('Registered Company Name', 'companyName')}
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ''}
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
            value={formData.brandName || ''}
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
            value={formData.brandShortName || ''}
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
          value={formData.billingAddress || ''}
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
            value={formData.billingPincode || ''}
            onChange={handleChange}
            className={inputClasses('billingPincode')}
          />
          {renderError('billingPincode')}
        </div>


        <div className='relative'>
          {renderLabel('Country', 'billingCountry')}

          <Select
            name="billingCountry"
            value={countryOptions.find(opt => opt.value === formData.billingCountry) || null}
            onChange={(selected) => handleChange({ target: { name: "billingCountry", value: selected?.value } })}
            options={countryOptions}
            isDisabled={loading}
            placeholder="Select Country"
          />
          {loading && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <div className="loader border-t-transparent border-gray-400 border-2 w-5 h-5 rounded-full animate-spin"></div>
            </div>
          )}
          {renderError('billingCountry')}
        </div>

        <div className='relative'>
          {renderLabel('State', 'billingState')}
          <Select
            name="billingState"
            value={stateOptions.find(opt => opt.value === formData.billingState) || null}
            onChange={(selected) => handleChange({ target: { name: "billingState", value: selected?.value } })}
            options={stateOptions}
            isDisabled={stateLoading}
            placeholder="Select State"
          />
          {stateLoading && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <div className="loader border-t-transparent border-gray-400 border-2 w-5 h-5 rounded-full animate-spin"></div>
            </div>
          )}
          {renderError('billingState')}
        </div>


      </div>

      {/* Business Type, Client Entry Type */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className='relative'>
          {renderLabel('City', 'billingCity')}

          <Select
            name="billingCity"
            value={cityOptions.find(opt => opt.value === formData.billingCity) || null}
            onChange={(selected) => handleChange({ target: { name: "billingCity", value: selected?.value } })}
            options={cityOptions}
            isDisabled={cityLoading}
            placeholder="Select City"
          />
          {cityLoading && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <div className="loader border-t-transparent border-gray-400 border-2 w-5 h-5 rounded-full animate-spin"></div>
            </div>
          )}
          {renderError('billingCity')}
        </div>
        <div>
          {renderLabel('Business Type', 'businessType')}
          <select
            name="businessType"
            value={formData.businessType || ''}
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
            value={formData.clientEntryType || ''}
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
            { label: 'Upload GST Document', name: 'gstDocument', type: 'file' },
            { label: 'Name on PAN Card', name: 'panCardHolderName' },
            { label: 'Name Aadhar Card ID', name: 'aadharCardHolderName' },
          ].map(({ label, name, type = 'text' }) => (
            <div key={name}>
              {renderLabel(label, name)}
              <input
                type={type}
                name={name}
                {...(type === 'file' ? { multiple: true, onChange: handleChange } : { value: formData[name] || '', onChange: handleChange })}
                className={inputClasses(name)}
              />
              {renderError(name)}
            </div>
          ))}
        </div>
      </div>

      {/* PAN and Aadhar Upload */}
      <div className="grid md:grid-cols-2 py-5 gap-3">
        {['panCardImage', 'aadharCardImage'].map((name) => (
          <div key={name}>
            {renderLabel(
              name === 'panCardImage' ? 'Upload PAN card image' : 'Upload Aadhar card image',
              name
            )}
            <input
              type="file"
              name={name}
              multiple
              onChange={handleChange}
              className={inputClasses(name)}
            />
          </div>
        ))}
      </div>

      {/* Additional Documents */}
      <h3 className="font-semibold text-[#FF702C] underline text-sm pt-5">
        Additional Supporting Document
      </h3>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 pt-3">
        {[
          { label: 'Document to upload', name: 'additionalDocumentUpload', type: 'file' },
          { label: 'Document ID', name: 'documentId' },
          { label: 'Name of document', name: 'documentName' },
          { label: 'Document Image', name: 'documentImage', type: 'file' },
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            {renderLabel(label, name)}
            <input
              type={type}
              name={name}
              {...(type === 'file' ? { multiple: true, onChange: handleChange } : { value: formData[name] || '', onChange: handleChange })}
              className={inputClasses(name)}
            />
          </div>
        ))}
      </div>

      <div className="py-5">
        <button type="submit" className="px-5 p-2 bg-[#FF702C] text-white py-3 rounded-xl">
          Submit
        </button>
      </div>
    </form>

  );
};

export default BusinessInfo;