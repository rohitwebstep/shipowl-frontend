"use client";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import HashLoader from "react-spinners/HashLoader";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { MdModeEdit, MdRestoreFromTrash } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useAdmin } from '../middleware/AdminMiddleWareContext';
import { useAdminActions } from '@/components/commonfunctions/MainContext';
import { DropshipperProfileContext } from './DropshipperProfileContext';

const Dropshipper = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dropshippers, setDropshippers] = useState([]);
    const { verifyAdminAuth } = useAdmin();
    const [isTrashed, setIsTrashed] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [expandedItem, setExpandedItem] = useState(null);
    const [selected, setSelected] = useState([]);
    const { setActiveTab } = useContext(DropshipperProfileContext);

    const { fetchAll, fetchTrashed, softDelete, restore, destroy } = useAdminActions("admin/dropshipper", "dropshippers");

    const handleCheckboxChange = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleToggleTrash = async () => {
        setIsTrashed(prev => !prev);
        if (!isTrashed) {
            await fetchTrashed(setDropshippers, setLoading);
        } else {
            await fetchAll(setDropshippers, setLoading);
        }
    };

    const handleSoftDelete = (id) => softDelete(id, () => fetchAll(setDropshippers, setLoading));
    const handleRestore = (id) => restore(id, () => fetchTrashed(setDropshippers, setLoading));
    const handleDestroy = (id) => destroy(id, () => fetchTrashed(setDropshippers, setLoading));


    useEffect(() => {
        const fetchData = async () => {
            setIsTrashed(false);
            setLoading(true);
            await verifyAdminAuth();
            await fetchAll(setDropshippers, setLoading);
            setLoading(false);
        };
        fetchData();
    }, [, verifyAdminAuth]);
    useEffect(() => {
        if (typeof window !== "undefined" && dropshippers.length > 0 && !loading) {
            let table = null;

            Promise.all([
                import("jquery"),
                import("datatables.net"),
                import("datatables.net-dt"),
                import("datatables.net-buttons"),
                import("datatables.net-buttons-dt")
            ])
                .then(([jQuery]) => {
                    window.jQuery = window.$ = jQuery.default;

                    if ($.fn.DataTable.isDataTable("#supplierTable")) {
                        $("#supplierTable").DataTable().destroy();
                        // Remove the empty() call here
                    }

                    table = $("#supplierTable").DataTable();

                    return () => {
                        if (table) {
                            table.destroy();
                        }
                    };
                })
                .catch((error) => {
                    console.error("Failed to load DataTables dependencies:", error);
                });
        }
    }, [loading]);

    const checkReporting = (id) => {
        router.push(`/admin/dropshipper/reporting?id=${id}`);
    }
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <HashLoader color="orange" size={50} />
            </div>
        );
    }

    return (

        <div className="bg-white rounded-3xl p-5">
            <div className="flex flex-wrap justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#2B3674]">Dropshippers List</h2>
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
                        <button onClick={setActiveTab('account_details')} className="bg-[#F98F5C] text-white px-4 py-2 rounded-lg text-sm">
                            <Link href="/admin/dropshipper/create">Add New</Link>
                        </button>

                        <button
                            className={`p-3 text-white rounded-md ${isTrashed ? "bg-green-500" : "bg-red-500"}`}
                            onClick={handleToggleTrash}
                        >
                            {isTrashed ? "Dropshipper Listing (Simple)" : "Trashed Dropshipper"}
                        </button>
                    </div>

                </div>
            </div>


            {dropshippers.length > 0 ? (
                <div className="overflow-x-auto w-full relative main-outer-wrapper">
                    <table className="display main-tables w-full" id="supplierTable">
                        <thead>
                            <tr className="border-b text-[#A3AED0] border-[#E9EDF7]">
                                <th className="p-3 px-4 text-left uppercase whitespace-nowrap">Sr.</th>
                                <th className="p-3 px-4 text-left uppercase whitespace-nowrap">Name</th>
                                <th className="p-3 px-4 text-left uppercase whitespace-nowrap">Email</th>
                                <th className="p-3 px-4 text-left uppercase whitespace-nowrap">Permanent Address</th>
                                <th className="p-3 px-4 text-left uppercase whitespace-nowrap">Country</th>
                                <th className="p-3 px-4 text-left uppercase whitespace-nowrap">State</th>
                                <th className="p-3 px-4 text-left uppercase whitespace-nowrap">City</th>
                                <th className="p-3 px-4 text-left uppercase whitespace-nowrap">Postal Code</th>
                                <th className="p-3 px-4 text-left uppercase whitespace-nowrap">View More</th>
                                <th className="p-3 px-4 text-left uppercase whitespace-nowrap">Check Reporting</th>
                                <th className="p-3 px-4 text-left uppercase whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dropshippers.map((item, index) => {
                                return (
                                    <React.Fragment key={item.id}>
                                        <tr className="bg-transparent border-b border-[#E9EDF7] text-[#2B3674] font-semibold">
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
                                            <td className="p-3 px-4 text-left">{item.permanentAddress || '-'}</td>
                                            <td className="p-3 px-4 text-left whitespace-nowrap">
                                                {item?.permanentCountry?.name || '-'}
                                            </td>
                                            <td className="p-3 px-4 text-left whitespace-nowrap">
                                                {item?.permanentState?.name || '-'}
                                            </td>
                                            <td className="p-3 px-4 text-left whitespace-nowrap">
                                                {item.permanentCity?.name || '-'}
                                            </td>
                                            <td className="p-3 px-4 text-left whitespace-nowrap">{item.permanentPostalCode || '-'}</td>
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


                                            <td className="p-3 px-4 text-left whitespace-nowrap">
                                                <button
                                                    className='bg-orange-500 rounded-md text-white p-3'
                                                    onClick={() => checkReporting(item.id)}
                                                >
                                                    View Reporting
                                                </button>
                                            </td>


                                            <td className="p-3 px-4 text-center">
                                                <div className="flex gap-2"> {isTrashed ? (
                                                    <>
                                                        <MdRestoreFromTrash onClick={() => handleRestore(item.id)} className="cursor-pointer text-3xl text-green-500" />
                                                        <AiOutlineDelete onClick={() => handleDestroy(item.id)} className="cursor-pointer text-3xl" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <MdModeEdit onClick={() => {
                                                            router.push(`/admin/dropshipper/update?id=${item.id}`);
                                                            setActiveTab('account_details');
                                                        }
                                                        } className="cursor-pointer text-3xl" />
                                                        <AiOutlineDelete onClick={() => handleSoftDelete(item.id)} className="cursor-pointer text-3xl" />
                                                    </>
                                                )}</div>
                                            </td>


                                        </tr>




                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
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
                                    <p><span className="font-semibold">Account Holder:</span> {expandedItem?.bankAccount?.accountHolderName || "-"}</p>
                                    <p><span className="font-semibold">Account Number:</span> {expandedItem?.bankAccount?.accountNumber || "-"}</p>
                                    <p><span className="font-semibold">Bank Name:</span> {expandedItem?.bankAccount?.bankName || "-"}</p>
                                    <p><span className="font-semibold">Account Type:</span> {expandedItem?.bankAccount?.accountType || "-"}</p>
                                    <p><span className="font-semibold">IFSC Code:</span> {expandedItem?.bankAccount?.ifscCode || "-"}</p>
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
                                            "-"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-lg text-gray-500">No dropshippers available</div>
            )
            }
        </div >
    );

};

export default Dropshipper;
