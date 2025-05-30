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
const tabs = [
  { key: "my", label: "Pushed to Shopify" },
  { key: "notmy", label: "Not Pushed to Shopify" },
];

const NewlyLaunched = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('my');
  const [isTrashed, setIsTrashed] = useState(false);
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
    <section className="xl:p-6 pt-6">
      <div className="container">
        {/* Tabs shared for both sections */}
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
              viewProduct={viewProduct}
              activeTab={activeTab}
              trashProducts={trashProducts}
              fetchProduct={fetchProduct}
              isTrashed={isTrashed}
              setActiveTab={setActiveTab}
            />

            {/* Potential Heros Section */}
            <Section
              title="Potential Heros"
              products={products}
              viewProduct={viewProduct}
              activeTab={activeTab}
              type={type}
              trashProducts={trashProducts}
              fetchProduct={fetchProduct}
              isTrashed={isTrashed}
              setActiveTab={setActiveTab}

            />
          </>
        )}
      </div>
    </section>
  );
};

const Section = ({ title, products, type, isTrashed, setActiveTab, trashProducts, fetchProduct, activeTab }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVariantPopup, setShowVariantPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const viewProduct = (id, type) => {
    if (type == "notmy") {
      router.push(`/dropshipping/product/?id=${id}&type=${type}`);
    }
    else {
      router.push(`/dropshipping/product/?id=${id}`);
    }
  };
  const router = useRouter();
  const [inventoryData, setInventoryData] = useState({
    supplierProductId: "",
    id: '',
    variant: [],
    isVarientExists: '',
  });
  const handleVariantChange = (id, field, value) => {
    setInventoryData((prevData) => ({
      ...prevData,
      variant: prevData.variant.map((v) =>
        v.id === id
          ? {
            ...v,
            [field]: ['qty', 'shipowl_price', 'dropStock'].includes(field)
              ? Number(value)
              : value,
          }
          : v
      ),
    }));
  };

  const [isEdit, setIsEdit] = useState(false);

  const handleEdit = async (item, id) => {
    setIsEdit(true);
    const supplierData = JSON.parse(localStorage.getItem("shippingData"));

    if (supplierData?.project?.active_panel !== "dropshipper") {
      localStorage.removeItem("shippingData");
      router.push("/dropshipper/auth/login");
      return;
    }

    const suppliertoken = supplierData?.security?.token;
    if (!suppliertoken) {
      router.push("/dropshipper/auth/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://sleeping-owl-we0m.onrender.com/api/dropshipper/product/my-inventory/${item.id}`,
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
          title: "Something Wrong!",
          text: errorMessage.message || "Your session has expired. Please log in again.",
        });
        throw new Error(errorMessage.message);
      }

      const result = await response.json();
      const items = result?.dropshipperProduct || {};
      setInventoryData({
        supplierProductId: items.productId || "",
        isVarientExists: items.product?.isVarientExists || "",
        id: id, // or items.product?.id if you prefer
        variant: (items.variants || []).map((v) => ({
          variantId: v.id,
          dropStock: v.stock,
          dropPrice: v.price,
          Dropstatus: v.status,
          image: v.supplierProductVariant?.variant?.image || '',
          name: v.supplierProductVariant?.variant?.name || '',
          modal: v.supplierProductVariant?.variant?.modal || '',
          color: v.supplierProductVariant?.variant?.color || '',
          status: v.supplierProductVariant?.variant?.status ?? v.status,
        }))
      });

      setShowPopup(true);

    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setLoading(false);
    }

  }

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
      form.append('variants', JSON.stringify(simplifiedVariants));



      const url = isEdit ? `https://sleeping-owl-we0m.onrender.com/api/dropshipper/product/my-inventory/${inventoryData.id}` : "https://sleeping-owl-we0m.onrender.com/api/dropshipper/product/my-inventory";

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : "POST",
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
        return;
      }

      // On success
      Swal.fire({
        icon: "success",
        title: isEdit ? "Product Updated" : "Product Created",
        text: isEdit
          ? result.message || "The Product has been updated successfully!"
          : result.message || "The Product has been created successfully!",
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          setInventoryData({
            productId: "",
            variant: [],
            id: '',
          });
          setShowPopup(false);
          fetchProduct('my');
          setActiveTab('my');
          setIsEdit(false);
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


  const handlePermanentDelete = async (item) => {
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

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      setLoading(true);

      const response = await fetch(
        `https://sleeping-owl-we0m.onrender.com/api/dropshipper/product/my-inventory/${item}/destroy`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${dropshippertoken}`,
          },
        }
      );

      Swal.close();

      if (!response.ok) {
        const errorMessage = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage.error || errorMessage.message || "Failed to delete.",
        });
        setLoading(false);
        return;
      }

      const result = await response.json();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: result.message || `${item.name} has been deleted successfully.`,
      });

      await fetchProduct('my');
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
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


      <div className="products-grid  grid xl:grid-cols-5 lg:grid-cols-3 gap-4 xl:gap-6 lg:gap-4 mt-4">
        <div className="grid bg-[#212B36] rounded-xl shadow-xl overflow-hidden cursor-default">
          <Image src={productimg} alt={`Best of ${title}`} className={`w-full  object-cover ${activeTab == "notmy" ? "max-h-[300px]" : "max-h-[270px]"}`} />
          <div className="bg-[#212B36] bg-opacity-50 p-4 px-2 text-center text-white">
            <p className="text-[16px] font-semibold font-lato">Best of {title}</p>
            <p className="text-[15px] text-[#F98F5C] font-lato">{products.length} Products</p>
          </div>
        </div>

        {products.map((product, index) => {
          const variant = product?.product?.variants?.[0];
          const imageUrl = variant?.image?.split(",")?.[0]?.trim() || "/default-image.png";
          const productName = product?.product?.name || "NIL";

          return (
            <div
              key={index}
              className="bg-white rounded-xl cursor-pointer shadow-sm relative transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="overflow-hidden rounded-t-xl">
                <Image
                  src={productimg || imageUrl}
                  alt={productName}
                  onClick={() => viewProduct(product.id, type)}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg transform transition-transform duration-300 hover:scale-105"
                />
              </div>

              {activeTab === "my" && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button
                    onClick={() => handleEdit(product, product.id)}
                    className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600 transition-colors duration-200"
                  >
                    Edit
                  </button>
                </div>
              )}

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

                {activeTab === "notmy" && (
                  <button
                    onClick={() => {
                      setShowPopup(true);
                      setInventoryData({
                        supplierProductId: product.id,
                        id: product.id,
                        variant: product.variants,
                        isVarientExists: product?.product?.isVarientExists,
                      });
                    }}
                    className="py-2 px-4 text-white rounded-md text-sm w-full mt-3 bg-[#2B3674] hover:bg-[#1f285a] transition-colors duration-200"
                  >
                    Push To Shopify
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowVariantPopup(true);
                  }}
                  className="py-2 px-4 text-white rounded-md text-sm w-full mt-3 bg-[#3965FF] hover:bg-[#2b50d6] transition-colors duration-200"
                >
                  View Variants
                </button>
                {activeTab === "my" && (
                  <button
                    onClick={() => handlePermanentDelete(product.id)}
                    className="py-2 px-4 mt-2 text-white rounded-md text-sm w-full  bg-black transition-colors duration-200"
                  >
                    Remove From Shopify
                  </button>
                )}
              </div>
            </div>
          );
        })}


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
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryData.variant?.map((v, idx) => {
                        const variantInfo = {
                          ...(v.variant || {}), // nested variant data (name, sku, image, etc.)
                          ...v, // direct data (dropStock, dropPrice, Dropstatus, etc.)
                        };
                        const variantInfos = v;

                        const imageUrls = variantInfo.image
                          ? variantInfo.image.split(',').map((img) => img.trim()).filter(Boolean)
                          : [];

                        return (
                          <tr key={variantInfo.id || idx}>
                            <td className="border px-4 py-2">
                              <div className="flex space-x-2 overflow-x-auto max-w-[200px]">
                                {imageUrls.length > 0 ? (
                                  imageUrls.map((url, i) => (
                                    <Image
                                      key={i}
                                      height={40}
                                      width={40}
                                      src={`https://placehold.co/600x400?text=${idx + 1}`}
                                      alt={variantInfo.name || 'NIL'}
                                      className="shrink-0 rounded"
                                    />
                                  ))
                                ) : (
                                  <Image
                                    height={40}
                                    width={40}
                                    src='https://placehold.co/600x400'
                                    alt="Placeholder"
                                    className="shrink-0 rounded"
                                  />
                                )}
                              </div>
                            </td>

                            <td className="border px-4 py-2">{variantInfo.modal || 'NIL'}</td>

                            {isExists && (
                              <>
                                <td className="border px-4 py-2">{variantInfo.name || 'NIL'}</td>
                                <td className="border px-4 py-2">{variantInfo.sku || 'NIL'}</td>
                                <td className="border px-4 py-2">{variantInfo.color || 'NIL'}</td>
                              </>
                            )}

                            <td className="border px-4 py-2">
                              <input
                                type="number"
                                placeholder="dropStock"
                                name="dropStock"
                                className="w-full border rounded p-2"
                                value={variantInfo.dropStock || ''}
                                onChange={(e) => handleVariantChange(variantInfo.id, 'dropStock', e.target.value)}
                              />
                            </td>

                            <td className="border px-4 py-2">
                              <input
                                type="number"
                                name="dropPrice"
                                placeholder="dropPrice"
                                className="w-full border rounded p-2"
                                value={variantInfo.dropPrice || ''}
                                onChange={(e) => handleVariantChange(variantInfo.id, 'dropPrice', e.target.value)}
                              />
                            </td>

                            <td className="border px-4 py-2">
                              <label className="flex mt-2 items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  name="Dropstatus"
                                  className="sr-only"
                                  checked={variantInfo.Dropstatus || false}
                                  onChange={(e) => handleVariantChange(variantInfo.id, 'Dropstatus', e.target.checked)}
                                />
                                <div
                                  className={`relative w-10 h-5 bg-gray-300 rounded-full transition ${variantInfo.Dropstatus ? 'bg-orange-500' : ''
                                    }`}
                                >
                                  <div
                                    className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition ${variantInfo.Dropstatus ? 'translate-x-5' : ''
                                      }`}
                                  ></div>
                                </div>
                              </label>
                            </td>
                          </tr>
                        );
                      })}

                    </tbody>
                  </table>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowPopup(false);
                        setIsEdit(false);
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
      {showVariantPopup && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-5xl shadow-xl relative">
            <h2 className="text-xl font-semibold mb-4">Variant Details</h2>

            {(() => {
              const isExists = selectedProduct?.product?.isVarientExists;

              return (
                <table className="min-w-full table-auto border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Image</th>
                      <th className="border px-4 py-2">Modal</th>
                      <th className="border px-4 py-2">Product Link</th>
                      <th className="border px-4 py-2">Suggested Price</th>
                      {isExists && (
                        <>
                          <th className="border px-4 py-2">Name</th>
                          <th className="border px-4 py-2">SKU</th>
                          <th className="border px-4 py-2">Color</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.variants?.map((v, idx) => {
                      let variant = {};
                      
                      console.log('selectedProduct',selectedProduct)
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

                      return (
                        <tr key={variant.id || idx}>
                          <td className="border px-4 py-2">
                            <div className="flex space-x-2 overflow-x-auto max-w-[200px]">
                              {imageUrls.length > 0 ? (
                                imageUrls.map((imgUrl, imgIdx) => (
                                  <img
                                    key={imgIdx}
                                    src={`https://placehold.co/600x400?text= ${idx + 1}`}
                                     alt={`variant-img-${imgIdx}`}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                ))
                              ) : (
                                <span className="text-gray-400">No Image</span>
                              )}
                            </div>
                          </td>
                          <td className="border px-4 py-2">{variant.modal || "—"}</td>
                          <td className="border px-4 py-2">{variant.product_link || "—"}</td>
                          <td className="border px-4 py-2">{  v.price ||v?.supplierProductVariant?.price || "—"}</td>
                          {isExists && (
                            <>
                              <td className="border px-4 py-2">{variant.name || "—"}</td>
                              <td className="border px-4 py-2">{variant.sku || "—"}</td>
                              <td className="border px-4 py-2">{variant.color || "—"}</td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            })()}
            <button
              onClick={() => setShowVariantPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NewlyLaunched;
