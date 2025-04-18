"use client"
import { useEffect, useState, useCallback } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { HashLoader } from 'react-spinners'
import { useAdmin } from '../middleware/AdminMiddleWareContext'

export default function Update() {
    const [formData, setFormData] = useState({
            name: "",
            state_id: "",
            country_id: "",
          });

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { verifyAdminAuth } = useAdmin();
    const router = useRouter();

    useEffect(() => {
        verifyAdminAuth();
    }, [verifyAdminAuth]);

    const validate = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = ' name is required.';
        if (!formData.state_id.trim()) errors.gst_number = 'State Id is required.';
        if (!formData.country_id.trim()) errors.contact_name = 'Country Id is required.';
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchwarehouse = useCallback(async () => {
        const supplierData = JSON.parse(localStorage.getItem("shippingData"));

        if (supplierData?.project?.active_panel !== "supplier") {
            localStorage.removeItem("shippingData");
            router.push("/admin/auth/login");
            return;
        }

        const suppliertoken = supplierData?.security?.token;
        if (!suppliertoken) {
            router.push("/admin/auth/login");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `https://shipping-owl-vd4s.vercel.app/api/warehouse/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${suppliertoken}`,
                    },
                }
            );

            if (!response.ok) {
                const errorMessage = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Session Expired",
                    text: errorMessage.message || "Your session has expired. Please log in again.",
                });
                throw new Error(errorMessage.message);
            }

            const result = await response.json();
            const cityData = result?.city || {};

            setFormData({
                name:cityData?.name || "",
                state_id:cityData?.state_id || "",
                country_id:cityData?.country_id|| "",
              });
        } catch (error) {
            console.error("Error fetching warehouse:", error);
        } finally {
            setLoading(false);
        }
    }, [router, id]);

    useEffect(() => {
        fetchwarehouse();
    }, [fetchwarehouse]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const supplierData = JSON.parse(localStorage.getItem("shippingData"));
        if (supplierData?.project?.active_panel !== "supplier") {
            localStorage.clear("shippingData");
            router.push("/admin/auth/login");
            return;
        }

        const token = supplierData?.security?.token;
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
                title: 'Updating Warehouse...',
                text: 'Please wait while we save your warehouse.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const url = `https://shipping-owl-vd4s.vercel.app/api/warehouse/${id}`;
            const form = new FormData();
            for (const key in formData) {
                if (formData[key]) {
                    form.append(key, formData[key]);
                }
            }

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: form,
            });

            if (!response.ok) {
                Swal.close();
                const errorMessage = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Update Failed",
                    text: errorMessage.message || "An error occurred",
                });
                throw new Error(errorMessage.message || "Update failed");
            }

            Swal.close();
            Swal.fire({
                icon: "success",
                title: "Warehouse Updated",
                text: `The warehouse has been updated successfully!`,
                showConfirmButton: true,
            }).then((res) => {
                if (res.isConfirmed) {
                    setFormData({
                        name: '',
                        state_id: '',
                        country_id: '',
                    });
                    router.push("/supplier/warehouse");
                }
            });
        } catch (error) {
            console.error("Error:", error);
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Submission Error",
                text: error.message || "Something went wrong. Please try again.",
            });
            setError(error.message || "Submission failed.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <HashLoader size={60} color="#F97316" loading={true} />
            </div>
        );
    }

    return (
        <section className="add-warehouse xl:w-8/12">
              <form onSubmit={handleSubmit} className="p-4 rounded-md bg-white shadow">
              <div>
            <label className="font-bold block text-[#232323]">Country</label>
            <Select
              name="countryId"
              value={countryOptions.find((option) => option.value === formData.countryId)}
              onChange={(selectedOption) =>
                handleChange({ target: { name: 'countryId', value: selectedOption?.value } })
              }
              options={countryOptions}
              placeholder="Select a country"
              className="mt-1"
              classNamePrefix="react-select"
            />
            {validationErrors.countryId && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.countryId}</p>
            )}
          </div>
          <div className="pt-2">
              <label className="font-bold block text-[#232323]">State</label>
              <select
                name="stateId"
                value={formData.stateId}
                onChange={handleChange}
                className="border w-full border-[#DFEAF2] rounded-md p-3 mt-1"
              >
                <option value="">Select a state</option>
                {stateData.map((item) => (
                  <option key={item.id || item._id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {validationErrors.stateId && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.countryId}</p>
              )}
            </div>
          <div className="pt-2">
              <label className="font-bold block text-[#232323]">City</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border w-full border-[#DFEAF2] rounded-md p-3 mt-1"
              />
               
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>
          <div>

        

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 rounded-md p-3"
            >
              Update
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
        </section>
    );
}
