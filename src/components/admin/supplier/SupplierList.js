"use client"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import { React, useState } from 'react'
import { FaCheck } from 'react-icons/fa';
import { MoreHorizontal } from "lucide-react";
export default function Supplier() {
    const suppliers = [

        {
            id: 1,
            name: "Rajesh Kumar",
            email: "rajesh.kumar@example.com",
            dob: "1985-04-12",
            present_address: "123, Green Street, Delhi",
            permanent_address: "456, Blue Lane, Mumbai",
            state: "Maharashtra",
            city: "Mumbai",
            postal_code: "400001",
            pincode: "123456",
            gst_number: "27ABCDE1234F1Z5",
            pan_card_id: "ABCDE1234F",
            aadhar_card_id: "1234-5678-9012",
        },
        {
            id: 2,
            name: "Sneha Verma",
            email: "sneha.verma@example.com",
            dob: "1990-08-25",
            present_address: "789, Red Road, Bangalore",
            permanent_address: "101, Yellow Building, Hyderabad",
            state: "Karnataka",
            city: "Bangalore",
            postal_code: "560001",
            pincode: "654321",
            gst_number: "29XYZ9876K1Z8",
            pan_card_id: "XYZ9876K1",
            aadhar_card_id: "5678-1234-9012",
        },
        {
            id: 3,
            name: "Anil Sharma",
            email: "anil.sharma@example.com",
            dob: "1978-01-15",
            present_address: "321, Sunset Blvd, Pune",
            permanent_address: "654, Mountain View, Ahmedabad",
            state: "Gujarat",
            city: "Ahmedabad",
            postal_code: "380001",
            pincode: "789012",
            gst_number: "24LMNOP5678A1Z9",
            pan_card_id: "LMNOP5678A",
            aadhar_card_id: "8901-2345-6789",
        },
        {
            id: 4,
            name: "Pooja Gupta",
            email: "pooja.gupta@example.com",
            dob: "1995-06-10",
            present_address: "987, Lake View, Kolkata",
            permanent_address: "123, City Center, Chennai",
            state: "West Bengal",
            city: "Kolkata",
            postal_code: "700001",
            pincode: "321654",
            gst_number: "19QRST4321B1Z7",
            pan_card_id: "QRST4321B",
            aadhar_card_id: "2345-6789-0123",
        }
    ];

    const [isPopupOpen, setIsPopupOpen] = useState(false);



    const [selected, setSelected] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const totalPages = Math.ceil(suppliers.length / perPage);
    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentData = suppliers.slice(indexOfFirst, indexOfLast);

    const handleCheckboxChange = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };
    return (
        <>

            <div className="bg-white rounded-3xl p-5">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#2B3674]">Suppliers List</h2>
                    <div className="flex gap-3  flex-wrap items-center">
                        <button
                            onClick={() => setIsPopupOpen((prev) => !prev)}
                            className="bg-[#F4F7FE] p-2 rounded-lg relative"
                        >
                            <MoreHorizontal className="text-[#F98F5C]" />
                            {isPopupOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                                    <ul className="py-2 text-sm text-[#2B3674]">
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Export CSV</li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Bulk Delete</li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                                    </ul>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto w-full relative">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-[#A3AED0] border-[#E9EDF7]">
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">Sr.<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">Name<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">Email<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">Date Of Birth<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">Present Address<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">Permanent Address<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">State<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">City<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">Postal Code<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">Pincode<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">GST Number<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">Pan Card ID<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">Aadhar Card ID<i></i></th>
                                <th className=" p-3 px-4 whitespace-nowrap text-left uppercase">Action<i></i></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, index) => {
                                return (
                                    <tr key={item.id} className="border-b border-[#E9EDF7] text-[#2B3674] font-semibold">

                                        <td className=" p-2  px-4 whitespace-nowrap text-left"> <div className="flex items-center">
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
                                            {index + 1}
                                        </div></td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">{item.name}</td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">{item.email}</td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">{item.dob}</td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">{item.present_address}</td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">{item.permanent_address}</td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">{item.state}</td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">{item.city}</td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">{item.postal_code}</td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">{item.pincode}</td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">{item.gst_number}</td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">{item.pan_card_id}</td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">{item.aadhar_card_id}</td>
                                        <td className=" p-2  px-4 whitespace-nowrap text-left">

                                            <button className='p-3 px-5 rounded-md bg-orange-500 text-white'>
                                                Edit
                                            </button>
                                            <button className='p-3  px-5 ms-2  rounded-md bg-red-500 text-white'>
                                                Delete
                                            </button>
                                        </td>


                                    </tr>
                                );
                            })}
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
        </>
    )
}
