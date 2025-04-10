"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Create() {
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    currency: "",
    status: "active",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code || !formData.currency) return;

    setCountries([...countries, formData]);
    setFormData({ name: "", code: "", currency: "", status: "active" });
  };


  return (
    <div className="p-6 max-w-3xl  space-y-6">
      <h2 className="text-2xl font-semibold">Country Management</h2>
      <form onSubmit={handleSubmit}>

        <div className="space-y-4  p-4 rounded-md bg-white shadow">
          <input
            type="text"
            name="name"
            placeholder="Country Name"
            value={formData.name}
            onChange={handleChange}
            className="font-medium border w-full border-[#DFEAF2] rounded-md p-3 mt-2"
          />
          <input
            type="text"
            name="code"
            placeholder="Country Code (e.g. IN)"
            value={formData.code}
            onChange={handleChange}
            className="font-medium border w-full border-[#DFEAF2] rounded-md p-3 mt-2"
          />
          <input
            type="text"
            name="currency"
            placeholder="Currency (e.g. INR)"
            value={formData.currency}
            onChange={handleChange}
            className="font-medium border w-full border-[#DFEAF2] rounded-md p-3 mt-2"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="font-medium border w-full border-[#DFEAF2] rounded-md p-3 mt-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex flex-wrap gap-3 mt-5">
            <button type="submit" className="bg-orange-500 text-white px-15 rounded-md p-3">
              Save
            </button>
            <button type="button" className="bg-gray-500 text-white px-15 rounded-md p-3" onClick={() => router.back()}>
              Cancel
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
