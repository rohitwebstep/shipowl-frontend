'use client';

import Image from 'next/image';
import productimg from '@/app/assets/product1.png';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { HashLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { useSupplier } from '../middleware/SupplierMiddleWareContext';
import { X, FileText, Tag, Truck, Pencil, RotateCcw, Trash2, Eye } from "lucide-react"; // Icons
import { FaEye } from "react-icons/fa";
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
    const [type, setType] = useState(false);

    const [openDescriptionId, setOpenDescriptionId] = useState(null);
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
                setType(result?.type || '');
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
            const simplifiedVariants = inventoryData.variant
                .filter(v => v.status === true) // Only include variants with status true
                .map(v => ({
                    variantId: v.id || v.variantId,
                    stock: v.stock,
                    price: v.price,
                    status: v.status
                }));

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
    const viewProduct = (id) => {
        router.push(`/supplier/product/?id=${id}`);
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
                    suggested_price: v.price || v.price,
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
                        className={`p-3 text-white rounded-md ${isTrashed ? 'bg-orange-500' : 'bg-red-500'}`}
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


                    <div className="grid lg:grid-cols-4 xl:grid-cols-5 md:grid-cols-2 gap-6">
                        {products.map((product) => {
                            const variant = product?.product?.variants?.[0];
                            const imageUrl =
                                variant?.image?.split(",")?.[0]?.trim() || productimg;
                            const productName = product?.product?.name || "NIL";

                            const getPriceDisplay = (variants) => {
                                if (!variants?.length) return "N/A";

                                console.log('variants', variants)
                                const modalMap = {};
                                variants.forEach((variant) => {
                                    const modal = variant?.variant?.modal || "Default";
                                    if (!modalMap[modal]) modalMap[modal] = [];
                                    modalMap[modal].push(variant);
                                });

                                const modalKeys = Object.keys(modalMap);

                                // Case 1: Only 1 model and 1 variant
                                if (modalKeys.length === 1 && modalMap[modalKeys[0]].length === 1) {
                                    return `₹${modalMap[modalKeys[0]][0].price ?? 0}`;
                                }

                                // Case 2: 1 model, multiple variants
                                if (modalKeys.length === 1 && modalMap[modalKeys[0]].length > 1) {
                                    const prices = modalMap[modalKeys[0]].map(v => v?.price ?? 0);
                                    const min = Math.min(...prices);
                                    const max = Math.max(...prices);
                                    return `₹${min} - ₹${max}`;
                                }

                                // Case 3 or 4: multiple models
                                return modalKeys.map((modal) => {
                                    const variants = modalMap[modal];
                                    const prices = variants.map(v => v?.price ?? 0);
                                    const min = Math.min(...prices);
                                    const max = Math.max(...prices);
                                    const priceLabel = (min === max) ? `₹${min}` : `₹${min} - ₹${max}`;
                                    return `${modal}: ${priceLabel}`;
                                }).join(" | ");
                            };



                            return (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-2xl overflow-hidden border border-[#B9B9B9] shadow-sm hover:shadow-lg transition-all duration-300 relative"
                                >
                                    {/* FLIPPING IMAGE */}
                                    <div className="relative h-[200px] perspective">
                                        <div onClick={() => viewProduct(product.id)} className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180">
                                            {/* FRONT */}
                                            <Image
                                                src={imageUrl}
                                                alt={productName}
                                                height={200}
                                                width={100}
                                                className="w-full h-full object-cover backface-hidden"
                                            />
                                            {/* BACK (optional or just black layer) */}
                                            <div className="absolute inset-0 bg-black bg-opacity-40 text-white flex items-center justify-center rotate-y-180 backface-hidden">
                                                <span className="text-sm">Back View</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-3 relative ">
                                        <div className="flex flex-wrap justify-between items-center">
                                            <h2 className="text-lg font-semibold">{productName}</h2>
                                            {product.variants.length > 0 && (
                                                <p className="text-black font-bold">
                                                    {getPriceDisplay(product.variants)}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-2 space-y-1 text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <FileText size={16} />
                                                <span>
                                                    <button
                                                        onClick={() => setOpenDescriptionId(product.id)}
                                                        className="text-blue-600"
                                                    >
                                                        View Description
                                                    </button>
                                                    {openDescriptionId === product.id && (
                                                        <div className="fixed p-4 inset-0 z-50 m-auto  flex items-center justify-center bg-black/50">
                                                            <div className="bg-white w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-6 relative shadow-lg popup-boxes">
                                                                {/* Close Button */}
                                                                <button
                                                                    onClick={() => setOpenDescriptionId(null)}
                                                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                                                                >
                                                                    &times;
                                                                </button>

                                                                {/* HTML Description Content */}
                                                                {product?.description ? (
                                                                    <div
                                                                        className="max-w-none prose [&_iframe]:h-[200px] [&_iframe]:max-h-[200px] [&_iframe]:w-full [&_iframe]:aspect-video"
                                                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                                                    />
                                                                ) : (
                                                                    <p className="text-gray-500">{product.description}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Tag size={16} />
                                                <span>SKU: {product?.product?.main_sku || "-"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Truck size={16} />
                                                <span>
                                                    Shipping Time: {product?.product?.shipping_time || "-"}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProduct(product);
                                                setShowVariantPopup(true);
                                            }}
                                            className="py-2 px-4 text-white rounded-md text-sm w-full mt-3 bg-[#3965FF] transition hover:bg-blue-700"
                                        >
                                            View Variants
                                        </button>

                                        {/* Sliding buttons on hover */}
                                        <div
                                            className="absolute bottom-0 shadow border border-gray-100 left-0 w-full p-3 bg-white z-10 opacity-0 translate-y-4
                       group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300
                       pointer-events-none group-hover:pointer-events-auto"
                                        >
                                            <div className="flex items-center gap-2">
                                                {isTrashed ? (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRestore(product);
                                                            }}
                                                            className="bg-orange-500 text-white px-3 py-1 text-sm rounded hover:bg-orange-600"
                                                        >
                                                            <RotateCcw />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handlePermanentDelete(product);
                                                            }}
                                                            className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                                                        >
                                                            <Trash2 />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(product, product.id);
                                                            }}
                                                            className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600"
                                                        >
                                                            <Pencil />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(product);
                                                            }}
                                                            className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                                                        >
                                                            <Trash2 />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedProduct(product);
                                                                setShowVariantPopup(true);
                                                            }}
                                                            className="py-2 px-2 text-white rounded-md text-sm  bg-[#3965FF] transition hover:bg-blue-700"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>


                    {showPopup && (
                        <div className="fixed inset-0 bg-[#00000087] bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
                            <div className="bg-white p-6 rounded-lg border-orange-500 w-full border max-w-5xl shadow-xl relative">
                                <h2 className="text-xl font-semibold mb-6">Add to Inventory</h2>


                                {(() => {
                                    const varinatExists = inventoryData?.isVarientExists ? "yes" : "no";
                                    const isExists = varinatExists === "yes";

                                    return (
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-1">
                                                {inventoryData.variant?.map((variant, idx) => {
                                                    const imageUrls = variant.image
                                                        ? variant.image.split(",").map((img) => img.trim()).filter(Boolean)
                                                        : [];

                                                    return (
                                                        <div
                                                            key={variant.id || idx}
                                                            className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col space-y-3"
                                                        >
                                                            <div className='flex gap-2'>
                                                                {/* Image Preview */}
                                                                <div className="md:min-w-4/12 h-20 rounded-lg flex items-center justify-center overflow-hidden">
                                                                    {imageUrls.length > 0 ? (
                                                                        <img
                                                                            src={`https://placehold.co/600x400?text=${idx + 1}`}
                                                                            alt={variant.name || "Variant Image"}
                                                                            className="h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src="https://placehold.co/600x400"
                                                                            alt="Placeholder"
                                                                            className="h-full object-cover"
                                                                        />
                                                                    )}
                                                                </div>

                                                                <div className="text-sm md:w-8/12 text-gray-700 space-y-1">
                                                                    <p><span className="font-semibold">Modal:</span> {variant.modal || "NIL"}</p>
                                                                    {isExists && (
                                                                        <>
                                                                            <p><span className="font-semibold">Name:</span> {variant.name || "NIL"}</p>
                                                                            <p><span className="font-semibold">SKU:</span> {variant.sku || "NIL"}</p>
                                                                            <p><span className="font-semibold">Color:</span> {variant.color || "NIL"}</p>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Input Fields */}
                                                            <div className="flex flex-col space-y-2">
                                                                <input
                                                                    type="number"
                                                                    placeholder="Stock"
                                                                    name="stock"
                                                                    className="border border-gray-300 shadow rounded px-3 py-2 text-sm"
                                                                    value={variant.stock || ""}
                                                                    onChange={(e) =>
                                                                        handleVariantChange(variant.variantId, "stock", e.target.value)
                                                                    }
                                                                />
                                                                <input
                                                                    type="number"
                                                                    placeholder="Price"
                                                                    name="price"
                                                                    className="border border-gray-300 shadow rounded px-3 py-2 text-sm"
                                                                    value={variant.price || ""}
                                                                    onChange={(e) =>
                                                                        handleVariantChange(variant.variantId, "price", e.target.value)
                                                                    }
                                                                />
                                                            </div>

                                                            {/* Status Switch */}
                                                            <div className="flex items-center justify-between mt-2">
                                                                <span className="text-sm font-medium">Add To List:</span>
                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={variant.status || false}
                                                                        onChange={(e) =>
                                                                            handleVariantChange(variant.variantId, "status", e.target.checked)
                                                                        }
                                                                        className="sr-only peer"
                                                                    />
                                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-orange-500 transition-all"></div>
                                                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transform transition-all"></div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Footer Buttons */}
                                            <div className="flex justify-end space-x-3 mt-6">
                                                <button
                                                    onClick={() => setShowPopup(false)}
                                                    className="flex items-center gap-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
                                                >
                                                    <span>Cancel</span>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={(e) => handleSubmit(e)}
                                                    className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
                                                >
                                                    <span>Submit</span>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Close Button */}
                                            <button
                                                onClick={() => setShowPopup(false)}
                                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
                                            >
                                                ×
                                            </button>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {showVariantPopup && selectedProduct && (
                        <div className="fixed inset-0 bg-[#00000087] bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
                            <div className="bg-white p-6 rounded-lg border-orange-500 w-full border max-w-5xl shadow-xl relative">
                                <h2 className="text-xl font-semibold mb-6">Varinats Details</h2>


                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-1">                                    {selectedProduct.variants?.map((v, idx) => {
                                    const imageUrls = v.image
                                        ? v.image.split(',').map((img) => img.trim()).filter(Boolean)
                                        : [];

                                    const variant = v.variant || v;
                                    const variants = v;
                                    const isExists = selectedProduct?.product?.isVarientExists;

                                    return (
                                        <div
                                            key={variant.id || idx}
                                            className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col space-y-3"
                                        >
                                            <div className="overflow-x-auto max-w-full pb-2">
                                                {imageUrls.length > 0 ? (
                                                    imageUrls.map((url, i) => (
                                                        <Image
                                                            key={i}
                                                            height={100}
                                                            width={100}
                                                            src={url}
                                                            alt={variant.name || 'Image'}
                                                            className="rounded border w-full  object-cover"
                                                        />
                                                    ))
                                                ) : (
                                                    <Image
                                                        height={80}
                                                        width={80}
                                                        src="https://placehold.co/400"
                                                        alt="Placeholder"
                                                        className="rounded border h-[150px] w-full object-cover"
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <p><span className="font-semibold">Model:</span> {variant.modal || 'NIL'}</p>

                                                <p><span className="font-semibold">Suggested Price:</span> ₹{variants.price ?? 'NIL'}</p>
                                            </div>

                                            {isExists && (
                                                <div className="">
                                                    <p><span className="font-semibold">Name:</span> {variant.name || 'NIL'}</p>
                                                    <p><span className="font-semibold">SKU:</span> {variant.sku || 'NIL'}</p>
                                                    <p><span className="font-semibold">Color:</span> {variant.color || 'NIL'}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                </div>



                                <button
                                    onClick={() => setShowVariantPopup(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
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
