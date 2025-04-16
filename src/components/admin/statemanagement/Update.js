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
              iso_2: "",
              country_id: "",
              type: "",
              status: "active",
    });

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { verifySupplierAuth } = useAdmin();
    const router = useRouter();

    useEffect(() => {
        verifySupplierAuth();
    }, [verifySupplierAuth]);

    const validate = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'State name is required.';
        if (!formData.iso_2.trim()) errors.iso_2 = 'ISO 2 code is required.';
        if (!formData.country_id.trim()) errors.country_id = 'Country ID is required.';
        if (!formData.type.trim()) errors.type = 'Type is required.';
        if (!formData.status.trim()) errors.status = 'Status is required.';
        return errors;
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchstate = useCallback(async () => {
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
                `https://sleeping-owl-we0m.onrender.com/api/state/${id}`,
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
            const state = result?.state || {};

            setFormData({
                name: state.name || '',
                name: "",
                description: "",
                iso_2: "",
                country_id: "",
                type: "",
                status: "active",
            });
        } catch (error) {
            console.error("Error fetching state:", error);
        } finally {
            setLoading(false);
        }
    }, [router, id]);

    useEffect(() => {
        fetchstate();
    }, [fetchstate]);

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
                title: 'Updating state...',
                text: 'Please wait while we save your state.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const url = `https://sleeping-owl-we0m.onrender.com/api/state/${id}`;
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
                title: "state Updated",
                text: `The state has been updated successfully!`,
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
                    router.push("/supplier/state");
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
        <section className="add-state xl:w-8/12">
            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-2xl p-5 ">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                        <div>
                            <label className="font-bold block text-[#232323]">State Name</label>
                            <input type="text" onChange={handleChange} value={formData?.name} id="name" name="name" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="Charlene Store House" />
                            {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
                        </div>
                        <div>
                            <label className="font-bold block text-[#232323]">ISO 2 Code</label>
                            <input type="text" value={formData?.iso_2} onChange={handleChange} name="iso_2" id="iso_2" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="GST289571412" />
                            {validationErrors.iso_2 && <p className="text-red-500 text-sm mt-1">{validationErrors.iso_2}</p>}
                        </div>
                        <div>
                            <label className="font-bold block text-[#232323]">Country ID</label>
                            <input type="text" value={formData?.country_id} onChange={handleChange} name="country_id" id="country_id" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="Charlene Reed " />
                            {validationErrors.country_id && <p className="text-red-500 text-sm mt-1">{validationErrors.country_id}</p>}
                        </div>
                        <div>
                            <label className="font-bold block text-[#232323]">Type</label>
                            <input type="text" value={formData?.type} onChange={handleChange} name="type" id="type" className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold" placeholder="+9876543210" />
                            {validationErrors.type && <p className="text-red-500 text-sm mt-1">{validationErrors.type}</p>}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                        <button type="submit" className="bg-orange-500 text-white px-15 rounded-md p-3">Update</button>
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-15 rounded-md p-3"
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
