import { createContext, useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const DropshipperMiddleWareContext = createContext();

export const useDropshipper = () => {
    const context = useContext(DropshipperMiddleWareContext);
    if (!context) {
        throw new Error("useAdmin must be used within an DropshipperMiddleWareProvider");
    }
    return context;
};

export default function DropshipperMiddleWareProvider({ children }) {
    const [dropShipperApi, setDropShipperApi] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const verifyDropShipperAuth = useCallback(async () => {
        setLoading(true);
        const supplierData = JSON.parse(localStorage.getItem("shippingData"));
        const dropshipper_token = supplierData?.security?.token;

        // ✅ Corrected the condition for active panel
        if (supplierData?.project?.active_panel !== "dropshipper") {
            localStorage.removeItem("shippingData"); // Correct way to remove item
            router.push("/dropshipping/auth/login");
            return; // Stop further execution
        }

        if (!dropshipper_token) {
            router.push("/dropshipping/auth/login");
            return; // Stop further execution
        }

        try {
            const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/dropshipper/auth/verify`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dropshipper_token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Something Wrong!",
                    text: errorMessage.error || errorMessage.message || "Your session has expired. Please log in again.",
                });
                throw new Error(errorMessage.message || errorMessage.error || "Something Wrong!");
            }

            const result = await response.json();

            if (result.message !== "Token is valid") {
                Swal.fire({
                    icon: "error",
                    title: "Unauthorized",
                    text: "Invalid token or unauthorized access.",
                });
                router.push("/dropshipping/auth/login");
                return;
            }


        } catch (error) {
            console.error("Error:", error);
            setError(error.message || "Something went wrong");
            router.push("/dropshipping/auth/login");
        } finally {
            setLoading(false);
        }
    }, [router, setLoading]);


    return (
        <DropshipperMiddleWareContext.Provider value={{ dropShipperApi, setDropShipperApi, verifyDropShipperAuth, error, loading }}>
            {children}
        </DropshipperMiddleWareContext.Provider>
    );
}
