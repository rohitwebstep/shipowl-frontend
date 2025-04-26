'use client';

import { useState, createContext } from 'react';

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {

    const [activeTab, setActiveTab] = useState("profile-edit");
  
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
   
  ]
});


  return (
    <ProfileContext.Provider value={{ formData,activeTab, setActiveTab, setFormData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileProvider, ProfileContext };
