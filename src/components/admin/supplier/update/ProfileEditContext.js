'use client';

import { useState, createContext ,useCallback} from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
const ProfileEditContext = createContext();

const ProfileEditProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [countryData, setCountryData] = useState([]);
    const [activeTab, setActiveTab] = useState("profile-edit");
    const router = useRouter();
    const [formData, setFormData] = useState({
      name: "",
      username: "",
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

    const fetchCountry = useCallback(async () => {
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
            const response = await fetch(`http://localhost:3001/api/location/country`, {
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

            setCountryData(result?.countries || []);
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);

  return (
    <ProfileEditContext.Provider value={{fetchCountry, formData,activeTab,countryData,setActiveTab, setFormData }}>
      {children}
    </ProfileEditContext.Provider>
  );
};

export { ProfileEditProvider, ProfileEditContext };
