"use client";
import 'datatables.net-dt/css/dataTables.dataTables.css';

import { useRouter} from "next/navigation";
import Swal from "sweetalert2";
import HashLoader from "react-spinners/HashLoader";
import React, { useState, useCallback, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { useSupplier } from "../middleware/SupplierMiddleWareContext";
import { MdModeEdit, MdRestoreFromTrash } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
const ProductTable = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showRtoLiveCount, setShowRtoLiveCount] = useState(false);
    const [selectedRtoAddress, setSelectedRtoAddress] = useState('');
    const [selectedPickupAddress, setSelectedPickupAddress] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [products, setProducts] = useState([]);
    const { verifySupplierAuth } = useSupplier();
    const [isTrashed, setIsTrashed] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const filteredProducts = products.filter((item) => {
        const matchesRto = selectedRtoAddress ? item.rtoAddress === selectedRtoAddress : true;
        const matchesPickup = selectedPickupAddress ? item.pickupAddress === selectedPickupAddress : true;
        const matchesModel = selectedModel ? item.list_as === selectedModel : true;
      
        return matchesRto && matchesPickup && matchesModel;
      });
      
    const fetchProduct = useCallback(async () => {
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
            const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/product`, {
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
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }, [router, setProducts]);

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
            const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/product/trashed`, {
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

    useEffect(() => {
        const fetchData = async () => {
            setIsTrashed(false);
            setLoading(true);
            await verifySupplierAuth();
            await fetchProduct();
            setLoading(false);
        };
        fetchData();
    }, [fetchProduct, verifySupplierAuth]);

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
                `https://sleeping-owl-we0m.onrender.com/api/product/${item.id}`,
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

            await fetchProduct();
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
                `https://sleeping-owl-we0m.onrender.com/api/product/${item.id}/destroy`,
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
                    `https://sleeping-owl-we0m.onrender.com/api/product/${item?.id}/restore`,
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
                        text: `${item.name} Has Been Restored Successfully !`,
                    });
                    await trashProducts();
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
    }, [router, trashProducts]);
    
    const [selected, setSelected] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return today.toISOString().slice(0, 7);
    });
    const handleCheckboxChange = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };
   
    const handleEdit=(id)=>{
        router.push(`/supplier/product/update?id=${id}`);
    }

    return (
        <div className="">
            <div className="flex flex-wrap md:justify-end justify-items-center gap-2 mb-4">
                <button className="bg-[#EE5D50] text-white px-4 py-2 rounded-lg text-sm">Details for approval</button>
                <button className="bg-[#2B3674] text-white px-4 py-2 rounded-lg text-sm">Import Inventory</button>
                <button className="bg-[#05CD99] text-white px-4 py-2 rounded-lg text-sm">Export</button>
                <button className="bg-[#3965FF] text-white px-4 py-2 rounded-lg text-sm">Import</button>
                <button className="bg-[#F98F5C] text-white px-4 py-2 rounded-lg text-sm">
                    <Link href="/supplier/add-product">Add New</Link>
                </button>
                <button className="bg-[#4285F4] text-white px-4 py-2 rounded-lg text-sm">Filters</button>
            </div>

            <div className="flex flex-wrap justify-between gap-4 items-end">
                <div className="w-full md:w-4/12">
                    <label className="block text-sm font-medium text-gray-700">RTO Address *</label>
                    <select
  value={selectedRtoAddress}
  onChange={(e) => setSelectedRtoAddress(e.target.value)}
  className="w-full mt-1 px-3 py-3 border-[#DFEAF2] bg-white border rounded-lg text-sm"
>
  <option value="">All</option>
  {[...new Set(products.map(item => item.rtoAddress))].map((addr, index) => (
    <option key={index} value={addr}>{addr}</option>
  ))}
</select>

                </div>

                <div className="w-full md:w-3/12">
                    <label className="block text-sm font-medium text-gray-700">Pickup Address *</label>
                    <select
  value={selectedPickupAddress}
  onChange={(e) => setSelectedPickupAddress(e.target.value)}
  className="w-full mt-1 px-3 py-3 border-[#DFEAF2] bg-white border rounded-lg text-sm"
>
  <option value="">All</option>
  {[...new Set(products.map(item => item.pickupAddress))].map((addr, index) => (
    <option key={index} value={addr}>{addr}</option>
  ))}
</select>

                </div>

                <div className="w-full md:w-3/12">
                    <label className="block text-sm font-medium text-gray-700">Select Model</label>
                    <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full mt-1 px-3 py-3 border-[#DFEAF2] bg-white border rounded-lg text-sm"
                    >
                    <option value="">All</option>
                    {[...new Set(products.map(item => item.list_as))].map((model, index) => (
                        <option key={index} value={model}>{model}</option>
                    ))}
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
                                <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
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
                                                            className={`p-3 text-white rounded-md ${isTrashed ? 'bg-green-500' : 'bg-red-500'}`}
                                                            onClick={async () => {
                                                                if (isTrashed) {
                                                                    setIsTrashed(false);
                                                                    await fetchProduct();
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
                </div>

                {products.length > 0 ? (
            <div className="overflow-x-auto relative main-outer-wrapper w-full">
            <table className="md:w-full w-auto display main-tables" id="productTable">
                <thead>
                    <tr className="border-b text-[#A3AED0] border-[#E9EDF7]">
                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                            NAME
                        </th>
                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                            SKU
                        </th>
                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase text-red-500">
                            Suggested Price
                        </th>
                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                            Shipwoll Cost Price
                        </th>
                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                            Quantity
                        </th>
                        {showRtoLiveCount && (
                            <th className="p-2 px-5 whitespace-nowrap text-left uppercase text-blue-500">
                                Live RTO Stock
                            </th>
                        )}
                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                            Order Auto Accept
                        </th>
                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                            Status
                        </th>
                        <th className="p-2 px-5 whitespace-nowrap text-left uppercase">
                            Admin Status
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
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((item) => (
                        <tr key={item.id} className="border-b border-[#E9EDF7] text-[#2B3674] font-semibold">
                            <td className="p-2 px-5 whitespace-nowrap">
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
                
                                    <span className="truncate"> {item.name|| 'NIL'}</span>
                                </div>
                            </td>
                            <td className="p-2 px-5 whitespace-nowrap">{item.main_sku|| 'NIL'}</td>
                            {(() => {
                            const variant = item.variants[0] || {};
                            return (
                                <>
                                <td className="p-2 px-5 whitespace-nowrap text-red-500">{variant.suggested_price || 'NIL'}</td>
                                <td className="p-2 px-5 whitespace-nowrap">{variant.shipowl_price || 'NIL'}</td>
                                <td className="p-2 px-5 whitespace-nowrap">{variant.qty || 'NIL'}</td>
                                </>
                            );
                            })()}


                            {showRtoLiveCount && <td className="p-2 px-5 whitespace-nowrap text-blue-500">{item.liveRtoStock}</td>}
                            <td className="p-2 px-5 whitespace-nowrap">
                                <div className="flex items-center mb-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only" checked={item.autoAccept} readOnly />
                                        <div className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${item.autoAccept ? "bg-orange-500" : ""}`}>
                                            <div className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${item.autoAccept ? "translate-x-5" : ""}`}></div>
                                        </div>
                                    </label>
                                </div>
                            </td>
                            <td className="p-2 px-5 whitespace-nowrap">
                                <div className="flex items-center mb-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only" checked={item.status} readOnly />
                                        <div className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${item.status ? "bg-orange-500" : ""}`}>
                                            <div className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${item.status ? "translate-x-5" : ""}`}></div>
                                        </div>
                                    </label>
                                </div>
                            </td>
                            <td className="p-2 px-5 whitespace-nowrap">
                                <button
                                    className={` py-2 text-white rounded-md text-sm p-3 uppercase  min-w-[95px]
            ${item.adminStatus === "Done" ? "bg-green-500" : item.adminStatus === "Pending" ? "bg-[#FFB547]" : "bg-red-500"}`}
                                >
                                    {item.adminStatus || 'NIL'}
                                </button>
                            </td>
                            {!showRtoLiveCount && (
                                <td className="p-2 px-5 whitespace-nowrap">
                                    <button
                                        className={` py-2 text-white rounded-md text-sm p-3  min-w-[95px] 
            ${item.model === "Warehouse" ? "bg-[#01B574]" : "bg-[#5CA4F9]"}`}
                                    >
                                        {item.list_as || 'NIL'}
                                    </button>
                                </td>
                            )}
                            {showRtoLiveCount && (
                                <td className="p-2 px-5 whitespace-nowrap">
                                    {" "}
                                    <button
                                        className={` py-2 text-white rounded-md text-sm p-3  min-w-[95px]
            ${item.rtoStatus === "Free" ? "bg-green-500" : item.rtoStatus === "Pending" ? "bg-[#FFB547]" : "bg-red-500"}`}
                                    >
                                        {item.rtoStatus || 'NIL'}
                                    </button>
                                </td>
                            )}
                            <td className="p-2 px-5 whitespace-nowrap text-center text-[#8F9BBA]">
                                <div className="flex justify-center gap-2">
                            {isTrashed ? (
                                <>
                                    <MdRestoreFromTrash onClick={() => handleRestore(item)} className="cursor-pointer text-3xl text-green-500" />
                                    <AiOutlineDelete onClick={() => handlePermanentDelete(item)} className="cursor-pointer text-2xl" />
                                </>
                            ) : (
                                <>
                                    <MdModeEdit onClick={() => handleEdit(item.id)} className="cursor-pointer text-2xl" />
                                    <AiOutlineDelete onClick={() => handleDelete(item)} className="cursor-pointer text-2xl" />
                                </>
                            )}
                        </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
                ) : (
                // Render when no suppliers
                <div className='text-center'>No Products available</div>
                )}                

                
            </div>
            )}
        </div>
    );
};

export default ProductTable;
