'use client';

import { useState, createContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  const [errors, setErrors] = useState({});
  const [businessErrors, setBusinessErrors] = useState({});
  const [activeMainTab, setActiveMainTab] = useState('create-supplier');
  const [activeSubTab, setActiveSubTab] = useState('profile-edit');
  const [loading, setLoading] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    currentAddress: "",
    permanentAddress: "",
    permanentCity: "",
    permanentPostalCode: "",
    permanentCountry: "",
    permanentState: "",
    companyName: "",
    brandName: "",
    billingAddress: "",
    billingPincode: "",
    billingCountry: "",
    billingState: "",
    billingCity: "",
    profilePicture: '',
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
    uploadGstDoc: "",
    panCardImage: "",
    aadharCardImage: ""
  });

  const requiredFields = {
    companyName: 'Registered Company Name is required',
    brandName: 'Brand Name is required',
    billingAddress: 'Billing Address is required',
    billingPincode: 'Pincode is required',
    billingCountry: 'Country is required',
    billingState: 'State is required',
    billingCity: 'City is required',
    clientEntryType: 'Client Entry Type is required',
    gstNumber: 'GST Number is required',
    companyPanNumber: 'PAN Number is required',
    aadharNumber: 'Aadhar Number is required',
    panCardHolderName: 'PAN Card Holder Name is required',
    aadharCardHolderName: 'Aadhar Card Holder Name is required',
  };

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
      const response = await fetch(`https://shipowl-kd06.onrender.com/api/location/country`, {
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
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full Name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.currentAddress) newErrors.currentAddress = 'Present Address is required';
    if (!formData.permanentAddress) newErrors.permanentAddress = 'Permanent Address is required';
    if (!formData.permanentCity) newErrors.permanentCity = 'City is required';
    if (!formData.permanentPostalCode) newErrors.permanentPostalCode = 'Postal Code is required';
    if (!formData.permanentCountry) newErrors.permanentCountry = 'Country is required';
    if (!formData.permanentState) newErrors.permanentState = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBusiness = () => {
    const newErrors = {};

    const alwaysRequiredFields = [
      'companyName',
      'brandName',
      'billingAddress',
      'billingPincode',
      'billingCountry',
      'billingState',
      'billingCity',
      'clientEntryType'
    ];

    alwaysRequiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = requiredFields[field];
      }
    });

    // GST/PAN logic
    const hasGST = !!formData.gstNumber?.trim();
    const hasAadhar = !!formData.aadharNumber?.trim();

    if (hasGST ) {
    
      if (!hasGST) {
        newErrors.gstNumber = requiredFields.gstNumber;
      }
      if (!formData.panCardHolderName?.trim()) {
        newErrors.panCardHolderName = requiredFields.panCardHolderName;
      }
      if (!formData.gstDocument) {
        newErrors.gstDocument = 'GST Document is required';
      }
    }


    // Aadhar section
    if (hasAadhar) {
      if (!formData.aadharNumber?.trim()) {
        newErrors.aadharNumber = requiredFields.aadharNumber;
      }
      if (!formData.companyPanNumber?.trim()) {
        newErrors.companyPanNumber = requiredFields.companyPanNumber;
      }
      if (!formData.aadharCardHolderName?.trim()) {
        newErrors.aadharCardHolderName = requiredFields.aadharCardHolderName;
      }
      if (!formData.panCardHolderName?.trim()) {
        newErrors.panCardHolderName = requiredFields.panCardHolderName;
      }
      if (!formData.panCardImage) {
        newErrors.panCardImage = 'PAN Card Image is required';
      }
      if (!formData.aadharCardImage) {
        newErrors.aadharCardImage = 'Aadhar Card Image is required';
      }
    }

    setBusinessErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <ProfileContext.Provider value={{
      fetchCountry,
      errors,
      activeMainTab,
      setActiveMainTab,
      businessErrors,
      setBusinessErrors,
      validate,
      requiredFields,
      validateBusiness,
      setErrors,
      formData,
      activeSubTab,
      setActiveSubTab,
      countryData,
      setFormData
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileProvider, ProfileContext };
