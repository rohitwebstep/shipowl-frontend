'use client';
import { Bell, Menu } from 'lucide-react';
import user from '@/app/assets/user.png';
import Image from 'next/image';
import { IoIosArrowDown } from "react-icons/io";

const Header = () => {
  return (
    <nav className="fixed rounded-xl lg:relative top-0 left-0 w-full bg-white   p-4 flex items-center justify-between lg:shadow-none">
      {/* Sidebar Toggle Button - Only visible on mobile */}
      <button className="p-2 bg-black text-white rounded-full ">
        <Menu className="w-6 h-6" />
      </button>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button className="p-2 bg-gray-200 rounded-full">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <div className="flex gap-2 items-center">
            <Image src={user} alt="User" className="w-8 h-8 rounded-full" />
            <IoIosArrowDown className="text-gray-600" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
