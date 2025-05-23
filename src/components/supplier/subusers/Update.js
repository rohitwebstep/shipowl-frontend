"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import Select from "react-select";
import { HashLoader } from "react-spinners";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import Image from "next/image"; 8
import 'swiper/css/navigation';
export default function Update() {
  const router = useRouter();
  const [permission, setPermission] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingPermission, setLoadingPermission] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    type: "main",
    status: "active",
    profilePicture: null,
    referralCode: "",
    phoneNumber: "",
    website: "",
    permanentAddress: "",
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",
    permissions: [],
  });
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const fetchSubuser = useCallback(async () => {
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
        `hhttps://sleeping-owl-we0m.onrender.com/api/supplier/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${suppliertoken}`,
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        Swal.fire({
          icon: "error",
          title: "Something Wrong!",
          text: errorMessage.message || "Your session has expired. Please log in again.",
        });
        throw new Error(errorMessage.message);
      }

      const result = await response.json();
      const users = result?.supplier || {};
      if (users?.permanentCityId) {
        fetchStateList(users?.permanentCountryId);
      }
      if (users?.permanentStateId) {
        fetchCity(users?.permanentStateId);
      }

      setFormData({
        name: users?.name || "",
        username: users?.username || "",
        email: users?.email || "",
        type: users?.type || "",
        status: users?.status || "",
        profilePicture: users?.profilePicture || null,
        referralCode: users?.referralCode || "",
        phoneNumber: users?.phoneNumber || "",
        website: users?.website || "",
        permanentAddress: users?.permanentAddress || "",
        permanentCity: users?.permanentCityId || "",
        permanentState: users?.permanentStateId || "",
        permanentCountry: users?.permanentCountryId || "",
        permissions: users?.permissions?.map((p) => p.permissionId) || [],
        image: users?.profilePicture || '',
      });

    } catch (error) {
      console.error("Error fetching Company:", error);
    } finally {
      setLoading(false);
    }
  }, [router, id]);


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };



  const handlePermissionChange = (permId) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter((p) => p !== permId)
        : [...prev.permissions, permId],
    }));
  };

  const validate = () => {
    const newErrors = {};
    const {
      name,
      username,
      email,
      permanentCountry,
      permanentState,
      permanentCity,
      permissions,
    } = formData;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!permanentCountry) newErrors.permanentCountry = "Country is required";
    if (!permanentState) newErrors.permanentState = "State is required";
    if (!permanentCity) newErrors.permanentCity = "City is required";
    if (permissions.length === 0) newErrors.permissions = "At least one permission is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Inside handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const supplierData = JSON.parse(localStorage.getItem("shippingData"));
    const token = supplierData?.security?.token;

    const data = new FormData();

    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "permissions") {
        // Send as JSON string with supplier_id: null for creation
        const permissionsPayload = value.map((permId) => ({
          supplier_id: null,
          permission_id: permId,
        }));
        data.append("permissions", JSON.stringify(permissionsPayload));
      } else if (value !== null && value !== "") {
        data.append(key, value);
      }
    });

    try {
      const res = await fetch(`hhttps://sleeping-owl-we0m.onrender.com/api/supplier/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to Update supplier");

      Swal.fire("Success", "supplier Updated Successfuly!", "success");
      // Reset form
      setFormData({
        name: "",
        username: "",
        email: "",
        type: "",
        status: "",
        profilePicture: null,
        referralCode: "",
        phoneNumber: "",
        website: "",
        permanentAddress: "",
        permanentCity: "",
        permanentState: "",
        permanentCountry: "",
        permissions: [],
      });
      router.push('/supplier/sub-user/list')
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };


  const fetchProtected = useCallback(async (url, setter, key, setLoading) => {
    const supplierData = JSON.parse(localStorage.getItem("shippingData"));
    const token = supplierData?.security?.token;
    if (!token || supplierData?.project?.active_panel !== "supplier") {
      localStorage.clear();
      router.push("/supplier/auth/login");
      return;
    }

    if (setLoading) setLoading(true);

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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



  const fetchPermission = useCallback(() => {
    fetchProtected(
      "hhttps://sleeping-owl-we0m.onrender.com/api/supplier/permission",
      setPermission,
      "permissions",
      setLoading
    );
  }, [fetchProtected]);

  const fetchCountryAndState = useCallback(() => {
    fetchProtected(
      "hhttps://sleeping-owl-we0m.onrender.com/api/location/country",
      setCountryData,
      "countries",
      setLoadingCountries
    );
  }, [fetchProtected]);

  const fetchStateList = useCallback((countryId) => {
    fetchProtected(
      `hhttps://sleeping-owl-we0m.onrender.com/api/location/country/${countryId}/states`,
      setStateData,
      "states",
      setLoadingStates
    );
  }, [fetchProtected]);

  const fetchCity = useCallback((stateId) => {
    fetchProtected(
      `hhttps://sleeping-owl-we0m.onrender.com/api/location/state/${stateId}/cities`,
      setCityData,
      "cities",
      setLoadingCities
    );
  }, [fetchProtected]);

  useEffect(() => {
    fetchSubuser();
    fetchPermission();
    fetchCountryAndState();
  }, [fetchSubuser])



  const handleImageDelete = (index) => {
    const images = formData.image?.split(',') || [];
    const updatedImages = images.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      image: updatedImages.join(','),
    }));
  };


  const selectOptions = (data) =>
    data.map((item) => ({
      value: item.id || item._id,
      label: item.name,
    }));

  const groupedPermissions = permission.reduce((acc, perm) => {
    if (!acc[perm.panel]) acc[perm.panel] = {};
    if (!acc[perm.panel][perm.module]) acc[perm.panel][perm.module] = [];
    acc[perm.panel][perm.module].push(perm);
    return acc;
  }, {});

  const formFields = [
    { label: "Name", name: "name", type: "text", required: true },
    { label: "Username", name: "username", type: "text", required: true },
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Referral Code", name: "referralCode", type: "text" },
    { label: "Phone Number", name: "phoneNumber", type: "text" },
    { label: "Website", name: "website", type: "text" },
    { label: "Permanent Address", name: "permanentAddress", type: "text" },
  ];
  if (loading || loadingPermission) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <HashLoader size={60} color="#F97316" loading={true} />
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="bg-white lg:p-10 p-3  rounded-2xl">
      {/* <h2 className="text-xl font-semibold">Create Subuser</h2> */}
      <div className="mb-2">
        <label className="block text-[#232323] font-bold mb-1">Profile Picture </label>
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
          className={`w-full p-3  file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100  border rounded-lg font-bold border-[#DFEAF2] text-[#718EBF]
                }`}
        />
        {formData?.image && (
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
        {errors.profilePicture && <p className="text-red-500 text-sm">{errors.profilePicture}</p>}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {formFields.map(({ label, name, type, required }) => (
          <div key={name}>
            <label className="block text-[#232323] font-bold mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name] || ''}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg font-bold ${errors[name] ? 'border-red-500 text-red-500' : 'border-[#DFEAF2] text-[#718EBF]'
                }`}
            />
            {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
          </div>
        ))}

        {/* Move the Status dropdown outside the loop */}
        <div className="">
          <label className="block text-[#232323] font-bold mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status || ''}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg font-bold border-[#DFEAF2] text-[#718EBF]
                }`}          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="">
          <label className="block text-[#232323] font-bold mb-1">Type</label>
          <select
            name="type"
            onChange={handleChange}
            value={formData.type || ''}
            className={`w-full p-3 border rounded-lg font-bold border-[#DFEAF2] text-[#718EBF]
              }`}        >
            <option value='main'>Main</option>
            <option value='sub'>Sub</option>
          </select>
        </div>
      </div>



      <div className="grid grid-cols-3 gap-4 mt-3">
        {["permanentCountry", "permanentState", "permanentCity"].map((field) => (
          <div key={field} className="relative">
            <label className="block text-[#232323] font-bold mb-1 capitalize">
              {field.replace("permanent", "")} <span className="text-red-500">*</span>
            </label>

            <Select
              isDisabled={
                (field === "permanentCountry" && loadingCountries) ||
                (field === "permanentState" && loadingStates) ||
                (field === "permanentCity" && loadingCities)
              }
              name={field}
              value={selectOptions(
                field === "permanentCountry" ? countryData :
                  field === "permanentState" ? stateData :
                    cityData
              ).find((item) => item.value === formData[field])}
              onChange={(selectedOption) => {
                const value = selectedOption ? selectedOption.value : "";

                setFormData((prev) => ({ ...prev, [field]: value }));

                if (field === "permanentCountry") {
                  fetchStateList(value); // <-- call with selected country ID
                }
                if (field === "permanentState") {
                  fetchCity(value); // <-- call with selected country ID
                }
              }}

              options={selectOptions(
                field === "permanentCountry" ? countryData :
                  field === "permanentState" ? stateData :
                    cityData
              )}
              isClearable
            />

            {((field === "permanentCountry" && loadingCountries) ||
              (field === "permanentState" && loadingStates) ||
              (field === "permanentCity" && loadingCities)) && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <div className="loader border-t-transparent border-gray-400 border-2 w-5 h-5 rounded-full animate-spin"></div>
                </div>
              )}

            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>

        ))}
      </div>

      <div>
        <label className="block text-[#232323] font-bold mb-1 mt-2">Permissions <span className="text-red-500">*</span></label>
        <div className="space-y-4">
          {Object.entries(groupedPermissions).map(([panel, modules]) => (
            <div key={panel} className="space-y-2">
              <h3 className="font-semibold capitalize">{panel}</h3>
              {Object.entries(modules).map(([module, perms]) => (
                <div className="grid grid-cols-3 gap-2" key={module}>
                  {/* <h4 className="col-span-3 font-medium">{module}</h4> */}
                  {perms.map((perm) => (
                    <label key={perm.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.id)}
                        onChange={() => handlePermissionChange(perm.id)}
                      />
                      <span className="capitalize block text-[#232323] font-bold mb-1">{perm.action}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        {errors.permissions && <p className="text-red-500 text-sm">{errors.permissions}</p>}
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
    </form>
  );
}
