"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Menu,
    X,
    Home,
    ShoppingCart,
    Package,
    Gift,
    BarChart,
    CreditCard,
    FileText,
    Settings,
    Volume2,
    MapPin,
    User,
    Warehouse,
    ClipboardList,
    BadgeDollarSign,
    ShieldCheck,
    LayoutDashboard,
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
            title: "Supplier Dashboard",
            icon: LayoutDashboard,
            href: "/supplier",
            children: [
                {
                    name: "Supplier",
                    icon: ShoppingCart,
                    href: "#",
                    subMenu: [
                        { icon: ClipboardList, name: "Add Supplier", href: "/admin/supplier/create" },
                        { icon: ClipboardList, name: "Supplier List", href: "/admin/supplier/list" },
                    ],
                },
                { name: "Product", icon: Package, href: "/admin/supplier/products/list" },
                { name: "New Product Request", icon: ClipboardList, href: "/admin/supplier/products/new-products" },
                { name: "Orders", icon: ShoppingCart, href: "/admin/supplier/orders" },
                { name: "Warehouse", icon: Warehouse, href: "/admin/supplier/warehouse/list" },
                { name: "RTO Orders", icon: ClipboardList, href: "/admin/supplier/orders/rto-orders" },
                { name: "Profile", icon: User, href: "/profile" },
                { name: "Settings", icon: Settings, href: "/settings" },
                { name: "Billings", icon: BadgeDollarSign, href: "/billings" },
                { name: "Payment", icon: CreditCard, href: "/payment" },
                { name: "Terms & Condition", icon: ShieldCheck, href: "/terms" },
            ],
        },
        {
            title: "Dropshipping Dashboard",
            icon: LayoutDashboard,
            href: "/dropshipping",
            children: [
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
    ];

    return (
        <>
            <div className="fixed top-0 w-full left-0 z-50 p-2 bg-white rounded-lg lg:hidden shadow-md">
                <div className="flex justify-between items-center">
                    <Image src={logo} alt="ShipOwl Logo" className="max-w-[100px]" />
                    <button onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="w-8 h-8 text-[#2C3454]" />
                    </button>
                </div>
            </div>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-opacity-30 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <aside
                className={`fixed top-0 left-0 w-72 bg-white z-50 shadow-lg lg:w-full transition-transform duration-300 ease-in-out 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:translate-x-0 lg:relative lg:h-full`}
            >
                <div className="flex items-center justify-between p-5 border-b border-[#F4F7FE]">
                    <Image src={logo} alt="ShipOwl Logo" className="max-w-[150px]" />
                    <button className="lg:hidden p-1" onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-6 h-6 text-[#2C3454]" />
                    </button>
                </div>

                <nav className="p-3 h-full">
                    <ul className="space-y-4">
                        <li>
                            <Link href="/admin">
                                <button
                                    className={`font-medium flex gap-2 items-center w-full p-3 rounded-lg hover:bg-[#2C3454] hover:text-white 
                                    ${pathname === "/admin" ? "bg-[#2C3454] text-white" : "bg-[#F0F1F3] text-[#2C3454]"}`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <Home className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </button>
                            </Link>
                        </li>

                        {menuSections.map((section) => (
                            <div key={section.title}>
                                <Link href={section.href}>
                                    <button
                                        className={`font-semibold text-sm uppercase text-[#2C3454] w-full flex items-center gap-2 p-2 px-3 mb-1`}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <section.icon className="w-4 h-4" />
                                        {section.title}
                                    </button>
                                </Link>

                                <ul className="px-2 space-y-1">
                                    {section.children.map((item) => (
                                        <div key={item.name}>
                                             <Link href={item.href}>
                                            <button
                                                onClick={() => {
                                                    if (item.subMenu) {
                                                        toggleSubMenu(item.name);
                                                    } else {
                                                        setIsSidebarOpen(false);
                                                    }
                                                }}
                                                className={`flex justify-between items-center w-full p-2 rounded-md ${
                                                    pathname === item.href
                                                        ? "bg-[#2C3454] text-white"
                                                        : "bg-[#F0F1F3] text-[#2C3454]"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <item.icon className="w-4 h-4" />
                                                    <span>{item.name}</span>
                                                </div>
                                                {item.subMenu && (
                                                    <span>{openSubMenus[item.name] ? "−" : "+"}</span>
                                                )}
                                            </button>
                                            </Link>
                                            {item.subMenu && openSubMenus[item.name] && (
                                                <ul className="pl-6 mt-1 space-y-1">
                                                    {item.subMenu.map((subItem) => (
                                                        <li key={subItem.name}>
                                                            <Link href={subItem.href}>
                                                                <button
                                                                    className={`flex items-center gap-2 w-full p-2 rounded-md ${
                                                                        pathname === subItem.href
                                                                            ? "bg-[#2C3454] text-white"
                                                                            : "bg-[#F0F1F3] text-[#2C3454]"
                                                                    }`}
                                                                    onClick={() => setIsSidebarOpen(false)}
                                                                >
                                                                    <subItem.icon className="w-3.5 h-3.5" />
                                                                    <span>{subItem.name}</span>
                                                                </button>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
}
