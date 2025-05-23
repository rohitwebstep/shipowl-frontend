'use client';
import { FaCheck } from 'react-icons/fa';
import { useState, useCallback, useEffect } from 'react';
import { IoMdRefresh } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { FiDownloadCloud } from 'react-icons/fi';
import { MoreHorizontal } from 'lucide-react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useRouter } from 'next/navigation';
import { useSupplier } from '../middleware/SupplierMiddleWareContext';
import { HashLoader } from 'react-spinners';
import Swal from 'sweetalert2'; // ✅ added import
import { RiFileEditFill } from 'react-icons/ri';
import { IoCloudDownloadOutline } from 'react-icons/io5';
import { RxCrossCircled } from 'react-icons/rx';
import { IoIosArrowDropdown } from 'react-icons/io';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import InvoicePdf from './InvoicePdf';

export default function Orders() {
  const [filter, setFilter] = useState("Actual Ratio");
  const [tracking, setTracking] = useState([]);
  const [filters, setFilters] = useState({
    orderId: '',
    productName: '',
    productSKU: '',
    tag: '',
    articleId: '',
    searchQuery: '',
    status: 'All',
    model: 'Warehouse Model',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7); // YYYY-MM
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false); // Not used in this version
  const [selected, setSelected] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const { verifySupplierAuth } = useSupplier();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = () => {
    console.log(filters);
  };

  const handleReset = () => {
    setFilters({
      orderId: '',
      productName: '',
      productSKU: '',
      tag: '',
      articleId: '',
      searchQuery: '',
      status: 'All',
      model: 'Warehouse Model',
    });
  };

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
  };

  const handleCheckboxChange = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const fetchOrders = useCallback(async () => {
    const supplierData = JSON.parse(localStorage.getItem('shippingData'));

    if (supplierData?.project?.active_panel !== 'supplier') {
      localStorage.removeItem('shippingData');
      router.push('/supplier/auth/login');
      return;
    }

    const suppliertoken = supplierData?.security?.token;
    if (!suppliertoken) {
      router.push('/supplier/auth/login');
      return;
    }


    try {
      setLoading(true);
      const response = await fetch('https://sleeping-owl-we0m.onrender.com/api/order', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${suppliertoken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong!',
          text: errorMessage.error || errorMessage.message || 'Please try again.',
        });
        return;
      }

      const result = await response.json();
      setOrders(result?.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);
  const handleShipping = useCallback(async (id) => {
    const supplierData = JSON.parse(localStorage.getItem('shippingData'));

    if (supplierData?.project?.active_panel !== 'supplier') {
      localStorage.removeItem('shippingData');
      router.push('/supplier/auth/login');
      return;
    }

    const suppliertoken = supplierData?.security?.token;
    if (!suppliertoken) {
      router.push('/supplier/auth/login');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/order/${id}/shipping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${suppliertoken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.json();

        if (errorMessage.isHighRto === true) {
          Swal.fire({
            icon: 'warning',
            title: 'High RTO Risk',
            text: 'This order has a high Return-To-Origin (RTO) risk. Do you want to continue?',
            showCancelButton: true,
            confirmButtonText: 'Yes, proceed',
            cancelButtonText: 'Cancel',
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const confirmResponse = await fetch(`https://sleeping-owl-we0m.onrender.com/api/order/${id}/shipping/confirm`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${suppliertoken}`,
                  },
                });

                if (confirmResponse.ok) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Confirmed',
                    text: 'Shipping confirmed successfully.',
                  });

                  // Optional: refresh order data
                  const updated = await confirmResponse.json();
                } else {
                  const confirmError = await confirmResponse.json();
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: confirmError.message || 'Confirmation failed.',
                  });
                }
              } catch (error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error.message || 'Something went wrong during confirmation.',
                });
              }
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong!',
            text: errorMessage.error || errorMessage.message || 'Please try again.',
          });
        }

        return;
      }

      const result = await response.json();
      fetchOrders();
      ``
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);
  const handleCancel = useCallback(async (id) => {
    const supplierData = JSON.parse(localStorage.getItem('shippingData'));

    if (supplierData?.project?.active_panel !== 'supplier') {
      localStorage.removeItem('shippingData');
      router.push('/supplier/auth/login');
      return;
    }

    const suppliertoken = supplierData?.security?.token;
    if (!suppliertoken) {
      router.push('/supplier/auth/login');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/order/${id}/shipping/cancel`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${suppliertoken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.json();


        Swal.fire({
          icon: 'error',
          title: 'Something went wrong!',
          text: errorMessage.error || errorMessage.message || 'Please try again.',
        });

        return;
      }

      const result = await response.json();
      fetchOrders();
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleTracking = useCallback(async (id) => {
    const supplierData = JSON.parse(localStorage.getItem('shippingData'));

    if (supplierData?.project?.active_panel !== 'supplier') {
      localStorage.removeItem('shippingData');
      router.push('/supplier/auth/login');
      return;
    }

    const suppliertoken = supplierData?.security?.token;
    if (!suppliertoken) {
      router.push('/supplier/auth/login');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/order/${id}/shipping/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${suppliertoken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong!',
          text: errorMessage.error || errorMessage.message || 'Please try again.',
        });
        return;
      }

      const result = await response.json();
      setTracking(result?.data || null);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const closeModal = () => {
    setIsModalOpen(false);
    setTracking(null);
  };



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await verifySupplierAuth();
      await fetchOrders();
      setLoading(false);

    };
    fetchData();
  }, [verifySupplierAuth, fetchOrders]);

  const areFiltersEmpty = Object.entries(filters).every(([key, val]) => {
    // status is considered empty if it's 'All'
    // model is always ignored in the empty-check (always used)
    if (key === 'status') return val === 'All';
    if (key === 'model') return true;
    return val === '';
  });

  const filteredOrders = areFiltersEmpty
    ? orders
    : orders.filter(order => {
      const matchesOrderId = filters.orderId === '' || order.order_id?.toLowerCase().includes(filters.orderId.toLowerCase());
      const matchesProductName = filters.productName === '' || order.product_name?.toLowerCase().includes(filters.productName.toLowerCase());
      const matchesProductSKU = filters.productSKU === '' || order.product_sku?.toLowerCase().includes(filters.productSKU.toLowerCase());
      const matchesTag = filters.tag === '' || order.tag?.toLowerCase().includes(filters.tag.toLowerCase());
      const matchesArticleId = filters.articleId === '' || order.article_id?.toLowerCase().includes(filters.articleId.toLowerCase());
      const matchesSearchQuery = filters.searchQuery === '' || order.order_id?.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesStatus = filters.status === 'All' || order.status === filters.status;
      const matchesModel = filters.model === 'Warehouse Model' ? order.model === 'Warehouse Model' : true;

      return (
        matchesOrderId &&
        matchesProductName &&
        matchesProductSKU &&
        matchesTag &&
        matchesArticleId &&
        matchesSearchQuery &&
        matchesStatus &&
        matchesModel
      );
    });


  const pendingCount = orders.filter(order => order.status === 'pending').length;
  const deliveredCount = orders.filter(order => order.status === 'delivered').length;
  const lostCount = orders.filter(order => order.status === 'lost').length;
  const damagedCount = orders.filter(order => order.status === 'damage').length;


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
        if ($.fn.DataTable.isDataTable('#orderTable')) {
          $('#orderTable').DataTable().destroy();
          $('#orderTable').empty();
        }

        // Reinitialize DataTable with new data
        table = $('#orderTable').DataTable();

        return () => {
          if (table) {
            table.destroy();
            $('#orderTable').empty();
          }
        };
      }).catch((error) => {
        console.error('Failed to load DataTables dependencies:', error);
      });
    }
  }, [orders, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <HashLoader size={60} color="#F97316" loading />
      </div>
    );
  }

  // ✅ Continue your return(...) block from here — I suggest fixing your filter buttons and looping through `filteredOrders` if needed


  return (
    <div>
      <div className='bg-white p-4 rounded-xl mb-4'>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 px-3 md:px-0 gap-4 mb-4">
          {/* Date Picker */}
          <div className="relative">
            <label className="text-[#232323] mb-1 block">From Date:</label>
            <input
              readOnly
              onClick={() => setShowPicker(!showPicker)}
              value={`${format(range[0].startDate, 'MM/dd/yyyy')} - ${format(range[0].endDate, 'MM/dd/yyyy')}`}
              className="bg-white outline-0 text-[#718EBF] border border-[#DFEAF2] px-3 py-2 rounded-xl w-full cursor-pointer"
              placeholder="Select date range"
            />

            {showPicker && (
              <div className="absolute z-50 mt-2">
                <DateRange
                  editableDateInputs={true}
                  onChange={handleSelect}
                  moveRangeOnFirstSelection={false}
                  ranges={range}
                  className="shadow-xl"
                />
              </div>
            )}
          </div>

          {/* Other Filter Inputs */}
          {[
            { label: 'Order ID(s):', name: 'orderId', placeholder: 'Separated By Comma' },
            { label: 'Product Name', name: 'productName', placeholder: 'Name' },
            { label: 'Product SKU', name: 'productSKU', placeholder: 'SKU' },
            { label: 'Tag:', name: 'tag', placeholder: 'ALL' },
            { label: 'Article Id:', name: 'articleId', placeholder: 'ID' },
            { label: 'Search Query:', name: 'searchQuery', placeholder: 'Query' },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-[#232323] font-medium block">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={filters[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="bg-white border text-[#718EBF] border-[#DFEAF2] mt-2 w-full p-2 rounded-xl"
              />
            </div>
          ))}

          <div className="flex gap-2 items-end">
            <button onClick={handleApply} className="bg-blue-600 text-white px-6 py-3 rounded-md">
              Apply
            </button>
            <button onClick={handleReset} className="bg-red-500 text-white px-6 py-3 rounded-md">
              Reset
            </button>
          </div>
        </div>

        {/* Status and Model Filters */}
        <div className="flex flex-wrap gap-2 mb-4 items-end justify-normal">
          <div className="lg:w-[150px]">
            <label className="text-[#232323] font-medium block">Status:</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="bg-white border text-[#718EBF] border-[#DFEAF2] mt-2 w-full p-2 rounded-xl"
            >
              <option value="All">All</option>
              {/* Add other status options here */}
            </select>
          </div>

          <div className="lg:w-2/12">
            <label className="text-[#232323] font-medium block">Select Model</label>
            <select
              name="model"
              value={filters.model}
              onChange={handleChange}
              className="bg-white border text-[#718EBF] border-[#DFEAF2] mt-2 w-full p-2 rounded-xl"
            >
              <option value="Warehouse Model">Warehouse Model</option>
              {/* Add other models here */}
            </select>
          </div>
          <button className="bg-[#2B3674] text-white font-medium px-4 py-2 rounded-md text-sm">All Orders ({orders.length})</button>
          <InvoicePdf />
          <button className="bg-[#EE5D50] text-white font-medium px-4 py-2 rounded-md text-sm">Pending ({pendingCount})</button>
          <button className="bg-[#4C82FF] text-white font-medium px-4 py-2 rounded-md text-sm">Ready to Pickup (10)</button>
          <button className="bg-[#F98F5C] text-white font-medium px-4 py-2 rounded-md text-sm">In Transit (10)</button>
          <button className="bg-[#05CD99] text-white font-medium px-4 py-2 rounded-md text-sm">Delivered ({deliveredCount})</button>
          <button className="bg-[#FF6D60] text-white font-medium px-4 py-2 rounded-md text-sm">Lost ({lostCount})</button>
          <button className="bg-[#B71D21] text-white font-medium px-4 py-2 rounded-md text-sm">Damaged ({damagedCount})</button>
          <button className="bg-[#F98F5C] text-white font-medium px-4 py-2 rounded-md text-sm">Export</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h2 className="text-2xl font-bold  font-dm-sans text-[#2B3674]">Order Details</h2>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="font-bold  font-dm-sans">Clear Filters</span>
            <span><IoMdRefresh className="text-red-600 text-xl" /></span>
            <span><IoSettingsOutline className="text-xl" /></span>
            <span><FiDownloadCloud className="text-red-400 text-xl" /></span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#4318FF] font-dm-sans outline-0 text-white md:w-[150px] font-bold px-2 py-2 rounded-md"
            >
              <option value="Actual Ratio ">Bulk Action</option>
            </select>
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
            <button className="bg-[#F4F7FE] px-4 py-2 text-sm rounded-lg flex items-center text-[#A3AED0]">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="outline-0 font-dm-sans"
              />
            </button>

          </div>
        </div>
        {filteredOrders?.length > 0 ? (
          <div className="overflow-x-auto relative main-outer-wrapper w-full">
            <table className="md:w-full w-auto display main-tables" id="orderTable">
              <thead>
                <tr className="text-[#A3AED0] border-b border-[#E9EDF7]">
                  <th className="p-2 px-5 text-left uppercase">Order ID</th>
                  <th className="p-2 px-5 text-left uppercase">Product Info</th>
                  <th className="p-2 px-5 text-left uppercase">Payment Info</th>
                  <th className="p-2 px-5 text-left uppercase">Shipment Details</th>
                  <th className="p-2 px-5 text-left uppercase">Order Status</th>
                  <th className="p-2 px-5 text-left uppercase">Download Inovice</th>
                  <th className="p-2 px-5 text-center uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="text-[#364e91] font-semibold border-b border-[#E9EDF7] align-top">
                    <td className="p-2 whitespace-nowrap px-5">
                      <div className="flex items-start">
                        <label className="flex mt-2 items-center cursor-pointer me-2">
                          <input
                            type="checkbox"
                            checked={selected.includes(order.id)}
                            onChange={() => handleCheckboxChange(order.id)}
                            className="peer hidden"
                          />
                          <div className="w-4 h-4 border-2 border-[#A3AED0] rounded-sm flex items-center justify-center 
                     peer-checked:bg-[#F98F5C] peer-checked:border-0 peer-checked:text-white">
                            <FaCheck className="peer-checked:block text-white w-3 h-3" />
                          </div>
                        </label>
                        <div>
                          <b className="text-black truncate uppercase">{order.orderNumber}</b>
                          <br />
                          <span>
                            {typeof order.createdAt === "string" && order.createdAt
                              ? new Date(order.createdAt).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-2 whitespace-nowrap px-5">
                      {order.items?.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} className="mb-4 border-b pb-2">
                            <span className="block font-semibold text-gray-800">
                              {item.product?.name || 'N/A'}
                            </span>
                            <p className="text-sm text-gray-600 mb-1">
                              {item.product?.description || 'No description'}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Price:</span> ₹{item.price} &nbsp;
                              <span className="font-medium">Qty:</span> {item.quantity} &nbsp;
                              <span className="font-medium">Total:</span> ₹{item.total}
                            </p>
                          </div>
                        ))
                      ) : (
                        <span>No products</span>
                      )}
                    </td>


                    <td className="p-2 whitespace-nowrap px-5">
                      <span>Transaction Id: {order.payment.transactionId}</span>
                      <br />
                      <span className='block'>Amount: {order.payment.amount}</span>
                      <span
                        className={`px-2 py-1 rounded inline-block text-white text-sm capitalize ${order.payment.status === "success"
                          ? "bg-green-500"
                          : order.payment.status === "cancelled"
                            ? "bg-red-500"
                            : order.payment.status === "pending"
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-400"
                          }`}
                      >
                        {order.payment.status}
                      </span>
                    </td>
                    <td className="p-2 whitespace-nowrap px-5">
                      <span>{order.shippingName}</span>
                      <br />
                      <span className="text-[#05CD99]">{order.shippingPhone}</span>
                      <br />
                      <span>{order.shippingAddress}</span>
                      <br />
                      <span>{order.shippingZip}</span>
                    </td>

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
                            value={order?.orderNote}
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

                    <td className="p-2 whitespace-nowrap px-5">
                      <span
                        className={`px-2 py-1 rounded w-max  inline-block text-white text-sm capitalize  ${order.status === "success"
                          ? "bg-green-500"
                          : order.status === "cancelled"
                            ? "bg-red-500"
                            : order.status === "pending"
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-400"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <button className="bg-[#2B3674] text-white font-medium px-4 py-2 rounded-md text-sm">Generate Invoice</button>

                    <td className="p-2 whitespace-nowrap px-5">
                      <ul className="flex gap-6 justify-end ">
                        <li><RiFileEditFill className="text-black text-3xl" /></li>
                        <li><IoCloudDownloadOutline className="text-black text-3xl" /></li>
                        <li><RxCrossCircled className="text-black text-3xl" /></li>
                        <li><IoIosArrowDropdown className="text-black text-3xl" /></li>
                      </ul>
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => setIsNoteModalOpen(true)}
                          className="text-[#F98F5C] border rounded-md font-dm-sans p-2 w-auto mt-2 text-sm"
                        >
                          View / Add Notes
                        </button>

                        {!order.shippingApiResult?.data?.awb_number ? (
                          <button
                            className="bg-orange-500 text-white font-medium px-4 py-2 rounded-md text-sm"
                            onClick={() => handleShipping(order.id)}
                          >
                            Shipping
                          </button>
                        ) : order.shippingApiResult?.data?.awb_number ? (
                          <>
                            <button
                              className="bg-blue-600 text-white font-medium px-4 py-2 rounded-md text-sm mr-2"
                              onClick={() => handleTracking(order.id)}
                            >
                              Tracking
                            </button>
                            <button
                              className="bg-[#B71D21] text-white font-medium px-4 py-2 rounded-md text-sm"
                              onClick={() => handleCancel(order.id)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : null}

                      </div>

                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        ) : (
          <p className='text-center'>No Orders Available</p>
        )}


      </div>
      {isModalOpen && tracking?.trackingData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg p-6 relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tracking Details</h2>

            <div className="mb-4">
              <p><span className="font-medium">AWB Number:</span> {tracking.awb_number}</p>
              <p><span className="font-medium">Current Status:</span> {tracking.trackingData.current_status?.status_title}</p>
              <p><span className="font-medium">Description:</span> {tracking.trackingData.current_status?.status_description}</p>
              <p><span className="font-medium">Updated At:</span> {tracking.trackingData.current_status?.event_date}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Tracking History</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="border px-4 py-2 text-left">Status</th>
                      <th className="border px-4 py-2 text-left">Description</th>
                      <th className="border px-4 py-2 text-left">Location</th>
                      <th className="border px-4 py-2 text-left">Code</th>
                      <th className="border px-4 py-2 text-left">Event Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tracking.trackingData.data?.map((event, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{event.status_title}</td>
                        <td className="px-4 py-2">{event.status_description}</td>
                        <td className="px-4 py-2">{event.status_location || "—"}</td>
                        <td className="px-4 py-2">{event.status_code || "—"}</td>
                        <td className="px-4 py-2">{event.event_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}


    </div>


  );
}
