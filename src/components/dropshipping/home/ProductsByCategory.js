'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { HashLoader } from 'react-spinners';
import productimg from '@/app/assets/product1.png';
import gift from '@/app/assets/gift.png';
import ship from '@/app/assets/delivery.png';
const tabs = [
  { key: "my", label: "Pushed to Shopify" },
  { key: "notmy", label: "Not Pushed to Shopify" },
];
import { X, Send } from "lucide-react"; // Lucide icons
function ProductsByCategory() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const router = useRouter();
  const [type, setType] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('my');
  const [shopifyStores, setShopifyStores] = useState([]);

  const [inventoryData, setInventoryData] = useState({
    supplierProductId: "",
    id: '',
    variant: [],
    isVarientExists: '',
    shopifyApp: '',
  });

  const handleVariantChange = (id, field, value) => {
    // If field is global (e.g., shopifyApp), update it at root level
    if (id == null) {
      setInventoryData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
      return;
    }

    // Otherwise, update specific variant
    setInventoryData((prevData) => ({
      ...prevData,
      variant: prevData.variant.map((v) =>
        v.id === id
          ? {
            ...v,
            [field]: ['qty', 'shipowl_price', 'dropStock', 'dropPrice'].includes(field)
              ? Number(value)
              : value,
          }
          : v
      ),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dropshipperData = JSON.parse(localStorage.getItem("shippingData"));
    if (dropshipperData?.project?.active_panel !== "dropshipper") {
      localStorage.clear("shippingData");
      router.push("/dropshipper/auth/login");
      return;
    }

    const token = dropshipperData?.security?.token;
    if (!token) {
      router.push("/dropshipper/auth/login");
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
        stock: v.dropStock,
        price: v.dropPrice,
        status: v.Dropstatus
      }));

      form.append('supplierProductId', inventoryData.supplierProductId);
      form.append('shopifyApp', inventoryData.shopifyApp);
      form.append('variants', JSON.stringify(simplifiedVariants));



      const url = "https://sleeping-owl-we0m.onrender.com/api/dropshipper/product/my-inventory";

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
        text: result.message || "The Product has been created successfully!",
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          setInventoryData({
            productId: "",
            variant: [],
            id: '',
            shopifyApp: ''
          });
          setShowPopup(false);
          fetchProduct('my');
          setActiveTab('my');
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

  const handleEdit = async (item) => {

  };

  const fetchProduct = useCallback(async (tab) => {
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
      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/dropshipper/product/inventory?category=${id}&type=${tab}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dropshippertoken}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Something Wrong!",
          text: result.error || result.message || "Your session has expired. Please log in again.",
        });
        throw new Error(result.message || result.error || "Something Wrong!");
      }

      setProducts(result?.products || []);
      setShopifyStores(result?.shopifyStores || []);
      if (result?.products.length > 0) {
        setCategory(result?.products[0].product?.category?.name || '');
        setType(result?.type || '');
      }

    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchProduct(activeTab);
  }, [fetchProduct, activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <HashLoader size={60} color="#F97316" loading={true} />
      </div>
    );
  }
  return (
    <> <>
      <div className="flex gap-4 bg-white rounded-md p-4 mb-8 font-lato text-sm ">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-2 font-medium text-xl border-b-2 transition-all duration-200
                ${activeTab === tab.key
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-orange-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {products.length > 0 ? (
        <>
          <div className='mt-5'>
            <h2 className='text-4xl font-bold'>{category}</h2>

          </div>
          <div className="products-grid  grid xl:grid-cols-5 lg:grid-cols-3 gap-4 xl:gap-6 lg:gap-4 mt-4">


            {products.map((product, index) => {
              const variant = product?.product?.variants?.[0];
              const imageUrl = variant?.image?.split(",")?.[0]?.trim() || "/default-image.png";
              const productName = product?.product?.name || "NIL";

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl group  overflow-hidden  cursor-pointer shadow-sm relative transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="relative h-[200px] perspective">
                    <div className="relative  overflow-hidden  w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180">
                      {/* FRONT */}
                      <Image
                        src={productimg}
                        alt={productName}
                        height={200}
                        width={100}
                        className="w-full h-full object-cover backface-hidden"
                      />
                      {/* BACK (optional or just black layer) */}
                      <div className="absolute inset-0 bg-black bg-opacity-40 text-white flex items-center justify-center rotate-y-180 backface-hidden">
                        <span className="text-sm">Back View</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex justify-between">
                      <p className="text-black font-bold nunito">
                        ₹
                        {product.variants.length === 1
                          ? product.variants[0]?.price ||
                          product.variants[0]?.supplierProductVariant?.price ||
                          0
                          : Math.min(
                            ...product.variants.map(
                              (v) =>
                                v?.price ??
                                v?.supplierProductVariant?.price ??
                                Infinity
                            )
                          )}
                      </p>

                    </div>
                    <p className="text-[12px] text-[#ADADAD] font-lato font-semibold">
                      {productName}
                    </p>

                    <div className="flex items-center border-t pt-2 group-hover:pb-15 mt-5 border-[#EDEDED] justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Image src={gift} className="w-5" alt="Gift" />
                        <span className="font-lato text-[#2C3454] font-bold">100-10k</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Image src={ship} className="w-5" alt="Shipping" />
                        <span className="font-lato text-[#2C3454] font-bold">4.5</span>
                      </div>
                    </div>
                    <div
                      className="absolute bottom-0  left-0 w-full p-3 bg-white z-10 opacity-0 translate-y-4
                      group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300
                      pointer-events-none group-hover:pointer-events-auto shadow border overflow-hidden border-gray-100"
                    >
                      {activeTab === "notmy" && (
                        <button
                          onClick={() => {
                            setShowPopup(true);
                            setInventoryData({
                              supplierProductId: product.id,
                              id: product.id,
                              variant: product.variants,
                              isVarientExists: product?.product?.isVarientExists,
                              shopifyApp: '',
                            });
                          }}
                          className="py-2 px-4 text-white rounded-md text-sm w-full mt-3 bg-[#2B3674] hover:bg-[#1f285a] transition-colors duration-200"
                        >
                          Push To Shopify
                        </button>
                      )}
                      {activeTab === "my" && (
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="py-2 px-4 mt-2 text-white rounded-md text-sm w-full  bg-black transition-colors duration-200"
                        >
                          Edit From Shopify
                        </button>
                      )}

                    </div>


                  </div>
                </div>
              );
            })}


          </div>
          {showPopup && (
            <div className="fixed inset-0 bg-[#000000b0] bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white border border-orange-500 p-6 rounded-lg w-full max-w-5xl shadow-xl relative">
                <h2 className="text-xl font-semibold mb-4">Push To Shopify</h2>

                {(() => {
                  const varinatExists = inventoryData?.isVarientExists ? 'yes' : 'no';
                  const isExists = varinatExists === "yes";
                  return (
                    <>
                      <div className="mb-2">
                        <select
                          className="w-full mt-1 border border-[#E0E2E7] shadow p-2 rounded-md"
                          name="shopifyApp"
                          id="shopifyApp"
                          onChange={(e) =>
                            handleVariantChange(null, 'shopifyApp', e.target.value)
                          }
                          value={inventoryData.shopifyApp || ''}
                        >
                          <option value="">Select Store</option>
                          {shopifyStores.map((item, index) => (
                            <option value={item.id} key={index}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {inventoryData.variant?.map((v, idx) => {
                          const variantInfo = {
                            ...(v.variant || {}),
                            ...v,
                          };

                          const imageUrls = variantInfo.image
                            ? variantInfo.image.split(',').map((img) => img.trim()).filter(Boolean)
                            : [];

                          return (
                            <div
                              key={variantInfo.id || idx}
                              className="relative bg-white border border-[#E0E2E7] shadow rounded-lg p-4  hover:shadow-lg transition group"
                            >
                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex gap-2 overflow-x-auto max-w-[120px]">
                                  {imageUrls.length > 0 ? (
                                    imageUrls.map((url, i) => (
                                      <Image
                                        key={i}
                                        height={100}
                                        width={100}
                                        src={`https://placehold.co/600x400?text=${idx + 1}`}
                                        alt={variantInfo.name || 'NIL'}
                                        className="shrink-0 border border-[#E0E2E7] shadow "
                                      />
                                    ))
                                  ) : (
                                    <Image
                                      height={40}
                                      width={40}
                                      src="https://placehold.co/600x400"
                                      alt="Placeholder"
                                      className="rounded shrink-0"
                                    />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold">Model: {variantInfo.modal || 'NIL'}</p>
                                  {isExists && (
                                    <>
                                      <p>Name: {variantInfo.name || 'NIL'}</p>
                                      <p>SKU: {variantInfo.sku || 'NIL'}</p>
                                      <p>Color: {variantInfo.color || 'NIL'}</p>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-3">
                                <input
                                  type="number"
                                  placeholder="Stock"
                                  name="dropStock"
                                  className="w-full border border-[#E0E2E7] shadow rounded p-2"
                                  value={variantInfo.dropStock || ''}
                                  onChange={(e) => handleVariantChange(variantInfo.id, 'dropStock', e.target.value)}
                                />
                                <input
                                  type="number"
                                  placeholder="Price"
                                  name="dropPrice"
                                  className="w-full border border-[#E0E2E7] shadow rounded p-2"
                                  value={variantInfo.dropPrice || ''}
                                  onChange={(e) => handleVariantChange(variantInfo.id, 'dropPrice', e.target.value)}
                                />

                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    name="Dropstatus"
                                    className="sr-only"
                                    checked={!!variantInfo.Dropstatus}
                                    onChange={(e) => handleVariantChange(variantInfo.id, 'Dropstatus', e.target.checked)}
                                  />
                                  <div
                                    className={`relative w-10 h-5 rounded-full transition ${variantInfo.Dropstatus ? 'bg-orange-500' : 'bg-gray-300'}`}
                                  >
                                    <div
                                      className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition ${variantInfo.Dropstatus ? 'translate-x-5' : ''
                                        }`}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm">{variantInfo.Dropstatus ? 'Active' : 'Inactive'}</span>
                                </label>
                              </div>



                            </div>
                          );
                        })}
                      </div>




                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          onClick={() => setShowPopup(false)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                        >
                          <X size={16} />
                          Cancel
                        </button>

                        <button
                          onClick={handleSubmit}
                          className="flex items-center gap-2 px-4 py-2 bg-[#F98F5C] text-white rounded hover:bg-[#e97b45] transition-colors"
                        >
                          <Send size={16} />
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
      ) : (
        <p className='text-center text-2xl'>No Product Found in This category</p>
      )}

    </>

    </>
  )
}

export default ProductsByCategory
