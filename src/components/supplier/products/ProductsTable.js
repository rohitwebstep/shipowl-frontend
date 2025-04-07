"use client"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { MdModeEdit } from "react-icons/md";
import Link from "next/link";
import { FaCheck } from "react-icons/fa"; // FontAwesome Check icon
import Image from "next/image";
import productimage from '@/app/images/product1.png'
import productimage2 from '@/app/images/product2.png'
import productimage3 from '@/app/images/product3.png'
import productimage4 from '@/app/images/product4.png'
import productimage5 from '@/app/images/product5.png'
const ProductTable = () => {

    const [showRtoLiveCount, setShowRtoLiveCount] = useState(false);

    const data = [
        {
            id: 1,
            name: "Product Name",
            sku: "#SKU58208",
            suggestedPrice: 5,
            costPrice: 5,
            quantity: 5,
            liveRtoStock: 5,
            autoAccept: true,
            rtoStatus: "Free",
            adminStatus: "rejected",
            status: false,
            model: 'Warehouse',
            productImage: productimage,
        },
        {
            id: 2,
            name: "Product Name",
            sku: "#SKU5858",
            suggestedPrice: 4,
            costPrice: 4,
            quantity: 4,
            liveRtoStock: 4,
            autoAccept: false,
            status: false,
            adminStatus: "rejected",
            rtoStatus: "Include RTO",
            model: 'RTO',
            productImage: productimage2
        },
        {
            id: 3,
            name: "Product Name",
            sku: "#SKU78208",
            suggestedPrice: 6,
            costPrice: 6,
            quantity: 6,
            liveRtoStock: 6,
            autoAccept: false,
            status: true,
            adminStatus: "Pending",
            rtoStatus: "Free",
            model: 'RTO',
            productImage: productimage3,
        },
        {
            id: 4,
            name: "Product Name",
            sku: "#SKU98208",
            suggestedPrice: 8,
            costPrice: 8,
            quantity: 8,
            liveRtoStock: 8,
            autoAccept: false,
            status: false,
            adminStatus: "Pending",
            rtoStatus: "Include RTO",
            model: 'Warehouse',
            productImage: productimage4,
        },
        {
            id: 5,
            name: "Product Name",
            sku: "#SKU56208",
            suggestedPrice: 10,
            costPrice: 10,
            quantity: 10,
            liveRtoStock: 10,
            autoAccept: false,
            status: true,
            adminStatus: "Pending",
            rtoStatus: "Free",
            model: 'Warehouse',
            productImage: productimage5,
        },
    ];

    const [selected, setSelected] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return today.toISOString().slice(0, 7); // YYYY-MM format
    });
    const handleCheckboxChange = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const totalPages = Math.ceil(data.length / perPage);
    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentData = data.slice(indexOfFirst, indexOfLast);


    return (
        <div className="">
            <div className="flex flex-wrap md:justify-end justify-items-center gap-2 mb-4">
                <button className="bg-[#EE5D50] text-white px-4 py-2 rounded-lg text-sm">
                    Details for approval
                </button>
                <button className="bg-[#2B3674] text-white px-4 py-2 rounded-lg text-sm">
                    Import Inventory
                </button>
                <button className="bg-[#05CD99] text-white px-4 py-2 rounded-lg text-sm">
                    Export
                </button>
                <button className="bg-[#3965FF] text-white px-4 py-2 rounded-lg text-sm">
                    Import
                </button>
                <button className="bg-[#F98F5C] text-white px-4 py-2 rounded-lg text-sm" >
                    <Link href="/supplier/add-product">Add New</Link>
                </button>
                <button className="bg-[#4285F4] text-white px-4 py-2 rounded-lg text-sm">
                    Filters
                </button>
            </div>

            <div className="flex flex-wrap gap-4 items-end">
                <div className="w-full md:w-5/12">
                    <label className="block text-sm font-medium text-gray-700">
                        RTO Address *
                    </label>
                    <select className="w-full mt-1 px-3 py-3 border-[#DFEAF2] bg-white border rounded-lg text-sm">
                        <option></option>
                    </select>
                </div>

                <div className="w-full md:w-3/12">
                    <label className="block text-sm font-medium text-gray-700">
                        Pickup Address *
                    </label>
                    <select className="w-full mt-1 px-3 border-[#DFEAF2] bg-white py-3 border rounded-lg text-sm">
                        <option></option>
                    </select>
                </div>

                <div className="w-full md:w-3/12">
                    <label className="block text-sm font-medium text-gray-700">
                        Select Model
                    </label>
                    <select className="w-full mt-1 px-3 py-3 border border-[#DFEAF2] bg-white rounded-lg text-sm">
                        <option></option>
                    </select>
                </div>

                {/* Save Button */}
                <div className="flex justify-end items-end">
                    <button className="bg-[#F98F5C] text-white px-6 py-3 rounded-lg text-sm">
                        Save
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-2xl mt-5 p-4">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#2B3674]">Product Details</h2>
                    <div className="flex gap-3  flex-wrap items-center">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={showRtoLiveCount}
                                onChange={() => setShowRtoLiveCount(!showRtoLiveCount)}
                            />
                            <div
                                className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${showRtoLiveCount ? "bg-orange-500" : ""
                                    }`}
                            >
                                <div
                                    className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${showRtoLiveCount ? "translate-x-5" : ""
                                        }`}
                                ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                                Show RTO Live Count
                            </span>
                        </label>
                        {selected < 1 && (
                            <span className="font-semibold text-[#2B3674]">Total: {data.length} Products</span>
                        )}
                        {selected.length > 0 && (

                            <h5 className="font-semibold text-[#2B3674] bg-[#DFE9FF] p-3 flex rounded-md gap-7">{selected.length} Products Selected <span className="text-[#EE5D50] cursor-pointer " onClick={() => setSelected([])}>Clear</span></h5>
                        )

                        }



                        <button className="bg-[#F4F7FE] rela px-4 py-2 text-sm rounded-lg flex items-center text-[#A3AED0]">

                            {/* Month Input */}
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="outline-0"
                            />
                        </button>
                        <button className="bg-[#F4F7FE] p-2 rounded-lg">
                            <MoreHorizontal className="text-[#F98F5C]" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto relative w-full">
                    <table className="md:w-full w-auto">
                        <thead>
                            <tr className="border-b text-[#A3AED0] border-[#E9EDF7]">
                                <th className="p-2 px-5 whitespace-nowrap text-left font-normal">NAME<i></i></th>
                                <th className="p-2 px-5 whitespace-nowrap text-left font-normal">SKU<i></i></th>
                                <th className="p-2 px-5 whitespace-nowrap text-left font-normal text-red-500">Suggested Price<i></i></th>
                                <th className="p-2 px-5 whitespace-nowrap text-left font-normal">Shipwoll Cost Price<i></i></th>
                                <th className="p-2 px-5 whitespace-nowrap text-left font-normal">Quantity<i></i></th>
                                {showRtoLiveCount && (
                                    <th className="p-2 px-5 whitespace-nowrap text-left font-normal text-blue-500">Live RTO Stock<i></i></th>
                                )}
                                <th className="p-2 px-5 whitespace-nowrap text-left font-normal">Order Auto Accept<i></i></th>
                                <th className="p-2 px-5 whitespace-nowrap text-left font-normal">Status<i></i></th>
                                <th className="p-2 px-5 whitespace-nowrap text-left font-normal">Admin Status<i></i></th>
                                {!showRtoLiveCount && (
                                    <th className="p-2 px-5 whitespace-nowrap text-left font-normal">Model<i></i></th>
                                )}
                                {showRtoLiveCount && (
                                    <th className="p-2 px-5 whitespace-nowrap text-left font-normal">RTO Status<i></i></th>
                                )}

                                <th className="p-2 px-5 whitespace-nowrap text-left font-normal">Action<i></i></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item) => (
                                <tr key={item.id} className="border-b border-[#E9EDF7] text-[#2B3674] font-semibold">
                                    <td className="p-2 px-5 whitespace-nowrap"> <div className="flex items-center">
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

                                        <Image src={item.productImage} alt={item.name} className="h-8 w-8 me-3" />
                                        <span className="truncate"> {item.name}</span>
                                    </div></td>
                                    <td className="p-2 px-5 whitespace-nowrap">{item.sku}</td>
                                    <td className="p-2 px-5 whitespace-nowrap text-red-500">{item.suggestedPrice}</td>
                                    <td className="p-2 px-5 whitespace-nowrap">{item.costPrice}</td>
                                    <td className="p-2 px-5 whitespace-nowrap">{item.quantity}</td>
                                    {showRtoLiveCount && (
                                        <td className="p-2 px-5 whitespace-nowrap text-blue-500">{item.liveRtoStock}</td>
                                    )}
                                    <td className="p-2 px-5 whitespace-nowrap">
                                        <div className="flex items-center mb-4">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={item.autoAccept}
                                                    readOnly
                                                />
                                                <div
                                                    className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${item.autoAccept ? "bg-orange-500" : ""
                                                        }`}
                                                >
                                                    <div
                                                        className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${item.autoAccept ? "translate-x-5" : ""
                                                            }`}
                                                    ></div>
                                                </div>

                                            </label>
                                        </div>
                                    </td>
                                    <td className="p-2 px-5 whitespace-nowrap">
                                        <div className="flex items-center mb-4">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={item.status}
                                                    readOnly
                                                />
                                                <div
                                                    className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${item.status ? "bg-orange-500" : ""
                                                        }`}
                                                >
                                                    <div
                                                        className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${item.status ? "translate-x-5" : ""
                                                            }`}
                                                    ></div>
                                                </div>

                                            </label>
                                        </div>
                                    </td>
                                    <td className="p-2 px-5 whitespace-nowrap">
                                        <button
                                            className={` py-2 text-white rounded-md text-sm p-3 uppercase font-normal min-w-[95px]
    ${item.adminStatus === "Done" ? "bg-green-500" :
                                                    item.adminStatus === "Pending" ? "bg-[#FFB547]" :
                                                        "bg-red-500"}`}
                                        >
                                            {item.adminStatus}
                                        </button>

                                    </td>
                                    {!showRtoLiveCount && (
                                        <td className="p-2 px-5 whitespace-nowrap">
                                            <button
                                                className={` py-2 text-white rounded-md text-sm p-3 font-normal min-w-[95px] 
    ${item.model === "Warehouse" ? "bg-[#01B574]" :
                                                        "bg-[#5CA4F9]"}`}
                                            >
                                                {item.model}
                                            </button>

                                        </td>
                                    )}
                                    {showRtoLiveCount && (
                                        <td className="p-2 px-5 whitespace-nowrap"> <button
                                            className={` py-2 text-white rounded-md text-sm p-3 font-normal min-w-[95px]
    ${item.rtoStatus === "Free" ? "bg-green-500" :
                                                    item.rtoStatus === "Pending" ? "bg-[#FFB547]" :
                                                        "bg-red-500"}`}
                                        >
                                            {item.rtoStatus}
                                        </button></td>
                                    )}
                                    <td className="p-2 px-5 whitespace-nowrap text-[#8F9BBA]"><MdModeEdit /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap lg:justify-end justify-center items-center mt-4 p-4 pt-0">
                    <div className="flex gap-1 items-center">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border-[#2B3674] flex gap-1  items-center  text-[#2B3674] rounded mx-1 disabled:opacity-50"
                        >
                            <MdKeyboardArrowLeft /> Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 hidden md:block py-1 border-[#2B3674] text-[#2B3674] rounded mx-1 ${currentPage === index + 1 ? "bg-[#2B3674] text-white" : ""
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border-[#2B3674] flex gap-1 items-center text-[#2B3674] rounded mx-1 disabled:opacity-50"
                        >
                            Next <MdKeyboardArrowRight />
                        </button>
                    </div>

                    {/* Per Page Selection */}
                    <select
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        className="border-[#2B3674] bg-[#F8FBFF] text-[#2B3674] rounded px-3 py-2 font-semibold"
                    >
                        {[5, 10, 15].map((num) => (
                            <option key={num} value={num}>
                                {num} /Per Page
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ProductTable;
