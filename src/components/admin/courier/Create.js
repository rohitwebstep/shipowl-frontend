"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
export default function Create() {
const router =useRouter();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    website: "",
    contactEmail: "",
    contactNumber: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Courier Company:", formData);
    // TODO: Submit data to backend
  };

  return (
    <div className="md:w-10/12  p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Add Courier Company</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

     <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
     <div>
          <label className="block font-medium">Courier Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
             className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2"
          />
        </div>

        <div>
          <label className="block font-medium">Courier Code</label>
          <input
            type="text"
            name="code"
            required
            value={formData.code}
            onChange={handleChange}
             className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2"
          />
        </div>

        <div>
          <label className="block font-medium">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
             className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2"
            placeholder="https://"
          />
        </div>

        <div>
          <label className="block font-medium">Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
             className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2"
          />
        </div>

        <div>
          <label className="block font-medium">Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
             className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2"
          />
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
             className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
     </div>

     <div className="flex flex-wrap gap-3 mt-5">
          <button type="submit" className="bg-orange-500 text-white px-15 rounded-md p-3">
            Save
          </button>
          <button type="button" className="bg-gray-500 text-white px-15 rounded-md p-3" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
