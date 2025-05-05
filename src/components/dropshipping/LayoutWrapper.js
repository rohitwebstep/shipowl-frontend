"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DropshipperMiddleWareProvider from "./middleware/DropshipperMiddleWareContext";
import { DropshipperProfileProvider } from "./dropshipper/update/DropshipperProfileContext";
import { ProfileProvider } from "../admin/supplier/ProfileContext";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/dropshipping/auth/login/' || pathname === '/dropshipping/auth/password/forget/' || pathname === '/dropshipping/auth/password/reset/';

    return (
        <div className="main">
            <div className="container">
                <div className="lg:flex ">
                    {!isAuthPage && (
                        <div className="xl:w-[18.5%] lg:w-[23%] w-full p-2 leftbar">
                            <Sidebar />
                        </div>
                    )}
                    <div className={`px-3 mt-20 lg:mt-0 main-outlet lg-px-0 ${isAuthPage ? "w-full" : "xl:w-[81.5%] lg:w-[77%]"}`}>
                        {!isAuthPage && <Header />}
                        <div className="md:p-7 xl:p-3 md:pt-0">
                            <ProfileProvider>
                                <DropshipperProfileProvider>
                            <DropshipperMiddleWareProvider>{children}</DropshipperMiddleWareProvider>
                            </DropshipperProfileProvider>
                            </ProfileProvider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
