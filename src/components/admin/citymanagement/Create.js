"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Create() {
  const router = useRouter();

  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    state_id: "",
    country_id: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear individual field error on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "City name is required.";
    if (!formData.state_id.trim()) newErrors.state_id = "State Id is required.";
    if (!formData.country_id.trim()) newErrors.country_id = "Country Id is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setCountries([...countries, formData]);
    setFormData({
      name: "",
      state_id: "",
      country_id: "",
    });
    setErrors({});
  };

  return (
    <div className="p-6 lg:w-10/12 space-y-6">
      <h2 className="text-2xl font-semibold">Country Management</h2>
      <form onSubmit={handleSubmit} className="p-4 rounded-md bg-white shadow">
        <div className="space-y-4 ">
          {[
            { name: "name", label: "City Name" },
            { name: "state_id", label: "State Id" },
            { name: "country_id", label: "Country Id" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block font-medium">
                {label} {["form_code"].includes(name) ? "" : <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name={name}
                placeholder={label}
                value={formData[name]}
                onChange={handleChange}
                className="border w-full border-[#DFEAF2] rounded-md p-3 mt-1"
              />
              {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
          ))}
          </div>
          <div>

        

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 rounded-md p-3"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-6 rounded-md p-3"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}



