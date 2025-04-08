"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import '@/app/globals.css'
import { ProfileProvider } from "./supplier/ProfileContext";
import AdminMiddleWareProvider from "./middleware/AdminMiddleWareContext";
export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/admin/auth/login/';

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
                        <div className=" xl:p-3 md:pt-4 md:px-0">
                            <AdminMiddleWareProvider>
                                <ProfileProvider>
                                    {children}
                                </ProfileProvider>
                            </AdminMiddleWareProvider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
