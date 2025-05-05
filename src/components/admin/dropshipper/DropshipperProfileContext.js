'use client';
import { useRouter,useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { useState, createContext,useCallback} from 'react';
const DropshipperProfileContext = createContext();

const DropshipperProfileProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState("account_details");
    const [cityData, setCityData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [errorsAddress, setErrorsAddress] = useState({});
    
      const router = useRouter();
       const searchParams = useSearchParams();
          const [errors, setErrors] = useState({});
      
       const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Full Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Mobile Number is required';
        if (!formData.website) newErrors.website = 'Website URL is required';
        if (!formData.referralCode) newErrors.referralCode = 'Referral Code is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
        const id = searchParams.get("id");
        const [loading, setLoading] = useState(false);
        const [formData, setFormData] = useState({
          profilePicture: null, // or fileInput.files[0]
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          website: "",
          referralCode: "",
        
          permanentAddress: "",
          permanentCity: "",
          permanentState: "",
          permanentCountry: "",
          permanentPostalCode: "",
        
          gstNumber: "",
          gstDocument: null, // or fileInput.files[0]
          
          panCardHolderName: "",
          aadharCardHolderName: "",
          panCardImage: null, // or fileInput.files[0]
          aadharCardImage: null, // or fileInput.files[0]
        
          bankAccounts: [
            {
              accountHolderName: "",
              accountNumber: "",
              bankName: "",
              bankBranch: "",
              accountType: "",
              ifscCode: "",
              paymentMethod: ""
            }
          ]
        });
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
        const response = await fetch(`http://localhost:3001/api/dropshipper/${id}`, {
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
        const suppliers = result.dropshipper || {};
        
        const companyDetail = suppliers?.companyDetail || {};
        const bankAccounts = suppliers?.bankAccounts || [];
        
        if (suppliers.permanentCountryId) {
          fetchState(suppliers.permanentCountryId);
        }
        if (suppliers.permanentStateId) {
          fetchCity(suppliers.permanentStateId);
        }

        const normalizedBankAccounts = bankAccounts.length > 0
  ? bankAccounts.map(account => ({
      id: account.id || "",
      accountHolderName: account.accountHolderName || "",
      accountNumber: account.accountNumber || "",
      bankName: account.bankName || "",
      bankBranch: account.bankBranch || "",
      accountType: account.accountType || "",
      ifscCode: account.ifscCode || "",
      paymentMethod: account.paymentMethod || ""
    }))
  : [
      {
        accountHolderName: "",
        accountNumber: "",
        bankName: "",
        bankBranch: "",
        accountType: "",
        ifscCode: "",
        paymentMethod: ""
      }
    ];

        
        setFormData({
          profilePicture: suppliers.profilePicture || null,
          name: suppliers.name || "",
          id: suppliers.id || "",
          email: suppliers.email || "",
          password: suppliers.password || "",
          phoneNumber: suppliers.phoneNumber || "",
          website: companyDetail?.website || "",
          referralCode: companyDetail?.referralCode || "",
        
          permanentAddress: suppliers.permanentAddress || "",
          permanentCity: suppliers.permanentCityId || "",
          permanentState: suppliers.permanentStateId || "",
          permanentCountry: suppliers.permanentCountryId || "",
          permanentPostalCode: suppliers.permanentPostalCode || "",
        
          gstNumber: companyDetail?.gstNumber || "",
          gstDocument: companyDetail?.gstDocument || null,
          companyid: companyDetail?.id || null,

          
          panCardHolderName: companyDetail?.panCardHolderName || "",
          aadharCardHolderName: companyDetail?.aadharCardHolderName || "",
          panCardImage: companyDetail?.panCardImage || null,
          aadharCardImage: companyDetail?.aadharCardImage || null,
        
          bankAccounts:normalizedBankAccounts
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
              const response = await fetch(`http://localhost:3001/api/location/state/${id}/cities`, {
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
              setStateData(result?.states || []);
          } catch (error) {
              console.error("Error fetching cities:", error);
          } finally {
              setLoading(false);
          }
      }, [router]);
      const fetchState = useCallback(async (id) => {
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
              `http://localhost:3001/api/location/country/${id}/states`,
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
        

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
   const validateAddress = () => {
          const newErrors = {};
          if (!formData.permanentAddress) newErrors.permanentAddress = 'Permanent Address is required';
          if (!formData.permanentPostalCode) newErrors.permanentPostalCode = 'Postal Code is required';
          if (!formData.permanentCity) newErrors.permanentCity = 'City is required';
          if (!formData.permanentCountry) newErrors.permanentCountry = 'Country is required';
          if (!formData.permanentState) newErrors.permanentState = 'State is required';
  
          setErrorsAddress(newErrors);
          return Object.keys(newErrors).length === 0;
      };
  return (
    <DropshipperProfileContext.Provider value={{errors, loading, setLoading,setErrors,errorsAddress, setErrorsAddress,validate,validateAddress, activeTab, setActiveTab,formData,setFormData,setStateData,setCityData,cityData,stateData, handleChange,fetchSupplier }}>
      {children}
    </DropshipperProfileContext.Provider>
  );
};

export { DropshipperProfileProvider, DropshipperProfileContext };
