'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight
} from "react-icons/md";
import { RiFileEditFill } from "react-icons/ri";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoMdRefresh } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { FiDownloadCloud } from "react-icons/fi";
import { MoreHorizontal } from "lucide-react";
import { FaCheck } from 'react-icons/fa';

export default function RTO() {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleViewVariant = (item, variant) => {
    console.log('item', item)
    setSelectedVariant(item);
    setShowModal(true);
  };
  const [selectedDisputeItem, setSelectedDisputeItem] = useState(null);
  const modalRefNew = useRef(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [packingGallery, setPackingGallery] = useState([]);
  const [unboxingGallery, setUnboxingGallery] = useState([]);
  const modalRef = useRef();
  const [files, setFiles] = useState([]);
  const openModal = () => {
    setIsModalOpen(true);
    modalRef.current.showModal();
  };

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


  console.log('files', files)

  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
  });

  const [toDate, setToDate] = useState(new Date());

  const formatDate = (date) => date.toISOString().split("T")[0];

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
        `https://sleeping-owl-we0m.onrender.com/api/supplier/order?from=${formatDate(
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
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  }, [router, fromDate, toDate]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [filter, setFilter] = useState("Actual Ratio");
  const totalPages = Math.ceil(orders.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = orders.slice(indexOfFirst, indexOfLast);

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
  }, [fetchRto])


  return (
    <div className='px-2 md:px-0'>
      <div className='bg-white rounded-md p-3 mb-4'>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 mb-4">
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

          <div> <label className='text-[#232323] font-medium block'>Order ID(s):</label>  <input type="text" placeholder="Separated By Comma" className="bg-white border text-[#718EBF] border-[#DFEAF2] mt-0 w-full p-2 rounded-xl" /></div>
          <div> <label className='text-[#232323] font-medium block'>Product Name</label>  <input type="text" placeholder="Name" className="bg-white border text-[#718EBF] border-[#DFEAF2] mt-0 w-full p-2 rounded-xl" /></div>
          <div> <label className='text-[#232323] font-medium block'>Product SKU</label>  <input type="text" placeholder="SKU" className="bg-white border text-[#718EBF] border-[#DFEAF2] mt-0 w-full p-2 rounded-xl" /></div>
          <div> <label className='text-[#232323] font-medium block'>Tag:</label>  <input type="text" placeholder="ALL" className="bg-white border text-[#718EBF] border-[#DFEAF2] mt-0 w-full p-2 rounded-xl" /></div>
          <div> <label className='text-[#232323] font-medium block'>Article Id:</label>  <input type="text" placeholder="ID" className="bg-white border text-[#718EBF] border-[#DFEAF2] mt-0 w-full p-2 rounded-xl" /></div>
          <div> <label className='text-[#232323] font-medium block'>Search Query:</label>  <input type="text" placeholder="Query" className="bg-white border text-[#718EBF] border-[#DFEAF2] mt-0 w-full p-2 rounded-xl" /></div>
          <div className="flex gap-2 items-end">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">Apply</button>
            <button className="bg-red-500 text-white px-6 py-2 rounded-md">Reset</button>
          </div>
        </div>

        <div className='lg:flex gap-4 mb-5 items-center justify-between'>


          <div className="grid md:grid-cols-3 gap-3 lg:w-8/12 grid-cols-1 items-end justify-between">
            <div>
              <label className='text-[#232323] font-medium block'>Status:</label>
              <select type="text" className=" bg-white border text-[#718EBF]  border-[#DFEAF2]  mt-2 w-full p-2 rounded-xl">
                <option value="All">All</option>
              </select>
            </div>
            <div > <label className='text-[#232323] font-medium block'>Select Model</label>
              <select type="text" className="bg-white border text-[#718EBF] border-[#DFEAF2] mt-0 w-full p-2 rounded-xl">
                <option value="Warehouse Model">Warehouse Model</option>
              </select>
            </div>
            <div > <label className='text-[#232323] font-medium block'>Select Dropshipper</label>
              <select type="text" className=" bg-white border text-[#718EBF]  border-[#DFEAF2]  mt-2 w-full p-2 rounded-xl">
                <option value="John Doe (john@gmail.com)">John Doe (john@gmail.com)</option>
              </select>
            </div>
          </div>
          <div className='lg:w-4/12 mt-3 lg:mt-0 flex justify-end gap-3'>
            <button className="bg-[#4C82FF] text-white font-medium px-6 py-2 rounded-md text-sm">Filter</button>
            <button className="bg-[#F98F5C] text-white font-medium px-6 py-2 rounded-md text-sm">Export</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl">
        <div className="flex flex-wrap justify-between items-center mb-4 lg:px-3">
          <h2 className="text-2xl font-bold  font-dm-sans">RTO Order Details</h2>
          <div className="flex gap-3  flex-wrap items-center">
            <span className="font-bold   font-dm-sans">Clear Filters</span>
            <span><IoMdRefresh className="text-red-600 text-xl" /></span>
            <span><IoSettingsOutline className="text-xl" /></span>
            <span><FiDownloadCloud className="text-red-400 text-xl" /></span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#4318FF] font-dm-sans outline-0 text-white md:w-[120px] font-medium  px-2 py-2 rounded-md"
            >
              <option value="Actual Ratio ">Bulk Action</option>
            </select>
            <button className="bg-[#F4F7FE] rela px-4 py-2 text-sm rounded-lg flex items-center text-[#A3AED0]">

              {/* Month Input */}
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
        <div className="overflow-x-auto">

          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="text-[#A3AED0] uppercase text-left  border-b border-[#E9EDF7]">
                <th className="p-3 px-5 whitespace-nowrap">Order #</th>
                <th className="p-3 px-5 whitespace-nowrap">Customer</th>
                <th className="p-3 px-5 whitespace-nowrap">Payment</th>
                <th className="p-3 px-5 whitespace-nowrap">Shipment Details</th>
                <th className="p-3 px-5 whitespace-nowrap">Return Tracking #</th>
                <th className="p-3 px-5 whitespace-nowrap">Return Status</th>
                <th className="p-3 px-5 whitespace-nowrap">Return Date</th>
                <th className="p-3 px-5 whitespace-nowrap">Item Count</th>
                <th className="p-3 px-5 whitespace-nowrap">Total</th>
                <th className="p-3 px-5 whitespace-nowrap">Delivered</th>
                <th className="p-3 px-5 whitespace-nowrap">Date</th>
                <th className="p-3 px-5 whitespace-nowrap">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b capitalize align-top text-[#304174] font-semibold border-[#E9EDF7]">
                  <td className="p-3 px-5 whitespace-nowrap">{order.orderNumber}
                    <span className='block'> {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}</span>
                  </td>
                  <td className="p-3 px-5 whitespace-nowrap">
                    {order.shippingName}
                    <br />
                    <span className="text-sm block">{order.shippingPhone}</span>
                    <span className="text-sm text-[#01b574]">{order.shippingEmail}</span>
                  </td>

                  <td className="p-3 px-5 whitespace-nowrap font-semibold">
                    <p>Method:<span className=' font-bold'>{order.shippingApiResult?.data?.payment_mode || "N/A"}</span></p>
                    <p>Transaction Id:<span className=' font-bold'>{order.payment?.transactionId || "N/A"}</span></p>
                    <p>Amount :<span className=' font-bold'>{order.payment?.amount || "N/A"}</span></p>
                    <p>
                      Status:
                      <span
                        className={`font-bold ${order.payment?.status === "failed"
                          ? "text-red-500"
                          : order.payment?.status === "pending"
                            ? "text-yellow-500"
                            : "text-green-500"
                          }`}
                      >
                        {order.payment?.status || "N/A"}
                      </span>
                    </p>
                  </td>

                  <td className="p-3 px-5 whitespace-nowrap">
                    {order.shippingApiResult?.data?.order_number || "N/A"}
                    <br />
                    {order.shippingAddress || "N/A"}
                    <br />
                    <span className='text-green-500'> {order.shippingPhone || "N/A"}</span>
                    <br />
                    AWB: {order.shippingApiResult?.data?.awb_number || "N/A"}
                  </td>
                  <td className="p-3 px-5 whitespace-nowrap">
                    {order.items
                      .map((item) => item.supplierRTOResponse?.trackingNumber || "N/A")
                      .join(", ")}
                  </td>
                  <td className="p-3 px-5 whitespace-nowrap">
                    {order.rtoDelivered ? (
                      <span className="text-green-600">Delivered</span>
                    ) : (
                      <span className="text-red-500">Pending</span>
                    )}
                  </td>
                  <td className="p-3 px-5 whitespace-nowrap">
                    {order.rtoDeliveredDate
                      ? new Date(order.rtoDeliveredDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3 px-5 whitespace-nowrap">{order.items.length}</td>
                  <td className="p-3 px-5 whitespace-nowrap">₹{order.totalAmount}</td>
                  <td className="p-3 px-5 whitespace-nowrap">
                    {order.delivered ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-500 font-medium">No</span>
                    )}
                  </td>
                  <td className="p-3 px-5 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 px-5 whitespace-nowrap">
                    <button
                      onClick={() =>
                        handleViewVariant(order, order.items)
                      }
                      className="bg-orange-500 rounded-md p-3 text-white text-sm"
                    >
                      View Variant
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>



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
                                  src={imgUrl.trim()}
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
                              className="px-4 py-2 text-white bg-blue-600 rounded"
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
        </div>
        <div className="flex flex-wrap lg:justify-end justify-center items-center mt-4 p-4 pt-0">
          <div className="flex gap-1 items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border-[#2B3674] flex gap-1 items-center  rounded mx-1 disabled:opacity-50"
            >
              <MdKeyboardArrowLeft /> Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 hidden md:block py-1 border-[#2B3674]  rounded mx-1 ${currentPage === index + 1 ? "bg-[#2B3674] text-white" : ""}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border-[#2B3674] flex gap-1 items-center  rounded mx-1 disabled:opacity-50"
            >
              Next <MdKeyboardArrowRight />
            </button>
          </div>

          {/* Per Page Selection */}
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border-[#2B3674] bg-[#F8FBFF]  rounded px-3 py-2 font-semibold"
          >
            {[5, 10, 15].map((num) => (
              <option key={num} value={num}>
                {num} /Per Page
              </option>
            ))}
          </select>
        </div>
      </div>
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
                      src={img.trim()}
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
                      src={img.trim()}
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
