'use client';

import { useState, createContext } from 'react';

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    permanentAddress: '',
    postalCode: '',
    username: '',
    password: '********',
    presentAddress: '',
    city: '',
    country: '',
    brandName: '',
    shortBrandName: '',
    companyBillingAddress: '',
    state: '',
    businessType: '',
    clientEntity: '',
    gstNumber: '',
    panCardID: '',
    panCardName: '',
    aadharCardName: '',
    aadharCardID: '',
    accountName: '',
    accountNumber: '',
    bankName: '.',
    bankBranch: '',
    accountType: '',
    ifscCode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <ProfileContext.Provider value={{ formData, handleChange }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileProvider, ProfileContext };
