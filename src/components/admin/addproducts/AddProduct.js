"use client";

import { useState } from "react";
import ProductDetails from './ProductDetails'
import VariantsDetails from './VariantsDetails'
import ShippingDetails from './ShippingDetails'
import OtherDetails from './OtherDetails'
const Tabs = () => {
  const [activeTab, setActiveTab] = useState("product-details");

  const tabs = [
    { id: "product-details", label: "Product Details" },
    { id: "variants-details", label: "Variants Details" },
    { id: "shipping-details", label: "Shipping Details" },
    { id: "other-details", label: "Other Details" },
  ];

  return (
    <div className="w-full xl:p-6">
      <div className="bg-white rounded-3xl p-5">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">
            Select Supplier
          </label>
          <select className="w-full mt-1 px-3 py-3 border-[#DFEAF2] bg-white border rounded-lg text-sm">
            <option></option>
          </select>
        </div>

        <div className="flex border-b overflow-auto  border-[#F4F5F7]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-lg whitespace-nowrap  ${activeTab === tab.id
                  ? "border-b-3 border-orange-500  font-bold text-orange-500"
                  : "text-[#718EBF] font-medium"
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="">
        {activeTab === "product-details" && <ProductDetails />}
        {activeTab === "variants-details" && <VariantsDetails />}
        {activeTab === "shipping-details" && <ShippingDetails />}
        {activeTab === "other-details" && <OtherDetails />}
      </div>
    </div>
  );
};



export default Tabs;
