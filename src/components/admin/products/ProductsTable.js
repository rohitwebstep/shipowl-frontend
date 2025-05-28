"use client";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import HashLoader from "react-spinners/HashLoader";
import React, { useState, useContext, useCallback, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { MdModeEdit, MdRestoreFromTrash } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useAdmin } from '../middleware/AdminMiddleWareContext';
import { ProductContextEdit } from './ProductContextEdit';
import { useAdminActions } from '@/components/commonfunctions/MainContext';
import Image from 'next/image';

const ProductTable = () => {
    const { setActiveTab } = useContext(ProductContextEdit);
    const [showVariantPopup, setShowVariantPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showRtoLiveCount, setShowRtoLiveCount] = useState(false);
    const [selectedModel, setSelectedModel] = useState('');
    const [category, setCategory] = useState('');
    const [categoryData, setCategoryData] = useState([]);
    const [products, setProducts] = useState([]);
    const { verifyAdminAuth } = useAdmin();
    const [isTrashed, setIsTrashed] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return today.toISOString().slice(0, 7);
    });
    const { fetchAll, fetchTrashed, softDelete, restore, destroy } = useAdminActions("admin/product", "products");

    const handleCheckboxChange = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleToggleTrash = async () => {
        setIsTrashed(prev => !prev);
        if (!isTrashed) {
            await fetchTrashed(setProducts, setLoading);
        } else {
            await fetchAll(setProducts, setLoading);
        }
    };

    const handleSoftDelete = (id) => softDelete(id, () => fetchAll(setProducts, setLoading));
    const handleRestore = (id) => restore(id, () => fetchTrashed(setProducts, setLoading));
    const handleDestroy = (id) => destroy(id, () => fetchTrashed(setProducts, setLoading));


    const filteredProducts = products.filter((item) => {
        const matchesCategory = category
            ? String(item.categoryId) === String(category)
            : true;

        const matchesModel = selectedModel
            ? String(item.list_as) === String(selectedModel)
            : true;


        return matchesCategory && matchesModel;
    });



    const fetchCategory = useCallback(async () => {
        const adminData = JSON.parse(localStorage.getItem("shippingData"));

        if (adminData?.project?.active_panel !== "admin") {
            localStorage.removeItem("shippingData");
            router.push("/admin/auth/login");
            return;
        }

        const admintoken = adminData?.security?.token;
        if (!admintoken) {
            router.push("/admin/auth/login");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `https://sleeping-owl-we0m.onrender.com/api/admin/category`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${admintoken}`,
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
            const category = result?.categories || {};
            setCategoryData(category)


        } catch (error) {
            console.error("Error fetching category:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            setIsTrashed(false);
            setLoading(true);
            await verifyAdminAuth();
            await fetchAll(setProducts, setLoading);
            await fetchCategory();
            setLoading(false);
        };
        fetchData();
    }, [verifyAdminAuth]);

    useEffect(() => {
        if (typeof window !== "undefined" && products.length > 0 && !loading) {
            let table = null;

            Promise.all([import("jquery"), import("datatables.net"), import("datatables.net-dt"), import("datatables.net-buttons"), import("datatables.net-buttons-dt")])
                .then(([jQuery]) => {
                    window.jQuery = window.$ = jQuery.default;

                    // Destroy existing DataTable if it exists
                    if ($.fn.DataTable.isDataTable("#productTable")) {
                        $("#productTable").DataTable().destroy();
                        $("#productTable").empty();
                    }

                    // Reinitialize DataTable with new product
                    table = $("#productTable").DataTable();

                    return () => {
                        if (table) {
                            table.destroy();
                            $("#productTable").empty();
                        }
                    };
                })
                .catch((error) => {
                    console.error("Failed to load DataTables dependencies:", error);
                });
        }
    }, [products, loading]);


    return (
        <div className="">
            <div className="flex flex-wrap md:justify-end justify-items-center gap-2 mb-4">
                <button className="bg-[#EE5D50] text-white px-4 py-2 rounded-lg text-sm">Details for approval</button>
                <button className="bg-[#2B3674] text-white px-4 py-2 rounded-lg text-sm">Import Inventory</button>
                <button className="bg-[#05CD99] text-white px-4 py-2 rounded-lg text-sm">Export</button>
                <button className="bg-[#3965FF] text-white px-4 py-2 rounded-lg text-sm">Import</button>
                <button className="bg-[#F98F5C] text-white px-4 py-2 rounded-lg text-sm" onClick={() => setActiveTab('product-details')}>
                    <Link href="/admin/products/create">Add New</Link>
                </button>
                <button className="bg-[#4285F4] text-white px-4 py-2 rounded-lg text-sm">Filters</button>
            </div>

            <div className="flex flex-wrap gap-4 items-end">


                <div className="md:w-4/12">
                    <label className="block text-sm font-medium text-gray-700">Select Model</label>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full mt-1 px-3 py-3 border-[#DFEAF2] uppercase bg-white border rounded-lg text-sm"
                    >
                        <option value="">All</option>
                        {[...new Set((products ?? []).map(item => item.list_as).filter(Boolean))].map((model, index) => (
                            <option key={index} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:w-4/12">
                    <label className="block text-sm font-medium text-gray-700">Filter By Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full mt-1 px-3 py-3 border-[#DFEAF2] bg-white border rounded-lg text-sm"
                    >
                        <option value="">All</option>
                        {[...new Set((products ?? []).map(item => item.categoryId).filter(Boolean))].map((catId) => {
                            const cat = (categoryData ?? []).find(c => c.id === catId);
                            return (
                                <option key={catId} value={catId}>
                                    {cat ? cat.name : catId}
                                </option>
                            );
                        })}
                    </select>
                </div>


                <div className="flex justify-end md:w-1/12 items-end">
                    <button className="bg-[#F98F5C] text-white px-6 py-3 rounded-lg text-sm">Save</button>
                </div>
            </div>


            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <HashLoader color="orange" />
                </div>
            ) : (
                <div className="bg-white rounded-2xl mt-5 p-4">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-[#2B3674]">Product Details</h2>
                        <div className="flex gap-3  flex-wrap items-center">
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only" checked={showRtoLiveCount} onChange={() => setShowRtoLiveCount(!showRtoLiveCount)} />
                                <div className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${showRtoLiveCount ? "bg-orange-500" : ""}`}>
                                    <div className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${showRtoLiveCount ? "translate-x-5" : ""}`}></div>
                                </div>
                                <span className="ml-2 text-sm text-gray-600">Show RTO Live Count</span>
                            </label>
                            {selected < 1 && <span className="font-semibold text-[#2B3674]">Total: {filteredProducts.length} Products</span>}
                            {selected.length > 0 && (
                                <h5 className="font-semibold text-[#2B3674] bg-[#DFE9FF] p-3 flex rounded-md gap-7">
                                    {selected.length} Products Selected{" "}
                                    <span className="text-[#EE5D50] cursor-pointer " onClick={() => setSelected([])}>
                                        Clear
                                    </span>
                                </h5>
                            )}

                            <button className="bg-[#F4F7FE] rela px-4 py-2 text-sm rounded-lg flex items-center text-[#A3AED0]">
                                {/* Month Input */}
                                <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="outline-0" />
                            </button>
                            <button onClick={() => setIsPopupOpen((prev) => !prev)} className="bg-[#F4F7FE] p-2 rounded-lg relative">
                                <MoreHorizontal className="text-[#F98F5C]" />
                                {isPopupOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                                        <ul className="py-2 text-sm text-[#2B3674]">
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Export CSV</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Bulk Delete</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                                        </ul>
                                    </div>
                                )}
                            </button>
                            <div className="flex justify-end gap-2">
                                <button
                                    className={`p-3 text-white rounded-md ${isTrashed ? "bg-green-500" : "bg-red-500"}`}
                                    onClick={handleToggleTrash}
                                >
                                    {isTrashed ? "Products Listing (Simple)" : "Trashed Products"}
                                </button>

                            </div>
                        </div>
                    </div>

                    {products.length > 0 ? (
                        <div className="overflow-x-auto relative main-outer-wrapper w-full">
                            <table className="md:w-full w-auto display main-tables" id="productTable">
                                <thead>
                                    <tr className="border-b text-[#A3AED0] border-[#E9EDF7]">
                                        <th className="p-2 px-5  whitespace-nowrap text-left uppercase">
                                            Name
                                        </th>
                                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                                            Description
                                        </th>
                                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                                            SKU
                                        </th>

                                        {showRtoLiveCount && (
                                            <th className="p-2 px-5 whitespace-nowrap text-left uppercase text-blue-500">
                                                Live RTO Stock
                                            </th>
                                        )}

                                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                                            Status
                                        </th>

                                        {!showRtoLiveCount && (
                                            <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                                                Model
                                            </th>
                                        )}
                                        {showRtoLiveCount && (
                                            <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                                                RTO Status
                                            </th>
                                        )}
                                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                                            View Variant
                                        </th>

                                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((item) => (
                                        <tr key={item.id} className="border-b border-[#E9EDF7] text-[#2B3674] font-semibold">
                                            <td className="p-2 px-5 capitalize  text-left whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <label className="flex items-center cursor-pointer me-2">
                                                        <input type="checkbox" checked={selected.includes(item.id)} onChange={() => handleCheckboxChange(item.id)} className="peer hidden" />
                                                        <div
                                                            className="w-4 h-4 border-2 border-[#A3AED0] rounded-sm flex items-center justify-center 
                                                peer-checked:bg-[#F98F5C] peer-checked:border-0 peer-checked:text-white"
                                                        >
                                                            <FaCheck className=" peer-checked:block text-white w-3 h-3" />
                                                        </div>
                                                    </label>

                                                    <span className="truncate"> {item.name || 'NIL'}</span>
                                                </div>
                                            </td>
                                            <td className="p-2 px-5 capitalize  text-left whitespace-nowrap">{item.description || 'NIL'}</td>
                                            <td className="p-2 px-5 capitalize  text-left whitespace-nowrap">{item.main_sku || 'NIL'}</td>
                                            {showRtoLiveCount && <td className="p-2 px-5 capitalize  text-left whitespace-nowrap text-blue-500">{item.liveRtoStock || 'NIL'}</td>}

                                            <td className="p-2 bg-transparent whitespace-nowrap px-5 border-0">
                                                {item.status ? (
                                                    <span className="bg-green-100 text-green-800 text-lg font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-green-400 border border-green-400">Active</span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-800 text-lg font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-red-400 border border-red-400">Inactive</span>
                                                )}
                                            </td>

                                            {!showRtoLiveCount && (
                                                <td className="p-2 px-5  text-left uppercase whitespace-nowrap">
                                                    <button
                                                        className={`py-2 text-white rounded-md text-sm p-3 uppercase min-w-[95px] 
    ${item.list_as?.toLowerCase() === "shipowl" ? "bg-[#01B574]" : "bg-[#5CA4F9]"}`}
                                                    >
                                                        {item.list_as || 'NIL'}
                                                    </button>
                                                </td>
                                            )}
                                            {showRtoLiveCount && (
                                                <td className="p-2 px-5 capitalize  text-left whitespace-nowrap">
                                                    {" "}
                                                    <button
                                                        className={` py-2 text-white rounded-md text-sm p-3  min-w-[95px]
            ${item.rtoStatus === "Free" ? "bg-green-500" : item.rtoStatus === "Pending" ? "bg-[#FFB547]" : "bg-red-500"}`}
                                                    >
                                                        {item.rtoStatus || 'NIL'}
                                                    </button>
                                                </td>
                                            )}
                                            <td className="p-2 px-5 text-left capitalize whitespace-nowrap">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(item); // `item` is your current product row
                                                        setShowVariantPopup(true);
                                                    }}
                                                    className="py-2 px-4 text-white rounded-md text-sm bg-[#3965FF]"
                                                >
                                                    View Variants
                                                </button>
                                            </td>
                                            <td className="p-2 px-5 capitalize  text-left whitespace-nowrap  text-[#8F9BBA]">
                                                <div className="flex gap-2"> {isTrashed ? (
                                                    <>
                                                        <MdRestoreFromTrash onClick={() => handleRestore(item.id)} className="cursor-pointer text-3xl text-green-500" />
                                                        <AiOutlineDelete onClick={() => handleDestroy(item.id)} className="cursor-pointer text-3xl" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <MdModeEdit onClick={() => {
                                                            router.push(`/admin/products/update?id=${item.id}`);
                                                            setActiveTab('product-details');
                                                        }
                                                        } className="cursor-pointer text-3xl" />
                                                        <AiOutlineDelete onClick={() => handleSoftDelete(item.id)} className="cursor-pointer text-3xl" />
                                                    </>
                                                )}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {showVariantPopup && selectedProduct && (
                                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-xl relative">
                                        <h2 className="text-xl font-semibold mb-4">Variant Details</h2>

                                        {(() => {
                                            const varinatExists = selectedProduct?.isVarientExists ? 'yes' : 'no';
                                            const isExists = varinatExists === "yes";
                                            return (
                                                <table className="min-w-full table-auto border border-gray-200">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="border px-4 py-2">Image</th>
                                                            <th className="border px-4 py-2">Modal</th>
                                                            <th className="border px-4 py-2">Product Link</th>
                                                            <th className="border px-4 py-2">Suggested Price</th>
                                                            <th className="border px-4 py-2">SKU</th>
                                                            {isExists && (
                                                                <>
                                                                    <th className="border px-4 py-2">Name</th>
                                                                    <th className="border px-4 py-2">Color</th>
                                                                </>
                                                            )}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedProduct.variants?.map((variant, idx) => {
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
                                                                    <td className="border px-4 py-2">{variant.product_link || 'NIL'}</td>
                                                                    <td className="border px-4 py-2">{variant.suggested_price ?? 'NIL'}</td>
                                                                    <td className="border px-4 py-2">{variant.sku || 'NIL'}</td>
                                                                    {isExists && (
                                                                        <>
                                                                        <td className="border px-4 py-2">{variant.name || 'NIL'}</td>
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

                        </div>
                    ) : (
                        // Render when no admins
                        <div className='text-center'>No Products available</div>
                    )}


                </div>
            )}
        </div>
    );
};

export default ProductTable;
