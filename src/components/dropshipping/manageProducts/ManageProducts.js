"use client";

import { useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RiFileEditFill } from "react-icons/ri";

import { MoreHorizontal } from "lucide-react";
import { IoMdRefresh } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { FiDownloadCloud } from "react-icons/fi";
import product from '@/app/assets/product1.png'
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
export default function ManageProducts() {
    const [activeTab, setActiveTab] = useState("Pushed_To_platform");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [selected, setSelected] = useState([]);
    const handleCheckboxChange = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };
    const tabs = [
        { id: "Pushed_To_platform", label: "Pushed To platform" },
        { id: "Inventory_Requests", label: "Inventory Requests" },
    ];
    const [filter, setFilter] = useState("Actual Ratio");
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return today.toISOString().slice(0, 7); // YYYY-MM format
    });
    const data = {
        Pushed_To_platform: [
            {
                channel: "Shopify",
                sku: "#C285800",
                Owl_Price: 580,
                model: 'Supplier',
                product_details: {
                    product_name: "Product Name",
                    img: product
                },
                Delivery_Ratio: 70,
                selling_price: 887,
                margin: 452,
                Inventory: '3,912',
                date_and_time: "15 Aug 24, 01:43 AM",
            },
            {
                channel: "Wix",
                sku: "#C285800",
                Owl_Price: 500,
                product_details: {
                    product_name: "Product Name",
                    img: product
                },
                model: "Self Ship",
                Delivery_Ratio: 70,
                selling_price: 887,
                margin: 452,
                Inventory: '3,912',
                date_and_time: "15 Aug 24, 01:43 AM",
            },
        ],
        Inventory_Requests: [],
    };

    const orders = data[activeTab] || [];
    const totalPages = Math.ceil(orders.length / perPage);
    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentData = orders.slice(indexOfFirst, indexOfLast);

    return (
        <div className="dm w-full lg:p-6">

<h2 className=" text-2xl font-lato font-semibold text-[#F98F5C]">Manage Products</h2>

<div className=" w-2/12 border-b-3  border-[#F98F5C] mt-1 mb-4"></div>
            <div className="md:flex items-center gap-3 bg-white rounded-xl p-5">
                {/* Tabs */}
                <div className="dm md:w-4/12 flex border-b overflow-auto border-[#F4F5F7]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`px-4 py-2 text-lg  whitespace-nowrap ${activeTab === tab.id ? "border-b-4 font-bold border-orange-500 text-orange-500" : "font-medium text-[#718EBF]"
                                }`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setCurrentPage(1);
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="grid lg:grid-cols-3 md:mt-0 mt-6 grid-cols-1 gap-2 justify-baseline md:w-8/12 ">


                    <select
                        name="" id=""
                        className="bg-white outline-0 text-[#718EBF] border border-[#DFEAF2] px-3 py-3 rounded-xl  w-full "
                    >
                        <option value="Model">Model</option>
                        <option value="Percentage Ratio">Percentage Ratio</option>
                    </select>
                    <select
                        name="" id=""
                        className="bg-white outline-0 text-[#718EBF] border border-[#DFEAF2] px-3 py-3 rounded-xl  w-full "
                    >
                        <option value="Select Platform">Select Platform</option>
                        <option value="Percentage Ratio">Percentage Ratio</option>
                    </select>
                    <select
                        name="" id=""

                        className="bg-white outline-0 text-[#718EBF] border border-[#DFEAF2] px-3 py-3 rounded-xl  w-full "
                    >
                        <option value="Select Store">Select Store</option>
                        <option value="Percentage Ratio">Percentage Ratio</option>
                    </select>
                </div>
            </div>
            <div className="dm grid lg:grid-cols-5 md:grid-cols-3 gap-6 my-5 items-end justify-between">


                <div>
                    <label className="text-[#232323] mb-1 block">From Date:</label>
                    <input className="bg-white outline-0 text-[#718EBF] border border-[#DFEAF2] px-3 py-2 rounded-xl w-full" type="text" name="" id="" placeholder="07/23/2024 - 07/30/2024" />


                </div>
                <div>
                    <label className="text-[#232323] mb-1 block">Stock</label>
                    <select
                        name="" id=""

                        className="bg-white outline-0 text-[#718EBF] border border-[#DFEAF2] px-3 py-2 rounded-xl w-full"
                    >
                        <option value="Stock">Stock</option>
                        <option value="Percentage Ratio">Percentage Ratio</option>
                    </select>
                </div>
                <div>
                    <label className="text-[#232323] mb-1 block">Name</label>
                    <input className="bg-white outline-0 text-[#718EBF] border border-[#DFEAF2] px-3 py-2 rounded-xl w-full" type="text" name="" id="" placeholder="Name" />


                </div>
                <div>
                    <label className="text-[#232323] mb-1 block">SKU</label>
                    <input className="bg-white outline-0 text-[#718EBF] border border-[#DFEAF2] px-3 py-2 rounded-xl w-full" type="text" name="" id="" placeholder="SKU" />


                </div>
                <div>

                    <div className="flex gap-3 lg:justify-end justify-normal lg:mt-0 mt-3">
                        <button className="dm bg-[#4285F4] text-white font-bold px-10 py-3 rounded-lg text-sm w-auto">Apply</button>
                        <button className="dm bg-[#EA4335] text-white font-bold px-10 py-3 rounded-lg text-sm w-auto">Reset</button>
                    </div>
                </div>
            </div>
            <div className="dm bg-white p-4 rounded-2xl my-5">
                <div className="md:flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#2B3674] dm">Product</h2>
                    <div className="flex gap-3  flex-wrap items-center">
                        <span className="font-bold text-[#2B3674] dm">Clear Filters</span>
                        <span><IoMdRefresh className="text-red-600 text-xl" /></span>
                        <span><IoSettingsOutline className="text-xl" /></span>
                        <span><FiDownloadCloud className="text-red-400 text-xl" /></span>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-[#4318FF] font-dm-sans text-sm outline-0 text-white md:w-[120px] font-normal  px-2 py-2 rounded-md"
                        >
                            <option value="Actual Ratio ">Bulk Action</option>
                        </select>
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
                <div className="dm overflow-x-auto border-b border-[#E9EDF7]">
                    {currentData.length > 0 && (
                        <table className="dm w-full border-collapse">
                            <thead>
                                <tr className="dm text-[#A3AED0] border-t border-b border-[#E9EDF7]">
                                    <th className="dm p-3 text-left font-medium whitespace-nowrap"> <div className="flex items-center">
                                            <label className="flex items-center cursor-pointer me-2">
                                                <input
                                                    type="checkbox"
                                                    className="peer hidden"
                                                />
                                                <div className="w-4 me-2 h-4 border-2 border-[#A3AED0] rounded-sm flex items-center justify-center 
                  peer-checked:bg-[#F98F5C] peer-checked:border-0 peer-checked:text-white">
                                                    <FaCheck className=" peer-checked:block text-white w-3 h-3" />
                                                </div>

                                            </label>
                                            <span>Channel<i></i></span>
                                        </div></th>
                                    <th className="dm p-3 text-left font-medium whitespace-nowrap">Model<i></i></th>
                                    <th className="dm p-3 text-left font-medium whitespace-nowrap">SKU<i></i></th>
                                    <th className="dm p-3 text-left font-medium whitespace-nowrap">Product Details<i></i></th>
                                    <th className="dm p-3 text-left font-medium whitespace-nowrap">Delivery Ratio<i></i></th>
                                    <th className="dm p-3 text-left font-medium whitespace-nowrap">Owl Price<i></i></th>
                                    <th className="dm p-3 text-left font-medium whitespace-nowrap">Selling Price<i></i></th>
                                    <th className="dm p-3 text-left font-medium whitespace-nowrap">Inventory<i></i></th>
                                    <th className="dm p-3 text-left font-medium whitespace-nowrap">Pushed Date & Time<i></i></th>
                                    <th className="dm p-3 text-left font-medium whitespace-nowrap">Action<i></i></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((order, index) => (
                                    <tr key={index} className="dm text-[#2B3674] align-top font-bold  border-b border-[#E9EDF7]">

                                        <td className="dm p-3 whitespace-nowrap text-black font-bold"><label className="flex items-center cursor-pointer me-2">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(index)}
                                                onChange={() => handleCheckboxChange(index)}
                                                className="peer hidden"
                                            />
                                            <div className="w-4 h-4 border-2 border-[#A3AED0] rounded-sm flex items-center justify-center 
                                                          peer-checked:bg-[#F98F5C] peer-checked:border-0 peer-checked:text-white">
                                                <FaCheck className=" peer-checked:block text-white w-3 h-3" />
                                            </div>
                                            <span className="ms-2">{order.channel}</span>
                                        </label>
                                        </td>
                                        <td className="dm p-3 whitespace-nowrap"> <button className={`rounded-md p-3 py-1 ${order.model == "Supplier" ? "bg-[#00b69b4b] text-[#00B69B]" : "bg-[#5ca5f956] text-[#5CA4F9]"}`}>{order.model || 'NA'}</button></td>
                                        <td className="dm p-3 whitespace-nowrap text-black font-bold">{order.sku || 'NA'}</td>
                                        <td className="dm p-3 whitespace-nowrap"><div className="flex gap-2 items-center"><Image className="h-8 w-8 rounded-full" src={order.product_details.img} alt={order.product_details.product_name} /><span className="truncate">{order.product_details.product_name || 'NA'}</span></div></td>
                                        <td className="dm p-3 whitespace-nowrap">{order.Delivery_Ratio || 'NA'}%</td>
                                        <td className="dm p-3 whitespace-nowrap">₹{order.Owl_Price || 'NA'}</td>
                                        <td className="dm p-3 whitespace-nowrap">₹{order.selling_price || 'NA'} <span className="block text-[#249B3E]">Margin:{order.margin}</span></td>
                                        <td className="dm p-3 whitespace-nowrap"><span className="bg-[#00b69b2c] max-w-[60px] text-[#00b69b] py-2 px-3 rounded-md">{order.Inventory || 'NA'}</span></td>
                                        <td className="dm p-3 whitespace-nowrap text-[#718EBF] font-semibold">{order.date_and_time || 'NA'}</td>
                                        <td className="dm p-3 whitespace-nowrap">
                                            <ul className="dm flex gap-2 justify-between">
                                                <li className="flex gap-1"><RiFileEditFill className="dm text-black text-2xl" /> Edit </li>

                                            </ul>
                                            <button className="dm text-[#F98F5C] border rounded-md  p-2 w-full mt-2 text-sm">
                                                Request Inventory
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {currentData.length == 0 && (

                        <p className="dm text-center font-bold text-xl">No Data Found</p>
                    )}
                </div>

                {/* Pagination */}
                <div className="dm flex justify-end items-center mt-4 p-4 ">
                    <div className="dm flex gap-1 items-center">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="dm px-3 py-1 text-[#2B3674] rounded mx-1 disabled:opacity-50 flex items-center gap-1"
                        >
                            <MdKeyboardArrowLeft /> Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`hidden md:block px-3 py-1 text-[#2B3674] rounded mx-1 ${currentPage === index + 1 ? "bg-[#2B3674] text-white" : ""
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="dm px-3 py-1 text-[#2B3674] rounded mx-1 disabled:opacity-50 flex items-center gap-1"
                        >
                            Next <MdKeyboardArrowRight />
                        </button>
                    </div>

                    {/* Per Page Selection */}
                    <select
                        name="" id=""
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        className="dm border-[#2B3674] bg-[#F8FBFF] text-[#2B3674] rounded px-3 py-2 font-semibold"
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
}
