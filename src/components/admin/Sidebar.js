"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Menu, X, Mail, Home, ShoppingCart, Package, Gift, BarChart, CreditCard,
  FileText, Settings, Volume2, MapPin, User, Warehouse, ClipboardList,
  BadgeDollarSign, ShieldCheck, LayoutDashboard, UserCheck, Users, Image as LucideImage, Banknote, Tags
} from "lucide-react";
import logo from "@/app/images/Shipowllogo.png";
import { useAdmin } from "./middleware/AdminMiddleWareContext";
export default function Sidebar() {
  const { openSubMenus, setOpenSubMenus } = useAdmin();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSubMenu = (name) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const menuSections = [
    { title: "Category Management", icon: Tags, href: "/admin/category/list" },
    { title: "Brand Management", icon: Tags, href: "/admin/brand/list" },
    { title: "Product Management", icon: Package, href: "/admin/products/list" },
    { title: "Dropshipper Banners", icon: LucideImage, href: "/admin/dropshipper/banner" },
    { title: "Email Settings", icon: Mail, href: "/admin/email-settings" },

    {
      children: [
        {
          name: "Permissions",
          icon: UserCheck,
          subMenu: [
            { icon: UserCheck, name: "Global Permission", href: "/admin/permission" },
            { icon: UserCheck, name: "Order Permission", href: "/admin/permission/order" },
          ],
        },
      ],
    },

    {
      children: [
        {
          name: "Supplier Dashboard",
          icon: LayoutDashboard,
          subMenu: [
            { icon: ClipboardList, name: "Supplier List", href: "/admin/supplier/list" },
            { icon: ClipboardList, name: "New Product Request", href: "/admin/products/new" },
            { icon: ShoppingCart, name: "Orders(In progress)", href: "/admin/supplier/orders" },
            { icon: Warehouse, name: "Warehouse", href: "/admin/supplier/warehouse/list" },
            { icon: ClipboardList, name: "RTO Management (in progress)", href: "/admin/supplier/orders/rto-orders" },
            { icon: BadgeDollarSign, name: "Billings(In progress)", href: "/admin/billing" },
            { icon: CreditCard, name: "Payment(In progress)", href: "/admin/payments" },
          ],
        },
      ],
    },

    {
      children: [
        {
          name: "Dropshipping Dashboard",
          icon: LayoutDashboard,
          subMenu: [
            { icon: Users, name: "Dropshippers List", href: "/admin/dropshipper/list" },
            { icon: ShoppingCart, name: "Manage Orders(In progress)", href: "/admin/dropshipper/manage-orders" },
            { icon: Package, name: "Manage Products(In progress)", href: "/admin/dropshipper/manage-products" },
            { icon: Gift, name: "Source a Product(In progress)", href: "/admin/dropshipper/product/source" },
            { icon: BarChart, name: "Reports(In progress)", href: "/report" },
            { icon: CreditCard, name: "Payments(In progress)", href: "#" },
            { icon: FileText, name: "Manage NDR(In progress)", href: "#" },
            { icon: MapPin, name: "High RTO Pincode(In progress)", href: "#" },
            { icon: Volume2, name: "Boosters(In progress)", href: "#" },
            { icon: Settings, name: "Integrations(In progress)", href: "#" },
          ],
        },
      ],
    },

    {
      children: [
        {
          name: "Shipping Dashboard",
          icon: LayoutDashboard,
          subMenu: [
            { icon: ClipboardList, name: "Courier Company", href: "/admin/courier/list" },
            { icon: ClipboardList, name: "Api Credentials (in progress)", href: "/admin/api/list" },
            { icon: ClipboardList, name: "Good Performing Page", href: "/admin/good-pincodes/list" },
            { icon: ClipboardList, name: "Bad Performing Page", href: "/admin/bad-pincodes/list" },
            { icon: Package, name: "High RTO", href: "/admin/high-rto/list" },
          ],
        },
      ],
    },

    { title: "Subuser Listing", icon: User, href: "/admin/sub-user/list" },
    { title: "Country Management", icon: Tags, href: "/admin/country/list" },
    { title: "State Management", icon: ShieldCheck, href: "/admin/state/list" },
    { title: "City Management", icon: ShieldCheck, href: "/admin/city/list" },
    { title: "Settings(In progress)", icon: Settings, href: "/admin/setting" },
    { title: "Profile(In progress)", icon: User, href: "/admin/profile" },
    { title: "Bank Details Update Requests", icon: Banknote, href: "/admin/bankaccount-update-requests" },
    { title: "Terms & Condition(In progress)", icon: ShieldCheck, href: "/admin/terms" },
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
        className={`fixed top-0 left-0 w-72 md:w-full sidebar bg-white z-50 shadow-lg xl:h-screen lg:h-full rounded-lg transition-transform duration-300 ease-in-out 
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
        <nav className="p-3 h-[80%] overflow-auto">
          <ul className="space-y-4">
            {/* Dashboard */}
            <li>
              <Link href="/admin">
                <button
                  className={`font-medium flex gap-2 border-l-4 items-center hover:border-orange-500 w-full p-2 rounded-lg hover:bg-[#2C3454] hover:text-white
                    ${pathname === "/admin" || pathname === "/admin/" ? "bg-[#131a44de] border-orange-500 text-white" : "bg-[#F0F1F3] border-[#131a44dec9] text-[#2C3454]"}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </button>
              </Link>
            </li>

            {/* Sidebar Sections */}
            {menuSections.map((section, index) => (
              <li key={section.title ?? `section-${index}`} className="mb-2">
                {section.title && (
                  <Link href={section.href}>
                    <div
                      className={`font-medium flex gap-2 border-l-4 items-center w-full p-2 hover:border-orange-500 rounded-lg hover:bg-[#2C3454] hover:text-white
                        ${pathname === section.href.concat('/') ? "bg-[#131a44de] border-orange-500 text-white" : "bg-[#F0F1F3] border-[#131a44dec9] text-[#2C3454]"}`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <section.icon className="w-4 h-4" />
                      <span className="font-medium">{section.title}</span>
                    </div>
                  </Link>
                )}

                {/* Nested children (dashboard with submenus) */}
                {section.children?.map((item) => (
                  <div key={item.name} className="my-2">
                    <button
                      className={`font-medium flex justify-between hover:border-orange-500 items-center gap-2 border-l-4 w-full p-2 rounded-lg hover:bg-[#2C3454] hover:text-white
                        ${pathname.includes(item.name.toLowerCase()) || openSubMenus[item.name] ? "bg-[#131a44de] border-orange-500 text-white" : "bg-[#F0F1F3] border-[#131a44dec9] text-[#2C3454]"}`}
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
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {item.subMenu && (
                        <span className="font-medium transform transition-transform duration-300">
                          {openSubMenus[item.name] ? "−" : "+"}
                        </span>
                      )}
                    </button>

                    {/* Submenu */}
                    {item.subMenu && (
                      <ul
                        className={`px-4 mt-1 space-y-2 overflow-hidden transform transition-all duration-500 ease-in-out
                          ${openSubMenus[item.name] ? "max-h-[1000px] translate-x-0" : "max-h-0 translate-x-[-10px] opacity-0"}`}
                      >
                        {item.subMenu.map((subItem) => (
                          <li key={subItem.name}>
                            <Link href={subItem.href}>
                              <div
                                className={`font-medium hover:border-orange-500 flex gap-2 border-l-4 items-center w-full p-2 rounded-lg hover:bg-[#2C3454] hover:text-white
                                  ${pathname === subItem.href.concat('/') ? "bg-[#131a44de] border-orange-500 text-white" : "bg-[#F0F1F3] border-[#131a44dec9] text-[#2C3454]"}`}
                                onClick={() => setIsSidebarOpen(false)}
                              >
                                <subItem.icon className="w-4 h-4" />
                                <span className="font-medium">{subItem.name}</span>
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
