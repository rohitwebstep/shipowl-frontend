"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useAdmin } from "../middleware/AdminMiddleWareContext";

export default function Create() {
  const router = useRouter();
  const { verifyAdminAuth } = useAdmin();

  const [validationErrors, setValidationErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    iso_2: "",
    country_id: "",
    type: "",
    status: "active",
  });

  useEffect(() => {
    verifyAdminAuth();
  }, [verifyAdminAuth]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

 

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "State name is required.";
    if (!formData.iso_2.trim()) errors.iso_2 = "ISO 2 code is required.";
    if (!formData.country_id.trim()) errors.country_id = "Country ID is required.";
    if (!formData.type.trim()) errors.type = "Type is required.";
    if (!formData.status.trim()) errors.status = "status is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
    if (!dropshipperData?.project?.active_panel === "supplier") {
      localStorage.clear("shippingData");
      router.push("/admin/auth/login");
      return;
    }

    const token = dropshipperData?.security?.token;
    if (!token) {
      router.push("/admin/auth/login");
      return;
    }

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    setValidationErrors({});

    try {
      Swal.fire({
        title: "Creating state...",
        text: "Please wait while we save your state.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }
      files.forEach((file) => {
        form.append("image", file);
      });

      const response = await fetch("https://sleeping-owl-we0m.onrender.com/api/state", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      Swal.close();

      if (!response.ok) {
        const errorMessage = await response.json();
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: errorMessage.message || errorMessage.error || "An error occurred",
        });
        return;
      }

      const result = await response.json();
      if (result) {
        Swal.fire({
          icon: "success",
          title: "State Created",
          text: "The state has been created successfully!",
          showConfirmButton: true,
        }).then((res) => {
          if (res.isConfirmed) {
            setFormData({
              name: "",
              iso_2: "",
              country_id: "",
              type: "",
              status: "active",
            });
            setFiles([]);
            router.push("/supplier/state/list");
          }
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: error.message || "Something went wrong. Please try again.",
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="add-warehouse xl:w-8/12">
      <div className="bg-white rounded-2xl p-5">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            {[
              { label: "State Name", name: "name" },
              { label: "ISO 2 Code", name: "iso_2" },
              { label: "Country ID", name: "country_id" },
              { label: "Type", name: "type" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label htmlFor={name} className="font-bold block text-[#232323]">
                  {label} <span className="text-red-500 text-lg">*</span>
                </label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  id={name}
                  onChange={handleChange}
                  className={`text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold ${
                    validationErrors.type? "border-red-500" : "border-[#E0E5F2]"
                  }`}
                />
                {validationErrors.type&& (
                  <p className="text-red-500 text-sm mt-1">{validationErrors[name]}</p>
                )}
              </div>
            ))}
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
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" className="bg-gray-500 text-white px-6 rounded-md p-3" onClick={() => router.back()}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
