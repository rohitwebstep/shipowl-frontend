"use client";

import { useContext ,useCallback,useEffect, useState} from "react";
import ProfileEdit from './ProfileEdit'
import BusinessInfo from './BusinessInfo';
import AccountInfo from './AccountInfo';
import { ProfileEditContext } from "./ProfileEditContext";
import { useRouter, useSearchParams } from 'next/navigation';

export default function Profile() {

  const {activeTab, setActiveTab ,setFormData} = useContext(ProfileEditContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading,setLoading] = useState(false);

  const id = searchParams.get("id");

  const fetchSupplier = useCallback(async () => {
    const adminData = JSON.parse(localStorage.getItem("shippingData"));

    if (adminData?.project?.active_panel !== "admin") {
      localStorage.removeItem("shippingData");
      router.push("/admin/auth/login");
      return;
    }

    const admintoken = adminData?.security?.token;

    if (!admintoken) {
      router.push("/admin/auth/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/supplier/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admintoken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: errorMessage.message || "Your session has expired. Please log in again.",
        });
        throw new Error(errorMessage.message);
      }

      const result = await response.json();
      const suppliers = result?.supplier || {};

      setFormData({
        name:suppliers.name || "",
        username: suppliers.username || "",
        email: "",
        password: "",
        dateOfBirth: "",
        currentAddress: "",
        permanentAddress: "",
        permanentCity: "",
        permanentPostalCode: "",
        permanentCountry: "",
        companyName: "",
        brandName: "",
        brandShortName: "",
        billingAddress: "",
        billingPincode: "",
        profilePicture:'',
        billingState: "",
        billingCity: "",
        businessType: "",
        clientEntryType: "",
        gstNumber: "",
        companyPanNumber: "",
        aadharNumber: "",
        gstDocument: "",         
        panCardHolderName: "",
        aadharCardHolderName: "",
        panCardImage: "",        
        aadharCardImage: "",   
        additionalDocumentUpload: "", 
        documentId: "",
        documentName: "",
        documentImage: "",  
        cancelledChequeImage_0:"",      
        bankAccounts: [
          {
          accountHolderName: "",
          accountNumber: "",
          bankName: "",
          bankBranch: "",
          accountType: "",
          ifscCode: "",
          }
        ],
      });
      
    } catch (error) {
      console.error("Error fetching supplier:", error);
    } finally {
      setLoading(false);
    }
  }, [router, id, setFormData]);

  useEffect(() => {
    if (id) fetchSupplier();
  }, [fetchSupplier, id]);
  const tabs = [
    { id: "profile-edit", label: "Personal Information" },
    { id: "business-info", label: "Business Information" },
    { id: "account-info", label: "Account Information" },
  ];



  return (
    <div className="">
      <div className={`flex border-b bg-white pt-5 xl:gap-8 overflow-auto px-4 rounded-tl-2xl rounded-tr-2xl  border-[#F4F5F7] ${activeTab == "profile-edit" ? "xl:w-10/12" : "w-full"}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-lg whitespace-nowrap font-medium ${activeTab === tab.id
              ? "border-b-3 border-orange-500 text-orange-500"
              : "text-[#718EBF]"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="">
        {activeTab === "profile-edit" && <ProfileEdit />}
        {activeTab === "business-info" && <BusinessInfo />}
        {activeTab === "account-info" && <AccountInfo />}
      </div>

    </div>
  )
}
