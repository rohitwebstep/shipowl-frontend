"use client";

import { useContext ,useCallback,useEffect, useState} from "react";
import ProfileEdit from './ProfileEdit'
import BusinessInfo from './BusinessInfo';
import AccountInfo from './AccountInfo';
import { ProfileEditContext } from "./ProfileEditContext";
import { useRouter, useSearchParams } from 'next/navigation';

export default function Profile() {

  const {activeTab,formData, setActiveTab ,cancelledChequeImages,setCancelledChequeImages,setFormData,setCityData,setStateData} = useContext(ProfileEditContext);
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

      const companyDetail = suppliers?.companyDetail || {};
      const bankAccounts = suppliers?.bankAccounts || [];
      if(result){
        fetchCity(suppliers.permanentStateId);
        fetchState(suppliers.permanentCountryId);
      }

      console.log(`bankAccounts - `, bankAccounts);
      // --------- Prepare cancelledChequeImage array using while loop ----------
      const cancelledChequeImages = [];
      let missingCount = 0;
      let i = 0;

      while (missingCount < 10) {
        const field = `cancelledChequeImage${i}`;
        
        if (bankAccounts[field]) {
          cancelledChequeImages.push(bankAccounts[field]);
          missingCount = 0; // reset if found
        } else {
          missingCount++; // if not found
        }

        i++;
      }

      console.log(`cancelledChequeImages - `, cancelledChequeImages);
      setCancelledChequeImages(cancelledChequeImages)

      setFormData({
        name: suppliers.name || "",
        username: suppliers.username || "",
        email: suppliers.email || "",
        password: "", // keep password empty for security
        dateOfBirth: suppliers.dateOfBirth || "",
        currentAddress: suppliers.currentAddress || "",
        permanentAddress: suppliers.permanentAddress || "",
        permanentCity: suppliers.permanentCityId || "",
        permanentState: suppliers.permanentStateId || "",
        permanentPostalCode: suppliers.permanentPostalCode || "",
        permanentCountry: suppliers.permanentCountryId || "",
        profilePicture: suppliers.profilePicture || "",
      
        companyName: companyDetail.companyName || "",
        brandName: companyDetail.brandName || "",
        brandShortName: companyDetail.brandShortName || "",
        billingAddress: companyDetail.billingAddress || "",
        billingPincode: companyDetail.billingPincode || "",
        billingState: companyDetail.billingState || "",
        billingCity: companyDetail.billingCity || "",
        businessType: companyDetail.businessType || "",
        clientEntryType: companyDetail.clientEntryType || "",
        gstNumber: companyDetail.gstNumber || "",
        companyPanNumber: companyDetail.companyPanNumber || "",
        aadharNumber: companyDetail.aadharNumber || "",
        gstDocument: companyDetail.gstDocument || "",
        panCardHolderName: companyDetail.panCardHolderName || "",
        aadharCardHolderName: companyDetail.aadharCardHolderName || "",
        panCardImage: companyDetail.panCardImage || "",
        aadharCardImage: companyDetail.aadharCardImage || "",
        additionalDocumentUpload: companyDetail.additionalDocumentUpload || "",
        documentId: companyDetail.documentId || "",
        documentName: companyDetail.documentName || "",
        documentImage: companyDetail.documentImage || "",
      
        // For bank accounts (only the first one, or you can map multiple later)
        cancelledChequeImage_0: bankAccounts[0]?.cancelledChequeImage || "",
      
        bankAccounts: bankAccounts.length > 0 
          ? bankAccounts.map((account) => ({
              accountHolderName: account.accountHolderName || "",
              accountNumber: account.accountNumber || "",
              bankName: account.bankName || "",
              bankBranch: account.bankBranch || "",
              accountType: account.accountType || "",
              ifscCode: account.ifscCode || "",
            }))
          : [
              {
                accountHolderName: "",
                accountNumber: "",
                bankName: "",
                bankBranch: "",
                accountType: "",
                ifscCode: "",
              },
            ],
      });
      
      
    } catch (error) {
      console.error("Error fetching supplier:", error);
    } finally {
      setLoading(false);
    }
  }, [router, id, setFormData]);

    const fetchCity = useCallback(async (id) => {
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
              const response = await fetch(`http://localhost:3001/api/location/state/${formData?.permanentState||id}/cities`, {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${admintoken}`,
                  },
              });
  
              const result = await response.json();
  
              if (!response.ok) {
                  Swal.fire({
                      icon: "error",
                      title: "Something Wrong!",
                      text: result.message || result.error || "Your session has expired. Please log in again.",
                  });
                  throw new Error(result.message || result.error || "Something Wrong!");
              }
  
              setCityData(result?.cities || []);
          } catch (error) {
              console.error("Error fetching cities:", error);
          } finally {
              setLoading(false);
          }
      }, [router]);
      const fetchState = useCallback(async (id) => {
        console.log('id',id)
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
            const response = await fetch(
              `http://localhost:3001/api/location/country/${ formData?.permanentCountry|| id}/states`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${admintoken}`,
                },
              }
            );
        
            const result = await response.json();
        
            if (!response.ok) {
              Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                text: result.message || result.error || "Your session has expired. Please log in again.",
              });
              throw new Error(result.message || result.error || "Something Wrong!");
            }
        
            setStateData(result?.states || []);
          } catch (error) {
            console.error("Error fetching states:", error); // <- corrected message: "states" instead of "cities"
          } finally {
            setLoading(false);
          }
        }, [router]);

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
