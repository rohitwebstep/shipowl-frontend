"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback, useState } from "react";
import 'datatables.net-dt/css/dataTables.dataTables.css';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function Analytics() {
    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [reportAnalytics, setReportAnalytics] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);

    const [fromDate, setFromDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 6);
        return d.toISOString().split("T")[0]; // format as yyyy-mm-dd
    });

    const [toDate, setToDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    const formatDate = (dateStr) => new Date(dateStr).toISOString().split("T")[0];
    const [loading, setLoading] = useState(null);

    const fetchOrders = useCallback(async () => {
        const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
        if (dropshipperData?.project?.active_panel !== "dropshipper") {
            localStorage.removeItem("shippingData");
            router.push("/dropshipping/auth/login");
            return;
        }

        const dropshippertoken = dropshipperData?.security?.token;
        if (!dropshippertoken) {
            router.push("/dropshipping/auth/login");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `https://shipowl-kd06.onrender.com/api/dropshipper/order/report?from=${fromDate}&to=${toDate}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${dropshippertoken}`,
                    },
                }
            );

            const result = await response.json();

            if (result) {
                setReportAnalytics(result.reportAnalytics || []);
                setOrders(result.orders || []);
                setFilteredOrders(result.orders || []);
            }

            if (!response.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Something Wrong!",
                    text:
                        result.message ||
                        result.error ||
                        "Your session has expired. Please log in again.",
                });
                throw new Error(
                    result.message || result.error || "Something Wrong!"
                );
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [fromDate, toDate, router]);

    useEffect(() => {
        fetchOrders();
    }, [fromDate, toDate]);

    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            orders.length > 0 &&
            loading === false
        ) {
            let table = null;

            Promise.all([
                import("jquery"),
                import("datatables.net"),
                import("datatables.net-dt"),
                import("datatables.net-buttons"),
                import("datatables.net-buttons-dt"),
            ])
                .then(([jQuery]) => {
                    window.jQuery = window.$ = jQuery.default;

                    if ($.fn.DataTable.isDataTable("#orderTable")) {
                        $("#orderTable").DataTable().destroy();
                        $("#orderTable").empty();
                    }

                    const isMobile = window.innerWidth <= 768;
                    const pagingType = isMobile ? "simple" : "simple_numbers";

                    table = $("#orderTable").DataTable({
                        pagingType,
                        language: {
                            paginate: {
                                previous: "<",
                                next: ">",
                            },
                        },
                    });

                    return () => {
                        if (table) {
                            table.destroy();
                            $("#orderTable").empty();
                        }
                    };
                })
                .catch((error) => {
                    console.error("Failed to load DataTables dependencies:", error);
                });
        }
    }, [orders, loading]);

    const totalEarnings = filteredOrders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
    );

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                📈 Dropshipper Analytics
            </h1>

            {/* Date Range */}
            <div className="flex flex-wrap gap-4 mb-8 items-end">
                <div>
                    <label className="text-sm font-medium text-gray-700">From Date</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="block mt-1 px-3 py-2 rounded-lg border bg-white border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">To Date</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="block mt-1 px-3 py-2 rounded-lg border bg-white border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Earnings */}
            <div className="mb-8 bg-white p-6 rounded-2xl shadow-md transition hover:shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Total Earnings
                </h2>
                <p className="text-4xl text-green-600 font-bold">
                    ₹{totalEarnings.toFixed(2)}
                </p>
            </div>

            {/* Table + Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Table */}
                <div className="bg-white p-6 rounded-2xl shadow-md transition main-outer-wrapper hover:shadow-lg overflow-auto">
                    <h2 className="text-lg font-bold text-gray-700 mb-4">
                        📦 Order Overview
                    </h2>
                    <table
                        className="min-w-full text-sm display main-tables"
                        id="orderTable"
                    >
                        <thead>
                            <tr className="text-left text-gray-500 border-b border-[#E9EDF7]">
                                <th className="p-2 text-left">Order ID</th>
                                <th className="p-2 text-left">Date</th>
                                <th className="p-2 text-left">Status</th>
                                <th className="p-2 text-left">Amount</th>
                                <th className="p-2 text-center">Profit / Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b border-[#E9EDF7] text-gray-700 hover:bg-blue-50 transition"
                                >
                                    <td className="p-2 font-medium">{order.orderNumber}</td>
                                    <td className="p-2 text-left">{new Date(order.createdAt).toISOString().split("T")[0]}</td>
                                    <td className="p-2 capitalize">{order.status}</td>
                                    <td className="p-2">₹{order.totalAmount}</td>
                                    <td
                                        className={`p-2 text-center font-semibold ${order.totalAmount >= 0 ? "text-green-600" : "text-red-500"
                                            }`}
                                    >
                                        ₹{order.totalAmount}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-2xl flex items-center flex-wrap shadow-md transition hover:shadow-lg">
                    <h2 className="text-lg mb-6 font-bold text-gray-700">
                        📊 Profit & Loss Trend
                    </h2>
                    <div className="w-full">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={filteredOrders} barCategoryGap="80%">
                                <XAxis
                                    dataKey="createdAt"
                                    stroke="#000"
                                    tick={{ fill: "#000", fontSize: 12 }}
                                />
                                <YAxis
                                    stroke="#000"
                                    tick={{ fill: "#000", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                    }}
                                    labelStyle={{ fontWeight: "600", color: "#000000" }}
                                    itemStyle={{ color: "#000000" }}
                                    cursor={{ fill: "#fff" }} // ⛔ this causes the gray hover
                                />

                                <Bar
                                    dataKey={(entry) => (entry.totalAmount > 0 ? entry.totalAmount : 0)}
                                    name="Profit"
                                    stackId="a"
                                    fill="#6AD2FF"
                                    // barSize={10}
                                    radius={[8, 8, 0, 0]}
                                />
                                <Bar
                                    dataKey={(entry) => (entry.totalAmount < 0 ? Math.abs(entry.totalAmount) : 0)}
                                    name="Loss"
                                    stackId="a"
                                    fill="#F98F5C"
                                    // barSize={10}
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
