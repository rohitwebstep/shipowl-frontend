"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Create() {
  const router = useRouter();

  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    iso_2: "",
    iso_3: "",
    form_code: "",
    currency: "",
    currency_name: "",
    currency_symbol: "",
    nationality: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Country name is required.";
    if (!formData.iso_2.trim()) newErrors.iso_2 = "ISO 2 code is required.";
    if (!formData.iso_3.trim()) newErrors.iso_3 = "ISO 3 code is required.";
    if (!formData.currency.trim()) newErrors.currency = "Currency is required.";
    if (!formData.currency_name.trim()) newErrors.currency_name = "Currency name is required.";
    if (!formData.currency_symbol.trim()) newErrors.currency_symbol = "Currency symbol is required.";
    if (!formData.nationality.trim()) newErrors.nationality = "Nationality is required.";
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
      iso_2: "",
      iso_3: "",
      form_code: "",
      currency: "",
      currency_name: "",
      currency_symbol: "",
      nationality: "",
      status: "active",
    });
    setErrors({});
  };

  return (
    <div className="p-6 lg:w-10/12 space-y-6">
      <h2 className="text-2xl font-semibold">Country Management</h2>
      <form onSubmit={handleSubmit} className="p-4 rounded-md bg-white shadow space-y-4">
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block font-medium">Country Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Country Name"
              className="border w-full border-[#DFEAF2] rounded-md p-3 mt-1"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-medium">ISO 2 Code <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="iso_2"
              value={formData.iso_2}
              onChange={handleChange}
              placeholder="ISO 2 Code"
              className="border w-full border-[#DFEAF2] rounded-md p-3 mt-1"
            />
            {errors.iso_2 && <p className="text-red-500 text-sm">{errors.iso_2}</p>}
          </div>

          <div>
            <label className="block font-medium">ISO 3 Code <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="iso_3"
              value={formData.iso_3}
              onChange={handleChange}
              placeholder="ISO 3 Code"
              className="border w-full border-[#DFEAF2] rounded-md p-3 mt-1"
            />
            {errors.iso_3 && <p className="text-red-500 text-sm">{errors.iso_3}</p>}
          </div>

          <div>
            <label className="block font-medium">Form Code</label>
            <input
              type="text"
              name="form_code"
              value={formData.form_code}
              onChange={handleChange}
              placeholder="Form Code"
              className="border w-full border-[#DFEAF2] rounded-md p-3 mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Currency <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              placeholder="Currency"
              className="border w-full border-[#DFEAF2] rounded-md p-3 mt-1"
            />
            {errors.currency && <p className="text-red-500 text-sm">{errors.currency}</p>}
          </div>

          <div>
            <label className="block font-medium">Currency Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="currency_name"
              value={formData.currency_name}
              onChange={handleChange}
              placeholder="Currency Name"
              className="border w-full border-[#DFEAF2] rounded-md p-3 mt-1"
            />
            {errors.currency_name && <p className="text-red-500 text-sm">{errors.currency_name}</p>}
          </div>

          <div>
            <label className="block font-medium">Currency Symbol <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="currency_symbol"
              value={formData.currency_symbol}
              onChange={handleChange}
              placeholder="Currency Symbol"
              className="border w-full border-[#DFEAF2] rounded-md p-3 mt-1"
            />
            {errors.currency_symbol && <p className="text-red-500 text-sm">{errors.currency_symbol}</p>}
          </div>

          <div>
            <label className="block font-medium">Nationality <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Nationality"
              className="border w-full border-[#DFEAF2] rounded-md p-3 mt-1"
            />
            {errors.nationality && <p className="text-red-500 text-sm">{errors.nationality}</p>}
          </div>
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border w-full border-[#DFEAF2] rounded-md p-3 mt-1"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          <button type="submit" className="bg-orange-500 text-white px-6 rounded-md p-3">
            Save
          </button>
          <button type="button" className="bg-gray-500 text-white px-6 rounded-md p-3" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
