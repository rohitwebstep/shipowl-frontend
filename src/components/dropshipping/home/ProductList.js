'use client';

import Image from 'next/image';
import productimg from '@/app/assets/product1.png';
import { useRouter } from 'next/navigation';
import { useDropshipper } from '../middleware/DropshipperMiddleWareContext';
import { useEffect, useState, useCallback } from 'react';
import { HashLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import coupen from '@/app/assets/coupen.png';
import gift from '@/app/assets/gift.png';
import ship from '@/app/assets/delivery.png';
import { IoIosArrowForward } from 'react-icons/io';

const ProductList = () => {
  const { verifyDropShipperAuth } = useDropshipper();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(null);
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [inventoryData, setInventoryData] = useState({
    supplierProductId: "",
    status: "",
    stock: "",
    price: "",
  });
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setInventoryData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const fetchProducts = useCallback(async () => {
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
        `http://localhost:3001/api/dropshipper/product/my-inventory?type=all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${dropshippertoken}`,
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
        setProducts(result?.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [router, setProducts]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await verifyDropShipperAuth();
      await fetchProducts();
      setLoading(false);
    };
    fetchData();
  }, []);
  const handleSubmit = async (e, id) => {
    e.preventDefault();
    setLoading(true);

    const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
    if (dropshipperData?.project?.active_panel !== "dropshipper") {
      localStorage.clear("shippingData");
      router.push("/dropshipping/auth/login");
      return;
    }

    const token = dropshipperData?.security?.token;
    if (!token) {
      router.push("/dropshipping/auth/login");
      return;
    }

    try {
      Swal.fire({
        title: 'Creating Product...',
        text: 'Please wait while we save your Product.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const form = new FormData();
      form.append('supplierProductId', inventoryData.supplierProductId);
      form.append('stock', inventoryData.stock);
      form.append('price', inventoryData.price);
      form.append('status', inventoryData.status);

      const url = "http://localhost:3001/api/dropshipper/product/my-inventory";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await response.json();

      Swal.close();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: result.message || result.error || "An error occurred",
        });
        return;
      }

      // On success
      Swal.fire({
        icon: "success",
        title: "Product Created",
        text: result.message || `The Product has been created successfully!`,
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          setInventoryData({
            supplierProductId: "",
            stock: "",
            price: "",
            status: "",
          });
          setShowPopup(false);
          fetchProducts();
        }
      });

    } catch (error) {
      console.error("Error:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
   if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <HashLoader size={60} color="#F97316" loading={true} />
            </div>
        );
    }


  return (
    <section className="lg:p-6">
      <div className="container">
        <div className='xl:flex gap-3'>
          <div className="md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:w-[87%] justify-center gap-4">
            <div className="">
              <label className="block text-sm font-medium text-[#777980] mb-1 public-sans">Search Product</label>
              <input
                type="text"
                placeholder="Search"
                className="w-full p-[11px] border  border-[#E0E2E7] text-[#858D9D] rounded-md bg-white focus:outline-none public-sans "
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-[#777980] mb-1 public-sans">Product Category</label>
              <select className="w-full p-3 border border-[#E0E2E7] text-[#858D9D] rounded-md bg-white focus:outline-none public-sans ">
                <option>Select...</option>
              </select>
            </div>
            <div className="">
              <label className="block text-sm font-medium text-[#777980] mb-1 public-sans">Select Price Range</label>
              <select className="w-full p-3 border border-[#E0E2E7] text-[#858D9D] rounded-md bg-white focus:outline-none public-sans ">
                <option>Select...</option>
              </select>
            </div>
            <div className="">
              <label className="block text-sm font-medium text-[#777980] mb-1 public-sans">Sold Units</label>
              <select className="w-full p-3 border border-[#E0E2E7] text-[#858D9D] rounded-md bg-white focus:outline-none public-sans ">
                <option>Select...</option>
              </select>
            </div>
            <div className="">
              <label className="block text-sm font-medium text-[#777980] mb-1 public-sans">Delivery Rate</label>
              <select className="w-full p-3 border border-[#E0E2E7] text-[#858D9D] rounded-md bg-white focus:outline-none public-sans ">
                <option>Select...</option>
              </select>
            </div>
          </div>


          <div className="xl:w-[13%]  mt-3 lg:mt-0  flex items-end justify-end">
            <button className="w-full bg-[#1D1F2C]  text-white p-3  px-2 rounded-md hover:bg-gray-800 public-sans lg:w-auto">Search Product</button>
          </div>
        </div>

        <div className="flex justify-between items-center my-4">
          <h2 className="md:text-3xl text-lg font-lato font-semibold text-[#F98F5C]">Newly Launched <span className='text-sm text-gray-500'>(100 Products)</span></h2>
        </div>
        <div className="md:w-[350px] border-b-3 border-[#F98F5C] mb-4"></div>
        <div className="products-grid grid xl:grid-cols-5 lg:grid-cols-4  gap-4  xl:gap-10 lg:gap-4">

          {products.map((product, index) => {
            const variant = product?.product?.variants?.[0];
            const imageUrl = variant?.image?.split(",")?.[0]?.trim() || "/default-image.png";
            const productName = product?.product?.name || "NIL";
            const price = variant?.shipowl_price ?? "N/A";

            return (
              <div key={index} className="bg-white rounded-xl cursor-pointer shadow-sm relative">
                <Image
                  src={productimg || imageUrl}
                  alt={productName}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <div className="p-3 mb:pb-0">
                  <div className="flex justify-between">
                    <p className="text-lg font-extrabold font-lato">₹{price}</p>
                    <div className="coupen-box flex gap-2 items-center">
                      <Image src={coupen} className="w-5" alt="Coupon" />
                      <span className="text-[#249B3E] font-lato font-bold text-[12px]">WELCOME10</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#ADADAD] font-lato font-semibold">{productName}</p>

                  <div className="flex items-center border-t pt-2 mt-5 border-[#EDEDED] justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Image src={gift} className="w-5" alt="Gift" />
                      <span className="font-lato text-[#2C3454] font-bold">100-10k</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image src={ship} className="w-5" alt="Shipping" />
                      <span className="font-lato text-[#2C3454] font-bold">4.5</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowPopup(true);
                      setInventoryData({
                        supplierProductId: product.id,
                        status: "",
                        stock: "",
                        price: "",
                      });
                    }}
                    className="py-2 px-4 text-white rounded-md text-sm w-full mt-3 bg-[#2B3674]"
                  >
                    Add To Inventory
                  </button>

                  {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Add to Inventory</h2>
                        <div className="space-y-3">
                          <input
                            type="number"
                            placeholder="Stock"
                            name="stock"
                            className="w-full border rounded p-2"
                            value={inventoryData.stock}
                            onChange={handleChange}
                          />
                          <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            className="w-full border rounded p-2"
                            value={inventoryData.price}
                            onChange={handleChange}
                          />
                          <div>
                            <label className="flex mt-2 items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="status"
                                className="sr-only"
                                checked={inventoryData.status || false}
                                onChange={handleChange}
                              />
                              <div className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${inventoryData.status ? "bg-orange-500" : ""}`}>
                                <div className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${inventoryData.status ? "translate-x-5" : ""}`}></div>
                              </div>
                              <span className="ms-2 text-sm text-gray-600">Status</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                          <button
                            onClick={() => setShowPopup(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => handleSubmit(e, product.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
