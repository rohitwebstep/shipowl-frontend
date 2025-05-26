"use client";
import { useEffect, useState } from "react";
import { MdModeEdit, MdRestoreFromTrash } from "react-icons/md";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import Image from "next/image";
import HashLoader from "react-spinners/HashLoader";
import { useRouter } from "next/navigation";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useAdmin } from "../middleware/AdminMiddleWareContext";
import { useAdminActions } from "@/components/commonfunctions/MainContext";

export default function List() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isTrashed, setIsTrashed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const { verifyAdminAuth } = useAdmin();
    const router = useRouter();
    const { fetchAll, fetchTrashed, softDelete, restore, destroy } = useAdminActions("admin/category", "categories");

    const handleCheckboxChange = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true)
            await verifyAdminAuth();
            await fetchAll(setCategoryData, setLoading);
            setLoading(false)

        };

        fetchInitialData();
    }, [fetchAll]);

    const handleToggleTrash = async () => {
        setIsTrashed(prev => !prev);
        if (!isTrashed) {
            await fetchTrashed(setCategoryData, setLoading);
        } else {
            await fetchAll(setCategoryData, setLoading);
        }
    };

    const handleSoftDelete = (id) => softDelete(id, () => fetchAll(setCategoryData, setLoading));
    const handleRestore = (id) => restore(id, () => fetchTrashed(setCategoryData, setLoading));
    const handleDestroy = (id) => destroy(id, () => fetchTrashed(setCategoryData, setLoading));
    useEffect(() => {
        if (typeof window !== 'undefined' && categoryData.length > 0 && !loading) {
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
                if ($.fn.DataTable.isDataTable('#categoryTable')) {
                    $('#categoryTable').DataTable().destroy();
                    $('#categoryTable').empty();
                }

                // Reinitialize DataTable with new data
                table = $('#categoryTable').DataTable();

                return () => {
                    if (table) {
                        table.destroy();
                        $('#categoryTable').empty();
                    }
                };
            }).catch((error) => {
                console.error('Failed to load DataTables dependencies:', error);
            });
        }
    }, [categoryData, loading]);


    const exportCsv = () => {
        const table = $('#categoryTable').DataTable();
        table.button('.buttons-csv').trigger();
    };



    return (
        <div className="md:w-10/12">
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <HashLoader color="orange" />
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-5 main-outer-wrapper">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <h2 className="md:text-2xl font-bold text-[#2B3674]">
                            {isTrashed ? "Trashed Category List" : "Category List"}
                        </h2>
                        <div className="flex gap-3 flex-wrap items-center">

                            <div className="flex justify-end gap-2">
                                <button
                                    className={`p-3 text-white rounded-md ${isTrashed ? "bg-green-500" : "bg-red-500"}`}
                                    onClick={handleToggleTrash}
                                >
                                    {isTrashed ? "Category Listing (Simple)" : "Trashed Category"}
                                </button>
                                <button
                                    className="bg-[#4285F4] text-white rounded-md p-2 px-4"
                                >
                                    <Link href="/admin/category/create">Add Category</Link>
                                </button>
                            </div>
                            <button
                                onClick={() => setIsPopupOpen((prev) => !prev)}
                                className="bg-[#F4F7FE] p-2 rounded-lg relative"
                            >
                                <MoreHorizontal className="text-[#F98F5C]" />
                                {isPopupOpen && (
                                    <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                                        <ul className="py-2 text-sm text-[#2B3674]">
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => exportCsv()}>
                                                Export CSV
                                            </li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleBulkDelete()}>
                                                Bulk Delete
                                            </li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                                        </ul>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    {categoryData.length > 0 ? (
                        <div className="overflow-x-auto w-full relative">
                            <table id="categoryTable" className="display main-tables">
                                <thead>
                                    <tr className="border-b text-[#A3AED0] border-[#E9EDF7]">
                                        <th className="p-2 whitespace-nowrap pe-5 text-left uppercase">Category Name</th>
                                        <th className="p-2 whitespace-nowrap px-5 text-left uppercase">Image</th>
                                        <th className="p-2 whitespace-nowrap px-5 text-left uppercase">Description</th>
                                        <th className="p-2 whitespace-nowrap px-5 text-left uppercase">Status</th>
                                        <th className="p-2 whitespace-nowrap px-5 text-center uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryData.map((item) => (
                                        <tr key={item.id} className="bg-transparent border-b border-[#E9EDF7] text-[#2B3674] font-semibold">
                                            <td className="p-2 bg-transparent whitespace-nowrap border-0 pe-5">
                                                <div className="flex items-center">
                                                    <label className="flex items-center cursor-pointer me-2">
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
                                                    {item.name}
                                                </div>
                                            </td>
                                            <td className="p-2 w-auto relative bg-transparent whitespace-nowrap px-5 border-0">
                                                {item.image ? (<Swiper
                                                    key={item.id}
                                                    modules={[Navigation]}
                                                    slidesPerView={1}
                                                    loop={item.image?.split(',').length > 1}
                                                    navigation={true}
                                                    className="mySwiper w-[200px] ms-2"
                                                >
                                                    {item.image?.split(',').map((img, index) => (
                                                        <SwiperSlide key={index}>
                                                            <Image
                                                                src={`https://placehold.co/600x400?text=${index + 1}`}
                                                                alt={`Image ${index + 1}`}
                                                                width={200}
                                                                height={200}
                                                                className="me-3 object-cover rounded"
                                                            />
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>) : (
                                                    <p>No Image Found</p>
                                                )}

                                            </td>
                                            <td className="p-2 bg-transparent whitespace-nowrap px-5 border-0">{item.description}</td>
                                            <td className="p-2 bg-transparent whitespace-nowrap px-5 border-0">
                                                {item.status ? (
                                                    <span className="bg-green-100 text-green-800 text-lg font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-green-400 border border-green-400">Active</span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-800 text-lg font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-red-400 border border-red-400">Inactive</span>
                                                )}
                                            </td>
                                            <td className="p-2 bg-transparent px-5 text-[#8F9BBA] border-0">
                                                <div className="flex gap-2"> {isTrashed ? (
                                                    <>
                                                        <MdRestoreFromTrash onClick={() => handleRestore(item.id)} className="cursor-pointer text-3xl text-green-500" />
                                                        <AiOutlineDelete onClick={() => handleDestroy(item.id)} className="cursor-pointer text-3xl" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <MdModeEdit onClick={() => router.push(`/admin/category/update?id=${item.id}`)} className="cursor-pointer text-3xl" />
                                                        <AiOutlineDelete onClick={() => handleSoftDelete(item.id)} className="cursor-pointer text-3xl" />
                                                    </>
                                                )}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-[#A3AED0] text-lg font-medium">
                            No category found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}