"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import logo from "@/app/images/Shipowllogo.png";
import home from "@/app/images/home.svg";
import cart from "@/app/images/cart.svg";
import cart1 from "@/app/images/cart1.svg";
import order from "@/app/images/order.svg";
import billings from "@/app/images/billings.svg";
import user from "@/app/images/user.svg";
import settings from "@/app/images/settings.svg";
import warehouse from "@/app/images/warehouse.svg";
import payment from "@/app/images/payment.svg";
import term from "@/app/images/term.svg";

export default function Sidebar() {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { name: "Dashboard", icon: home, href: "/supplier" },
        { name: "Product", icon: cart, href: "/supplier/product" },
        { name: "New Product Request", icon: cart1, href: "/supplier/new-product-request" },
        { name: "Orders", icon: order, href: "/supplier/orders" },
        { name: "Warehouse", icon: warehouse, href: "/supplier/warehouse" },
        { name: "RTO Orders", icon: warehouse, href: "/supplier/rto-orders" },
        { name: "Profile", icon: user, href: "/supplier/profile" },
        { name: "Settings", icon: settings, href: "/supplier/settings" },
        { name: "Billings", icon: billings, href: "/supplier/billings" },
        { name: "Payment", icon: payment, href: "/supplier/payment" },
        { name: "Terms & Condition", icon: term, href: "/supplier/terms" },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <div 
                className="fixed top-0 w-full left-0 z-50 p-2 bg-white rounded-lg lg:hidden shadow-md" 
              
            >
              <div className="flex justify-between">
              <Image src={logo} alt="ShipOwl Logo" className="max-w-[100px]" />
               <button className="" onClick={() => setIsSidebarOpen(true)}>
               <Menu className="w-8 h-8 text-[#2C3454]" />
               </button>
              </div>

            </div>
            
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0  bg-opacity-30 z-40 lg:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Panel */}
            <aside 
                className={`fixed top-0 left-0 w-72 sidebar rounded-md  bg-white z-50 shadow-lg lg:w-full   transition-transform duration-300 ease-in-out 
                ${isSidebarOpen ? "translate-x-0 lg:h-full" : "-translate-x-full lg:h-full"} lg:translate-x-0 lg:relative lg:h-full`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between lg:justify-center p-5 border-b border-[#F4F7FE]">
                    <Image src={logo} alt="ShipOwl Logo" className="max-w-[150px]" />
                    <button 
                        className="lg:hidden p-1" 
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="w-6 h-6 text-[#2C3454]" />
                    </button>
                </div>

                {/* Sidebar Menu */}
                <nav className="p-3 h-full">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.name} className="my-2 w-full">
                                    <Link href={item.href} className="w-full">
                                        <button
                                            className={`font-medium flex gap-2 items-center w-full p-3 rounded-lg hover:bg-[#2C3454] hover:text-white hover:border-[#F98F5C] border-l-4 
                                            ${isActive ? "bg-[#2C3454] text-white border-[#F98F5C]" : "bg-[#F0F1F3] border-[#667085]"}`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <Image src={item.icon} className="w-5 brightness-75" alt={item.name} />
                                            <span>{item.name}</span>
                                        </button>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    );
}