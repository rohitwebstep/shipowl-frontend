"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ProfileProvider } from "./userprofile/ProfileContext";
import SupplierMiddleWareProvider from "./middleware/SupplierMiddleWareContext";
import { CategoryProvider } from "./category/CategoryContext";
import { ApiProvider } from "../ApiContext";
import { BrandProvider } from "./brand/BrandContext";
import { ProductProviderEdit } from "./products/ProductContextEdit";

function LayoutWrapperInner({ children }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.includes('/admin') ||
    pathname.includes('/dropshipping') ||
    pathname.includes('/supplier/auth/login') ||
    pathname.includes('/supplier/auth/password/forget/') ||
    pathname.includes('/supplier/auth/password/reset/') ||
    pathname.includes('/supplier/auth/register/verify/') ||
    pathname.includes('/supplier/auth/register/') ||
    pathname === "/";

  return (
    <div className="main">
      <div className="container">
        <div className="lg:flex ">
          {!isAuthPage && (
            <div className="xl:w-[18.5%] lg:w-[23%] w-full p-2 leftbar">
              <Sidebar />
            </div>
          )}
          <SupplierMiddleWareProvider>

            <div className={`px-3 mt-20 lg:mt-0 main-outlet lg-px-0 ${isAuthPage ? "w-full" : "xl:w-[81.5%] lg:w-[77%]"}`}>
              {!isAuthPage && <Header />}
              <div className="xl:p-3 md:pt-4 md:px-0">
                  <ProductProviderEdit>
                    <ApiProvider>
                      <CategoryProvider>
                        <BrandProvider>
                          <ProfileProvider>{children}</ProfileProvider>
                        </BrandProvider>
                      </CategoryProvider>
                    </ApiProvider>
                  </ProductProviderEdit>
              </div>
            </div>
          </SupplierMiddleWareProvider>

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
