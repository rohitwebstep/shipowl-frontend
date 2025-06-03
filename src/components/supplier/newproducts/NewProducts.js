'use client';

import Image from 'next/image';
import productImage from '@/app/images/product-img.png';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupplier } from '../middleware/SupplierMiddleWareContext';
import { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import { HashLoader } from 'react-spinners';

export default function NewProducts() {
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
          title: "Creation Failed",
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
        <div className="bg-white rounded-md p-4 flex flex-wrap md:justify-end justify-center gap-3 mb-6">
          <button className="bg-[#05CD99] text-white lg:px-8 p-4 py-2 rounded-md">Export</button>
          <button className="bg-[#3965FF] text-white lg:px-8 p-4 py-2 rounded-md">Import</button>
          <Link href="https://sleeping-owl-we0m.onrender.com/dropshipping/product/source/create">
            <button className="bg-[#F98F5C] text-white lg:px-8 p-4 py-2 rounded-md">
              Add New
            </button>
          </Link>
        </div>

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
                        ₹ {
                          product.variants.length === 1
                            ? product.variants[0]?.suggested_price || 0
                            : Math.min(
                              ...product.variants
                                .map(v => v?.suggested_price || v?.variant?.suggested_price || v?.supplierProductVariant?.variant?.suggested_price || 0)
                            )
                        }
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-5xl shadow-xl relative">
            <h2 className="text-xl font-semibold mb-4">Variant Details</h2>

            {(() => {
              const varinatExists = inventoryData?.isVarientExists ? 'yes' : 'no';
              const isExists = varinatExists === "yes";
              return (
                <>
                  <table className="min-w-full table-auto border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Image</th>
                        <th className="border px-4 py-2">Modal</th>
                        {isExists && (
                          <>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">SKU</th>
                            <th className="border px-4 py-2">Color</th>
                          </>
                        )}
                        <th className="border px-4 py-2">Stock</th>
                        <th className="border px-4 py-2">Price</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2 whitespace-nowrap">Suggested Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryData.variant?.map((variant, idx) => {
                        const imageUrls = variant.image
                          ? variant.image.split(',').map((img) => img.trim()).filter(Boolean)
                          : [];
                        return (
                          <tr key={variant.id || idx}>
                            <td className="border px-4 py-2">
                              <div className="flex space-x-2 overflow-x-auto max-w-[200px]">
                                {imageUrls.length > 0 ? (
                                  imageUrls.map((url, i) => (
                                    <Image
                                      key={i}
                                      height={40}
                                      width={40}
                                      src={url}
                                      alt={variant.name || 'NIL'}
                                      className="shrink-0 rounded"
                                    />
                                  ))
                                ) : (
                                  <Image
                                    height={40}
                                    width={40}
                                    src="https://placehold.co/400"
                                    alt="Placeholder"
                                    className="shrink-0 rounded"
                                  />
                                )}
                              </div>
                            </td>
                            <td className="border px-4 py-2">{variant.modal || 'NIL'}</td>
                            {isExists && (
                              <>
                                <td className="border px-4 py-2">{variant.name || 'NIL'}</td>
                                <td className="border px-4 py-2">{variant.sku || 'NIL'}</td>
                                <td className="border px-4 py-2">{variant.color || 'NIL'}</td>
                              </>
                            )}
                            <td className="border px-4 py-2">
                              <input
                                type="number"
                                placeholder="Stock"
                                name="stock"
                                className="w-full border rounded p-2"
                                value={variant.stock || ''}
                                onChange={(e) =>
                                  handleVariantChange(variant.id, "stock", e.target.value)
                                }
                              />
                            </td>
                            <td className="border px-4 py-2">
                              <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                className="w-full border rounded p-2"
                                value={variant.price || ''}
                                onChange={(e) =>
                                  handleVariantChange(variant.id, "price", e.target.value)
                                }
                              />
                            </td>
                            <td className="border px-4 py-2">
                              <label className="flex mt-2 items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  name="status"
                                  className="sr-only"
                                  checked={variant.status || false}
                                  onChange={(e) =>
                                    handleVariantChange(variant.id, "status", e.target.checked)
                                  }
                                />
                                <div
                                  className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${variant.status ? "bg-orange-500" : ""
                                    }`}
                                >
                                  <div
                                    className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${variant.status ? "translate-x-5" : ""
                                      }`}
                                  ></div>
                                </div>
                              </label>
                            </td>
                            <td className="border px-4 py-2">{variant.lowestOtherSupplierSuggestedPrice ? variant.lowestOtherSupplierSuggestedPrice : variant.suggested_price ?? 'NIL'}</td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowPopup(false);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => handleSubmit(e)}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Submit
                    </button>
                  </div>
                </>
              );
            })()}

            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
