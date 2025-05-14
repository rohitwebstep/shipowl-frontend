"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Select from "react-select";
import { HashLoader } from "react-spinners";
export default function Create() {
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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    if(name=="permanentCountry"){
      fetchStateList(value);
    }
    if(name=="permanentState"){
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
      password,
      phoneNumber,
      website,
      profilePicture,
      permanentCountry,
      permanentState,
      permanentCity,
      type,
      permissions,
    } = formData;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!username.trim()) newErrors.username = "Username is required";
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
    if (!type) newErrors.type = "Type is required";
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
    const res = await fetch(`http://https://sleeping-owl-we0m.onrender.com/api/admin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to create admin");

    Swal.fire("Success", "Admin created Successfuly!", "success");
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
    if (!res.ok) throw new Error(result.message || `Failed to fetch ${key}`);
    setter(result[key] || []);
  } catch (err) {
    Swal.fire("Error", err.message, "error");
  } finally {
    if (setLoading) setLoading(false);
  }
}, [router]);
const fetchPermission = useCallback(() => {
  fetchProtected(
    "http://https://sleeping-owl-we0m.onrender.com/api/admin/permission",
    setPermission,
    "permissions",
    setLoadingPermission
  );
}, [fetchProtected]);

const fetchCountryAndState = useCallback(() => {
  fetchProtected(
    "http://https://sleeping-owl-we0m.onrender.com/api/location/country",
    setCountryData,
    "countries",
    setLoadingCountries
  );
}, [fetchProtected]);

const fetchStateList = useCallback((countryId) => {
  fetchProtected(
    `http://https://sleeping-owl-we0m.onrender.com/api/location/country/${countryId}/states`,
    setStateData,
    "states",
    setLoadingStates
  );
}, [fetchProtected]);

const fetchCity = useCallback((stateId) => {
  fetchProtected(
    `http://https://sleeping-owl-we0m.onrender.com/api/location/state/${stateId}/cities`,
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

useEffect(()=>{
  fetchPermission();
  fetchCountryAndState();
},[fetchPermission,fetchCountryAndState]);

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
    { label: "Password", name: "password", type: "password", required: true },
    { label: "Referral Code", name: "referralCode", type: "text" },
    { label: "Phone Number", name: "phoneNumber", type: "text" },
    { label: "Website", name: "website", type: "text" },
    { label: "Permanent Address", name: "permanentAddress", type: "text" },
  ];
  if (loading) {
          return (
              <div className="flex items-center justify-center h-[80vh]">
                  <HashLoader size={60} color="#F97316" loading={true} />
              </div>
          );
      }
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-xl font-semibold">Create Subuser</h2>

      <div className="grid grid-cols-2 gap-4">
        {formFields.map(({ label, name, type, required }) => (
          <div key={name}>
            <label className="block font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors[name] ? "border-red-500" : "border-gray-300"}`}
            />
            {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
          </div>
        ))}

       
      </div>
       <div>
          <label className="block font-medium">Profile Picture <span className="text-red-500">*</span></label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.profilePicture && <p className="text-red-500 text-sm">{errors.profilePicture}</p>}
        </div>
      <div>
          <label className="block font-medium">Type <span className="text-red-500">*</span></label>
          <select
            name="type"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value= 'main'>Main</option>
            <option value='sub'>Sub</option>
            </select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
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
                      <span>{perm.action}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        {errors.permissions && <p className="text-red-500 text-sm">{errors.permissions}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
