'use client';

import { useState, createContext, useCallback } from 'react';
import { useRouter } from "next/navigation";

const ProductContext = createContext();

const CategoryProvider = ({ children }) => {
    const router = useRouter();
    const [categoryData, setCategoryData] = useState([]);
    const [isEdit, setIsEdit] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

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
            const response = await fetch(
                `https://sleeping-owl-we0m.onrender.com/api/category`,
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
                setCategoryData(result?.categories);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
        }
    }, [router]);

    return (
        <ProductContext.Provider value={{ formData, categoryData,setIsEdit,isEdit, setCategoryData, setFormData, fetchCategory }}>
            {children}
        </ProductContext.Provider>
    );
};

export { CategoryProvider, ProductContext };
