"use client";

import { useContext ,useCallback,useEffect, useState} from "react";
import ProfileEdit from './ProfileEdit'
import BusinessInfo from './BusinessInfo';
import AccountInfo from './AccountInfo';
import { ProfileContext } from "./ProfileContext";
import { useRouter } from 'next/navigation';
import { HashLoader } from 'react-spinners';
export default function Profile() {

  const {activeTab,validateBusiness,validate,formData, setActiveTab,setFormData,setCityData,setStateData} = useContext(ProfileContext);
  const router = useRouter();
  const [loading,setLoading] = useState(false);
  const handleTabClick = async (tabId) => {
    if (activeTab === 'profile-edit') {
      const isValid = await validate();
      if (!isValid) return;
    }

    if (activeTab === 'business-info') {
      const isValid = await validateBusiness();
      if (!isValid) return;
    }

    setActiveTab(tabId);
  };


  const fetchSupplier = useCallback(async () => {
    const supplierData = JSON.parse(localStorage.getItem("shippingData"));

    if (supplierData?.project?.active_panel !== "supplier") {
      localStorage.removeItem("shippingData");
      router.push("/supplier/auth/login");
      return;
    }

    const suppliertoken = supplierData?.security?.token;

    if (!suppliertoken) {
      router.push("/supplier/auth/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/supplier/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${suppliertoken}`,
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
      if(suppliers.permanentCountryId){
        fetchState(suppliers.permanentCountryId);
      }
      if(suppliers.permanentStateId){
        fetchCity(suppliers.permanentStateId);
      }

      setFormData({
        name: suppliers.name || "",
        id: suppliers.id || "",
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
        billingCountry: companyDetail.billingCountry || "",
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
        companyid: companyDetail.id || "",
      
        bankAccounts: bankAccounts.length > 0 
          ? bankAccounts.map((account) => ({
              accountHolderName: account.accountHolderName || "",
              id: account.id || "",
              accountNumber: account.accountNumber || "",
              bankName: account.bankName || "",
              bankBranch: account.bankBranch || "",
              accountType: account.accountType || "",
              ifscCode: account.ifscCode || "",
              cancelledChequeImages: account.cancelledChequeImage || "",
            }))
          : [
              {
                accountHolderName: "",
                accountNumber: "",
                bankName: "",
                bankBranch: "",
                accountType: "",
                ifscCode: "",
                cancelledChequeImage: ""
              },
            ],
      });
      
      
    } catch (error) {
      console.error("Error fetching supplier:", error);
    } finally {
      setLoading(false);
    }
  }, [router, setFormData]);

    const fetchCity = useCallback(async (id) => {
          const supplierData = JSON.parse(localStorage.getItem("shippingData"));
          if (supplierData?.project?.active_panel !== "supplier") {
              localStorage.removeItem("shippingData");
              router.push("/supplier/auth/login");
              return;
          }
  
          const suppliertoken = supplierData?.security?.token;
          if (!suppliertoken) {
              router.push("/supplier/auth/login");
              return;
          }
  
          try {
              setLoading(true);
              const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/location/state/${formData?.permanentState||id}/cities`, {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${suppliertoken}`,
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
          const supplierData = JSON.parse(localStorage.getItem("shippingData"));
          
          if (supplierData?.project?.active_panel !== "supplier") {
            localStorage.removeItem("shippingData");
            router.push("/supplier/auth/login");
            return;
          }
        
          const suppliertoken = supplierData?.security?.token;
          if (!suppliertoken) {
            router.push("/supplier/auth/login");
            return;
          }
        
          try {
            setLoading(true);
            const response = await fetch(
              `https://sleeping-owl-we0m.onrender.com/api/location/country/${ formData?.permanentCountry|| id}/states`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${suppliertoken}`,
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
     fetchSupplier();
  }, [fetchSupplier]);
    if (loading) {
      return (
          <div className="flex items-center justify-center h-[80vh]">
              <HashLoader size={60} color="#F97316" loading={true} />
          </div>
      );
  }
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
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-2 text-lg whitespace-nowrap font-medium ${
              activeTab === tab.id
                ? 'border-b-3 border-orange-500 text-orange-500'
                : 'text-[#718EBF]'
            }`}
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
