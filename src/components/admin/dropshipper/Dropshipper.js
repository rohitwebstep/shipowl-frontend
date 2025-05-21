"use client";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import HashLoader from "react-spinners/HashLoader";
import React, { useState, useCallback, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { MdModeEdit, MdRestoreFromTrash } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useAdmin } from '../middleware/AdminMiddleWareContext';
const Dropshipper = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dropshipper, setDropshipper] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const { verifyAdminAuth } = useAdmin();
    const [isTrashed, setIsTrashed] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);

    const fetchDropshipper = useCallback(async () => {
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
            const response = await fetch(`http://localhost:3001/api/dropshipper`, {
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
                setDropshipper(result?.dropshippers || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }, [router, setDropshipper]);

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
            const response = await fetch(`http://localhost:3001/api/dropshipper/trashed`, {
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
                setDropshipper(result?.dropshippers || []);
            }
        } catch (error) {
            console.error("Error fetching trashed categories:", error);
        } finally {
            setLoading(false);
        }
    }, [router, setDropshipper]);

    useEffect(() => {
        const fetchData = async () => {
            setIsTrashed(false);
            setLoading(true);
            await verifyAdminAuth();
            await fetchDropshipper();
            await fetchCity();
            await fetchState();
            setLoading(false);
        };
        fetchData();
    }, [fetchDropshipper, verifyAdminAuth]);

    useEffect(() => {
        if (typeof window !== "undefined" && dropshipper.length > 0 && !loading) {
            let table = null;

            Promise.all([import("jquery"), import("datatables.net"), import("datatables.net-dt"), import("datatables.net-buttons"), import("datatables.net-buttons-dt")])
                .then(([jQuery]) => {
                    window.jQuery = window.$ = jQuery.default;

                    // Destroy existing DataTable if it exists
                    if ($.fn.DataTable.isDataTable("#supplierTable")) {
                        $("#supplierTable").DataTable().destroy();
                        $("#supplierTable").empty();
                    }

                    // Reinitialize DataTable with new dropshipper
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
    }, [dropshipper, loading]);



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
                `http://localhost:3001/api/dropshipper/${item.id}`,
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

            await fetchDropshipper();
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
                `http://localhost:3001/api/dropshipper/${item.id}/destroy`,
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
                `http://localhost:3001/api/dropshipper/${item?.id}/restore`,
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

    const handleEdit = (id) => {
        router.push(`/admin/dropshipper/update?id=${id}`);
    }

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
                `http://localhost:3001/api/location/city`,
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
                `http://localhost:3001/api/location/state`,
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

    return (
  loading ? (
    <div className="flex justify-center items-center h-96">
      <HashLoader color="orange" />
    </div>
  ) : (
    <div className="bg-white rounded-3xl p-5">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#2B3674]">Dropshipper List</h2>
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
              <Link href="/admin/dropshipper/create">Add New</Link>
            </button>
            <button
              className={`p-3 text-white rounded-md ${isTrashed ? 'bg-green-500' : 'bg-red-500'}`}
              onClick={async () => {
                if (isTrashed) {
                  setIsTrashed(false);
                  await fetchDropshipper();
                } else {
                  setIsTrashed(true);
                  await trashSupplier();
                }
              }}
            >
              {isTrashed ? "Dropshipper Listing (Simple)" : "Trashed Dropshipper"}
            </button>
          </div>
        </div>
      </div>

      {dropshipper.length > 0 ? (
        <div className="overflow-x-auto w-full relative main-outer-wrapper">
          <table className="display main-tables w-full" id="supplierTable">
            <thead>
              <tr className="border-b text-[#A3AED0] border-[#E9EDF7]">
                <th className="p-3 px-4 text-left uppercase">Sr.</th>
                <th className="p-3 px-4 text-left uppercase">Name</th>
                <th className="p-3 px-4 text-left uppercase">Email</th>
                <th className="p-3 px-4 text-left uppercase">Permanent Address</th>
                <th className="p-3 px-4 text-left uppercase">State</th>
                <th className="p-3 px-4 text-left uppercase">City</th>
                <th className="p-3 px-4 text-left uppercase">Postal Code</th>
                <th className="p-3 px-4 text-left uppercase">Action</th>
                <th className="p-3 px-4 text-left uppercase">Bank Details</th>
              </tr>
            </thead>
            <tbody>
              {dropshipper.map((item, index) => (
                <tr key={item.id} className="border-b border-[#E9EDF7] text-[#2B3674] font-semibold">
                  <td className="p-2 px-4 text-left">
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer me-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                          className="peer hidden"
                        />
                        <div className="w-4 h-4 border-2 border-[#A3AED0] rounded-sm flex items-center justify-center peer-checked:bg-[#F98F5C] peer-checked:border-0">
                          <FaCheck className="peer-checked:block text-white w-3 h-3" />
                        </div>
                      </label>
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-2 px-4 text-left">{item.name || "N/A"}</td>
                  <td className="p-2 px-4 text-left">{item.email || "N/A"}</td>
                  <td className="p-2 px-4 text-left">{item.permanentAddress || "N/A"}</td>
                  <td className="p-2 px-4 text-left">
                    {stateData.find((state) => state.id === item.permanentStateId)?.name || "N/A"}
                  </td>
                  <td className="p-2 px-4 text-left">
                    {cityData.find((city) => city.id === item.permanentCityId)?.name || "N/A"}
                  </td>
                  <td className="p-2 px-4 text-left">{item.permanentPostalCode || "N/A"}</td>
                  <td className="p-2 px-5 text-center text-[#8F9BBA]">
                    <div className="flex justify-center gap-2">
                      {isTrashed ? (
                        <>
                          <MdRestoreFromTrash
                            onClick={() => handleRestore(item)}
                            className="cursor-pointer text-3xl text-green-500"
                          />
                          <AiOutlineDelete
                            onClick={() => handlePermanentDelete(item)}
                            className="cursor-pointer text-3xl"
                          />
                        </>
                      ) : (
                        <>
                          <MdModeEdit
                            onClick={() => handleEdit(item.id)}
                            className="cursor-pointer text-3xl"
                          />
                          <AiOutlineDelete
                            onClick={() => handleDelete(item)}
                            className="cursor-pointer text-3xl"
                          />
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() =>
                        expandedItem?.id === item.id
                          ? setExpandedItem(null)
                          : setExpandedItem(item)
                      }
                      className="text-white rounded-md p-2 bg-[#2B3674] cursor-pointer font-semibold"
                    >
                      {expandedItem?.id === item.id
                        ? "Hide Bank Details"
                        : "View Bank Details"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center">No dropshipper available</div>
      )}

      {/* Modal */}
      {expandedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
            <button
              onClick={() => setExpandedItem(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#2B3674]">Bank Account Details</h2>
            <div className="space-y-3 text-sm text-[#2B3674]">
              <p><span className="font-semibold">Account Holder:</span> {expandedItem?.bankAccount?.accountHolderName || "N/A"}</p>
              <p><span className="font-semibold">Account Number:</span> {expandedItem?.bankAccount?.accountNumber || "N/A"}</p>
              <p><span className="font-semibold">Bank Name:</span> {expandedItem?.bankAccount?.bankName || "N/A"}</p>
              <p><span className="font-semibold">Account Type:</span> {expandedItem?.bankAccount?.accountType || "N/A"}</p>
              <p><span className="font-semibold">IFSC Code:</span> {expandedItem?.bankAccount?.ifscCode || "N/A"}</p>
              <p className="flex items-center">
                <span className="font-semibold mr-2">Cheque Image:</span>
                {expandedItem?.bankAccount?.cancelledChequeImage ? (
                  <a
                    href={expandedItem?.bankAccount?.cancelledChequeImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Cheque Image
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
);
}
export default Dropshipper;
