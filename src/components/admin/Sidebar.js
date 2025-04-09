"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Menu, X, Home, ShoppingCart, Package, Gift, BarChart, CreditCard,
  FileText, Settings, Volume2, MapPin, User, Warehouse, ClipboardList,
  BadgeDollarSign, ShieldCheck, LayoutDashboard,
} from "lucide-react";
import logo from "@/app/images/Shipowllogo.png";

export default function Sidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});

  const toggleSubMenu = (name) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const menuSections = [
    {
      children: [
        {
          name: "Supplier Dashboard",
          icon: ShoppingCart,
          subMenu: [
            { icon: ClipboardList, name: "Add Supplier", href: "/admin/supplier/create" },
            { icon: ClipboardList, name: "Supplier List", href: "/admin/supplier/list" },
            { name: "Product", icon: Package, href: "/admin/supplier/products/list" },
            { name: "New Product Request", icon: ClipboardList, href: "/admin/supplier/products/new-products" },
            { name: "Orders", icon: ShoppingCart, href: "/admin/supplier/orders" },
            { name: "Warehouse", icon: Warehouse, href: "/admin/supplier/warehouse/list" },
            { name: "RTO Orders", icon: ClipboardList, href: "/admin/supplier/orders/rto-orders" },
            { name: "Billings", icon: BadgeDollarSign, href: "/admin/billing" },
            { name: "Payment", icon: CreditCard, href: "/admin/payments" },
            { name: "Terms & Condition", icon: ShieldCheck, href: "/terms" },
          ],
        },
      ],
    },
    {
      children: [
        {
          name: "Dropshipping Dashboard",
          icon: ShoppingCart,
          subMenu: [
            { name: "Dropshippers Details", icon: ShoppingCart, href: "/admin/dropshipper/list" },
            { name: "Create Dropshippers", icon: ShoppingCart, href: "/admin/dropshipper/create" },
            { name: "Manage Orders", icon: ShoppingCart, href: "/admin/dropshipper/manage-orders" },
            { name: "Manage Products", icon: Package, href: "/admin/dropshipper/manage-products" },
            { name: "Source a Product", icon: Gift, href: "/admin/dropshipper/source-a-product" },
            { name: "Reports", icon: BarChart, href: "/report" },
            { name: "Payments", icon: CreditCard, href: "#" },
            { name: "Manage NDR", icon: FileText, href: "#" },
            { name: "High RTO Pincode", icon: MapPin, href: "#" },
            { name: "Boosters", icon: Volume2, href: "#" },
            { name: "Integrations", icon: Settings, href: "#" },
            { name: "Terms & Conditions", icon: FileText, href: "#" },
          ],
        },
      ],
    },
    { title: "Shipping Dashboard", icon: LayoutDashboard, href: "/dropshipping" },
    { title: "Country Management", icon: LayoutDashboard, href: "/dropshipping" },
    { title: "Profile", icon: User, href: "/admin/profile" },
    { title: "Settings", icon: Settings, href: "/admin/setting" },
  ];

  return (
    <>
      {/* Mobile header */}
      <div className="fixed top-0 w-full left-0 z-50 p-2 lg:p-0 bg-white rounded-lg lg:hidden shadow-md">
        <div className="flex justify-between items-center">
          <Image src={logo} alt="ShipOwl Logo" className="max-w-[100px]" />
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-8 h-8 text-[#2C3454]" />
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-72 md:w-full sidebar bg-white z-50 shadow-lg rounded-lg transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0 h-[500px] overflow-auto" : "-translate-x-full"} 
          lg:translate-x-0 lg:relative lg:h-full`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-5 lg:justify-center border-b border-[#F4F7FE]">
          <Image src={logo} alt="ShipOwl Logo" className="max-w-[150px]" />
          <button className="lg:hidden p-1" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6 text-[#2C3454]" />
          </button>
        </div>

        {/* Sidebar nav */}
        <nav className="p-3 h-full">
          <ul className="space-y-4">
            {/* Dashboard */}
            <li>
              <Link href="/admin">
                <button
                  className={`font-medium flex gap-2 border-l-4 items-center w-full p-2 rounded-lg hover:bg-[#2C3454] hover:text-white
                    ${pathname === "/admin" || pathname === "/admin/" ? "bg-[#131a44] border-orange-500 text-white" : "bg-[#F0F1F3] border-[#131a44c9] text-[#2C3454]"}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium text-lg">Dashboard</span>
                </button>
              </Link>
            </li>

            {/* Sidebar Sections */}
            {menuSections.map((section, index) => (
              <li key={section.title ?? `section-${index}`} className="mb-2">
                {section.title && (
                  <Link href={section.href}>
                    <div
                      className={`font-medium flex gap-2 border-l-4 items-center w-full p-2 rounded-lg hover:bg-[#2C3454] hover:text-white
                        ${pathname === section.href ? "bg-[#131a44] border-orange-500 text-white" : "bg-[#F0F1F3] border-[#131a44c9] text-[#2C3454]"}`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <section.icon className="w-4 h-4" />
                      <span className="font-medium text-lg">{section.title}</span>
                    </div>
                  </Link>
                )}

                {/* Nested children (dashboard with submenus) */}
                {section.children?.map((item) => (
                  <div key={item.name} className="my-2">
                    <button
                      className={`font-medium flex justify-between items-center gap-2 border-l-4 w-full p-2 rounded-lg hover:bg-[#2C3454] hover:text-white
                        ${pathname.includes(item.name.toLowerCase()) || openSubMenus[item.name] ? "bg-[#131a44] border-orange-500 text-white" : "bg-[#F0F1F3] border-[#131a44c9] text-[#2C3454]"}`}
                      onClick={() => {
                        if (item.subMenu) {
                          toggleSubMenu(item.name);
                        } else {
                          setIsSidebarOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium text-lg">{item.name}</span>
                      </div>
                      {item.subMenu && (
                        <span className="font-medium text-lg">
                          {openSubMenus[item.name] ? "−" : "+"}
                        </span>
                      )}
                    </button>

                    {/* Submenus */}
                    {item.subMenu && openSubMenus[item.name] && (
                      <ul className="px-4 mt-1 space-y-2">
                        {item.subMenu.map((subItem) => (
                          <li key={subItem.name}>
                            <Link href={subItem.href}>
                              <div
                                className={`font-medium flex gap-2 border-l-4 items-center w-full p-2 rounded-lg hover:bg-[#2C3454] hover:text-white
                                  ${pathname === subItem.href.concat('/') ? "bg-[#131a44] border-orange-500 text-white" : "bg-[#F0F1F3] border-[#131a44c9] text-[#2C3454]"}`}
                                onClick={() => setIsSidebarOpen(false)}
                              >
                                <subItem.icon className="w-4 h-4" />
                                <span className="font-medium text-lg">{subItem.name}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
