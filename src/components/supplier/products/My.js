'use client';

import Image from 'next/image';
import productimg from '@/app/assets/product1.png';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { HashLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { useSupplier } from '../middleware/SupplierMiddleWareContext';
export default function My() {
    const { verifySupplierAuth } = useSupplier();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(null);
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [inventoryData, setInventoryData] = useState({
        productId: "",
        variant: [],
        id: '',
        isVarientExists: '',
    });
    const [showVariantPopup, setShowVariantPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isTrashed, setIsTrashed] = useState(false);
    const fetchProducts = useCallback(async () => {
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
                `https://sleeping-owl-we0m.onrender.com/api/supplier/product/inventory?type=my`,
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
                    title: "Something Wrong!",
                    text:
                        errorMessage.error ||
                        errorMessage.message ||
                        "Your session has expired. Please log in again.",
                });
                throw new Error(
                    errorMessage.message || errorMessage.error || "Something Wrong!"
                );
            }

            const result = await response.json();
            if (result) {
                setProducts(result?.products || []);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [router, setProducts]);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await verifySupplierAuth();
            await fetchProducts();
            setLoading(false);
        };
        fetchData();
    }, []);
    const handleVariantChange = (variantId, field, value) => {
        setInventoryData((prevData) => ({
            ...prevData,
            variant: prevData.variant.map((variant) =>
                variant.variantId === variantId
                    ? { ...variant, [field]: value }
                    : variant
            ),
        }));
    };


    const trashProducts = useCallback(async () => {
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
            const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/supplier/product/my-inventory/trashed`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${suppliertoken}`,
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
            if (result) {
                setProducts(result?.products || []);
            }
        } catch (error) {
            console.error("Error fetching trashed categories:", error);
        } finally {
            setLoading(false);
        }
    }, [router, setProducts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const supplierData = JSON.parse(localStorage.getItem("shippingData"));
        if (supplierData?.project?.active_panel !== "supplier") {
            localStorage.clear("shippingData");
            router.push("/supplier/auth/login");
            return;
        }

        const token = supplierData?.security?.token;
        if (!token) {
            router.push("/supplier/auth/login");
            return;
        }

        try {
            Swal.fire({
                title: ' Product...',
                text: 'Please wait while we save your Product.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const form = new FormData();
            const simplifiedVariants = inventoryData.variant.map((v) => ({
                variantId: v.id || v.variantId,
                stock: v.stock,
                price: v.price,
                status: v.status
            }));

            console.log('inventoryData', inventoryData);
            console.log('simplifiedVariants', simplifiedVariants);
            form.append('productId', inventoryData.productId);
            form.append('variants', JSON.stringify(simplifiedVariants));


            const url = `https://sleeping-owl-we0m.onrender.com/api/supplier/product/my-inventory/${inventoryData.id}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            const result = await response.json();

            Swal.close();

            if (!response.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Updation Failed",
                    text: result.message || result.error || "An error occurred",
                });
                return;
            }

            // On success
            Swal.fire({
                icon: "success",
                title: "Product Updated",
                text: result.message || `The Product has been Updated successfully!`,
                showConfirmButton: true,
            }).then((res) => {
                if (res.isConfirmed) {
                    setInventoryData({
                        productId: "",
                        stock: "",
                        price: "",
                        status: "",
                        id: '',
                    });
                    setShowPopup(false);
                    fetchProducts();
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
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (item) => {
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

        const confirmResult = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (!confirmResult.isConfirmed) return;

        try {
            Swal.fire({
                title: "Deleting...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            setLoading(true);

            const response = await fetch(
                `https://sleeping-owl-we0m.onrender.com/api/supplier/product/my-inventory/${item.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${suppliertoken}`,
                    },
                }
            );

            Swal.close();

            if (!response.ok) {
                const errorMessage = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMessage.error || errorMessage.message || "Failed to delete.",
                });
                setLoading(false);
                return;
            }

            const result = await response.json();

            Swal.fire({
                icon: "success",
                title: "Trash!",
                text: result.message || `${item.name} has been Trashed successfully.`,
            });

            await fetchProducts();
        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };
    const handlePermanentDelete = async (item) => {
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

        const confirmResult = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (!confirmResult.isConfirmed) return;

        try {
            Swal.fire({
                title: "Deleting...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            setLoading(true);

            const response = await fetch(
                `https://sleeping-owl-we0m.onrender.com/api/supplier/product/my-inventory/${item.id}/destroy`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${suppliertoken}`,
                    },
                }
            );

            Swal.close();

            if (!response.ok) {
                const errorMessage = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMessage.error || errorMessage.message || "Failed to delete.",
                });
                setLoading(false);
                return;
            }

            const result = await response.json();

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: result.message || `${item.name} has been deleted successfully.`,
            });

            await trashProducts();
        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = useCallback(async (item) => {
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
                `https://sleeping-owl-we0m.onrender.com/api/supplier/product/my-inventory/${item?.id}/restore`,
                {
                    method: "PATCH",
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
                    title: "Something Wrong!",
                    text:
                        errorMessage.error ||
                        errorMessage.message ||
                        "Your session has expired. Please log in again.",
                });
                throw new Error(
                    errorMessage.message || errorMessage.error || "Something Wrong!"
                );
            }

            const result = await response.json();
            if (result.status) {
                Swal.fire({
                    icon: "success",
                    text: `product Has Been Restored Successfully !`,
                });
                await trashProducts();
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }, [router, trashProducts]);


    const handleEdit = async (item, id) => {
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
                `https://sleeping-owl-we0m.onrender.com/api/supplier/product/my-inventory/${item.id}`,
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
                    title: "Something Wrong!",
                    text: errorMessage.message || "Your session has expired. Please log in again.",
                });
                throw new Error(errorMessage.message);
            }

            const result = await response.json();
            const items = result?.supplierProduct || {};


            setInventoryData({
                productId: items.product?.id || "",
                isVarientExists: items.product.isVarientExists || "",
                id: id, // or items.product?.id if you prefer
                variant: (items.variants || []).map((v) => ({
                    variantId: v.id || v.variantId,
                    stock: v.stock,
                    price: v.price,
                    sku: v.variant.sku || v.sku,
                    name: v.variant.name || v.name,
                    modal: v.variant.modal || v.modal,
                    color: v.variant.color || v.color,
                    suggested_price: v.variant.suggested_price || v.suggested_price,
                    status: v.variant.status || v.status,
                    image: v.variant?.image || '',
                }))
            });
            setShowPopup(true);

        } catch (error) {
            console.error("Error fetching category:", error);
        } finally {
            setLoading(false);
        }


    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <HashLoader size={60} color="#F97316" loading={true} />
            </div>
        );
    }



    return (
        <>
            <div className="flex flex-wrap md:justify-end gap-3 justify-center mb-6">

                <div className="flex justify-end gap-2">
                    <button
                        className={`p-3 text-white rounded-md ${isTrashed ? 'bg-green-500' : 'bg-red-500'}`}
                        onClick={async () => {
                            if (isTrashed) {
                                setIsTrashed(false);
                                await fetchProducts();
                            } else {
                                setIsTrashed(true);
                                await trashProducts();
                            }
                        }}
                    >
                        {isTrashed ? "Product Listing (Simple)" : "Trashed Product"}
                    </button>

                </div>

            </div>
            {products.length === 0 ? (
                <div className="flex justify-center items-center h-64 text-gray-500 text-lg font-semibold">
                    No products found
                </div>
            ) : (
                <>
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
                        {products.map((product, index) => {
                            const variant = product?.product?.variants?.[0];
                            const imageUrl = variant?.image?.split(",")?.[0]?.trim() || productimg;
                            const productName = product?.product?.name || "NIL";

                            return (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl overflow-hidden   border border-[#B9B9B9]"
                                >
                                    <div className='relative'>
                                        <Image
                                            src={imageUrl}
                                            alt={productName}
                                            height={300}
                                            width={100}
                                            className="w-full md:h-[300px]  object-cover"
                                        />
                                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                                            {isTrashed ? (
                                                <>
                                                    <button
                                                        onClick={() => handleRestore(product)}
                                                        className="bg-green-500 text-white px-3 py-1 text-sm rounded"
                                                    >
                                                        Restore
                                                    </button>
                                                    <button
                                                        onClick={() => handlePermanentDelete(product)}
                                                        className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                                                    >
                                                        Permanent Delete
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(product, product.id)}
                                                        className="bg-yellow-500 text-white px-3 py-1 text-sm rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product)}
                                                        className="bg-red-500 text-white px-3 py-1 text-sm rounded"
                                                    >
                                                        Trash
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>



                                    <div className="mt-3 p-3">
                                        <div className="flex justify-between">
                                            <div>
                                                <h2 className="text-lg font-semibold nunito">
                                                    {productName}
                                                </h2>
                                            </div>
                                            <div className="text-right">
                                                {product.variants.length === 1 && (
                                                    <p className="text-black font-bold nunito">
                                                        ₹ {product.variants[0]?.variant?.suggested_price || 0}
                                                    </p>
                                                )}

                                                {/* <p className="text-sm text-[#202224] nunito">
                                                        Exp. Orders: {product.expectedDailyOrders || 0}
                                                    </p> */}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setShowVariantPopup(true);
                                            }}
                                            className="py-2 px-4 text-white rounded-md text-sm w-full mt-3 bg-[#3965FF]"
                                        >
                                            View Variants
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {showPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg w-full max-w-4xl shadow-xl relative">
                                <h2 className="text-xl font-semibold mb-4">Variant Details</h2>

                                {(() => {
                                    const varinatExists = inventoryData?.isVarientExists ? 'yes' : 'no';
                                    const isExists = varinatExists === "yes";
                                    return (
                                        <>
                                            <table className="min-w-full table-auto border border-gray-200">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="border px-4 py-2">Image</th>
                                                        <th className="border px-4 py-2">Modal</th>
                                                        {isExists && (
                                                            <>
                                                                <th className="border px-4 py-2">Name</th>
                                                                <th className="border px-4 py-2">SKU</th>
                                                                <th className="border px-4 py-2">Color</th>
                                                            </>
                                                        )}
                                                        <th className="border px-4 py-2">Stock</th>
                                                        <th className="border px-4 py-2">Price</th>
                                                        <th className="border px-4 py-2">Status</th>
                                                        <th className="border px-4 py-2 whitespace-nowrap">Suggested Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {inventoryData.variant?.map((variant, idx) => {
                                                        const imageUrls = variant.image
                                                            ? variant.image.split(',').map((img) => img.trim()).filter(Boolean)
                                                            : [];
                                                        return (
                                                            <tr key={variant.id || idx}>
                                                                <td className="border px-4 py-2">
                                                                    <div className="flex space-x-2 overflow-x-auto max-w-[200px]">
                                                                        {imageUrls.length > 0 ? (
                                                                            imageUrls.map((url, i) => (
                                                                                <Image
                                                                                    key={i}
                                                                                    height={40}
                                                                                    width={40}
                                                                                    src={url}
                                                                                    alt={variant.name || 'NIL'}
                                                                                    className="shrink-0 rounded"
                                                                                />
                                                                            ))
                                                                        ) : (
                                                                            <Image
                                                                                height={40}
                                                                                width={40}
                                                                                src="https://placehold.co/400"
                                                                                alt="Placeholder"
                                                                                className="shrink-0 rounded"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="border px-4 py-2">{variant.modal || 'NIL'}</td>
                                                                {isExists && (
                                                                    <>
                                                                        <td className="border px-4 py-2">{variant.name || 'NIL'}</td>
                                                                        <td className="border px-4 py-2">{variant.sku || 'NIL'}</td>
                                                                        <td className="border px-4 py-2">{variant.color || 'NIL'}</td>
                                                                    </>
                                                                )}
                                                                <td className="border px-4 py-2">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Stock"
                                                                        name="stock"
                                                                        className="w-full border rounded p-2"
                                                                        value={variant.stock || ''}
                                                                        onChange={(e) =>
                                                                            handleVariantChange(variant.variantId, "stock", e.target.value)
                                                                        }
                                                                    />
                                                                </td>
                                                                <td className="border px-4 py-2">
                                                                    <input
                                                                        type="number"
                                                                        name="price"
                                                                        placeholder="Price"
                                                                        className="w-full border rounded p-2"
                                                                        value={variant.price || ''}
                                                                        onChange={(e) =>
                                                                            handleVariantChange(variant.variantId, "price", e.target.value)
                                                                        }
                                                                    />
                                                                </td>
                                                                <td className="border px-4 py-2">
                                                                    <label className="flex mt-2 items-center cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            name="status"
                                                                            className="sr-only"
                                                                            checked={variant.status || false}
                                                                            onChange={(e) =>
                                                                                handleVariantChange(variant.variantId, "status", e.target.checked)
                                                                            }
                                                                        />
                                                                        <div
                                                                            className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${variant.status ? "bg-orange-500" : ""
                                                                                }`}
                                                                        >
                                                                            <div
                                                                                className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${variant.status ? "translate-x-5" : ""
                                                                                    }`}
                                                                            ></div>
                                                                        </div>
                                                                    </label>
                                                                </td>
                                                                <td className="border px-4 py-2">{variant.lowestOtherSupplierSuggestedPrice ? variant.lowestOtherSupplierSuggestedPrice : variant.suggested_price ?? 'NIL'}</td>

                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                            <div className="flex justify-end space-x-3 mt-6">
                                                <button
                                                    onClick={() => {
                                                        setShowPopup(false);
                                                    }}
                                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={(e) => handleSubmit(e)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </>
                                    );
                                })()}

                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}
                    {showVariantPopup && selectedProduct && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-xl relative">
                                <h2 className="text-xl font-semibold mb-4">Variant Details</h2>

                                {(() => {
                                    const varinatExists = selectedProduct?.product?.isVarientExists ? 'yes' : 'no';
                                    const isExists = varinatExists === "yes";
                                    return (
                                        <table className="min-w-full table-auto border border-gray-200">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border px-4 py-2">Image</th>
                                                    <th className="border px-4 py-2">Modal</th>
                                                    <th className="border px-4 py-2">Product Link</th>
                                                    <th className="border px-4 py-2">Suggested Price</th>
                                                    {isExists && (
                                                        <>
                                                            <th className="border px-4 py-2">Name</th>
                                                            <th className="border px-4 py-2">SKU</th>
                                                            <th className="border px-4 py-2">Color</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedProduct.variants?.map((v, idx) => {
                                                    const imageUrls = v.image
                                                        ? v.image.split(',').map((img) => img.trim()).filter(Boolean)
                                                        : [];
                                                    const variant = v.variant || v;
                                                    return (
                                                        <tr key={variant.id || idx}>
                                                            <td className="border px-4 py-2">
                                                                <div className="flex space-x-2 overflow-x-auto max-w-[200px]">
                                                                    {imageUrls.length > 0 ? (
                                                                        imageUrls.map((url, i) => (
                                                                            <Image
                                                                                key={i}
                                                                                height={40}
                                                                                width={40}
                                                                                src={url}
                                                                                alt={variant.name || 'NIL'}
                                                                                className="shrink-0 rounded"
                                                                            />
                                                                        ))
                                                                    ) : (
                                                                        <Image
                                                                            height={40}
                                                                            width={40}
                                                                            src="https://placehold.co/400"
                                                                            alt="Placeholder"
                                                                            className="shrink-0 rounded"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="border px-4 py-2">{variant.modal || 'NIL'}</td>
                                                            <td className="border px-4 py-2">{variant.product_link || 'NIL'}</td>
                                                            <td className="border px-4 py-2">{variant.suggested_price ?? 'NIL'}</td>
                                                            {isExists && (
                                                                <>
                                                                    <td className="border px-4 py-2">{variant.name || 'NIL'}</td>
                                                                    <td className="border px-4 py-2">{variant.sku || 'NIL'}</td>
                                                                    <td className="border px-4 py-2">{variant.color || 'NIL'}</td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    );
                                })()}

                                <button
                                    onClick={() => setShowVariantPopup(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>


    );
}
