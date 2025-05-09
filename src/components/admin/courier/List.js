"use client";
import { useContext, useEffect, useCallback, useState } from "react";
import { MdModeEdit, MdRestoreFromTrash } from "react-icons/md";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import HashLoader from "react-spinners/HashLoader";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useAdmin } from "../middleware/AdminMiddleWareContext";

export default function List() {
    const [isTrashed, setIsTrashed] = useState(false);
    const [selected, setSelected] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [countryData, setCountryData] = useState([]);
    const { verifyAdminAuth } = useAdmin();
    const router = useRouter();

    const handleCheckboxChange = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };


    const fetchCompany = useCallback(async () => {
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
                `http://localhost:3001/api/courier-company`,
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
    
            setData(result?.courierCompanies || []);
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);
    
    const trashedComany = useCallback(async () => {
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
                `http://localhost:3001/api/courier-company/trashed`,
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
                setData(result?.courierCompanies || []);
            }
        } catch (error) {
            console.error("Error fetching trashed courier-company:", error);
        } finally {
            setLoading(false);
        }
    }, [router, setData]);

    useEffect(() => {
        const fetchData = async () => {
            setIsTrashed(false);
            setLoading(true);
            await verifyAdminAuth();
            await fetchCompany();
            setLoading(false);
        };
        fetchData();
    }, [fetchCompany, verifyAdminAuth]);

    useEffect(() => {
        if (typeof window !== 'undefined' && data.length > 0 && !loading) {
            let table = null;

            Promise.all([
                import('jquery'),
                import('datatables.net'),
                import('datatables.net-dt'),
                import('datatables.net-buttons'),
                import('datatables.net-buttons-dt')
            ]).then(([jQuery]) => {
                window.jQuery = window.$ = jQuery.default;

                // Destroy existing DataTable if it exists
                if ($.fn.DataTable.isDataTable('#courier-companytable')) {
                    $('#courier-companytable').DataTable().destroy();
                    $('#courier-companytable').empty();
                }

                // Reinitialize DataTable with new data
                table = $('#courier-companytable').DataTable();

                return () => {
                    if (table) {
                        table.destroy();
                        $('#courier-companytable').empty();
                    }
                };
            }).catch((error) => {
                console.error('Failed to load DataTables dependencies:', error);
            });
        }
    }, [data, loading]);

    const handleEditItem = (item) => {
        router.push(`/admin/courier/update?id=${item.id}`);
    };


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
                `http://localhost:3001/api/courier-company/${item.id}`,
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

            await fetchCompany();
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
                `http://localhost:3001/api/courier-company/${item?.id}/restore`,
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
                    title: `${item.name} Has Been Restored Successfully !`,
                    text: result.message,
                });
                await trashedComany();
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }, [router, trashedComany]);

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
                `http://localhost:3001/api/courier-company/${item.id}/destroy`,
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

            await trashedComany();
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
  if (loading) {
          return (
              <div className="flex items-center justify-center h-[80vh]">
                  <HashLoader size={60} color="#F97316" loading={true} />
              </div>
          );
      }
    return (
        <>

            <div className="bg-white rounded-3xl p-5">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#2B3674]">Courier List</h2>
                    <div className="flex gap-3  flex-wrap items-center">
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
                        <div className="flex justify-start gap-5 items-end">
                        <button
                                    className={`p-3 text-white rounded-md ${isTrashed ? 'bg-green-500' : 'bg-red-500'}`}
                                    onClick={async () => {
                                        if (isTrashed) {
                                            setIsTrashed(false);
                                            await fetchCompany();
                                        } else {
                                            setIsTrashed(true);
                                            await trashedComany();
                                        }
                                    }}
                                >
                                    {isTrashed ? "courier-company Listing (Simple)" : "Trashed courier-company"}
                                </button>
                            <button className='bg-[#4285F4] text-white rounded-md p-3 px-8'><Link href="/admin/courier/create">Add New</Link></button>
                        </div>
                    </div>
                </div>
              {data.length > 0 ?(
                  <div className="overflow-x-auto w-full relative">
                  <table className="w-full" id="courier-companytable">
                      <thead>
                          <tr className="border-b text-[#A3AED0] border-[#E9EDF7]">
                              <th className="p-2 whitespace-nowrap px-5 text-left uppercase">Courier Name<i></i></th>
                              <th className="p-2 whitespace-nowrap px-5 text-left uppercase">Courier Code<i></i></th>
                              <th className="p-2 whitespace-nowrap px-5 text-left uppercase">Website<i></i></th>
                              <th className="p-2 whitespace-nowrap px-5 text-left uppercase">Contact Email<i></i></th>
                              <th className="p-2 whitespace-nowrap px-5 text-left uppercase">Contact Number<i></i></th>
                              <th className="p-2 whitespace-nowrap px-5 text-left uppercase">Status<i></i></th>
                              <th className="p-2 whitespace-nowrap px-5 text-center uppercase">Action<i></i></th>
                          </tr>
                      </thead>
                      <tbody>
                          {data.map((item) => (
                              <tr key={item.id} className="border-b border-[#E9EDF7] text-[#2B3674] font-semibold">
                                  <td className="p-2 whitespace-nowrap px-5">
                                      <div className="flex items-center">
                                          <label className="flex items-center cursor-pointer me-2">
                                              <input
                                                  type="checkbox"
                                                  checked={selected.includes(item.id)}
                                                  onChange={() => handleCheckboxChange(item.id)}
                                                  className="peer hidden"
                                              />
                                              <div className="w-4 h-4 border-2 border-[#A3AED0] rounded-sm flex items-center justify-center 
                                                                         peer-checked:bg-[#F98F5C] peer-checked:border-0 peer-checked:text-white">
                                                  <FaCheck className=" peer-checked:block text-white w-3 h-3" />
                                              </div>
                                          </label>
                                          {item.name}
                                      </div>

                                  </td>
                                  <td className="p-2 whitespace-nowrap px-5">{item.code}</td>
                                  <td className="p-2 whitespace-nowrap px-5">{item.website}</td>
                                  <td className="p-2 whitespace-nowrap px-5">{item.email}</td>
                                  <td className="p-2 whitespace-nowrap px-5">{item.phoneNumber}</td>
                                  <td className="p-2 bg-transparent whitespace-nowrap px-5 border-0">
                                                {item.status ? (
                                                    <span className="bg-green-100 text-green-800 text-lg font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-green-400 border border-green-400">Active</span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-800 text-lg font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-red-400 border border-red-400">Inactive</span>
                                                )}
                                            </td>                                  <td className="p-2 px-5 text-[#8F9BBA] text-center">

                                    <div className="flex gap-2">{isTrashed ? (
                                        <>
                                            <MdRestoreFromTrash onClick={() => handleRestore(item)} className="cursor-pointer text-3xl text-green-500" />
                                            <AiOutlineDelete onClick={() => handlePermanentDelete(item)} className="cursor-pointer text-2xl" />
                                        </>
                                    ) : (
                                        <>
                                            <MdModeEdit onClick={() => handleEditItem(item)} className="cursor-pointer text-2xl" />
                                            <AiOutlineDelete onClick={() => handleDelete(item)} className="cursor-pointer text-2xl" />
                                        </>
                                    )}</div>

                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              ):(
                <p className="text-center">No Company Found</p>
              )}

               
            </div>


        </>
    )
}
