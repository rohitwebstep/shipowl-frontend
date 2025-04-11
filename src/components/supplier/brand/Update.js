"use client"

import { useContext, useEffect, useCallback, useState } from 'react'
import { BrandContext } from './BrandContext'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { useSupplier } from '../middleware/SupplierMiddleWareContext'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // 👈 Import Navigation module
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
            [name]: type === 'checkbox' ? (checked ? true : false) : value
        }));
    };


    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const validate = () => {
        const errors = {};

        if (!formData.name || formData.name.trim() === '') {
            errors.name = 'Brand name is required.';
        }
        if (!formData.description || formData.description.trim() === '') {
            errors.description = 'Brand description is required.';
        }
        if (!files || files.length === 0) {
            errors.image = 'At least one brand image is required.';
        }

        return errors;
    };


    const fetchCategory = useCallback(async () => {
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
                `https://sleeping-owl-we0m.onrender.com/api/brand/${id}`,
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
            if (result) {
                const currentCat = result?.brand || [];
                console.log('currentCat', currentCat)
                setFormData({
                    name: currentCat.name || '',
                    description: currentCat.description || '',
                    status: currentCat.status || '',
                    image: currentCat.image || ''
                })
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);
    useEffect(() => {
        fetchCategory();
    }, [fetchCategory])

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
        if (!dropshipperData?.project?.active_panel === "supplier") {
            localStorage.clear("shippingData");
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
                title: 'Updating Brand',
                text: 'Please wait while we save your brand.',
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
                files.forEach((file, index) => {
                    form.append('image', file); // use 'images[]' if backend expects an array
                });
            }

            const url = `https://sleeping-owl-we0m.onrender.com/api/brand/${id}`

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
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
                    title: "Brand Updated",
                    text: `The brand has been updated successfully!`,
                    showConfirmButton: true,
                }).then((res) => {
                    if (res.isConfirmed) {
                        setFormData({ name: '', description: '', image: '' });
                        setFiles(null);
                        router.push("/supplier/brand/list");
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
        if (!dropshipperData?.project?.active_panel === "supplier") {
            localStorage.clear("shippingData");
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
                title: isEdit ? 'Updating Brand...' : 'Creating Brand...',
                text: 'Please wait while we save your brand.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const url = `https://sleeping-owl-we0m.onrender.com/api/brand/${id}/image/${index}`

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
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
                    title: "Image Deleted",
                    text: `The Image has been updated successfully!`,
                    showConfirmButton: true,
                }).then((res) => {
                    if (res.isConfirmed) {
                        setFormData({ name: '', description: '', image: '' });
                        setFiles(null);
                        fetchCategory();
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
    }


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
                                        Brand Name <span className='text-red-500 text-lg'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData?.name}
                                        id="name"
                                        onChange={handleChange}
                                        className={`text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold  ${validationErrors.name ? "border-red-500" : "border-[#E0E5F2]"
                                            } `} />
                                    {validationErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="description" className="font-bold block text-[#232323]">
                                        Brand Description <span className='text-red-500 text-lg'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        id="description"
                                        onChange={handleChange}
                                        className={`text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold  ${validationErrors.description ? "border-red-500" : "border-[#E0E5F2]"
                                            } `}
                                    />
                                    {validationErrors.description && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                                    )}
                                </div>
                            </div>

                            <div className='mt-2'>
                                <label htmlFor="image" className="font-bold block text-[#232323]">
                                    Brand Image <span className='text-red-500 text-lg'>*</span>
                                </label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    name="image"
                                    multiple
                                    id="image"
                                    className={`text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold  ${validationErrors.image ? "border-red-500" : "border-[#E0E5F2]"
                                        } `} />
                                {formData?.image && (
                                    <div className="mt-2">
                                        <Swiper
                                            key={formData.id}
                                            modules={[Navigation]}
                                            slidesPerView={2}
                                            loop={formData.image?.split(',').length > 1}
                                            navigation={true}
                                            className="mySwiper w-full ms-2"
                                        >
                                            {formData.image?.split(',').map((img, index) => (
                                                <SwiperSlide key={index} className="relative gap-3">
                                                    {/* Delete Button */}
                                                    <button
                                                        type="button"
                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                                                        onClick={() => {
                                                            Swal.fire({
                                                                title: 'Are you sure?',
                                                                text: `Do you want to delete this image?`,
                                                                icon: 'warning',
                                                                showCancelButton: true,
                                                                confirmButtonColor: '#d33',
                                                                cancelButtonColor: '#3085d6',
                                                                confirmButtonText: 'Yes, delete it!'
                                                            }).then((result) => {
                                                                if (result.isConfirmed) {

                                                                    handleImageDelete(index); // Call your delete function
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        ✕
                                                    </button>

                                                    {/* Image */}
                                                    <Image
                                                        src={`https://placehold.co/600x400?text=${index + 1}` || img.trim()}
                                                        alt={`Image ${index + 1}`}
                                                        width={500}
                                                        height={500}
                                                        className="me-3 p-2 object-cover rounded"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>

                                )}
                                {validationErrors.image && (
                                    <p className="text-red-500 text-sm mt-1">{validationErrors.image}</p>
                                )}
                            </div>
                            <div>

                                <label className="flex mt-2 items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name='status'
                                        className="sr-only"
                                        checked={formData.status}
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
                                    <span className="ms-2 text-sm text-gray-600">
                                        Status
                                    </span>
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-5">
                                <button type="submit" className="bg-orange-500 text-white px-15 rounded-md p-3">
                                    UPDATE
                                </button>
                                <button type="button" className="bg-gray-500 text-white px-15 rounded-md p-3" onClick={() => router.back()}>
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
