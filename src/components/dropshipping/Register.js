"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Select from "react-select";
import { HashLoader } from "react-spinners";
export default function Register() {
  const router = useRouter();
const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    permanentPostalCode: "",
    password: "",
    profilePicture: null,
    referralCode: "",
    phoneNumber: "",
    website: "",
    permanentAddress: "",
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
     if (name === "profilePicture" && files && files[0]) {
    const file = files[0];
   setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));    setImagePreview(URL.createObjectURL(file)); // Set preview
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
    
    if (name == "permanentCountry") {
      fetchStateList(value);
    }
    if (name == "permanentState") {
      fetchCity(value);
    }
  };



  const validate = () => {
    const newErrors = {};
    const {
      name,
      email,
      password,
      phoneNumber,
      website,
      profilePicture,
      permanentCountry,
      permanentState,
      permanentCity,
      permanentPostalCode,
    } = formData;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password.trim()) newErrors.password = "Password is required";
    if (!profilePicture) newErrors.profilePicture = "Profile picture is required";
    if (phoneNumber && !/^[0-9]{7,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 7-15 digits";
    }
    if (website && !/^https?:\/\/[\w.-]+\.[a-z]{2,}/i.test(website)) {
      newErrors.website = "Invalid website URL";
    }
    if (!permanentCountry) newErrors.permanentCountry = "Country is required";
    if (!permanentState) newErrors.permanentState = "State is required";
    if (!permanentCity) newErrors.permanentCity = "City is required";
    if (!permanentPostalCode) newErrors.permanentPostalCode = "permanentPostalCode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Inside handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
    const token = dropshipperData?.security?.token;

    const data = new FormData();
 for (const key in formData) {
  if (formData[key] !== null && formData[key] !== "") {
    if (key === "profilePicture") {
      data.append("profilePicture", formData[key]);
    } else {
      data.append(key, formData[key]);
    }
  }
}



    try {
  const res = await fetch(`http://localhost:3001/api/dropshipper/auth/registration`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create dropshipper");

  Swal.fire({
    title: "Success",
    text: "Dropshipper Registered Successfully!",
    icon: "success",
    confirmButtonText: "Go to Login",
  }).then((result) => {
    if (result.isConfirmed) {
      router.push('/dropshipping/auth/login');
    }
  });

  // Reset form
  setFormData({
    name: "",
    email: "",
    password: "",
    profilePicture: null,
    referralCode: "",
    phoneNumber: "",
    website: "",
    permanentAddress: "",
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",
  });
} catch (err) {
  Swal.fire("Error", err.message, "error");
} finally {
  setLoading(false);
}

  };
console.log('errors',errors)
  const fetchProtected = useCallback(async (url, setter, key, setLoading) => {
    if (setLoading) setLoading(true);

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || result.error || `Failed to fetch ${key}`);
      setter(result[key] || []);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      if (setLoading) setLoading(false);
    }
  }, [router]);

  const fetchCountryAndState = useCallback(() => {
    fetchProtected(
      "http://localhost:3001/api/location/country",
      setCountryData,
      "countries",
      setLoadingCountries
    );
  }, [fetchProtected]);

  const fetchStateList = useCallback((countryId) => {
    fetchProtected(
      `http://localhost:3001/api/location/country/${countryId}/states`,
      setStateData,
      "states",
      setLoadingStates
    );
  }, [fetchProtected]);

  const fetchCity = useCallback((stateId) => {
    fetchProtected(
      `http://localhost:3001/api/location/state/${stateId}/cities`,
      setCityData,
      "cities",
      setLoadingCities
    );
  }, [fetchProtected]);

  const selectOptions = (data) =>
    data.map((item) => ({
      value: item.id || item._id,
      label: item.name,
    }));

  useEffect(() => {
    fetchCountryAndState();
  }, [, fetchCountryAndState]);



  const formFields = [
    { label: "Name", name: "name", type: "text", required: true },
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Phone Number", name: "phoneNumber", type: "text" },
    { label: "Password", name: "password", type: "password", required: true },
    { label: "Website", name: "website", type: "text" },
    { label: "Referral Code", name: "referralCode", type: "text" },
  ];
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <HashLoader size={60} color="#F97316" loading={true} />
      </div>
    );
  }
  return (
<form
  onSubmit={handleSubmit}
  className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8 border border-gray-100"
>
  <h2 className="text-2xl font-bold text-gray-800 mb-4">Create an Account</h2>

  <div className="flex flex-col md:flex-row gap-8">
    {/* Left: Profile Picture */}
    <div className="md:w-1/3 space-y-4">
  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Profile Photo</h3>

  <div className="w-full space-y-3">
    <label className="block text-sm font-medium text-gray-700">
      Upload Profile Picture <span className="text-red-500">*</span>
    </label>
    <input
      type="file"
      name="profilePicture"
      accept="image/*"
      onChange={handleChange}
      className={`w-full border px-3 py-2 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 ${
        errors.profilePicture ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {errors.profilePicture && (
      <p className="text-red-500 text-sm">{errors.profilePicture}</p>
    )}

    {imagePreview && (
      <div className="mt-2">
        <img
          src={imagePreview}
          alt="Profile Preview"
          className="rounded-md border border-gray-200 shadow-sm w-48 h-48 object-cover"
        />
      </div>
    )}
  </div>
</div>


    {/* Right: Form Fields */}
    <div className="md:w-2/3 space-y-8">
      {/* Basic Info */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {formFields.map(({ label, name, type, required }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name] || ''}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors[name] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Address Info */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Permanent Address</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
          <input
            type="text"
            name="permanentAddress"
            value={formData.permanentAddress || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="permanentPostalCode"
            value={formData.permanentPostalCode || ''}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.permanentPostalCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.permanentPostalCode && (
            <p className="text-red-500 text-sm mt-1">{errors.permanentPostalCode}</p>
          )}
        </div>

        {/* Country, State, City */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {['permanentCountry', 'permanentState', 'permanentCity'].map((field) => {
            const loading =
              (field === 'permanentCountry' && loadingCountries) ||
              (field === 'permanentState' && loadingStates) ||
              (field === 'permanentCity' && loadingCities);

            const options = selectOptions(
              field === 'permanentCountry'
                ? countryData
                : field === 'permanentState'
                ? stateData
                : cityData
            );

            return (
              <div key={field} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace('permanent', '')} <span className="text-red-500">*</span>
                </label>
                <Select
                  isDisabled={loading}
                  name={field}
                  value={options.find((item) => item.value === formData[field]) || ''}
                  onChange={(selectedOption) => {
                    const value = selectedOption ? selectedOption.value : '';
                    setFormData((prev) => ({ ...prev, [field]: value }));

                    if (field === 'permanentCountry') fetchStateList(value);
                    if (field === 'permanentState') fetchCity(value);
                  }}
                  options={options}
                  isClearable
                  classNamePrefix="react-select"
                />
                {loading && (
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <div className="loader border-t-transparent border-gray-400 border-2 w-5 h-5 rounded-full animate-spin"></div>
                  </div>
                )}
                {errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>

  {/* Submit Button */}
  <div className="flex justify-end pt-6">
    <button
      type="submit"
      disabled={loading}
      className="px-6 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-md transition disabled:opacity-50"
    >
      {loading ? 'Submitting...' : 'Register'}
    </button>
  </div>
</form>

  );
}
