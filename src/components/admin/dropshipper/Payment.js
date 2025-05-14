'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { DropshipperProfileContext } from './DropshipperProfileContext';

const Payment = () => {
  const { formData, setFormData } = useContext(DropshipperProfileContext);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (index = null, e) => {
    const { name, value, files } = e.target;

    if (['panCardImage', 'aadharCardImage', 'gstDocument'].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (index !== null && name) {
      const updatedAccounts = [...formData.bankAccounts];
      updatedAccounts[index][name] = value;
      setFormData((prev) => ({ ...prev, bankAccounts: updatedAccounts }));
    } else if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddBankAccount = () => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: [
        ...prev.bankAccounts,
        {
          accountHolderName: '',
          accountNumber: '',
          bankName: '',
          bankBranch: '',
          ifscCode: '',
          accountType: '',
          paymentMethod: '',
        },
      ],
    }));
  };

  const handleRemove = (index) => {
    const updatedAccounts = formData.bankAccounts.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, bankAccounts: updatedAccounts }));
  };

  const validate = () => {
    const newErrors = {};

    formData.bankAccounts.forEach((account, index) => {
      if (!account.accountHolderName) newErrors[`accountHolderName-${index}`] = 'Required';
      if (!account.accountNumber) newErrors[`accountNumber-${index}`] = 'Required';
      if (!account.bankName) newErrors[`bankName-${index}`] = 'Required';
      if (!account.bankBranch) newErrors[`bankBranch-${index}`] = 'Required';
      if (!account.ifscCode) newErrors[`ifscCode-${index}`] = 'Required';
      if (!account.paymentMethod) newErrors[`paymentMethod-${index}`] = 'Required';
    });

    if (!formData.gstNumber) newErrors.gstNumber = 'Required';
    if (!formData.panCardHolderName) newErrors.panCardHolderName = 'Required';
    if (!formData.aadharCardHolderName) newErrors.aadharCardHolderName = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const adminData = JSON.parse(localStorage.getItem('shippingData'));
    if (adminData?.project?.active_panel !== 'admin') {
      localStorage.clear();
      router.push('/admin/auth/login');
      return;
    }

    const token = adminData?.security?.token;
    if (!token) {
      router.push('/admin/auth/login');
      return;
    }

    try {
      Swal.fire({
        title: 'Creating dropshipper...',
        text: 'Please wait while we save your dropshipper.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const url = `https://sleeping-owl-we0m.onrender.com/api/dropshipper`;
      const form = new FormData();

      // Append formData
      for (const key in formData) {
        const value = formData[key];

        if (value === null || value === undefined || value === '') continue;

        if (['panCardImage', 'gstDocument', 'aadharCardImage', 'profilePicture'].includes(key)) {
          if (value instanceof File) {
            form.append(key, value, value.name);
          }
        } else if (key === 'bankAccounts') {
          form.append('bankAccounts', JSON.stringify(value));
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, value);
        }
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      Swal.close();

      if (!response.ok) {
        const errorMessage = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Creation Failed',
          text: errorMessage.message || errorMessage.error || 'An error occurred',
        });
        throw new Error(errorMessage.message || errorMessage.error || 'Submission failed');
      }

      const result = await response.json();

      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Dropshipper Created',
          text: 'The Dropshipper has been created successfully!',
          showConfirmButton: true,
        }).then((res) => {
          if (res.isConfirmed) {
            setFormData({});
            router.push('/admin/dropshipper/list');
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white lg:p-10 p-3 rounded-2xl">
      <h3 className="font-semibold text-[#FF702C] underline text-sm">Bank Account Details</h3>

      {Array.isArray(formData.bankAccounts) &&
  formData.bankAccounts.map((account, index) => (
        <div key={index} className="grid lg:grid-cols-3 gap-4 py-5 border p-3 rounded-md mb-3">
          {[
            ['Account Holder Name', 'accountHolderName'],
            ['Account Number', 'accountNumber'],
            ['Bank Name', 'bankName'],
            ['Bank Branch', 'bankBranch'],
            ['IFSC Code', 'ifscCode'],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="block text-[#232323] font-bold mb-1">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={name}
                value={account[name] || ''}
                onChange={(e) => handleChange(index, e)}
                className={`w-full p-3 border rounded-lg font-bold ${
                  errors[`${name}-${index}`] ? 'border-red-500 text-red-500' : 'border-[#DFEAF2] text-[#718EBF]'
                }`}
              />
              {errors[`${name}-${index}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`${name}-${index}`]}</p>
              )}
            </div>
          ))}

          {/* Account Type */}
          <div>
            <label className="block text-[#232323] font-bold mb-1">
              Account Type
            </label>
            <select
              name="accountType"
              value={account.accountType}
              onChange={(e) => handleChange(index, e)}
              className="w-full p-3 border rounded-lg font-bold border-[#DFEAF2] text-[#718EBF]"
            >
              <option value="">Select Type</option>
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
              <option value="Business">Business</option>
            </select>
          </div>

          {/* Preferred Payment Method */}
          <div>
            <label className="block text-[#232323] font-bold mb-1">
              Preferred Payment Method 
            </label>
            <select
              name="paymentMethod"
              value={account.paymentMethod || ''}
              onChange={(e) => handleChange(index, e)}
              className="w-full p-3 border rounded-lg font-bold border-[#DFEAF2] text-[#718EBF]"
            >
              <option value="">Select Method</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Paypal">Paypal</option>
              <option value="Stripe">Stripe</option>
              <option value="COD">COD</option>
            </select>
          </div>

          {/* Remove Button */}
          {index > 0 && (
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="bg-red-500 text-white underline px-4 py-2 rounded"
              >
                Remove Account
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="py-4">
        <button
          type="button"
          onClick={handleAddBankAccount}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Add More Bank Account
        </button>
      </div>

      {/* KYC Details */}
      <div>
        <h3 className="font-semibold text-[#FF702C] py-5 underline text-sm">KYC Details</h3>
        <div className="grid lg:grid-cols-3 gap-4 mt-2">
          {[
            { name: 'gstNumber', label: 'GST Number' },
            { name: 'panCardHolderName', label: 'Name on PAN Card' },
            { name: 'aadharCardHolderName', label: 'Name on Aadhar Card' },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-[#232323] font-bold mb-1">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={name}
                value={formData[name] || ''}
                onChange={(e) => handleChange(null, e)}
                className={`w-full p-3 border rounded-lg font-bold ${
                  errors[name] ? 'border-red-500' : 'border-[#DFEAF2]'
                } text-[#718EBF]`}
              />
              {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
          ))}

          {/* File Uploads */}
          {['panCardImage', 'aadharCardImage', 'gstDocument'].map((name) => (
            <div key={name}>
              <label className="block text-[#232323] font-bold mb-1">
                {name.replace(/([A-Z])/g, ' $1')} Upload
              </label>
              <input
                type="file"
                name={name}
                multiple
                onChange={(e) => handleChange(null, e)}
                className="w-full p-3 border rounded-lg border-[#DFEAF2] text-[#718EBF] font-bold"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Payment;
