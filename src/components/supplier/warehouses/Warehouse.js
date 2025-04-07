
"use client"
import { useState } from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { MoreHorizontal } from "lucide-react";
import Link from 'next/link';
import { FaCheck } from "react-icons/fa"; // FontAwesome Check icon
export default function Warehouse() {

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const warehouseData = [
    {
      id: 1,
      name: "Warehouse Name",
      contact_name: "MOHANBHAI KHOKHANI",
      contact_number: 9876543210,
      address: "Plot No. 36, 2nd Floor, Madhav Park Society, Near Kantheria Hanuman Mandir & Silver Stone Arcade, Surat, Gujarat, PIN: 395004, India",
      pickup_address: true,
      rto_address: true,
    },
    {
      id: 2,
      name: "Warehouse Name",
      contact_name: "RAHUL SHARMA",
      contact_number: 9123456789,
      address: "Plot No. 45, Ground Floor, Diamond Park Society, Near City Mall, Ahmedabad, Gujarat, PIN: 380015, India",
      pickup_address: false,
      rto_address: true,
    }
  ];
  const [selected, setSelected] = useState([]);


  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };


  const totalPages = Math.ceil(warehouseData.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = warehouseData.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <div className="flex justify-end mb-5">
        <button className='bg-[#4285F4] text-white rounded-md p-3 px-8'><Link href="/add-warehouse">Add New</Link></button>

      </div>
      <div className="bg-white rounded-3xl p-5">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#2B3674]">Warehouse</h2>
          <div className="flex gap-3  flex-wrap items-center">
            <button className="bg-[#F4F7FE] p-2 rounded-lg">
              <MoreHorizontal className="text-[#F98F5C]" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto w-full relative">
        <table className="w-full">
            <thead>
              <tr className="border-b text-[#A3AED0] border-[#E9EDF7]">
                <th className="p-2 whitespace-nowrap text-left font-normal">Warehouse Name<i></i></th>
                <th className="p-2 whitespace-nowrap text-left font-normal">Contact Name<i></i></th>
                <th className="p-2 whitespace-nowrap text-left font-normal">Address<i></i></th>
                <th className="p-2 whitespace-nowrap text-left font-normal">Pickup Address<i></i></th>
                <th className="p-2 whitespace-nowrap text-left font-normal">RTO Address<i></i></th>
                <th className="p-2 whitespace-nowrap text-left font-normal">Action<i></i></th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id} className="border-b border-[#E9EDF7] text-[#2B3674] font-semibold">
                  <td className="p-2 whitespace-nowrap"> <div className="flex items-center">
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
                  </div></td>
                  <td className="p-2 whitespace-nowrap">{item.contact_name}<br />
                    {item.contact_number}</td>
                  <td className="p-2 whitespace-nowrap">
                    {(() => {
                      const parts = item.address.split(",");

                      if (parts.length > 2) {
                        const firstPart = parts.slice(0, 2).join(",") + ","; // First 2 segments
                        const remaining = parts.slice(2).join(","); // Remaining part after 2nd comma

                        // Now split the remaining part again
                        const remainingParts = remaining.split(",");

                        if (remainingParts.length > 2) {
                          return (
                            <>
                              {firstPart}
                              <br />
                              {remainingParts.slice(0, 2).join(",")},{" "}
                              <br />
                              {remainingParts.slice(2).join(",")}
                            </>
                          );
                        }

                        return (
                          <>
                            {firstPart}
                            <br />
                            {remaining}
                          </>
                        );
                      }

                      return item.address; // If not enough commas, return full address
                    })()}
                  </td>


                  <td className="p-2">
                    <div className="flex items-center mb-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={item.pickup_address}
                          readOnly
                        />
                        <div
                          className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${item.pickup_address ? "bg-orange-500" : ""
                            }`}
                        >
                          <div
                            className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${item.pickup_address ? "translate-x-5" : ""
                              }`}
                          ></div>
                        </div>

                      </label>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center mb-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={item.rto_address}
                          readOnly
                        />
                        <div
                          className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${item.rto_address ? "bg-orange-500" : ""
                            }`}
                        >
                          <div
                            className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${item.rto_address ? "translate-x-5" : ""
                              }`}
                          ></div>
                        </div>

                      </label>
                    </div>
                  </td>
                  <td className="p-2 text-[#8F9BBA]"><MdModeEdit /></td>
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


    </>
  )
}
