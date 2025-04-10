"use client";
import { useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";

export default function Payment() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const payments = [
    {
      id: "PAY12345",
      date: "2025-04-01",
      day: "Monday",
      transaction_id: "TXN001001",
      payment_cycle: "Weekly",
      amount: 2999,
      status: "Success",
    },
    {
      id: "PAY12346",
      date: "2025-04-02",
      day: "Tuesday",
      transaction_id: "TXN001002",
      payment_cycle: "Weekly",
      amount: 4199,
      status: "Pending",
    },
    {
      id: "PAY12347",
      date: "2025-04-03",
      day: "Wednesday",
      transaction_id: "TXN001003",
      payment_cycle: "Monthly",
      amount: 5999,
      status: "Failed",
    },
  ];

  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalPages = Math.ceil(payments.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = payments.slice(indexOfFirst, indexOfLast);

  return (
    <div className="bg-white lg:w-8/12 rounded-3xl p-5">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#2B3674]">Payments</h2>
        <div className="flex gap-3 flex-wrap items-center">
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
          <Link href="/dropshipping/payments/create">
            <button className="bg-[#4285F4] text-white rounded-md p-3 px-8">Add New</button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto w-full relative">
        <table className="w-full">
          <thead>
            <tr className="border-b text-[#A3AED0] border-[#E9EDF7] text-sm">
              <th className="p-2 px-5 uppercase text-left">#<i></i></th>
              <th className="p-2 px-5 uppercase text-left">Date<i></i></th>
              <th className="p-2 px-5 uppercase text-left">Transaction ID<i></i></th>
              <th className="p-2 px-5 uppercase text-left">Cycle<i></i></th>
              <th className="p-2 px-5 uppercase text-right">Amount<i></i></th>
              <th className="p-2 px-5 uppercase text-center">Status<i></i></th>
              <th className="p-2 px-5 uppercase text-center">Actions<i></i></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.id} className="border-b border-[#E9EDF7] text-[#2B3674] font-medium text-sm">
                <td className="p-2 px-5">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="peer hidden"
                    />
                    <div className="w-4 h-4 border-2 border-[#A3AED0] rounded-sm flex items-center justify-center 
                      peer-checked:bg-[#F98F5C] peer-checked:border-0 peer-checked:text-white">
                      <FaCheck className="peer-checked:block text-white w-3 h-3" />
                    </div>
                  </label>
                </td>
                <td className="p-2 px-5">{item.date} <span className="text-xs text-gray-400">({item.day})</span></td>
                <td className="p-2 px-5">{item.transaction_id}</td>
                <td className="p-2 px-5">{item.payment_cycle}</td>
                <td className="p-2 px-5 text-right">₹{item.amount.toLocaleString()}</td>
                <td className="p-2 px-5 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === "Success"
                        ? "bg-green-100 text-green-600"
                        : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-2 px-5 text-center">
                  <button className="p-1 px-3 rounded bg-orange-500 text-white mr-2">Edit</button>
                  <button className="p-1 px-3 rounded bg-red-500 text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap lg:justify-end justify-center items-center mt-4 p-4 pt-0">
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 flex gap-1 items-center text-[#2B3674] rounded disabled:opacity-50"
          >
            <MdKeyboardArrowLeft /> Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === index + 1
                  ? "bg-[#2B3674] text-white"
                  : "text-[#2B3674] hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 flex gap-1 items-center text-[#2B3674] rounded disabled:opacity-50"
          >
            Next <MdKeyboardArrowRight />
          </button>
        </div>

        {/* Per Page Selection */}
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="ml-4 border text-sm rounded px-3 py-2 text-[#2B3674]"
        >
          {[5, 10, 15].map((num) => (
            <option key={num} value={num}>
              {num} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
