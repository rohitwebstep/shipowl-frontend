"use client"
import { useState } from "react";

const permissionsList = [
  "View Orders",
  "Edit Products",
  "Manage Inventory",
  "Access Reports",
];

export default function Create() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    profilePicture: null,
    permissions: [],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePermissionChange = (perm) => {
    setFormData((prev) => {
      const updated = prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: updated };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.profilePicture) newErrors.profilePicture = "Profile picture is required";
    if (formData.permissions.length === 0) newErrors.permissions = "Select at least one permission";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        Swal.fire({ title: "Creating Subuser...", allowOutsideClick: false, didOpen: Swal.showLoading });
         const formdata = new FormData();
          formdata.append("name", formData.name);
          formdata.append("userName", formData.username);
          formdata.append("email", formData.email);
          formdata.append("password", formData.password);
          formdata.append("permissions", JSON.stringify(formData.permissions || []));
          if (formData.profilePicture) {
            formdata.append("profilePicture", formData.profilePicture); // binary image file
          }
        const res = await fetch("http://localhost:3001/api/subuser", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formdata,
        });
  
        const result = await res.json();
  
        if (!res.ok) throw new Error(result.message || "Creation failed");
  
        Swal.fire("Subuser Created", " Hihg RTO has been created successfully!", "success").then(() => {
          setFormData({state: "", country: "", city: "", pincode: "" });
          router.push("/admin/sub-user/list");
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
