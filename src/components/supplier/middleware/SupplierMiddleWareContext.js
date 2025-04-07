import { createContext, useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const SupplierMiddleWareContext = createContext();

export const useSupplier = () => {
    const context = useContext(SupplierMiddleWareContext);
    if (!context) {
        throw new Error("useAdmin must be used within an SupplierMiddleWareProvider");
    }
    return context;
};

export default function SupplierMiddleWareProvider({ children }) {
    const [supplierApi, setSupplierApi] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();



    // ✅ Moved async logic to a stable function using useCallback
    const verifySupplierAuth = useCallback(async () => {
        setLoading(true);
        const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
        if (!dropshipperData?.project?.active_panel == "supplier") {
            localStorage.clear("shippingData");
            router.push("/supplier/auth/login");
        }
        const suppliertoken = dropshipperData?.security?.token;
        if (!suppliertoken) {
            router.push("/supplier/auth/login");

        };

        try {
            const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/supplier/auth/verify`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${suppliertoken}`,
                },
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Session Expired",
                    text: errorMessage.error || errorMessage.message || "Your session has expired. Please log in again.",
                });
                throw new Error(errorMessage.message || errorMessage.error || "Session expired");
            }

            const result = await response.json();

            if (result.message !== "Token is valid") {
                Swal.fire({
                    icon: "error",
                    title: "Unauthorized",
                    text: "Invalid token or unauthorized access.",
                });
                router.push("/supplier/auth/login");
                return;
            }

        } catch (error) {
            console.error("Error:", error);
            setError(error.message || "Something went wrong");
            router.push("/supplier/auth/login");
        } finally {
            setLoading(false);
        }
    }, [router]);

    // ✅ Run verifyDropShipperAuth when adminToken changes


    return (
        <SupplierMiddleWareContext.Provider value={{ supplierApi, setSupplierApi, verifySupplierAuth, error, loading }}>
            {children}
        </SupplierMiddleWareContext.Provider>
    );
}
