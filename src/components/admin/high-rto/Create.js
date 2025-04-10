"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Create() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    website: "",
    contactEmail: "",
    contactNumber: "",
    status: "active",
  });

  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Courier Company:", formData);
    // TODO: Submit single form data
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (bulkFile) {
      console.log("Uploading Bulk File:", bulkFile.name);
      // TODO: Upload the bulkFile to the server
    }
  };

  return (
    <div className="md:w-10/12 p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Add High RTO</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
          <div>
            <label className="block font-medium">Pincode</label>
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
            <label className="block font-medium">Dist</label>
            <input
              type="text"
              name="code"
              required
              value={formData.code}
              onChange={handleChange}
              className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">State</label>
          <textarea
            name="state"
            className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2"
            rows={3}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          <button type="submit" className="bg-orange-500 text-white px-10 rounded-md p-3">
            Save
          </button>
          <button type="button" className="bg-gray-500 text-white px-10 rounded-md p-3" onClick={() => router.back()}>
            Cancel
          </button>
          <button type="button" className="bg-blue-600 text-white px-10 rounded-md p-3" onClick={() => setShowBulkForm((prev) => !prev)}>
            Bulk Upload
          </button>
        </div>
      </form>

      {showBulkForm && (
        <form onSubmit={handleBulkSubmit} className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-2">Bulk Upload CSV/Excel</h3>
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={(e) => setBulkFile(e.target.files[0])}
            className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2"          />
          <div className="mt-3">
            <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded-md">
              Upload File
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
