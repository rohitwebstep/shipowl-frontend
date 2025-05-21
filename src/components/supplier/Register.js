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
  const [states, setStates] = useState([]);
  const [city, setCity] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [billingStateLoading, setBillingStateLoading] = useState(false);
  const [billingCityLoading, setBillingCityLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
    currentAddress: "",
    permanentAddress: "",
    permanentPostalCode: "",
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",
    companyName: "",
    brandName: "",
    brandShortName: "",
    billingAddress: "",
    billingPincode: "",
    billingState: "",
    billingCity: "",
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "profilePicture" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "permanentCountry") {
      fetchStateList(value);
    }
    if (name === "permanentState") {
      fetchCity(value);
    }
    if (name === "billingState") {
      fetchCity(value);
    }
  };

  const validate = () => {
    const newErrors = {};
    const {
      name,
      username,
      email,
      password,
      dateOfBirth,
      currentAddress,
      permanentAddress,
      permanentPostalCode,
      permanentCity,
      permanentState,
      permanentCountry,
      companyName,
      brandName,
      brandShortName,
      billingAddress,
      billingPincode,
      billingState,
      billingCity,
      profilePicture,
    } = formData;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password.trim()) newErrors.password = "Password is required";
    if (!dateOfBirth.trim()) newErrors.dateOfBirth = "Date of Birth is required";
    if (!currentAddress.trim()) newErrors.currentAddress = "Current Address is required";
    if (!permanentAddress.trim()) newErrors.permanentAddress = "Permanent Address is required";
    if (!permanentPostalCode.trim()) newErrors.permanentPostalCode = "Postal Code is required";
    if (!permanentCity) newErrors.permanentCity = "City is required";
    if (!permanentState) newErrors.permanentState = "State is required";
    if (!permanentCountry) newErrors.permanentCountry = "Country is required";
    if (!companyName.trim()) newErrors.companyName = "Company Name is required";
    if (!brandName.trim()) newErrors.brandName = "Brand Name is required";
    if (!brandShortName.trim()) newErrors.brandShortName = "Brand Short Name is required";
    if (!billingAddress.trim()) newErrors.billingAddress = "Billing Address is required";
    if (!billingPincode.trim()) newErrors.billingPincode = "Billing Pincode is required";
    if (!billingState.trim()) newErrors.billingState = "Billing State is required";
    if (!billingCity.trim()) newErrors.billingCity = "Billing City is required";
    if (!profilePicture) newErrors.profilePicture = "Profile picture is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
    const token = dropshipperData?.security?.token;

    const data = new FormData();
    
 for (const key in formData) {
  if (key === 'dateOfBirth' && formData[key]) {
    const formattedDate = new Date(formData[key]).toLocaleDateString('en-GB');
    data.append(key, formattedDate);
    console.log(typeof formattedDate); // Should be string
  } else if (formData[key] !== null && formData[key] !== '') {
    data.append(key, formData[key]);
  }
}

    try {
      const res = await fetch(`http://localhost:3001/api/supplier/auth/registration`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || result.error || "Failed to create supplier");

      Swal.fire({
        title: "Success",
        text: "Supplier Registered Successfully!",
        icon: "success",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/supplier/auth/login");
        }
      });

      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        dateOfBirth: "",
        currentAddress: "",
        permanentAddress: "",
        permanentPostalCode: "",
        permanentCity: "",
        permanentState: "",
        permanentCountry: "",
        companyName: "",
        brandName: "",
        brandShortName: "",
        billingAddress: "",
        billingPincode: "",
        billingState: "",
        billingCity: "",
        profilePicture: null,
      });
      setImagePreview(null);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const fetchProtected = useCallback(async (url, setter, key, setLoadingFn) => {
    if (setLoadingFn) setLoadingFn(true);
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || result.error || `Failed to fetch ${key}`);

      // ✅ handle missing key gracefully
      setter(result[key] || []);
    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    } finally {
      if (setLoadingFn) setLoadingFn(false);
    }
  }, []);

  const fetchCountryAndState = useCallback(() => {
    fetchProtected(
      "http://localhost:3001/api/location/country",
      setCountryData,
      "countries",             // ✅ make sure backend response uses this key
      setLoadingCountries
    );
  }, [fetchProtected]);

  const fetchState = useCallback(() => {
    fetchProtected(
      "http://localhost:3001/api/location/state",
      setStates,
      "states",         // ⚠️ verify that your API returns a `billingstates` key
      setBillingStateLoading
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

  const fetchCity2 = useCallback((stateId) => {
    fetchProtected(
      `http://localhost:3001/api/location/state/${stateId}/cities`,
      setCity,
      "cities",               // ⚠️ This key must match your API response structure
      setBillingCityLoading
    );
  }, [fetchProtected]);


  const selectOptions = (data) =>
    data.map((item) => ({
      value: item.id || item._id,
      label: item.name,
    }));

  useEffect(() => {
    fetchCountryAndState();
    fetchState();
  }, [fetchCountryAndState, fetchState]);

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
      className="md:w-8/12 mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create an Account</h2>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700  pb-2">Profile Photo</h3>

        <div className="w-full space-y-3">
          <label
            htmlFor="profilePicture"
            className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-orange-500 transition"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full mb-2"
              />
            ) : (
              <span className="text-gray-500">Click to upload profile picture</span>
            )}
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          {errors.profilePicture && (
            <p className="text-red-600 text-sm">{errors.profilePicture}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:flex-row gap-8">
        {/* Left: Profile Picture */}


        {/* Basic Info */}
        <div className="  pt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          <h3 className="text-lg md:col-span-2 font-semibold text-gray-700  pb-2">Basic Info</h3>

          <div>
            <label className="block text-sm mb-1" htmlFor="name">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${errors.name ? "border-red-600" : "border-gray-300"
                }`}
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="username">
              Username <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${errors.username ? "border-red-600" : "border-gray-300"
                }`}
            />
            {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="email">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${errors.email ? "border-red-600" : "border-gray-300"
                }`}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="password">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${errors.password ? "border-red-600" : "border-gray-300"
                }`}
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1" htmlFor="dateOfBirth">
              Date of Birth <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${errors.dateOfBirth ? "border-red-600" : "border-gray-300"
                }`}
            />
            {errors.dateOfBirth && <p className="text-red-600 text-sm">{errors.dateOfBirth}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1" htmlFor="currentAddress">
              Current Address <span className="text-red-600">*</span>
            </label>
            <textarea
              id="currentAddress"
              name="currentAddress"
              value={formData.currentAddress || ''}
              onChange={handleChange}
              rows={3}
              className={`w-full border rounded px-3 py-2 ${errors.currentAddress ? "border-red-600" : "border-gray-300"
                }`}
            />
            {errors.currentAddress && (
              <p className="text-red-600 text-sm">{errors.currentAddress}</p>
            )}
          </div>
        </div>

        {/* Permanent Address */}
        <div className=" pt-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700  pb-2">Permanent Address</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="">
              <label
                className="block text-sm mb-1"
                htmlFor="permanentAddress"
              >
                Address <span className="text-red-600">*</span>
              </label>
              <textarea
                id="permanentAddress"
                name="permanentAddress"
                value={formData.permanentAddress || ''}
                onChange={handleChange}
                rows={1}
                className={`w-full border rounded px-3 py-2 ${errors.permanentAddress ? "border-red-600" : "border-gray-300"
                  }`}
              />
              {errors.permanentAddress && (
                <p className="text-red-600 text-sm">{errors.permanentAddress}</p>
              )}
            </div>

            <div className="">
              <label
                htmlFor="permanentPostalCode"
                className="block text-sm mb-1"
              >
                Postal Code <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="permanentPostalCode"
                name="permanentPostalCode"
                value={formData.permanentPostalCode || ''}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${errors.permanentPostalCode ? "border-red-600" : "border-gray-300"
                  }`}
              />
              {errors.permanentPostalCode && (
                <p className="text-red-600 text-sm">{errors.permanentPostalCode}</p>
              )}
            </div>


          </div>
          <div className="grid grid-cols-1  gap-3">
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

                    classNamePrefix="react-select"
                  />
                  {loading && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <div className="loader -transparent border-gray-400 border-2 w-5 h-5 rounded-full animate-spin"></div>
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

        {/* Company & Brand Info */}
        <div className=" pt-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700  pb-2">Company & Brand Information</h3>

          <div className="grid gap-3">
            <div>
              <label className="block text-sm mb-1" htmlFor="companyName">
                Company Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${errors.companyName ? "border-red-600" : "border-gray-300"
                  }`}
              />
              {errors.companyName && (
                <p className="text-red-600 text-sm">{errors.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="brandName">
                Brand Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                value={formData.brandName || ''}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${errors.brandName ? "border-red-600" : "border-gray-300"
                  }`}
              />
              {errors.brandName && (
                <p className="text-red-600 text-sm">{errors.brandName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="brandShortName">
                Brand Short Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="brandShortName"
                name="brandShortName"
                value={formData.brandShortName || ''}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${errors.brandShortName ? "border-red-600" : "border-gray-300"
                  }`}
              />
              {errors.brandShortName && (
                <p className="text-red-600 text-sm">{errors.brandShortName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className=" pt-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700  pb-2">Billing Address</h3>

          <div className="  gap-2">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1" htmlFor="billingAddress">
                Address <span className="text-red-600">*</span>
              </label>
              <textarea
                id="billingAddress"
                name="billingAddress"
                value={formData.billingAddress || ''}
                onChange={handleChange}
                rows={2}
                className={`w-full border rounded px-3 py-2 ${errors.billingAddress ? "border-red-600" : "border-gray-300"
                  }`}
              />
              {errors.billingAddress && (
                <p className="text-red-600 text-sm">{errors.billingAddress}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="billingPincode">
                Pincode <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="billingPincode"
                name="billingPincode"
                value={formData.billingPincode || ''}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${errors.billingPincode ? "border-red-600" : "border-gray-300"
                  }`}
              />
              {errors.billingPincode && (
                <p className="text-red-600 text-sm">{errors.billingPincode}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {['billingState', 'billingCity'].map((field) => {
                const loading =
                  (field === 'billingState' && billingStateLoading) ||
                  (field === 'billingCity' && billingCityLoading);

                const options = selectOptions(
                  field === 'billingState' ? states : city
                );

                return (
                  <div key={field} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {field.replace('billing', '')} <span className="text-red-500">*</span>
                    </label>
                    <Select
                      isDisabled={loading}
                      name={field}
                      value={options.find((item) => item.value === formData[field]) || ''}
                      onChange={(selectedOption) => {
                        const value = selectedOption ? selectedOption.value : '';
                        setFormData((prev) => ({ ...prev, [field]: value }));

                        if (field === 'billingState') fetchCity2(value);
                      }}
                      options={options}
                      classNamePrefix="react-select"
                    />
                    {loading && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <div className="loader -transparent border-gray-400 border-2 w-5 h-5 rounded-full animate-spin"></div>
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
      <button
        type="submit"
        className="w-auto px-10 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded"
      >
        Register
      </button>
    </form>
  )
}