'use client';

import { useContext, useState } from 'react';
import ProfileEdit from './ProfileEdit';
import BusinessInfo from './BusinessInfo';
import AccountInfo from './AccountInfo';
import { ProfileContext } from './ProfileContext';

export default function Profile() {
  const { validate, validateBusiness } = useContext(ProfileContext);

  const [activeMainTab, setActiveMainTab] = useState('create-supplier');
  const [activeSubTab, setActiveSubTab] = useState('profile-edit');

  const mainTabs = [
    { id: 'create-supplier', label: 'Create Supplier' },
    { id: 'add-bank-details', label: 'Add Bank Details' },
  ];

  const subTabs = [
    { id: 'profile-edit', label: 'Profile Info' },
    { id: 'business-info', label: 'Business Info' },
  ];

  const handleMainTabClick = async (tabId) => {

    setActiveMainTab(tabId);
  };

  const handleSubTabClick = async (tabId) => {
    if (activeSubTab === 'profile-edit') {
      const isValid = await validate();
      if (!isValid) return;
    }

    if (activeSubTab === 'business-info') {
      const isValid = await validateBusiness();
      if (!isValid) return;
    }

    setActiveSubTab(tabId);
  };

  return (
    <>
      <div className={`${activeMainTab == "create-supplier" ? "md:w-10/12" : ""}`}>
        {/* Top-level Tabs */}
        <div className="flex border-b bg-white pt-5 xl:gap-8 overflow-auto px-4 rounded-tl-2xl rounded-tr-2xl border-[#F4F5F7]">
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleMainTabClick(tab.id)}
              className={`px-4 py-2 text-lg whitespace-nowrap font-medium ${activeMainTab === tab.id
                ? 'border-b-3 border-orange-500 text-orange-500'
                : 'text-[#718EBF]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sub-tabs under "Create Supplier" */}
        {activeMainTab === 'create-supplier' && (
          <div className="flex border-b bg-white pt-4 xl:gap-6 overflow-auto px-4 border-[#EDEDED]">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSubTabClick(tab.id)}
                className={`px-3 py-1.5 text-base whitespace-nowrap font-medium ${activeSubTab === tab.id
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-[#718EBF]'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}

      </div>
      <div className="">
        {activeMainTab === 'create-supplier' && activeSubTab === 'profile-edit' && <ProfileEdit />}
        {activeMainTab === 'create-supplier' && activeSubTab === 'business-info' && <BusinessInfo />}
        {activeMainTab === 'add-bank-details' && <AccountInfo />}
      </div>
    </>
  );
}
