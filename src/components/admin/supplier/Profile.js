'use client';

import { useContext } from 'react';
import ProfileEdit from './ProfileEdit';
import BusinessInfo from './BusinessInfo';
import AccountInfo from './AccountInfo';
import { ProfileContext } from './ProfileContext';

export default function Profile() {
  const { activeTab, validate, validateBusiness, setActiveTab } = useContext(ProfileContext);

  const handleTabClick = async (tabId) => {
    if (activeTab === 'profile-edit') {
      const isValid = await validate();
      if (!isValid) return;
    }

    if (activeTab === 'business-info') {
      const isValid = await validateBusiness();
      if (!isValid) return;
    }

    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'profile-edit', label: 'Personal Information' },
    { id: 'business-info', label: 'Business Information' },
    { id: 'account-info', label: 'Account Information' },
  ];

  return (
    <div>
      <div
        className={`flex border-b bg-white pt-5 xl:gap-8 overflow-auto px-4 rounded-tl-2xl rounded-tr-2xl border-[#F4F5F7] ${
          activeTab === 'profile-edit' ? 'xl:w-10/12' : 'w-full'
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-2 text-lg whitespace-nowrap font-medium ${
              activeTab === tab.id
                ? 'border-b-3 border-orange-500 text-orange-500'
                : 'text-[#718EBF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'profile-edit' && <ProfileEdit />}
        {activeTab === 'business-info' && <BusinessInfo />}
        {activeTab === 'account-info' && <AccountInfo />}
      </div>
    </div>
  );
}
