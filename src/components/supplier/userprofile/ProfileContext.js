'use client';

import { useState, createContext ,useCallback} from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
    const [errors, setErrors] = useState({});
    const [businessErrors, setBusinessErrors] = useState({});
    const [cityData,setCityData] = useState([]);
    const [stateData,setStateData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState({});
    const [countryData, setCountryData] = useState([]);
    const [activeTab, setActiveTab] = useState("profile-edit");
    const router = useRouter();
    
    const [formData, setFormData] = useState({
      name: "",
      username: "",
      email: "",
      password: "",
      permanentState: "",
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
      billingCountry:'',
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
      
  });

    const fetchCountry = useCallback(async () => {
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
            const response = await fetch(`http://localhost:3001/api/location/country`, {
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

            setCountryData(result?.countries || []);
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Full Name is required';
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
        if (!formData.currentAddress) newErrors.currentAddress = 'Present Address is required';
        if (!formData.permanentAddress) newErrors.permanentAddress = 'Permanent Address is required';
        if (!formData.permanentCity) newErrors.permanentCity = 'City is required';
        if (!formData.permanentPostalCode) newErrors.permanentPostalCode = 'Postal Code is required';
        if (!formData.permanentCountry) newErrors.permanentCountry = 'Country is required';
        if (!formData.permanentState) newErrors.permanentState = 'State is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const requiredFields = {
      companyName: 'Registered Company Name is required',
      brandName: 'Brand Name is required',
      billingAddress: 'Billing Address is required',
      billingPincode: 'Pincode is required',
      billingCountry: 'Country is required',
      billingState: 'State is required',
      billingCity: 'City is required',
      businessType: 'Business Type is required',
      clientEntryType: 'Client Entry Type is required',
      gstNumber: 'GST Number is required',
      companyPanNumber: 'PAN Number is required',
      aadharNumber: 'Aadhar Number is required',
      panCardHolderName: 'PAN Card Holder Name is required',
      aadharCardHolderName: 'Aadhar Card Holder Name is required',
    };
    const validateBusiness = () => {
      const newErrors = {};
      for (let key in requiredFields) {
        if (!formData[key] || formData[key].toString().trim() === '') {
          newErrors[key] = requiredFields[key];
        }
      }
      setBusinessErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  return (
    <ProfileContext.Provider value={{businessErrors, setBusinessErrors,errors,setErrors,validateBusiness,validate,requiredFields,fetchCountry,files, setFiles,cityData,setCityData,stateData,setStateData, formData,activeTab,countryData,setActiveTab, setFormData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileProvider, ProfileContext };
