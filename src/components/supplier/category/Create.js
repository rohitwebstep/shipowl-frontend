"use client"

import { useContext, useEffect, useState } from 'react'
import { CategoryContext } from './CategoryContext'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { useSupplier } from '../middleware/SupplierMiddleWareContext'

export default function Create() {
    const router = useRouter();
    const { formData, setFormData } = useContext(CategoryContext);
    const [validationErrors, setValidationErrors] = useState({});

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { verifySupplierAuth } = useSupplier();
    useEffect(() => {
        verifySupplierAuth()
    }, [verifySupplierAuth])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        const errors = {};
        if (!formData.name || formData.name.trim() === '') {
            errors.name = 'Category name is required.';
        }
        if (!formData.description || formData.description.trim() === '') {
            errors.description = 'Category description is required.';
        }
        if (!file) {
            errors.image = 'Category image is required.';
        }
        return errors;
    };


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
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
            // Show SweetAlert loading
            Swal.fire({
                title: 'Creating Category...',
                text: 'Please wait while we save your category.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const form = new FormData();
            form.append('name', formData.name);
            form.append('description', formData.description);
            if (file) {
                form.append('image', file);
            }

            const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/category/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: form,
            });

            if (!response.ok) {
                Swal.close(); // Ensure loading is stopped
                const errorMessage = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Creation Failed",
                    text: errorMessage.message || errorMessage.error || "An error occurred",
                });
                throw new Error(errorMessage.message || errorMessage.error || "Creation failed");
            }

            const result = await response.json();

            Swal.close(); // Success: close loading

            if (result) {
                Swal.fire({
                    icon: "success",
                    title: "Category Created",
                    text: "The category has been created successfully!",
                    showConfirmButton: true,
                }).then((res) => {
                    if (res.isConfirmed) {
                        setFormData({ title: '', description: '' });
                        setFile(null);
                        router.push("/supplier/category/list");
                    }
                });
            }

        } catch (error) {
            console.error("Error:", error);
            Swal.close(); // Ensure loading is closed on catch
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
        <section className="add-warehouse xl:w-8/12">
            <div className="bg-white rounded-2xl p-5 ">
                <form onSubmit={handleSubmit}>

                    <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                        <div>
                            <label htmlFor="name" className="font-bold block text-[#232323]">
                                Category Name <span className='text-red-500 text-lg'>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData?.name}
                                id="name"
                                onChange={handleChange}
                                className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold"
                            />
                            {validationErrors.name && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="font-bold block text-[#232323]">
                                Category Description <span className='text-red-500 text-lg'>*</span>
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                id="description"
                                onChange={handleChange}
                                className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold"
                            />
                            {validationErrors.description && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                            )}
                        </div>

                    </div>
                    <div className='mt-2'>
                        <label htmlFor="image" className="font-bold block text-[#232323]">
                            Category Image <span className='text-red-500 text-lg'>*</span>
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            name="image"
                            id="image"
                            className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-3 mt-2 font-bold"
                        />
                        {validationErrors.image && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.image}</p>
                        )}
                    </div>


                    <div className="flex flex-wrap gap-3 mt-5">
                        <button type="submit" className="bg-orange-500 text-white px-15 rounded-md p-3">
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" className="bg-gray-500 text-white px-15 rounded-md p-3" onClick={() => router.back()}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
