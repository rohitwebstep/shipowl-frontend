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
    type: "",
    password: "",
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
        `https://sleeping-owl-we0m.onrender.com/api/admin/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admintoken}`,
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
      const users = result?.admin || {};
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
        password: "", // keep password blank for security
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
    if (name == "permanentCountry") {
      fetchStateList(value);
    }
    if (name == "permanentState") {
      fetchCity(value);
    }
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
      website,
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

    if (website && !/^https?:\/\/[\w.-]+\.[a-z]{2,}/i.test(website)) {
      newErrors.website = "Invalid website URL";
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
    const adminData = JSON.parse(localStorage.getItem("shippingData"));
    const token = adminData?.security?.token;

    const data = new FormData();

    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "permissions") {
        // Send as JSON string with admin_id: null for creation
        const permissionsPayload = value.map((permId) => ({
          admin_id: null,
          permission_id: permId,
        }));
        data.append("permissions", JSON.stringify(permissionsPayload));
      } else if (value !== null && value !== "") {
        data.append(key, value);
      }
    });

    try {
      const res = await fetch(`https://sleeping-owl-we0m.onrender.com/api/admin/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to Update admin");

      Swal.fire("Success", "Admin Updated Successfuly!", "success");
      // Reset form
      setFormData({
        name: "",
        username: "",
        email: "",
        type: "",
        password: "",
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
      router.push('/admin/sub-user/list')
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };


  const fetchProtected = useCallback(async (url, setter, key, setLoading) => {
    const adminData = JSON.parse(localStorage.getItem("shippingData"));
    const token = adminData?.security?.token;
    if (!token || adminData?.project?.active_panel !== "admin") {
      localStorage.clear();
      router.push("/admin/auth/login");
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
      "https://sleeping-owl-we0m.onrender.com/api/admin/permission",
      setPermission,
      "permissions",
      setLoading
    );
  }, [fetchProtected]);

  const fetchCountryAndState = useCallback(() => {
    fetchProtected(
      "https://sleeping-owl-we0m.onrender.com/api/location/country",
      setCountryData,
      "countries",
      setLoadingCountries
    );
  }, [fetchProtected]);

  const fetchStateList = useCallback((countryId) => {
    fetchProtected(
      `https://sleeping-owl-we0m.onrender.com/api/location/country/${countryId}/states`,
      setStateData,
      "states",
      setLoadingStates
    );
  }, [fetchProtected]);

  const fetchCity = useCallback((stateId) => {
    fetchProtected(
      `https://sleeping-owl-we0m.onrender.com/api/location/state/${stateId}/cities`,
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
  ];
  if (loading || loadingPermission) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <HashLoader size={60} color="#F97316" loading={true} />
      </div>
    );
  }
  console.log('formData', formData)
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow space-y-2">

      <div className="grid grid-cols-2 gap-4">
        {formFields.map(({ label, name, type, required }) => (
          <div key={name}>
            <label className="block font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name] || ''
              }
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors[name] ? "border-red-500" : "border-gray-300"}`}
            />
            {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
          </div>
        ))}


      </div>
      <div>
        <label className="block font-medium">Permanent Address</label>
        <input
          type="text"
          name="permanentAddress"
          value={formData?.permanentAddress || ''}
          onChange={handleChange}
          className="w-full border p-2 border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Profile Picture </label>
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
          className="w-full border p-2 border-gray-300 rounded"
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
      </div>
      <div>
        <label className="block font-medium">Type <span className="text-red-500">*</span></label>
        <select
          name="type"
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          value={formData?.type || ''}
        >
          <option value='main'>Main</option>
          <option value='sub'>Sub</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {["permanentCountry", "permanentState", "permanentCity"].map((field) => (
          <div key={field} className="relative">
            <label className="block font-medium capitalize">
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
        <label className="block font-medium">Permissions <span className="text-red-500">*</span></label>
        <div className="space-y-4">
          {Object.entries(groupedPermissions).map(([panel, modules]) => (
            <div key={panel} className="space-y-2">
              <h3 className="font-semibold capitalize">{panel}</h3>
              {Object.entries(modules).map(([module, perms]) => (
                <div className="grid grid-cols-3 gap-2" key={module}>
                  <h4 className="col-span-3 font-medium">{module}</h4>
                  {perms.map((perm) => (
                    <label key={perm.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.id)}
                        onChange={() => handlePermissionChange(perm.id)}
                      />
                      <span className="capitalize">{perm.action}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        {errors.permissions && <p className="text-red-500 text-sm">{errors.permissions}</p>}
      </div>

      <div className="flex justify-start my-2">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
