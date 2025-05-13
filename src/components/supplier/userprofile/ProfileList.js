"use client";
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useRouter} from "next/navigation";
import Swal from "sweetalert2";
import HashLoader from "react-spinners/HashLoader";
import React, { useState, useCallback, useEffect } from "react";
import { useSupplier } from '../middleware/SupplierMiddleWareContext';
const ProfileList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const { verifySupplierAuth } = useSupplier();
    const [cityData, setCityData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [isTrashed, setIsTrashed] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
 
      
    const fetchSupplier = useCallback(async () => {
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
            const response = await fetch(`http://localhost:3001/api/supplier/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${suppliertoken}`,
                },
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Something Wrong!",
                    text: errorMessage.error || errorMessage.message || "Your session has expired. Please log in again.",
                });
                throw new Error(errorMessage.message || errorMessage.error || "Something Wrong!");
            }

            const result = await response.json();
            if (result) {
                setSuppliers(result?.supplier || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }, [router, setSuppliers]);
    const fetchCity = useCallback(async () => {
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
            const response = await fetch(
                `http://localhost:3001/api/location/city`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${suppliertoken}`,
                    },
                }
            );
    
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
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);
    
    const fetchState = useCallback(async () => {
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
            const response = await fetch(
                `http://localhost:3001/api/location/state`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${suppliertoken}`,
                    },
                }
            );

            if (!response.ok) {
                const errorMessage = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Something Wrong!",
                    text:
                        errorMessage.error ||
                        errorMessage.message ||
                        "Your session has expired. Please log in again.",
                });
                throw new Error(
                    errorMessage.message || errorMessage.error || "Something Wrong!"
                );
            }

            const result = await response.json();
            if (result) {
                setStateData(result?.states || []);
            }
        } catch (error) {
            console.error("Error fetching state:", error);
        } finally {
            setLoading(false);
        }
    }, [router, setStateData]);
            

    useEffect(() => {
        const fetchData = async () => {
            setIsTrashed(false);
            setLoading(true);
            await verifySupplierAuth();
            await fetchSupplier();
            await fetchCity();
            await fetchState();
            setLoading(false);
        };
        fetchData();
    }, [fetchSupplier, verifySupplierAuth]);

    const [selected, setSelected] = useState([]);
   
    const handleCheckboxChange = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((suppliers) => suppliers !== id) : [...prev, id]));
    };
   
    const handleEdit=()=>{
        router.push(`/supplier/profile/update`);
    }
    return (
        loading ? (
            <div className="flex justify-center items-center h-96">
                <HashLoader color="orange" />
            </div>
        ) : (
            <div className="grid gap-6 grid-cols-2 ">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold text-[#2B3674] mb-4">Personal Information</h3>
              <div className="space-y-2 text-[#2B3674]">
                <p><strong>Name:</strong> {suppliers.name || 'N/A'}</p>
                <p><strong>Email:</strong> {suppliers.email || 'N/A'}</p>
                <p><strong>Date of Birth:</strong> 
                {(typeof suppliers.dateOfBirth === 'string' && suppliers.dateOfBirth.trim() !== '')
                    ? suppliers.dateOfBirth
                    : 'N/A'}
                </p>
                <p><strong>Permanent Address:</strong> {suppliers.permanentAddress || 'N/A'}</p>
                <p><strong>State:</strong> {stateData.find(s => s.id === suppliers.permanentStateId)?.name || 'N/A'}</p>
                <p><strong>City:</strong> {cityData.find(c => c.id === suppliers.permanentCityId)?.name || 'N/A'}</p>
                <p><strong>Postal Code:</strong> {suppliers.permanentPostalCode || 'N/A'}</p>
              </div>
              <h3 className="text-2xl font-semibold text-[#2B3674] my-4">Company Details</h3>
              <div className="space-y-2 text-[#2B3674]">
                <p><strong>Company Name:</strong> {suppliers?.companyDetail?.companyName || 'N/A'}</p>
                <p><strong>Company PanNumber:</strong> {suppliers?.companyDetail?.companyPanNumber || 'N/A'}</p>
                <p><strong>Brand Name:</strong> {suppliers?.companyDetail?.brandName || 'N/A'}</p>
                <p><strong>Brand Short Name:</strong> {suppliers?.companyDetail?.brandShortName || 'N/A'}</p>
                <p><strong>Billing Address:</strong> {suppliers?.companyDetail?.billingAddress || 'N/A'}</p>
                <p><strong>Billing Pincode:</strong> {suppliers?.companyDetail?.billingPincode || 'N/A'}</p>
                <p><strong>AadharCardHolderName:</strong> {suppliers?.companyDetail?.aadharCardHolderName || 'N/A'}</p>
                
              </div>
              <div className="mt-4 text-right">
                <button onClick={() => handleEdit(suppliers.id)} className='bg-orange-500 text-white p-3 rounded-md'>Update Profile</button>
              </div>
            </div>
          
            <div className="bg-white rounded-2xl p-6 shadow-md ">
              <h3 className="text-2xl font-semibold text-[#2B3674] mb-4">Bank Account Details</h3>
              {Array.isArray(suppliers.bankAccounts) && suppliers.bankAccounts.length > 0 ? (
                <div className="space-y-4">
                  {suppliers.bankAccounts.map((bank, index) => (
                    <div key={bank.id} className="bg-white p-4 rounded-lg border">
                      <p><strong>Account Holder Name:</strong> {bank.accountHolderName}</p>
                      <p><strong>Account Number:</strong> {bank.accountNumber}</p>
                      <p><strong>Bank Name:</strong> {bank.bankName}</p>
                      <p><strong>Branch:</strong> {bank.bankBranch}</p>
                      <p><strong>Account Type:</strong> {bank.accountType}</p>
                      <p><strong>IFSC Code:</strong> {bank.ifscCode}</p>
                      {bank.cancelledChequeImage ? (
                        <button
                            onClick={() => window.open(bank.cancelledChequeImage, "_blank")}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Check Cancelled Cheque Image
                        </button>
                        ) : (
                        <p className="text-sm text-gray-400 mt-2">No cancelled cheque image uploaded.</p>
                        )}
                     
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#A3AED0]">No bank account details available.</p>
              )}
            </div>
          </div>
        )
    );

};

export default ProfileList;
