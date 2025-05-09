"use client";
import { useRouter ,useSearchParams} from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Select from 'react-select';
import Swal from "sweetalert2";

export default function Create() {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [showBulkForm, setShowBulkForm] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [pinCode, setPinCode] = useState([]);

  const [formData, setFormData] = useState({
    state: "",
    country: "",
    city: "",
    pincode: "",
  });
 const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "country") fetchStateList(value);
    if (name === "state") fetchCity(value);

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const fetchPincodes = useCallback(async () => {
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
            `http://localhost:3001/api/high-rto/${id}`,
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
        const pinCode = result?.highRto || {};
        if(pinCode?.countryId){
            fetchStateList(pinCode?.countryId);
        }
        if(pinCode?.stateId){
            fetchCity(pinCode?.stateId);
        }

        setFormData({
          state: pinCode?.stateId || "",
          country:pinCode?.countryId|| "",
          city:pinCode?.cityId ||  "",
          pincode: pinCode?.pincode|| "",
          });
          setPinCode(pinCode)
    } catch (error) {
        console.error("Error fetching Company:", error);
    } finally {
        setLoading(false);
    }
}, [router, id]);

  const fetchCity = useCallback(async (id) => {
    const adminData = JSON.parse(localStorage.getItem("shippingData"));
    const token = adminData?.security?.token;

    if (adminData?.project?.active_panel !== "admin" || !token) {
      localStorage.clear();
      router.push("/admin/auth/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/location/state/${id}/cities`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to fetch cities");

      setCityData(result?.cities || []);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchStateList = useCallback(async (id) => {
    const adminData = JSON.parse(localStorage.getItem("shippingData"));
    const token = adminData?.security?.token;

    if (adminData?.project?.active_panel !== "admin" || !token) {
      localStorage.clear();
      router.push("/admin/auth/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/location/country/${id}/states`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to fetch states");

      setStateData(result?.states || []);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchCountryAndState = useCallback(async () => {
    const adminData = JSON.parse(localStorage.getItem("shippingData"));
    const token = adminData?.security?.token;

    if (adminData?.project?.active_panel !== "admin" || !token) {
      localStorage.clear();
      router.push("/admin/auth/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/location/country`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to fetch country list");

      setCountryData(result?.countries || []);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchPincodes();
    fetchCountryAndState();
  }, [fetchCountryAndState,fetchPincodes]);

  const validate = () => {
    const newErrors = {};
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
    const token = dropshipperData?.security?.token;

    if (dropshipperData?.project?.active_panel !== "admin" || !token) {
      localStorage.clear();
      router.push("/admin/auth/login");
      return;
    }

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      Swal.fire({ title: "Creating High Rto...", allowOutsideClick: false, didOpen: Swal.showLoading });
      const formdata = new FormData();
      formdata.append("city", formData.city);
      formdata.append("country", formData.country);
      formdata.append("state", formData.state);
      formdata.append("pincode", formData.pincode);

      const res = await fetch(`http://localhost:3001/api/high-rto/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formdata,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Creation failed");

      Swal.fire("Updating...", "Rto has been Updated successfully!", "success").then(() => {
        setFormData({state: "", country: "", city: "", pincode: "" });
        router.push("/admin/high-rto/list");
      });
    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
   <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Create Subuser</h2>

      {[
        { label: "Name", name: "name", type: "text" },
        { label: "Username", name: "username", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "Password", name: "password", type: "password" },
      ].map(({ label, name, type }) => (
        <div key={name}>
          <label className="block font-medium">
          {label}<span className="text-red-500">*</span> 
          </label>
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${
              errors[name] ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
        </div>
      ))}

      <div>
        <label className="block font-medium">
          Profile Picture <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
          className={`w-full border p-2 rounded ${
            errors.profilePicture ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.profilePicture && (
          <p className="text-red-500 text-sm">{errors.profilePicture}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-2">
          Permissions <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-4">
          {permissionsList.map((perm) => (
            <label key={perm} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.permissions.includes(perm)}
                onChange={() => handlePermissionChange(perm)}
                className="accent-blue-600"
              />
              <span>{perm}</span>
            </label>
          ))}
        </div>
        {errors.permissions && (
          <p className="text-red-500 text-sm mt-1">{errors.permissions}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Subuser
      </button>
    </form>
  );
}
