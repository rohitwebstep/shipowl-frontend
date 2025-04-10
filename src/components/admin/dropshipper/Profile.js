"use client";

import { useState } from "react";
import AccountDeatils from './AccountDeatils'
import AddressDetails from './AddressDetails';
import Payment from './Payment';

export default function Profile() {

  const [activeTab, setActiveTab] = useState("account_details");

  const tabs = [
    { id: "account_details", label: "Account Details" },
    { id: "address_details", label: "Address Details" },
    { id: "payment_billing", label: "Payment & Billing" },
  ];
  return (
    <div className="">
      <div className={`flex border-b bg-white pt-5 xl:gap-8 overflow-auto px-4 rounded-tl-2xl rounded-tr-2xl  border-[#F4F5F7] ${activeTab== "account_details" ? "xl:w-10/12" :"w-full"}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-lg whitespace-nowrap font-medium ${activeTab === tab.id
                ? "border-b-3 border-orange-500 text-orange-500"
                : "text-[#718EBF]"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="">
        {activeTab === "account_details" && <AccountDeatils />}
        {activeTab === "address_details" && <AddressDetails />}
        {activeTab === "payment_billing" && <Payment />}
      </div>

    </div>
  )
}
