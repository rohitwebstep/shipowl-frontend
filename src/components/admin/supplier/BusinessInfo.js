'use client';

import { useContext, useState } from 'react';
import { ProfileContext } from './ProfileContext';

const BusinessInfo = () => {
  const { formData, setFormData,setActiveTab } = useContext(ProfileContext);
  const [errors, setErrors] = useState({});

  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    // Update form data properly
    setFormData((prev) => ({
      ...prev,
      [name]: files?.length ? files[0] : value,
    }));
  
    // Clear error for the current field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = {
      companyName: 'Registered Company Name is required',
      brandName: 'Brand Name is required',
      billingAddress: 'Billing Address is required',
      billingPincode: 'Pincode is required',
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

    const newErrors = {};
    for (let key in requiredFields) {
      if (!formData[key] || formData[key].toString().trim() === '') {
        newErrors[key] = requiredFields[key];
      }
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setActiveTab('account-info');
    }
  };

  const renderLabel = (label, field) => (
    <label className="block text-[#232323] font-bold mb-1">
      {label}
      {errors[field] && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const renderInputClasses = (field) =>
    `w-full p-3 border rounded-lg font-bold ${
      errors[field] ? 'border-red-500' : 'border-[#DFEAF2]'
    } text-[#718EBF]`;

  const renderError = (field) =>
    errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>;

  return (
    <form onSubmit={handleSubmit} className="bg-white lg:p-10 p-3 rounded-2xl">
      <div className="grid lg:grid-cols-3 py-5 gap-4">
        <div>
          {renderLabel('Registered Company Name', 'companyName')}
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className={renderInputClasses('companyName')}
          />
          {renderError('companyName')}
        </div>

        <div>
          {renderLabel('Brand Name', 'brandName')}
          <input
            type="text"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            className={renderInputClasses('brandName')}
          />
          {renderError('brandName')}
        </div>

        <div>
          {renderLabel('Short Brand Name')}
          <input
            type="text"
            name="brandShortName"
            value={formData.brandShortName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
          />
        </div>
      </div>

      <div>
        {renderLabel('Company Billing Address', 'billingAddress')}
        <input
          type="text"
          name="billingAddress"
          value={formData.billingAddress}
          onChange={handleChange}
          className={renderInputClasses('billingAddress')}
        />
        {renderError('billingAddress')}
      </div>

      <div className="grid lg:grid-cols-3 py-5 gap-4">
        {['billingPincode', 'billingState', 'billingCity'].map((field) => (
          <div key={field}>
            {renderLabel(field === 'billingPincode' ? 'Pincode' : field === 'billingState' ? 'State' : 'City', field)}
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className={renderInputClasses(field)}
            />
            {renderError(field)}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div>
          {renderLabel('Business Type', 'businessType')}
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className={renderInputClasses('businessType')}
          >
            <option value="">Select</option>
            <option value="Business">Business</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Startup">Startup</option>
          </select>
          {renderError('businessType')}
        </div>

        <div>
          {renderLabel('Form of Client’s Entity', 'clientEntryType')}
          <select
            name="clientEntryType"
            value={formData.clientEntryType}
            onChange={handleChange}
            className={renderInputClasses('clientEntryType')}
          >
            <option value="">Select</option>
            <option value="Entrepreneurship">Entrepreneurship</option>
            <option value="Partnership">Partnership</option>
            <option value="Corporation">Corporation</option>
          </select>
          {renderError('clientEntryType')}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-[#FF702C] py-5 underline text-sm">
          KYC Details – Provide minimum of 2 documents
        </h3>

        <div className="grid lg:grid-cols-3 gap-4 mt-2">
          {[
            { label: 'GST Number', name: 'gstNumber' },
            { label: 'Company PAN Card ID', name: 'companyPanNumber' },
            { label: 'Adhar Card ID', name: 'aadharNumber' },
            { label: 'Upload GST Document', name: 'gstDocument', type: 'file' },
            { label: 'Name on PAN Card', name: 'panCardHolderName' },
            { label: 'Name Adhar Card ID', name: 'aadharCardHolderName' },
          ].map(({ label, name, type = 'text' }) => (
            <div key={name}>
              {renderLabel(label, name)}
              <input
                type={type}
                name={name}
                value={type === 'file' ? undefined : formData[name]}
                onChange={handleChange}
                className={renderInputClasses(name)}
              />
              {renderError(name)}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 py-5 gap-3">
        {['panCardImage', 'aadharCardImage'].map((name) => (
          <div key={name}>
            {renderLabel(
              name === 'panCardImage' ? 'Upload PAN card image' : 'Upload Adhar card image',
              name
            )}
            <input
              type="file"
              name={name}
              onChange={handleChange}
              className={renderInputClasses(name)}
            />
          </div>
        ))}
      </div>

      <h3 className="font-semibold text-[#FF702C] underline text-sm pt-5">
        Additional Supporting Document
      </h3>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 pt-3">
        {[
          { label: 'Document to upload', name: 'additionalDocumentUpload', type: 'file' },
          { label: 'Document ID', name: 'documentId' },
          { label: 'Name of document', name: 'documentName' },
          { label: 'Document Image', name: 'documentImage', type: 'file' },
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            {renderLabel(label, name)}
            <input
              type={type}
              name={name}
              value={type === 'file' ? undefined : formData[name]}
              onChange={handleChange}
              className={renderInputClasses(name)}
            />
          </div>
        ))}
      </div>

      <div className="flex space-x-4 mt-6">
        <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-orange-500 text-white rounded-lg">
          Next
        </button>
        <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded-lg">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BusinessInfo;
