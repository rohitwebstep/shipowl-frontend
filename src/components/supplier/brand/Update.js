"use client";

import { useContext, useEffect, useCallback, useState } from 'react';
import { BrandContext } from './BrandContext';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useSupplier } from '../middleware/SupplierMiddleWareContext';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useSearchParams } from 'next/navigation';
import HashLoader from "react-spinners/HashLoader";

export default function Update() {
    const router = useRouter();
    const { formData, setFormData, isEdit } = useContext(BrandContext);
    const [validationErrors, setValidationErrors] = useState({});
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { verifySupplierAuth } = useSupplier();

    useEffect(() => {
        verifySupplierAuth();
    }, [verifySupplierAuth]);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const validate = () => {
        const errors = {};

        if (!formData.name || formData.name.trim() === '') {
            errors.name = 'Category name is required.';
        }
        if (!formData.description || formData.description.trim() === '') {
            errors.description = 'Category description is required.';
        }
        if ((!files || files.length === 0) && (!formData.image || formData.image.trim() === '')) {
            errors.image = 'At least one category image is required.';
        }

        return errors;
    };

    const fetchCategory = useCallback(async () => {
        if (!id) {
            Swal.fire({
                icon: "error",
                title: "Invalid Category",
                text: "No category ID provided.",
            });
            router.push("/supplier/category/list");
            return;
        }

        const supplierData = JSON.parse(localStorage.getItem("shippingData"));

        if (supplierData?.project?.active_panel !== "supplier") {
            localStorage.removeItem("shippingData");
            router.push("/supplier/auth/login");
            return;
        }

        const suppliertoken = supplierData?.security?.token;
        if (!suppliertoken) {
            router.push("/supplier/auth/login");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `https://shipping-owl-vd4s.vercel.app/api/category/${id}`,
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
                    text:
                        errorMessage.error ||
                        errorMessage.message ||
                        "Your session has expired. Please log in again.",
                });
                throw new Error(
                    errorMessage.message || errorMessage.error || "Session expired"
                );
            }

            const result = await response.json();
            if (result && result.category) {
                const currentCat = result.category;
                console.log('currentCat', currentCat);
                setFormData({
                    name: currentCat.name || '',
                    description: currentCat.description || '',
                    status: currentCat.status || false,
                    image: currentCat.image || ''
                });
            }
        } catch (error) {
            console.error("Error fetching category:", error);
        } finally {
            setLoading(false);
        }
    }, [router, id, setFormData]);

    useEffect(() => {
        fetchCategory();
    }, [fetchCategory]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
        if (dropshipperData?.project?.active_panel !== "supplier") {
            localStorage.removeItem("shippingData");
            router.push("/supplier/auth/login");
            return;
        }

        const token = dropshipperData?.security?.token;
        if (!token) {
            router.push("/supplier/auth/login");
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
                title: 'Updating Category...',
                text: 'Please wait while we save your category.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const form = new FormData();
            form.append('name', formData.name);
            form.append('description', formData.description);
            form.append('status', formData.status);
            if (files.length > 0) {
                files.forEach((file) => {
                    form.append('images[]', file); // Adjust based on backend requirements
                });
            }

            const url = `https://shipping-owl-vd4s.vercel.app/api/category/${id}`;

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            if (!response.ok) {
                Swal.close();
                const errorMessage = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Update Failed",
                    text: errorMessage.message || errorMessage.error || "An error occurred",
                });
                throw new Error(errorMessage.message || errorMessage.error || "Submission failed");
            }

            const result = await response.json();
            Swal.close();

            if (result) {
                Swal.fire({
                    icon: "success",
                    title: "Category Updated",
                    text: `The category has been updated successfully!`,
                    showConfirmButton: true,
                }).then((res) => {
                    if (res.isConfirmed) {
                        setFormData({ name: '', description: '', image: '', status: false });
                        setFiles([]);
                        router.push("/supplier/category/list");
                    }
                });
            }
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

    const handleImageDelete = async (index) => {
        setLoading(true);

        const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
        if (dropshipperData?.project?.active_panel !== "supplier") {
            localStorage.removeItem("shippingData");
            router.push("/supplier/auth/login");
            return;
        }

        const token = dropshipperData?.security?.token;
        if (!token) {
            router.push("/supplier/auth/login");
            return;
        }

        try {
            Swal.fire({
                title: 'Deleting Image...',
                text: 'Please wait while we remove the image.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const url = `https://shipping-owl-vd4s.vercel.app/api/category/${id}/image/${index}`;

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                Swal.close();
                const errorMessage = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Delete Failed",
                    text: errorMessage.message || errorMessage.error || "An error occurred",
                });
                throw new Error(errorMessage.message || errorMessage.error || "Submission failed");
            }

            const result = await response.json();
            Swal.close();

            if (result) {
                Swal.fire({
                    icon: "success",
                    title: "Image Deleted",
                    text: `The image has been deleted successfully!`,
                    showConfirmButton: true,
                }).then((res) => {
                    if (res.isConfirmed) {
                        fetchCategory(); // Refresh formData with updated images
                    }
                });
            }
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

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <HashLoader color="orange" />
                </div>
            ) : (
                <section className="add-warehouse xl:w-8/12">
                    <div className="bg-white rounded-2xl p-5">
                        <form onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                                <div>
                                    <label htmlFor="name" className="font-bold block text-[#232323]">
                                        Category Name <span className="text-red-500 text-lg">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData?.name || ''}
                                        id="name"
                                        onChange={handleChange}
                                        className={`text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold ${validationErrors.name ? "border-red-500" : "border-[#E0E5F2]"
                                            }`}
                                    />
                                    {validationErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="description" className="font-bold block text-[#232323]">
                                        Category Description <span className="text-red-500 text-lg">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description || ''}
                                        id="description"
                                        onChange={handleChange}
                                        className={`text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold ${validationErrors.description ? "border-red-500" : "border-[#E0E5F2]"
                                            }`}
                                    />
                                    {validationErrors.description && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-2">
                                <label htmlFor="image" className="font-bold block text-[#232323]">
                                    Upload Category Images <span className="text-red-500 text-lg">*</span>
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    multiple
                                    onChange={handleFileChange}
                                    className={`text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold ${validationErrors.image ? "border-red-500" : "border-[#E0E5F2]"
                                        }`}
                                />
                                {validationErrors.image && (
                                    <p className="text-red-500 text-sm mt-1">{validationErrors.image}</p>
                                )}

                                {formData.image && Array.isArray(formData.image) && formData.image.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {formData.image.map((img, index) => (
                                            <div key={index} className="relative">
                                                <Image
                                                    src={img}
                                                    alt={`Category Image ${index + 1}`}
                                                    width={100}
                                                    height={100}
                                                    className="rounded-md object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleImageDelete(index)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                                    title="Delete Image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                            <div>
                                <label className="flex mt-2 items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="status"
                                        className="sr-only"
                                        checked={formData.status || false}
                                        onChange={handleChange}
                                    />
                                    <div
                                        className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${formData.status ? "bg-orange-500" : ""
                                            }`}
                                    >
                                        <div
                                            className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${formData.status ? "translate-x-5" : ""
                                                }`}
                                        ></div>
                                    </div>
                                    <span className="ms-2 text-sm text-gray-600">Status</span>
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-5">
                                <button type="submit" className="bg-orange-500 text-white px-15 rounded-md p-3">
                                    UPDATE
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-15 rounded-md p-3"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}
        </>
    );
}