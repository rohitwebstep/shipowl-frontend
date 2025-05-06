"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import '@/app/globals.css';
import { ProfileProvider } from "./supplier/ProfileContext";
import { ProfileEditProvider } from "./supplier/update/ProfileEditContext";
import AdminMiddleWareProvider from "./middleware/AdminMiddleWareContext";
import { DropshipperProfileProvider } from "./dropshipper/DropshipperProfileContext";

function LayoutWrapperInner({ children }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === '/admin/auth/login/' ||
    pathname === '/admin/auth/password/forget/' ||
    pathname === '/admin/auth/password/reset/';

  return (
    <div className="main">
      <div className="container">
        <div className="lg:flex">
          {!isAuthPage && (
            <div className="xl:w-[18.5%] lg:w-[27%] w-full p-2 leftbar">
              <Sidebar />
            </div>
          )}
          <div className={`px-3 mt-20 lg:mt-0 main-outlet lg-px-0 ${isAuthPage ? "w-full" : "xl:w-[81.5%] lg:w-[73%]"}`}>
            {!isAuthPage && <Header />}
            <div className="xl:p-3 md:pt-4 md:px-0">
              <AdminMiddleWareProvider>
                <ProfileProvider>
                  <ProfileEditProvider>
                    <DropshipperProfileProvider>
                      {children}
                    </DropshipperProfileProvider>
                  </ProfileEditProvider>
                </ProfileProvider>
              </AdminMiddleWareProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LayoutWrapper({ children }) {
  return (
    <Suspense fallback={<div>Loading layout...</div>}>
      <LayoutWrapperInner>{children}</LayoutWrapperInner>
    </Suspense>
  );
}
