'use client';

import Image from 'next/image';
import productImage from '@/app/images/product-img.png';
import { useRouter } from 'next/navigation';
import { useSupplier } from '../middleware/SupplierMiddleWareContext';
import { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import { HashLoader } from 'react-spinners';

export default function NotMy() {
  const { verifySupplierAuth } = useSupplier();
  const [productsRequest, setProductsRequest] = useState([]);
  const [loading, setLoading] = useState(null);
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [inventoryData, setInventoryData] = useState({
    productId: "",
    variant: [],
    id: '',
    isVarientExists: '',
  });
  const handleVariantChange = (id, field, value) => {
    setInventoryData((prevData) => ({
      ...prevData,
      variant: prevData.variant.map((v) =>
        v.id === id ? { ...v, [field]: field === 'qty' || field === 'shipowl_price' ? Number(value) : value } : v
      ),
    }));
  };
  const fetchProducts = useCallback(async () => {
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
      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/supplier/product/inventory?type=notmy`, {
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
          title: "Something Went Wrong!",
          text:
            errorMessage.error ||
            errorMessage.message ||
            "Your session has expired. Please log in again.",
        });
        throw new Error(errorMessage.message || errorMessage.error || "Something Went Wrong!");
      }

      const result = await response.json();
      if (result) {
        setProductsRequest(result?.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await verifySupplierAuth();
      await fetchProducts();
      setLoading(false);

    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <HashLoader size={60} color="#F97316" loading={true} />
      </div>
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
    if (dropshipperData?.project?.active_panel !== "supplier") {
      localStorage.clear("shippingData");
      router.push("/supplier/auth/login");
      return;
    }

    const token = dropshipperData?.security?.token;
    if (!token) {
      router.push("/supplier/auth/login");
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
      const simplifiedVariants = inventoryData.variant.map((v) => ({
        variantId: v.id || v.variantId,
        stock: v.stock,
        price: v.price,
        status: v.status
      }));

      form.append('productId', inventoryData.productId);
      form.append('variants', JSON.stringify(simplifiedVariants));



      const url = "https://sleeping-owl-we0m.onrender.com/api/supplier/product/my-inventory";

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
          title: isEdit ? "Updation Failed" : "Creation Failed",
          text: result.message || result.error || "An error occurred",
        });
        Swal.close();
        return;
      }

      // On success
      Swal.fire({
        icon: "success",
        title: "Product Created",
        text: "The Product has been created successfully!",
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          setInventoryData({
            productId: "",
            variant: [],
            id: '',
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
      Swal.close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {productsRequest.length > 0 ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {productsRequest.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#B9B9B9]"
              >
                <Image
                  src={product.image || productImage}
                  alt={product.name || "Product"}
                  width={400}
                  height={300}
                  className="w-full object-cover"
                />
                <div className="mt-3 p-3">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-lg font-semibold nunito">{product.name}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-black font-bold nunito">
                        ₹
                        {product.variants.length === 1
                          ? product.variants[0]?.suggested_price || 0
                          : Math.min(
                            ...product.variants.map(
                              (v) => v?.suggested_price ?? Infinity
                            )
                          )}
                      </p>

                      {/* <p className="text-sm text-[#202224] nunito">Exp. Orders: {product.expectedDailyOrders || 0}</p> */}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowPopup(true),
                        setInventoryData({
                          productId: product.id,
                          variant: product.variants,
                          id: product.id,
                          isVarientExists: product.isVarientExists,
                        })
                    }} className="mt-2 w-full bg-blue-500 nunito text-white px-4 py-2 rounded font-semibold">
                    Add to list
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No Products Found</p>
        )}
      </div>
       {showPopup && (
        <div className="fixed inset-0 bg-[#00000087] bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg border-orange-500 w-full border max-w-5xl shadow-xl relative">
            <h2 className="text-xl font-semibold mb-6">Add to Inventory</h2>

            {(() => {
              const varinatExists = inventoryData?.isVarientExists ? "yes" : "no";
              const isExists = varinatExists === "yes";

              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-1">
                    {inventoryData.variant?.map((variant, idx) => {
                      const imageUrls = variant.image
                        ? variant.image.split(",").map((img) => img.trim()).filter(Boolean)
                        : [];

                      return (
                        <div
                          key={variant.id || idx}
                          className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col space-y-3"
                        >
                          <div className='flex gap-2'>
                            {/* Image Preview */}
                            <div className="md:min-w-4/12 h-20 rounded-lg flex items-center justify-center overflow-hidden">
                              {imageUrls.length > 0 ? (
                                <img
                                  src={`https://placehold.co/600x400?text=${idx + 1}`}
                                  alt={variant.name || "Variant Image"}
                                  className="h-full object-cover"
                                />
                              ) : (
                                <img
                                  src="https://placehold.co/600x400"
                                  alt="Placeholder"
                                  className="h-full object-cover"
                                />
                              )}
                            </div>

                            <div className="text-sm md:w-8/12 text-gray-700 space-y-1">
                              <p><span className="font-semibold">Modal:</span> {variant.modal || "NIL"}</p>
                              {isExists && (
                                <>
                                  <p><span className="font-semibold">Name:</span> {variant.name || "NIL"}</p>
                                  <p><span className="font-semibold">SKU:</span> {variant.sku || "NIL"}</p>
                                  <p><span className="font-semibold">Color:</span> {variant.color || "NIL"}</p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Input Fields */}
                          <div className="flex flex-col space-y-2">
                            <input
                              type="number"
                              placeholder="Stock"
                              name="stock"
                              className="border border-gray-300 shadow rounded px-3 py-2 text-sm"
                              value={variant.stock || ""}
                              onChange={(e) =>
                                handleVariantChange(variant.id, "stock", e.target.value)
                              }
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              name="price"
                              className="border border-gray-300 shadow rounded px-3 py-2 text-sm"
                              value={variant.price || ""}
                              onChange={(e) =>
                                handleVariantChange(variant.id, "price", e.target.value)
                              }
                            />
                          </div>

                          {/* Status Switch */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-medium">Status:</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={variant.status || false}
                                onChange={(e) =>
                                  handleVariantChange(variant.id, "status", e.target.checked)
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-orange-500 transition-all"></div>
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transform transition-all"></div>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowPopup(false)}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
                    >
                      <span>Cancel</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleSubmit(e)}
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
                    >
                      <span>Submit</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowPopup(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
                  >
                    ×
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
