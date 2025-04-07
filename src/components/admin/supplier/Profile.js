"use client";

import { useState } from "react";
import ProfileEdit from './ProfileEdit'
import BusinessInfo from './BusinessInfo';
import AccountInfo from './AccountInfo';

export default function Profile() {

  const [activeTab, setActiveTab] = useState("profile-edit");

  const tabs = [
    { id: "profile-edit", label: "Edit Profile" },
    { id: "business-info", label: "Business Information" },
    { id: "account-info", label: "Account Information" },
  ];
  return (
    <div className="">
      <div className={`flex border-b bg-white pt-5 xl:gap-8 overflow-auto px-4 rounded-tl-2xl rounded-tr-2xl  border-[#F4F5F7] ${activeTab== "profile-edit" ? "xl:w-10/12" :"w-full"}`}>
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
        {activeTab === "profile-edit" && <ProfileEdit />}
        {activeTab === "business-info" && <BusinessInfo />}
        {activeTab === "account-info" && <AccountInfo />}
      </div>

    </div>
  )
}
