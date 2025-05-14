'use client';

import { useContext, useState } from 'react';
import { ProfileContext } from './ProfileContext';
import BankAccountList from './BankAccountList';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const AccountInfo = () => {
  const { formData, setFormData,setErrors ,requiredFields,setActiveTab} = useContext(ProfileContext);
  const [accountErrors, setAccountErrors] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedAccounts = [...formData.bankAccounts];
    updatedAccounts[index][name] = files ? files : value;
    setFormData({ ...formData, bankAccounts: updatedAccounts });

    const updatedErrors = [...accountErrors];
    if (value || files?.length) {
      if (updatedErrors[index]) updatedErrors[index][name] = '';
    }
    setAccountErrors(updatedErrors);
  };

  const validate = () => {
    const newErrors = formData.bankAccounts.map(account => {
      const accountErrors = {};
      for (let field in account) {
        if (!account[field] || (Array.isArray(account[field]) && account[field].length === 0)) {
          accountErrors[field] = 'This field is required';
        }
      }
      return accountErrors;
    });

    setAccountErrors(newErrors);
    return newErrors.every(err => Object.keys(err).length === 0);
  };

  const handleRemove = (indexToRemove) => {
    const updatedAccounts = formData.bankAccounts.filter((_, i) => i !== indexToRemove);
    const updatedErrors = accountErrors.filter((_, i) => i !== indexToRemove);
    setFormData({ ...formData, bankAccounts: updatedAccounts });
    setAccountErrors(updatedErrors);
  };

  const handleAddMore = () => {
    setFormData({
      ...formData,
      bankAccounts: [
        ...formData.bankAccounts,
        {
          accountHolderName: '',
          accountNumber: '',
          bankName: '',
          bankBranch: '',
          accountType: '',
          ifscCode: '',
          cancelledChequeImage: [],
        },
      ],
    });
    setAccountErrors([...accountErrors, {}]);
  };
   const getTabByFieldName = (fieldName) => {
    const profileFields = [
      'name', 'username', 'email', 'password', 'dateOfBirth',
      'currentAddress', 'permanentAddress', 'permanentCity',
      'permanentPostalCode', 'permanentCountry', 'permanentState',
    ];
  
    const businessFields = Object.keys(requiredFields);
  
    const accountFields = [
      'bankAccounts', 'documentImage', 'panCardImage',
      'aadharCardImage', 'aadharNumber', 'aadharCardHolderName',
      'panCardHolderName', 'companyPanNumber', 'additionalDocumentUpload',
    ];
  
    if (profileFields.includes(fieldName)) return 'profile-edit';
    if (businessFields.includes(fieldName)) return 'business-info';
    if (accountFields.includes(fieldName)) return 'account-info';
  
    return null;
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validate()) return;
  
    setLoading(true);
    console.log('formData', formData);
  
    const adminData = JSON.parse(localStorage.getItem("shippingData"));
    if (!adminData?.project?.active_panel === "admin") {
      localStorage.clear("shippingData");
      router.push("/admin/auth/login");
      return;
    }
  
    const token = adminData?.security?.token;
    if (!token) {
      router.push("/admin/auth/login");
      return;
    }
  
    try {
      Swal.fire({
        title: 'Creating Supplier...',
        text: 'Please wait while we save your Supplier.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
  
      const url = "https://sleeping-owl-we0m.onrender.com/api/supplier";
      const form = new FormData();
  
      for (const key in formData) {
        const value = formData[key];
  
        if (value === null || value === undefined || value === '') continue;
  
        if (
          ['panCardImage', 'gstDocument', 'additionalDocumentUpload', 'documentImage', 'aadharCardImage', 'profilePicture'].includes(key)
        ) {
          if (Array.isArray(value)) {
            value.forEach(file => form.append(key, file, file.name));
          } else if (value instanceof File) {
            form.append(key, value, value.name);
          }
        } else if (key === 'dateOfBirth' && value) {
          const formattedDate = new Date(value).toLocaleDateString('en-GB');
          form.append(key, formattedDate);
        } else if (value instanceof FileList) {
          Array.from(value).forEach(file => form.append(key, file));
        } else if (key === 'bankAccounts') {
          value.forEach((bank, bankIndex) => {
            const file = bank['cancelledChequeImage'];
            const fileKey = `cancelledChequeImage${bankIndex}`;
            if (Array.isArray(file)) {
              file.forEach(f => form.append(fileKey, f, f.name));
            } else if (file instanceof File) {
              form.append(fileKey, file, file.name);
            }
          });
          form.append('bankAccounts', JSON.stringify(value));
        } else if (Array.isArray(value) || typeof value === 'object') {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, value);
        }
      }
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: form,
      });
  
      const result = await response.json();
      if (!response.ok) {
        Swal.close();
  
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: result.message || result.error || "An error occurred",
        });
  
        if (result.error && typeof result.error === 'object') {
          const entries = Object.entries(result.error);
          let focused = false;
  
          entries.forEach(([key, message]) => {
            setErrors((prev) => ({
              ...prev,
              [key]: message,
            }));
  
            if (!focused) {
              const tab = getTabByFieldName(key); // make sure this is imported or defined above
              if (tab) setActiveTab(tab);
  
              setTimeout(() => {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) input.focus();
              }, 300);
  
              focused = true;
            }
          });
        }
  
        throw new Error(result.message || result.error || "Submission failed");
      }
  
      Swal.close();
  
      if (result) {
        Swal.fire({
          icon: "success",
          title: "Supplier Created",
          text: `The supplier has been created successfully!`,
          showConfirmButton: true,
        }).then((res) => {
          if (res.isConfirmed) {
            setFormData({});
            router.push("/admin/supplier/list");
          }
        });
      }
  
    } catch (error) {
      console.error("Error:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: error.message || "Something went wrong. Please try again.",
      });
  
      setAccountErrors({});
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleFileChange = (event, index) => {
    const files = event.target.files;
    if (files) {
      const updatedAccounts = [...formData.bankAccounts];
      updatedAccounts[index].cancelledChequeImage = Array.from(files);
      setFormData({ ...formData, bankAccounts: updatedAccounts });
    }
  };

  return (
    <div className="bg-white lg:p-10 p-3 rounded-tr-none rounded-tl-none rounded-2xl">
      {Array.isArray(formData?.bankAccounts) && formData.bankAccounts.map((account, index) => (
  <div key={index} className="grid lg:grid-cols-3 gap-4 py-5">
    {[['Account Holder Name', 'accountHolderName'], ['Account Number', 'accountNumber'], ['Bank Name', 'bankName'], ['Bank Branch', 'bankBranch'], ['IFSC Code', 'ifscCode']].map(([label, name]) => (
      <div key={name}>
        <label className="block text-[#232323] font-bold mb-1">
          {label} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name={name}
          value={account[name]}
          onChange={(e) => handleChange(index, e)}
          className={`w-full p-3 border rounded-lg font-bold ${accountErrors[index]?.[name] ? 'border-red-500 text-red-500' : 'border-[#DFEAF2] text-[#718EBF]'}`}
        />
        {accountErrors[index]?.[name] && (
          <p className="text-red-500 text-sm mt-1">{accountErrors[index][name]}</p>
        )}
      </div>
    ))}

    <div>
      <label className="block text-[#232323] font-bold mb-1">
        Account Type <span className="text-red-500">*</span>
      </label>
      <select
        name="accountType"
        value={account.accountType}
        onChange={(e) => handleChange(index, e)}
        className={`w-full p-3 border rounded-lg font-bold ${accountErrors[index]?.accountType ? 'border-red-500 text-red-500' : 'border-[#DFEAF2] text-[#718EBF]'}`}
      >
        <option value="">Select Type</option>
        <option value="Savings">Savings</option>
        <option value="Current">Current</option>
        <option value="Business">Business</option>
      </select>
      {accountErrors[index]?.accountType && (
        <p className="text-red-500 text-sm mt-1">{accountErrors[index].accountType}</p>
      )}
    </div>

    <div>
      <label className="block text-[#232323] font-bold mb-1">
        Cancelled Cheque Image 
      </label>
      <input
        type="file"
        multiple
        onChange={(e) => handleFileChange(e, index)}
        className={`w-full p-3 border rounded-lg font-bold ${accountErrors[index]?.cancelledChequeImage ? 'border-red-500 text-red-500' : 'border-[#DFEAF2] text-[#718EBF]'}`}
      />
      {accountErrors[index]?.cancelledChequeImage && (
        <p className="text-red-500 text-sm mt-1">{accountErrors[index].cancelledChequeImage}</p>
      )}
    </div>

    {/* Only show Remove button if it's not the first (index 0) account */}
    {index !== 0 && formData.bankAccounts.length > 1 && (
      <div className="lg:col-span-3 flex justify-end mt-2">
        <button
          onClick={() => handleRemove(index)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    )}
  </div>
))}


      <button
        onClick={handleAddMore}
        className="mb-5 px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        + Add More
      </button>

      <div className="flex space-x-4 mt-6">
        <button onClick={handleSubmit} className="px-4 py-2 bg-orange-500 text-white rounded-lg">
          Save
        </button>
        <button className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
      </div>

      <BankAccountList />
    </div>
  );
};

export default AccountInfo;
