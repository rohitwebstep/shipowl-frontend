"use client";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useRouter} from "next/navigation";
import Swal from "sweetalert2";
import HashLoader from "react-spinners/HashLoader";
import React, { useState, useCallback, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { MdModeEdit, MdRestoreFromTrash } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useAdmin } from '../middleware/AdminMiddleWareContext';
const SupplierList = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const { verifyAdminAuth } = useAdmin();
    const [cityData, setCityData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [isTrashed, setIsTrashed] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
 
      const [expandedSupplier, setExpandedSupplier] = useState(null);
    
      const handleViewMore = (supplierId) => {
        // Toggle supplier's bank account view on click
        setExpandedSupplier(expandedSupplier === supplierId ? null : supplierId);
      };
            const fetchSupplier = useCallback(async () => {
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
                    const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/supplier`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${admintoken}`,
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
                        setSuppliers(result?.suppliers || []);
                    }
                } catch (error) {
                    console.error("Error fetching categories:", error);
                } finally {
                    setLoading(false);
                }
            }, [router, setSuppliers]);
            const fetchCity = useCallback(async () => {
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
                        `https://sleeping-owl-we0m.onrender.com/api/location/city`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${admintoken}`,
                            },
                        }
                    );
            
                    const result = await response.json();
            
                    if (!response.ok) {
                        Swal.fire({
                            icon: "error",
                            title: "Something Wrong!",
                            text: result.message || result.error || "Your session has expired. Please log in again.",
                        });
                        throw new Error(result.message || result.error || "Something Wrong!");
                    }
            
                    setCityData(result?.cities || []);
                } catch (error) {
                    console.error("Error fetching cities:", error);
                } finally {
                    setLoading(false);
                }
            }, [router]);
    
              const fetchState = useCallback(async () => {
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
                            `https://sleeping-owl-we0m.onrender.com/api/location/state`,
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
                            setStateData(result?.states || []);
                        }
                    } catch (error) {
                        console.error("Error fetching state:", error);
                    } finally {
                        setLoading(false);
                    }
                }, [router, setStateData]);
            

    const trashSupplier = useCallback(async () => {
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
            const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/supplier/trashed`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${admintoken}`,
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
                setSuppliers(result?.suppliers || []);
            }
        } catch (error) {
            console.error("Error fetching trashed categories:", error);
        } finally {
            setLoading(false);
        }
    }, [router, setSuppliers]);

    useEffect(() => {
        const fetchData = async () => {
            setIsTrashed(false);
            setLoading(true);
            await verifyAdminAuth();
            await fetchSupplier();
            await fetchCity();
            await fetchState();
            setLoading(false);
        };
        fetchData();
    }, [fetchSupplier, verifyAdminAuth]);

    useEffect(() => {
        if (typeof window !== "undefined" && suppliers.length > 0 && !loading) {
            let table = null;

            Promise.all([import("jquery"), import("datatables.net"), import("datatables.net-dt"), import("datatables.net-buttons"), import("datatables.net-buttons-dt")])
                .then(([jQuery]) => {
                    window.jQuery = window.$ = jQuery.default;

                    // Destroy existing DataTable if it exists
                    if ($.fn.DataTable.isDataTable("#supplierTable")) {
                        $("#supplierTable").DataTable().destroy();
                        $("#supplierTable").empty();
                    }

                    // Reinitialize DataTable with new supplier
                    table = $("#supplierTable").DataTable();

                    return () => {
                        if (table) {
                            table.destroy();
                            $("#supplierTable").empty();
                        }
                    };
                })
                .catch((error) => {
                    console.error("Failed to load DataTables dependencies:", error);
                });
        }
    }, [suppliers, loading]);



    const handleDelete = async (item) => {
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
                `https://sleeping-owl-we0m.onrender.com/api/supplier/${item.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${admintoken}`,
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

            await fetchSupplier();
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
                `https://sleeping-owl-we0m.onrender.com/api/supplier/${item.id}/destroy`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${admintoken}`,
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

            await trashSupplier();
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
                    `https://sleeping-owl-we0m.onrender.com/api/supplier/${item?.id}/restore`,
                    {
                        method: "PATCH",
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
                    await trashSupplier();
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
    }, [router, trashSupplier]);
    
    const [selected, setSelected] = useState([]);
   
    const handleCheckboxChange = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };
   
    const handleEdit=(id)=>{
        router.push(`/admin/supplier/update?id=${id}`);
    }
    return (
        loading ? (
            <div className="flex justify-center items-center h-96">
                <HashLoader color="orange" />
            </div>
        ) : (
            <div className="bg-white rounded-3xl p-5">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#2B3674]">Suppliers List</h2>
                    <div className="flex gap-3 flex-wrap items-center">
                        <button
                            onClick={() => setIsPopupOpen((prev) => !prev)}
                            className="bg-[#F4F7FE] p-2 rounded-lg relative"
                        >
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
<button className="bg-[#F98F5C] text-white px-4 py-2 rounded-lg text-sm">
    <Link href="/admin/supplier/create">Add New</Link>
</button>

<button
    className={`p-3 text-white rounded-md ${isTrashed ? 'bg-green-500' : 'bg-red-500'}`}
    onClick={async () => {
    if (isTrashed) {
        await fetchSupplier(); // Fetch the suppliers when in 'trashed' state
        setIsTrashed(false); // Switch to the simple listing view
    } else {
        await trashSupplier(); // Trash the supplier
        setIsTrashed(true); // Switch to the trashed supplier view
    }
    }}
>
    {isTrashed ? "Supplier Listing (Simple)" : "Trashed Supplier"}
</button>
                        </div>

                    </div>
                </div>
                { suppliers.length > 0 ? (
      <div className="overflow-x-auto w-full relative">
        <table className="min-w-full table-auto border-collapse" id="supplierTable">
          <thead>
            <tr className="border-b text-sm font-semibold text-[#A3AED0]">
              <th className="p-3 px-4 text-left whitespace-nowrap">Sr.</th>
              <th className="p-3 px-4 text-left whitespace-nowrap">Name</th>
              <th className="p-3 px-4 text-left whitespace-nowrap">Email</th>
              <th className="p-3 px-4 text-left whitespace-nowrap">Date Of Birth</th>
              <th className="p-3 px-4 text-left whitespace-nowrap">Current Address</th>
              <th className="p-3 px-4 text-left whitespace-nowrap">Permanent Address</th>
              <th className="p-3 px-4 text-left whitespace-nowrap">State</th>
              <th className="p-3 px-4 text-left whitespace-nowrap">City</th>
              <th className="p-3 px-4 text-left whitespace-nowrap">Postal Code</th>
              <th className="p-3 px-4 text-left whitespace-nowrap">Actions</th>
              <th className="p-3 px-4 text-left whitespace-nowrap">View More</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((item, index) => {
              const isExpanded = expandedSupplier === item.id;
              return (
                <React.Fragment key={item.id}>
                  <tr className="border-b text-[#2B3674] font-semibold">
                    <td className="p-3 px-4 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer mr-2">
                          <input
                            type="checkbox"
                            checked={selected.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                            className="peer hidden"
                          />
                          <div className="w-4 h-4 border-2 border-[#A3AED0] rounded-sm flex items-center justify-center peer-checked:bg-[#F98F5C] peer-checked:border-0 peer-checked:text-white">
                            <FaCheck className="peer-checked:block text-white w-3 h-3" />
                          </div>
                        </label>
                        {index + 1}
                      </div>
                    </td>
                    <td className="p-3 px-4 text-left whitespace-nowrap">{item.name}</td>
                    <td className="p-3 px-4 text-left whitespace-nowrap">{item.email}</td>
                    <td className="p-3 px-4 text-left whitespace-nowrap">
                    {item.dateOfBirth && typeof item.dateOfBirth === 'object'
                        ? item.dateOfBirth.toString()
                        : item.dateOfBirth || 'N/A'}
                    </td>
                    <td className="p-3 px-4 text-left whitespace-nowrap">{item.currentAddress || 'N/A'}</td>
                    <td className="p-3 px-4 text-left whitespace-nowrap">{item.permanentAddress || 'N/A'}</td>
                    <td className="p-3 px-4 text-left whitespace-nowrap">
                      {stateData.find(state => state.id === item.permanentStateId)?.name || 'N/A'}
                    </td>
                    <td className="p-3 px-4 text-left whitespace-nowrap">
                      {cityData.find(city => city.id === item.permanentCityId)?.name || 'N/A'}
                    </td>
                    <td className="p-3 px-4 text-left whitespace-nowrap">{item.permanentPostalCode || 'N/A'}</td>

                    <td className="p-3 px-4 text-center">
                      <div className="flex justify-center gap-3">
                        {isTrashed ? (
                          <>
                            <MdRestoreFromTrash
                              onClick={() => handleRestore(item)} 
                              className="cursor-pointer text-3xl text-green-500"
                            />
                            <AiOutlineDelete
                              onClick={() => handlePermanentDelete(item)} 
                              className="cursor-pointer text-3xl text-red-500"
                            />
                          </>
                        ) : (
                          <>
                            <MdModeEdit
                              onClick={() => handleEdit(item.id)} 
                              className="cursor-pointer text-3xl text-blue-500"
                            />
                            <AiOutlineDelete
                              onClick={() => handleDelete(item)} 
                              className="cursor-pointer text-3xl text-red-500"
                            />
                          </>
                        )}
                      </div>
                    </td>

                    <td className="p-3 px-4 text-center">
                      <button 
                        onClick={() => handleViewMore(item.id)} 
                        className="text-[#F98F5C] cursor-pointer font-semibold"
                      >
                        {isExpanded ? 'View Less' : 'View More'}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row for Bank Account Details */}
                  {isExpanded && item.bankAccounts.length > 0 && (
                    <tr>
                      <td colSpan="11" className="p-3 text-left">
                        <div className="overflow-x-auto">
                          <table className="w-full table-auto border-collapse">
                            <thead>
                              <tr className="border-b text-[#A3AED0]">
                                <th className="p-2 px-4 text-left">Account Holder</th>
                                <th className="p-2 px-4 text-left">Account Number</th>
                                <th className="p-2 px-4 text-left">Bank Name</th>
                                <th className="p-2 px-4 text-left">Account Type</th>
                                <th className="p-2 px-4 text-left">IFSC Code</th>
                                <th className="p-2 px-4 text-left">Cheque Image</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.bankAccounts.map((bank, bankIndex) => (
                                <tr key={bankIndex} className="border-b text-[#2B3674]">
                                  <td className="p-3 px-4">{bank.accountHolderName || 'N/A'}</td>
                                  <td className="p-3 px-4">{bank.accountNumber || 'N/A'}</td>
                                  <td className="p-3 px-4">{bank.bankName || 'N/A'}</td>
                                  <td className="p-3 px-4">{bank.accountType || 'N/A'}</td>
                                  <td className="p-3 px-4">{bank.ifscCode || 'N/A'}</td>
                                  <td className="p-3 px-4 text-center">
                                    {bank.cancelledChequeImage ? (
                                      <a href={bank.cancelledChequeImage} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                        View Cheque Image
                                      </a>
                                    ) : 'N/A'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center text-lg text-gray-500">No suppliers available</div>
    )}
        </div>
        )
    );

};

export default SupplierList;
