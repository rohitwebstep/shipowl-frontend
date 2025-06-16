'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
const tabs = [
  { key: "warehouse-collected", label: "Collected at Warehouse" },
  { key: "rto", label: "RTO Count" },
  { key: "need-to-raise", label: "Need to Raise" },
  { key: "dispute", label: "Dispute" },
];

import useScannerDetection from '../useScannerDetection';
// import { RiFileEditFill } from "react-icons/ri";
// import { IoCloudDownloadOutline } from "react-icons/io5";
// import { RxCrossCircled } from "react-icons/rx";
// import { IoIosArrowDropdown } from "react-icons/io";
import { IoMdRefresh } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { FiDownloadCloud } from "react-icons/fi";
import { MoreHorizontal } from "lucide-react";
import barcode from '@/app/assets/barcode.png'
import Image from 'next/image';
import { HashLoader } from 'react-spinners';
export default function RTO() {
  const [activeTab, setActiveTab] = useState('warehouse-collected');

  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleViewVariant = (item, variant) => {
    setSelectedVariant(item);
    setShowModal(true);
  };
  const [selectedDisputeItem, setSelectedDisputeItem] = useState(null);
  const modalRefNew = useRef(null);
  const [scannedCode, setScannedCode] = useState('');
  const [message, setMessage] = useState('📷 Please scan a barcode...');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isBarCodePopupOpen, setIsBarCodePopupOpen] = useState(false);
  const openBarCodeModal = () => {
    setIsBarCodePopupOpen(true);

  }

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [packingGallery, setPackingGallery] = useState([]);
  const [unboxingGallery, setUnboxingGallery] = useState([]);
  const [permission, setPermission] = useState([]);
  const [assignedPermissions, setAssignedPermissions] = useState([]);
  const modalRef = useRef();
  const [files, setFiles] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
    modalRef.current.showModal();
  };

  useScannerDetection({
    onComplete: (code) => {
      const scanned = String(code);
      setScannedCode(scanned);
      barcodeScannerOrder();
    },
    minLength: 3,
  });

  const closeModal = () => {
    setIsModalOpen(false);
    modalRef.current.close();
    setStatus('');
    setPackingGallery([]);
    setUnboxingGallery([]);
  };


  const handleFileChange = (e) => {
    const inputName = e.target.name; // get the input's name attribute
    const selectedFiles = Array.from(e.target.files); // array of File objects

    setFiles((prevFiles) => ({
      ...prevFiles,
      [inputName]: selectedFiles,
    }));
  };



  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
  });
  const [toDate, setToDate] = useState(new Date());

  const formatDate = (date) => date.toISOString().split("T")[0];
  console.log('formatDate', formatDate(fromDate), formatDate(toDate))


  const sendBarCodeOrder = async () => {
    const supplierData = JSON.parse(localStorage.getItem("shippingData"));

    if (!supplierData || supplierData?.project?.active_panel !== "supplier") {
      localStorage.removeItem("shippingData");
      router.push("/supplier/auth/login");
      return;
    }
    const form = new FormData();
    form.append('orderNumber', scannedCode);

    const suppliertoken = supplierData?.security?.token;
    if (!suppliertoken) {
      router.push("/supplier/auth/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://sleeping-owl-we0m.onrender.com/api/supplier/order/warehouse-collected`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: form,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          customClass: {
            container: 'custom-swal-zindex',
          },
          text:
            result.error ||
            result.message ||
            "Your session has expired. Please log in again.",
        });
        throw new Error(result.message || result.error);
      }

      if (result) {
        // Refresh the page
        window.location.reload();
      }

    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchRto = useCallback(async () => {
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
        `https://sleeping-owl-we0m.onrender.com/api/supplier/order/${activeTab}?from=${formatDate(
          fromDate
        )}&to=${formatDate(toDate)}`,
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
          title: "Something went wrong!",
          customClass: {
            container: 'custom-swal-zindex'
          },
          text:
            errorMessage.error ||
            errorMessage.message ||
            "Your session has expired. Please log in again.",
        },

        );
        throw new Error(errorMessage.message || errorMessage.error);
      }

      const result = await response.json();
      setOrders(result?.orders || []);
      setPermission(result?.permissions[0] || []);
      if (result?.staffPermissionApplied == true) {
        setAssignedPermissions(result?.assignedPermissions || []);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  }, [router, fromDate, toDate, activeTab]);

  useEffect(() => {
    if (typeof window !== 'undefined' && orders.length > 0 && !loading) {
      let table = null;

      Promise.all([
        import('jquery'),
        import('datatables.net'),
        import('datatables.net-dt'),
        import('datatables.net-buttons'),
        import('datatables.net-buttons-dt')
      ]).then(([jQuery]) => {
        window.jQuery = window.$ = jQuery.default;

        // Destroy existing DataTable if it exists
        if ($.fn.DataTable.isDataTable('#rtoOrderTable')) {
          $('#rtoOrderTable').DataTable().destroy();
          $('#rtoOrderTable').empty();
        }

        // Reinitialize DataTable with new data
        table = $('#rtoOrderTable').DataTable();

        return () => {
          if (table) {
            table.destroy();
            $('#rtoOrderTable').empty();
          }
        };
      }).catch((error) => {
        console.error('Failed to load DataTables dependencies:', error);
      });
    }
  }, [orders, loading]);
  const barcodeScannerOrder = useCallback(async () => {
    try {
      if (isBarCodePopupOpen && scannedCode) {
        const filteredOrders = orders.filter((order) => {
          return order.orderNumber === scannedCode;
        });
        setScannedCode('');
        setOrders(filteredOrders);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
      setIsBarCodePopupOpen(false)
    }
  }, [orders, scannedCode]);


  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7); // YYYY-MM
  });


  const handleSubmit = async (e, order, id) => {
    e.preventDefault();
    setLoading(true);

    const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));

    // Redirect if not supplier
    if (dropshipperData?.project?.active_panel !== "supplier") {
      localStorage.removeItem("shippingData");
      router.push("/supplier/auth/login");
      return;
    }

    const token = dropshipperData?.security?.token;
    if (!token) {
      router.push("/supplier/auth/login");
      return;
    }

    try {
      // Show loading dialog
      Swal.fire({
        title: 'Creating ...',
        text: 'Please wait while we save your data.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: 'custom-swal-zindex'
        }
      });

      closeModal();
      const formdata = new FormData();
      Object.entries(files).forEach(([key, fileArray]) => {
        fileArray.forEach((file) => {
          formdata.append(key, file, file.name);
        });
      });

      const url = `https://sleeping-owl-we0m.onrender.com/api/supplier/order/${order.id}/rto/${id}/response?status=${status}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formdata,
      });

      const result = await response.json();
      Swal.close();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: result.message || result.error || "An error occurred.",
          customClass: {
            container: 'custom-swal-zindex'
          },
        });

        if (result.error && typeof result.error === 'object') {
          const entries = Object.entries(result.error);
          let focused = false;

          entries.forEach(([key, message]) => {
            setValidationErrors((prev) => ({
              ...prev,
              [key]: message,
            }));

            if (!focused) {
              setTimeout(() => {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) input.focus();
              }, 300);
              focused = true;
            }
          });
        }

      } else {
        // Success
        setValidationErrors({});
        Swal.fire({
          icon: "success",
          title: "Created",
          showConfirmButton: true,
          customClass: {
            popup: 'custom-swal-zindex'
          }
        }).then((res) => {
          if (res.isConfirmed) {
            setFiles({});
            setShowModal(false);
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
        customClass: {
          popup: 'custom-swal-zindex'
        }
      });
      setError(error.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRto()
  }, [fetchRto]);
  let finalAllowedKeys = [];

  if (assignedPermissions && assignedPermissions.length > 0) {
    finalAllowedKeys = assignedPermissions
      .map(p => p.permission?.action)
      .filter(action => permission[action] === true);
  } else {
    finalAllowedKeys = Object.keys(permission).filter(key => permission[key] === true);
  }

  const hasAnyPermission = (...keys) => keys.some((key) => finalAllowedKeys.includes(key));



  const PermissionField = ({ permissionKey, children }) => {
    const isAllowed = finalAllowedKeys.includes(permissionKey);

    return (
      <span
        style={
          isAllowed
            ? {}
            : {
              filter: "blur(3px)",
              opacity: 0.5,
              userSelect: "none",
              pointerEvents: "none",
            }
        }
      >
        {isAllowed ? children : ' '}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <HashLoader color="orange" />
      </div>
    )
  }

  return (
    <div className='px-2 md:px-0'>
      <div className="flex gap-4 bg-white rounded-md p-4 mb-8 font-lato text-sm ">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`md:px-6 py-2 font-medium px-2  md:text-xl border-b-2 transition-all duration-200
                ${activeTab === tab.key
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-orange-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <>
        <div className='bg-white rounded-md p-3 mb-4'>
          <div className="grid justify-between grid-cols-2 items-center">
            <div className="">
              <div className="flex  items-end gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">From Date</label>
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    maxDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="border border-gray-200 rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">To Date</label>
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    maxDate={new Date()}
                    minDate={fromDate}
                    dateFormat="yyyy-MM-dd"
                    className="border border-gray-200 rounded px-3 py-2 w-full"
                  />
                </div>

              </div>


            </div>
            {activeTab === "warehouse-collected" && (
              <div className='flex justify-end' onClick={() => openBarCodeModal()}>
                <Image src={barcode} height={70} width={70} alt="Barcode Image" />
              </div>

            )}

          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl">
          <div className="flex flex-wrap justify-between items-center mb-4 lg:px-3">
            <h2 className="text-2xl font-bold  font-dm-sans">RTO Order Details</h2>
            <div className="flex gap-3  flex-wrap items-center">
              <span onClick={() => fetchRto()} className="font-bold   font-dm-sans">Clear Filters</span>
              <span><IoMdRefresh className="text-red-600 text-xl" /></span>
              <span><IoSettingsOutline className="text-xl" /></span>
              <span><FiDownloadCloud className="text-red-400 text-xl" /></span>

              <button className="bg-[#F4F7FE] rela px-4 py-2 text-sm rounded-lg flex items-center text-[#A3AED0]">


                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="outline-0 font-dm-sans"
                />
              </button>
              <button
                onClick={() => setIsPopupOpen((prev) => !prev)}
                className="bg-[#F4F7FE] p-2 rounded-lg relative"
              >
                <MoreHorizontal className="text-[#F98F5C]" />
                {isPopupOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                    <ul className="py-2 text-sm text-[#2B3674]">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Export CSV</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Bulk Delete</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                    </ul>
                  </div>
                )}
              </button>
            </div>
          </div>
          {orders.length > 0 ? (
            <div className="overflow-x-auto relative main-outer-wrapper w-full">
              <table className="min-w-full">
                <thead className="uppercase text-gray-700">
                  <tr className="border-b border-[#DFEAF2] text-left">
                    <th className="p-3 px-5 whitespace-nowrap">SR.</th>
                    <th className="p-3 px-5 whitespace-nowrap">+ n more products</th>
                    <th className="p-3 px-5 whitespace-nowrap">Order#</th>

                    {hasAnyPermission(
                      "shippingName",
                      "shippingPhone",
                      "shippingEmail"
                    ) && <th className="p-3 px-5 whitespace-nowrap">Customer Information</th>}

                    {hasAnyPermission(
                      "payment_mode",
                      "transactionId",
                      "amount",
                      "status"
                    ) && (
                        <th className="p-3 px-5 whitespace-nowrap">Payment</th>
                      )}
                    {hasAnyPermission(
                      "order_number",
                      "shippingPhone",
                      "shippingAddress",
                      "awb_number",
                    ) && <th className="p-3 px-5 whitespace-nowrap">Shipment Details</th>}

                    {hasAnyPermission("trackingNumber ") && (
                      <th className="p-3 px-5 whitespace-nowrap">Return Tracking #</th>
                    )}

                    {hasAnyPermission("rtoDelivered", "delivered") && (
                      <>
                        <th className="p-3 px-5 whitespace-nowrap">Status</th>
                      </>
                    )}
                    {hasAnyPermission("rtoDeliveredDate", "deliveredDate") && (
                      <>
                        <th className="p-3 px-5 whitespace-nowrap">Date</th>
                      </>
                    )}

                    <th className="p-3 px-5 whitespace-nowrap">Item Count</th>

                    {hasAnyPermission("totalAmount") && (
                      <th className="p-3 px-5 whitespace-nowrap">Total</th>
                    )}



                    <th className="px-4 py-2 text-center text-sm whitespace-nowrap font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y bg-white">
                  {orders.map((order, index) => {
                    const variant = order.items?.[0]?.dropshipperVariant?.supplierProductVariant?.variant;
                    const variantImages =
                      (variant?.image || '')
                        .split(',')
                        .filter((img) => img.trim() !== '');

                    return (
                      <tr key={order.id} className="border-b border-[#DFEAF2]">
                        <td className="p-3 px-5 whitespace-nowrap">{index + 1}</td>
                        <td className="p-3 px-5 whitespace-nowrap">
                          <div className='flex items-center gap-3'>
                            <div className="flex gap-2 flex-wrap">
                              {variantImages.map((imgUrl, imgIdx) => (
                                <img
                                  key={imgIdx}
                                  src={"https://placehold.co/400" || imgUrl.trim()}
                                  alt={`Variant ${imgIdx}`}
                                  className="h-12 w-12 object-cover rounded-full border border-[#DFEAF2]"
                                />
                              ))}
                            </div>
                            <div onClick={() => handleViewVariant(order, order.items)} className="mt-2 cursor-pointer text-sm text-gray-600">
                              +{order.items.length} more products
                            </div>
                          </div>
                        </td>
                        <td className="p-3 px-5 whitespace-nowrap">
                          <PermissionField permissionKey="orderNumber">{order.orderNumber}</PermissionField>
                          <span className="block">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</span>
                        </td>

                        {hasAnyPermission("shippingName", "shippingPhone", "shippingEmail") && (
                          <td className="p-3 px-5 whitespace-nowrap">
                            <PermissionField permissionKey="shippingName">{order.shippingName}</PermissionField>
                            <br />
                            <span className="text-sm block">
                              <PermissionField permissionKey="shippingPhone">{order.shippingPhone}</PermissionField>
                            </span>
                            <span className="text-sm text-[#01b574]">
                              <PermissionField permissionKey="shippingEmail">{order.shippingEmail}</PermissionField>
                            </span>
                          </td>
                        )}

                        {hasAnyPermission("payment_mode", "transactionId", "amount", "status") && (
                          <td className="p-3 px-5 whitespace-nowrap font-semibold">
                            <PermissionField permissionKey="payment_mode">
                              <p>Method: <span className="font-bold">{order.shippingApiResult?.data?.payment_mode || "N/A"}</span></p>
                            </PermissionField>
                            <PermissionField permissionKey="transactionId">
                              <p>Transaction Id: <span className="font-bold">{order.payment?.transactionId || "N/A"}</span></p>
                            </PermissionField>
                            <PermissionField permissionKey="amount">
                              <p>Amount: <span className="font-bold">{order.payment?.amount || "N/A"}</span></p>
                            </PermissionField>
                            <PermissionField permissionKey="status">
                              <p>
                                <span className={`font-bold ${order.payment?.status === "failed"
                                  ? "text-red-500"
                                  : order.payment?.status === "pending"
                                    ? "text-yellow-500"
                                    : "text-green-500"
                                  }`}>
                                  {order.payment?.status || "N/A"}
                                </span>
                              </p>
                            </PermissionField>
                          </td>
                        )}

                        {hasAnyPermission("orderNumber", "shippingPhone", "shippingAddress", "awbNumber") && (
                          <td className="p-3 px-5 whitespace-nowrap">
                            <PermissionField permissionKey="orderNumber">
                              {order.shippingApiResult?.data?.order_number || "N/A"}
                            </PermissionField>
                            <br />
                            <PermissionField permissionKey="shippingAddress">
                              {order.shippingAddress || "N/A"}
                            </PermissionField>
                            <br />
                            <span className="text-green-500">
                              <PermissionField permissionKey="shippingPhone">
                                {order.shippingPhone || "N/A"}
                              </PermissionField>
                            </span>
                            <br />
                            <PermissionField permissionKey="awbNumber">
                              {order.shippingApiResult?.data?.awb_number || "N/A"}
                            </PermissionField>
                          </td>
                        )}

                        {hasAnyPermission("trackingNumber") && (
                          <td className="p-3 px-5 whitespace-nowrap">
                            {order.items
                              .map((item) => (
                                <PermissionField key={item.id} permissionKey="trackingNumber">
                                  {item.supplierRTOResponse?.trackingNumber || "N/A"}
                                </PermissionField>
                              ))
                              .reduce((prev, curr) => [prev, ", ", curr])}
                          </td>
                        )}

                        {hasAnyPermission("rtoDelivered", "delivered") && (
                          <td className="p-3 px-5 whitespace-nowrap capitalize">
                            <PermissionField permissionKey="rtoDelivered">
                              {order.delivered ? (
                                <span className="text-green-600">Delivered</span>
                              ) : order.rtoDelivered ? (
                                <span className="text-orange-500">RTO Delivered</span>
                              ) : (
                                <span className="text-red-500">Pending</span>
                              )}
                            </PermissionField>
                          </td>
                        )}

                        {hasAnyPermission("rtoDeliveredDate", "deliveredDate") && (
                          <td className="p-3 px-5 whitespace-nowrap">
                            <PermissionField permissionKey="rtoDeliveredDate">
                              {order.deliveredDate ? (
                                <span>{new Date(order.deliveredDate).toLocaleDateString()}</span>
                              ) : order.rtoDeliveredDate ? (
                                <span>{new Date(order.rtoDeliveredDate).toLocaleDateString()}</span>
                              ) : (
                                <span className="text-red-500">Pending</span>
                              )}
                            </PermissionField>
                          </td>
                        )}

                        {/* Item Count */}
                        <td className="p-3 px-5 whitespace-nowrap">{order.items.length}</td>

                        {/* Total Amount */}
                        {hasAnyPermission("totalAmount") && (
                          <td className="p-3 px-5 whitespace-nowrap">
                            <PermissionField permissionKey="totalAmount">₹{order.totalAmount}</PermissionField>
                          </td>
                        )}

                        {/* Actions */}
                        <td className="px-4 py-2 text-sm whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewVariant(order, order.items)}
                            className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
                          >
                            View Variants
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-center'>No RTO Orders Available</p>
          )}


        </div>
      </>

      {/* {activeTab == "rto" && (
        <p> Live RTO Count</p>
      )
      }
      {activeTab == "need-to-raise" && (
        <p>Need To Raise</p>
      )
      }
      {activeTab == "dispute" && (
        <p>Dispute Orders</p>
      )
      } */}

      {showModal && selectedVariant && (

        <div className="fixed inset-0 flex items-center justify-center bg-[#000000ba] bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-3xl border-2 border-orange-500 p-6 rounded-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedVariant?.items?.map((item, idx) => {
                const variant = item.dropshipperVariant?.supplierProductVariant?.variant;
                if (!variant) return null;
                return (
                  <div key={idx}>
                    <div
                      key={idx}
                      className="border hover:border-orange-400 border-[#DFEAF2] p-4 rounded-md shadow-sm"
                    >
                      <div className="flex gap-2 mb-2 overflow-x-auto">
                        {(variant.image || '')
                          .split(',')
                          .filter((img) => img.trim() !== '')
                          .map((imgUrl, imgIdx) => (
                            <img
                              key={imgIdx}
                              src={`https://placehold.co/400` || imgUrl.trim()}
                              alt={`Variant ${idx}`}
                              className="h-24 w-24 object-cover rounded border border-[#DFEAF2]"
                            />
                          ))}
                      </div>
                      <p><strong>Name:</strong> {variant.name}</p>
                      <p><strong>Color:</strong> {variant.color}</p>
                      <p><strong>Model:</strong> {variant.modal}</p>
                      <p><strong>SKU:</strong> {variant.sku}</p>
                      <p><strong>Suggested Price:</strong> ₹{variant.suggested_price}</p>

                      {item?.supplierRTOResponse && Object.keys(item.supplierRTOResponse).length > 0 ? (
                        <button
                          className="px-4 mt-2 py-2 text-white bg-blue-600 rounded"
                          onClick={() => {
                            setSelectedDisputeItem(item); // Save clicked dispute item to state
                            modalRefNew.current?.showModal(); // Open dialog
                          }}
                        >
                          View Dispute
                        </button>

                      ) : (
                        selectedVariant?.rtoDelivered &&
                        (() => {
                          const rtoDate = new Date(selectedVariant.rtoDeliveredDate);
                          const now = new Date();
                          const diffInHours = (now - rtoDate) / (1000 * 60 * 60);

                          if (diffInHours <= 24) {
                            return (
                              <button
                                onClick={() => openModal()}
                                className="bg-orange-500 text-white p-2 mt-2 px-4 rounded-md"
                              >
                                Dispute
                              </button>
                            );
                          }
                          return null;
                        })()
                      )}





                    </div>
                    <dialog ref={modalRef} className="rounded-md w-full m-auto  max-w-md p-6 z-10">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Raise a Dispute</h2>
                        <button onClick={closeModal} className="text-gray-500 hover:text-black">✕</button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block font-medium mb-1">Status</label>
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value="">Select Status</option>
                            <option value="wrong item received">Wrong Item Received</option>
                            <option value="received">Delivered</option>
                            <option value="not received">Not Delivered</option>

                          </select>
                        </div>

                        {status === 'wrong item received' && (
                          <>
                            <div>
                              <label className="block font-medium mb-1">Packing Gallery (images/videos)</label>
                              <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                name='packingGallery'
                                onChange={handleFileChange}
                                className="w-full border rounded px-3 py-2"
                              />
                            </div>

                            <div>
                              <label className="block font-medium mb-1">Unboxing Gallery (images/videos)</label>
                              <input
                                type="file"
                                multiple
                                name='unboxingGallery'
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="w-full border rounded px-3 py-2"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <div className="mt-6 flex justify-end gap-2">
                        <button onClick={closeModal} className="px-4 py-2 border rounded">
                          Cancel
                        </button>
                        <button
                          onClick={(e) => handleSubmit(e, selectedVariant, variant.id)} className="px-4 py-2 bg-orange-500 text-white rounded"
                        >
                          Submit Dispute
                        </button>
                      </div>
                    </dialog>
                  </div>
                );
              })}
            </div>


          </div>
        </div>

      )}




      <dialog ref={modalRefNew} className="rounded-md w-full m-auto max-w-2xl p-6 z-50">
        {selectedDisputeItem && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">
                Dispute: {selectedDisputeItem?.supplierRTOResponse}
              </h2>
              <button onClick={() => modalRefNew.current?.close()} className="text-gray-500 hover:text-black">✕</button>
            </div>

            {/* Packing Gallery */}
            {selectedDisputeItem.packingGallery && (
              <div className="mb-6">
                <p className="text-lg font-semibold mb-2">Packing Gallery</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedDisputeItem.packingGallery.replace(/"/g, '').split(',').map((img, index) => (
                    <img
                      key={index}
                      src={`https://placehold.co/600x400?text=${index + 1}` || img.trim()}
                      alt={`Packing ${index}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Unboxing Gallery */}
            {selectedDisputeItem.unboxingGallery && (
              <div>
                <p className="text-lg font-semibold mb-2">Unboxing Gallery</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedDisputeItem.unboxingGallery.replace(/"/g, '').split(',').map((img, index) => (
                    <img
                      key={index}
                      src={`https://placehold.co/600x400?text=${index + 1}` || img.trim()}
                      alt={`Unboxing ${index}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </dialog>


      {isBarCodePopupOpen && (
        <div className="fixed inset-0 bg-[#00000038] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setIsBarCodePopupOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Scan Barcode</h2>
            <div>
              <p style={scannedCode ? styles.msgSuccess : styles.msgDefault}>{message}</p>
              <section style={styles.box}>
                <label style={styles.label}>Scanned Code:</label>
                <div style={styles.code}>{scannedCode || '___'}</div>
              </section>

            </div>

          </div>
        </div>
      )}

      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-[#00000038] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setIsNoteModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Order Notes</h2>
            <textarea
              className="w-full border p-2 rounded-xl mb-4"
              rows={4}
              placeholder="Add your note here..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Submit logic here
                  setIsNoteModalOpen(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
const styles = {
  container: {
    maxWidth: 480,
    margin: '4rem auto',
    padding: '2rem',
    borderRadius: 12,
    background: '#fff',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontFamily: "'Segoe UI', sans-serif",
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#0070f3',
  },
  msgDefault: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: '#555',
  },
  msgSuccess: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: '#28a745',
  },
  box: {
    border: '2px dashed #0070f3',
    padding: '1.5rem',
    borderRadius: '10px',
    background: '#f0f8ff',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#0070f3',
  },
  code: {
    marginTop: '10px',
    fontSize: '1.5rem',
    color: '#003a8c',
  },
};