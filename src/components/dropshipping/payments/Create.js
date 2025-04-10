"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Create() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        date: "",
        transaction_id: "",
        payment_cycle: "Weekly",
        amount: "",
        status: "Success",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission (API call or local storage)
        console.log("Payment Submitted:", formData);
        router.push("/admin/payments"); // Redirect after submit
    };

    return (
        <div className="bg-white lg:w-9/12  mt-10 rounded-2xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-[#2B3674] mb-6">Create Payment</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-2">
                 <div>
                    <label className="block font-medium">Payment Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-2 mt-2"

                        required
                    />
                </div>

                {/* Transaction ID */}
                <div>
                    <label className="block font-medium">Transaction ID</label>
                    <input
                        type="text"
                        name="transaction_id"
                        value={formData.transaction_id}
                        onChange={handleChange}
                        placeholder="TXN000123"
                        className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-2 mt-2"

                        required
                    />
                </div>

                {/* Payment Cycle */}
                <div>
                    <label className="block font-medium">Payment Cycle</label>
                    <select
                        name="payment_cycle"
                        value={formData.payment_cycle}
                        onChange={handleChange}
                        className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-2 mt-2"

                    >
                        <option value="Weekly">Weekly</option>
                        <option value="Biweekly">Biweekly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                </div>

                {/* Amount */}
                <div>
                    <label className="block font-medium">Amount (₹)</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="0"
                        placeholder="5000"
                        className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-2 mt-2"

                        required
                    />
                </div>
                 </div>
                <div>
                    <label className="block font-medium">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="text-[#718EBF] border w-full border-[#DFEAF2] rounded-md p-2 mt-2"

                    >
                        <option value="Success">Success</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-orange-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-[#3367d6]"
                    >
                        Create Payment
                    </button>
                </div>
            </form>
        </div>
    );
}