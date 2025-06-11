'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { IoIosArrowForward } from 'react-icons/io';
import { HashLoader } from 'react-spinners';
import productimg from '@/app/assets/product1.png';
import gift from '@/app/assets/gift.png';
import ship from '@/app/assets/delivery.png';
import { X, Send } from "lucide-react"; // Lucide icons
import CategorySection from './CatogorySection'

const tabs = [
  { key: "my", label: "Pushed to Shopify" },
  { key: "notmy", label: "Not Pushed to Shopify" },
];

const NewlyLaunched = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [shopifyStores, setShopifyStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('my');
  const [type, setType] = useState(false);

  const fetchProduct = useCallback(async (type) => {
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
      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/dropshipper/product/inventory?type=${type}`, {
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
      setType(result?.type || '');
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProduct(activeTab);
  }, [fetchProduct, activeTab]);


  const trashProducts = useCallback(async () => {
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
      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/dropshipper/product/my-inventory/trashed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dropshippertoken}`,
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
        setProducts(result?.products || []);
      }
    } catch (error) {
      console.error("Error fetching trashed categories:", error);
    } finally {
      setLoading(false);
    }
  }, [router, setProducts]);

  const viewProduct = (id, type) => {
    if (type == "notmy") {
      router.push(`/dropshipping/product/?id=${id}&type=${type}`);
    } else {

      router.push(`/dropshipping/product/?id=${id}`);
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
    <>
      <CategorySection />
      <section className="xl:p-6 pt-6">
        <div className="container">
          {/* Tabs shared for both sections */}
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


          {/* Show No Data Found once if no products */}
          {!loading && products.length === 0 ? (
            <p className="text-center">No Data Found</p>
          ) : (
            <>
              {/* Newly Launched Section */}
              <Section
                title="Newly Launched"
                products={products}
                type={type}
                shopifyStores={shopifyStores}
                viewProduct={viewProduct}
                activeTab={activeTab}
                trashProducts={trashProducts}
                fetchProduct={fetchProduct}
                setActiveTab={setActiveTab}
              />

              {/* Potential Heros Section */}
              <Section
                title="Potential Heros"
                products={products}
                viewProduct={viewProduct}
                activeTab={activeTab}
                type={type}
                shopifyStores={shopifyStores}
                trashProducts={trashProducts}
                fetchProduct={fetchProduct}
                setActiveTab={setActiveTab}

              />
            </>
          )}
        </div>
      </section>
    </>
  );
};

const Section = ({ title, products, shopifyStores, setActiveTab, fetchProduct, activeTab }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVariantPopup, setShowVariantPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const viewProduct = (id, type) => {
    if (type == "notmy") {
      router.push(`/dropshipping/product/?id=${id}&type=${type}`);
    } else {

      router.push(`/dropshipping/product/?id=${id}`);
    }
  };
  const router = useRouter();
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


  return (
    <>

      <div className="flex justify-between items-center mb-4 mt-6">

        <h2 className="md:text-[24px] text-lg text-[#F98F5C] font-lato font-bold">{title}</h2>
        <Link href="/dropshipping/product-list" className="text-[16px] text-[#222222] hover:text-orange-500 flex items-center gap-2 font-lato">
          View All <IoIosArrowForward className='text-[#F98F5C]' />
        </Link>
      </div>
      <div className="md:w-[293px] border-b-3 border-[#F98F5C] mt-1 mb-4"></div>


      <div className="products-grid pb-5 md:pb-0  grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 gap-4 xl:gap-6 lg:gap-4 mt-4">
        <div className="grid bg-[#212B36] rounded-xl shadow-xl overflow-hidden cursor-default">
          <Image src={productimg} alt={`Best of ${title}`} className={`w-full  object-cover ${activeTab == "notmy" ? "md:max-h-[250px] h-[200px]" : "md:max-h-[230px] h-[200px]"}`} />
          <div className="bg-[#212B36] bg-opacity-50 p-4 px-2 text-center text-white">
            <p className="text-[16px] font-semibold font-lato">Best of {title}</p>
            <p className="text-[15px] text-[#F98F5C] font-lato">{products.length} Products</p>
          </div>
        </div>

        {products.map((product, index) => {

          const productName = product?.product?.name || "NIL";

          return (
            <div
              key={index}
              tabIndex={0} // Allows focus via tap on mobile
              className="bg-white focus-within:z-10 rounded-xl group overflow-hidden cursor-pointer shadow-sm relative transition-transform duration-300 hover:shadow-lg hover:scale-[1.02] outline-none"
            >
              {/* FLIP CARD */}
              <div  onClick={() => viewProduct(product.id)}  className="relative z-50  md:h-[200px] h-[150px] perspective">
                <div className="relative overflow-hidden w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180">
                  {/* FRONT */}
                  <Image
                    src={productimg}
                    alt={productName}
                    height={200}
                    width={100}
                    className="w-full h-full object-cover backface-hidden"
                    
                  />
                  {/* BACK */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 text-white flex items-center justify-center rotate-y-180 backface-hidden">
                    <span className="text-sm">Back View</span>
                  </div>
                </div>
              </div>

              {/* PRODUCT DETAILS */}
              <div className="p-3 group-hover:pb-24 mb-4 relative z-0 bg-white">
                <div className="flex justify-between items-center">
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

                {/* INFO FOOTER */}
                <div className="mt-3 pt-2 border-t border-[#EDEDED] flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Image src={gift || "/icons/gift.svg"} className="w-5 h-5" alt="Gift" />
                    <span className="font-lato text-[#2C3454] font-bold">100-10k</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image src={ship || "/icons/ship.svg"} className="w-5 h-5" alt="Shipping" />
                    <span className="font-lato text-[#2C3454] font-bold">4.5</span>
                  </div>
                </div>
              </div>

              {/* INVISIBLE FOCUS HELPER (for mobile) */}
              <button className="absolute top-0 left-0 w-full h-full opacity-0 z-0" tabIndex={-1} />

              {/* SLIDE-IN ACTION PANEL */}
              <div
                className="absolute bottom-0 left-0 w-full p-3 bg-white z-10 border border-gray-100 shadow
               opacity-0 translate-y-4 pointer-events-none
               group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
               focus-within:opacity-100 focus-within:translate-y-0 focus-within:pointer-events-auto
               group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto
               transition-all duration-300"
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
                        shopifyApp: "",
                      });
                    }}
                    className="w-full py-2 px-4 md:text-sm  text-xs text-white rounded-md  bg-[#2B3674] hover:bg-[#1f285a] transition-colors duration-200"
                  >
                    Push To Shopify
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowVariantPopup(true);
                  }}
                  className="w-full mt-2 py-2 px-4 text-white rounded-md md:text-sm  text-xs bg-[#3965FF] hover:bg-[#2b50d6] transition-colors duration-200"
                >
                  View Variants
                </button>

                {activeTab === "my" && (
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="w-full py-2 px-4 mt-2 text-white rounded-md md:text-sm  text-xs  bg-black hover:bg-gray-800 transition-colors duration-200"
                  >
                    Edit From Shopify
                  </button>
                )}
              </div>
            </div>


          );
        })}


      </div>
      {showPopup && (
        <div className="fixed px-6 md:px-0 inset-0 bg-[#000000b0] bg-opacity-40 flex items-center justify-center z-50">
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


      {showVariantPopup && selectedProduct && (
        <div className="fixed  px-6 md:px-0  inset-0 bg-[#000000b0] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white border border-orange-500 p-6 rounded-lg w-full max-w-4xl shadow-xl relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Variant Details</h2>
              <button
                onClick={() => setShowVariantPopup(false)}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-1">
              {selectedProduct.variants?.map((v, idx) => {
                let variant = {};
                if (activeTab === "notmy") {
                  variant = { ...(v.variant || {}), ...v };
                }
                if (activeTab === "my") {
                  const supplierProductVariant = v?.supplierProductVariant || {};
                  variant = {
                    ...(supplierProductVariant.variant || {}),
                    ...v
                  };
                }

                const imageUrls = variant.image
                  ? variant.image.split(",").map((img) => img.trim()).filter(Boolean)
                  : [];

                const isExists = selectedProduct?.product?.isVarientExists;

                return (
                  <div
                    key={variant.id || idx}
                    className="bg-white hover:border-orange-500 p-4 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                      {imageUrls.length > 0 ? (
                        <img
                          src={`https://placehold.co/600x400?text=${idx + 1}`}
                          alt={`variant-img-${idx}`}
                          className="h-full w-full object-cover p-3 rounded-md"
                        />
                      ) : (
                        <span className="text-gray-400  text-xl font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Text Info */}
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><span className="font-semibold">Modal:</span> {variant.modal || "—"}</p>
                      <p><span className="font-semibold">Suggested Price:</span> {v.price || v?.supplierProductVariant?.price || "—"}</p>

                      {isExists && (
                        <>
                          <p><span className="font-semibold">Name:</span> {variant.name || "—"}</p>
                          <p><span className="font-semibold">SKU:</span> {variant.sku || "—"}</p>
                          <p><span className="font-semibold">Color:</span> {variant.color || "—"}</p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default NewlyLaunched;
