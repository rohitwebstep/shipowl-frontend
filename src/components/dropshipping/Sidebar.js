"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Package,
  Gift,
  BarChart,
  CreditCard,
  FileText,
  Settings,
  Link,
  Volume2,
  MapPin,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import Image from "next/image";
import Logo from "@/app/assets/Shipowl-logo1.png";

const menuItems = [
  { name: "Home", icon: Home, href: "/dropshipping", section: "MENU" },
  {
    name: "Manage Orders",
    icon: ShoppingCart,
    href: "#",
    section: "MENU",
    subMenu: [
      { name: "All Orders", href: "/dropshipping/manage-orders" },
      { name: "Pending Orders", href: "/dropshipping/pending-orders" }
    ]
  },
  { name: "Manage Products", icon: Package, href: "/dropshipping/manage-products", section: "MENU" },
  { name: "Source a Product", icon: Gift, href: "/dropshipping/source-a-product", section: "MENU" },
  { name: "Reports", icon: BarChart, href: "/dropshipping/report", section: "MENU" },
  { name: "Payments", icon: CreditCard, href: "/dropshipping/payments", section: "MENU" },
  { name: "Manage NDR", icon: FileText, href: "/dropshipping/manage-ndr", section: "MENU" },
  { name: "High RTO Pincode", icon: MapPin, href: "/dropshipping/high-rto-pincode", section: "OTHERS" },
  { name: "Boosters", icon: Volume2, href: "/dropshipping/boosters", section: "OTHERS" },
  { name: "Integrations", icon: Link, href: "/dropshipping/integrations", section: "OTHERS" },
  { name: "Settings", icon: Settings, href: "/dropshipping/settings", section: "OTHERS" },
  { name: "Terms & Conditions", icon: FileText, href: "/dropshipping/terms", section: "OTHERS" }
];

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isSidebarOpen && !event.target.closest("aside")) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isSidebarOpen]);

  const toggleSubMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      <button
        className="fixed top-4 left-5 z-50 p-2 lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-10 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 w-72 h-screen bg-white z-50 rounded-xl lg:w-full shadow-lg p-4 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:relative w-64 lg:h-full`}
      >
        <div className="flex items-center justify-between lg:justify-center py-4 border-b border-[#6670856e]">
          <Image src={Logo} alt="Shipowl Logo" className="md:max-w-[130px] max-w-[100px]" />
          <button className="lg:hidden p-1" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6 text-[#2C3454]" />
          </button>
        </div>

        <nav className="mt-4">
          {["MENU", "OTHERS"].map((section) => (
            <div key={section}>
              <p className="text-[#8A99AF] text-sm mb-2 mt-4">{section}</p>
              <ul className="space-y-2">
                {menuItems
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <li key={item.name}>
                      {item.subMenu ? (
                        <button
                          onClick={() => toggleSubMenu(item.name)}
                          className={`font-lato font-medium w-full flex items-center justify-between p-3 border-l-4 rounded-md hover:bg-[#2C3454] hover:border-[#F98F5C] hover:text-white 
                          ${pathname === item.href || openMenus[item.name] ? "bg-[#2C3454] text-white border-[#F98F5C]" : "bg-[#F0F1F3] border-[#667085]"}`}
                        >
                          <span className="flex items-center">
                            <item.icon className="w-5 h-5 mr-2" /> {item.name}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              openMenus[item.name] ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      ) : (
                        <a
                          href={item.href}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`font-lato font-medium flex items-center text-[#2C3454] p-3 rounded-md hover:bg-[#2C3454] hover:text-white hover:border-[#F98F5C] border-l-4 
                          ${pathname === item.href ? "bg-[#2C3454] text-white border-[#F98F5C]" : "bg-[#F0F1F3] border-[#667085]"}`}
                        >
                          <item.icon className="w-5 h-5 mr-2" /> {item.name}
                        </a>
                      )}
                      {item.subMenu && openMenus[item.name] && (
                        <ul className="ml-6 mt-1 space-y-1 text-sm text-gray-700">
                          {item.subMenu.map((subItem) => (
                            <li key={subItem.name}>
                              <a
                                href={subItem.href}
                                className={`block p-3 text-[#2C3454] hover:bg-[#2C3454] hover:text-white rounded-md 
                                ${pathname === subItem.href ? "bg-[#2C3454] text-white font-semibold" : ""}`}
                                onClick={() => setIsSidebarOpen(false)}
                              >
                                {subItem.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
