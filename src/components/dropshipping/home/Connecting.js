"use client"
import { useEffect } from "react";
import { useDropshipper } from "../middleware/DropshipperMiddleWareContext";
import { useSearchParams } from "next/navigation";
export default function Connecting() {
  const { verifyDropShipperAuth } = useDropshipper();
  const searchParams = useSearchParams();
  const shop = searchParams.get('shop');

  const fetchStores = useCallback(async () => {
    const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));

    if (dropshipperData?.project?.active_panel !== "dropshipper") {
      localStorage.removeItem("shippingData");
      router.push("/dropshipping/auth/login");
      return;
    }

    const token = dropshipperData?.security?.token;
    if (!token) {
      router.push("/dropshipping/auth/login");
      return;
    }

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    setValidationErrors({});
    setLoading(true);

    try {
      const form = new FormData();
      form.append('shop', shop);

      const url = "https://sleeping-owl-we0m.onrender.com/api/dropshipper/shopify/connect";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await response.json();
      if (!response.ok) {
        router.push('/dropshipping/shopify/failed');

      } else {
        setFormData({ name: '' });
        router.push(result.installUrl);
      }
    } catch (error) {
      console.error("Error:", error);
      router.push('/dropshipping/shopify/failed');
      setError(error.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  }, [router,]); // ← Add formData.shop to the dependency array
  useEffect(() => {
    const fetchData = async () => {
      await verifyDropShipperAuth();
      await fetchStores();
    };
    fetchData();
  }, [verifyDropShipperAuth, fetchStores]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
      <div className="w-20 h-20 border-8 border-orange-500 border-t-transparent rounded-full animate-spin mb-6" />
      <h1 className="text-xl font-semibold text-gray-800">Connecting your Shopify store...</h1>
      <p className="text-gray-500 mt-2">Please wait while we establish a secure connection.</p>
    </div>
  );
}
