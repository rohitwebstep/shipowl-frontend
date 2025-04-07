"use client";
import { usePathname } from "next/navigation";
import { FaSearch, FaBell, FaChevronDown } from "react-icons/fa";
import Image from "next/image";
import userImage from "@/app/images/userimage.png";

export default function Header() {
  const pathname = usePathname(); // Get current route

  // Map route to a more readable title
  const pageTitles = {
    "/supplier": "Dashboard",
    "/supplier/product": "Product",
    "/supplier/new-product-request": "New Product Request",
    "/supplier/orders": "Orders",
    "/supplier/warehouse": "Warehouse",
    "/supplier/rto-orders": "RTO Orders",
    "/supplier/profile": "Profile",
    "/supplier/settings": "Settings",
    "/supplier/billings": "Billings",
    "/supplier/payment": "Payment",
    "/supplier/terms": "Terms & Conditions",
    "/supplier/add-warehouse": "Add Warehouse",
    "/supplier/add-product": "Add Product",
  };

  const currentPage = pageTitles[pathname] || "Dashboard";

  return (
    <header className="md:flex items-center md:mt-16 mt-10 lg:mt-0 justify-between md:p-7 p-2 md:py-8 pt-6">
      {/* Left: Breadcrumb & Title */}
      <div className="md:w-4/12">
        <p className="text-sm text-[#707EAE]">Pages / {currentPage}</p>
        <h1 className="md:text-4xl text-3xl mt-3 font-bold text-[#2B3674]">{currentPage}</h1>
      </div>

      {/* Right: Date Picker, Search, Notification, Profile */}
      <div className="flex  items-cente mt-5 md:mt-0 justify-end space-x-4 md:w-8/12">
        {/* Date Picker */}
        <button className="bg-white hidden md:flex px-10 py-4 gap-8 rounded-full font-semibold text-[#2B3674]  items-center space-x-2">
          <span>07/26/2024</span>
          <span><FaChevronDown /></span>
        </button>

        <div className="bg-white w-full md:w-auto rounded-full p-3 flex justify-baseline md:gap-4 gap-1">
          {/* Search Input */}
          <div className="relative  w-9/12">
            <FaSearch className="absolute md:left-3 right-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="md:pl-10 w-full pl-4 pr-4 py-2 bg-[#F4F7FE] rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Notification Bell */}
          <button className="relative p-2">
            <FaBell className="text-gray-500" />
            <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
          </button>

          {/* Profile Picture */}
          <Image
            src={userImage}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-white shadow"
          />
        </div>
      </div>
    </header>
  );
}
