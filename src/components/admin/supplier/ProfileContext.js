'use client';

import { useState, createContext} from 'react';

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: 'Charlene Reed',
    email: 'charlenereed@gmail.com',
    dob: '1990-01-25',
    permanentAddress: 'San Jose, California, USA',
    postalCode: '45962',
    username: 'Charlene Reed',
    password: '********',
    presentAddress: 'San Jose, California, USA',
    city: 'San Jose',
    country: 'USA',
    brandName: 'Brand',
    shortBrandName: 'Br.',
    companyBillingAddress: 'San Jose, California, USA',
    state: 'San Jose, California, USA',
    businessType: 'Business',
    clientEntity: 'Entrepreneurship',
    gstNumber: '',
    panCardID: '',
    panCardName: '',
    aadharCardName: '',
    aadharCardID: '',
    accountName: 'Charlene Reed',
    accountNumber: '',
    bankName: 'Rr.',
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
