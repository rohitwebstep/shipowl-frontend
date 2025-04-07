"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ProfileProvider } from "./userprofile/ProfileContext";
import SupplierMiddleWareProvider from "./middleware/SupplierMiddleWareContext";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes('/admin') || pathname.includes('/dropshipping') || pathname.includes('/supplier/auth/login') || pathname== "/";

  return (
    <div className="main">
      <div className="container">
        <div className="lg:flex ">
          {!isAuthPage && (
            <div className="xl:w-2/12  lg:w-3/12 w-full p-2">
              <Sidebar />
            </div>
          )}
          <div className={`px-3 lg-px-0 ${isAuthPage ? "w-full" : "xl:w-10/12 lg:w-9/12"}`}>
            {!isAuthPage && <Header />}
            <div className="md:p-7 xl:p-3 md:pt-0">
              <SupplierMiddleWareProvider>
                <ProfileProvider>{children}</ProfileProvider>
              </SupplierMiddleWareProvider>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
