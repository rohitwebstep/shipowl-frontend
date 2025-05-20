'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { IoIosArrowForward } from 'react-icons/io';
import { HashLoader } from 'react-spinners';

import productimg from '@/app/assets/product1.png';
import coupen from '@/app/assets/coupen.png';
import gift from '@/app/assets/gift.png';
import ship from '@/app/assets/delivery.png';

const tabs = [
  { key: "my", label: "My Products" },
  { key: "all", label: "All Products" },
  { key: "notmy", label: "Not My Products" },
];

const NewlyLaunched = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('my');
  const [isTrashed, setIsTrashed] = useState(false);

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
      const response = await fetch(`http://localhost:3001/api/dropshipper/product?type=${type}`, {
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
      const response = await fetch(`http://localhost:3001/api/dropshipper/product/my/trashed`, {
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

  const viewProduct = (item) => {
    router.push(`/dropshipping/product/?id=${item.id}`);
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
              className={`px-6 py-2 font-medium border-b-2 transition-all duration-200
                ${activeTab === tab.key
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-orange-600"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "my" && (
          <div className="flex justify-end gap-2">
            <button
              className={`p-3 text-white rounded-md ${isTrashed ? 'bg-green-500' : 'bg-red-500'}`}
              onClick={async () => {
                if (isTrashed) {
                  setIsTrashed(false);
                  await fetchProduct('my');
                } else {
                  setIsTrashed(true);
                  await trashProducts();
                }
              }}
            >
              {isTrashed ? "Product Listing (Simple)" : "Trashed Product"}
            </button>

          </div>
        )}

        {/* Show No Data Found once if no products */}
        {!loading && products.length === 0 ? (
          <p className="text-center">No Data Found</p>
        ) : (
          <>
            {/* Newly Launched Section */}
            <Section
              title="Newly Launched"
              products={products}
              // viewProduct={viewProduct}
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
              // viewProduct={viewProduct}
              activeTab={activeTab}
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

const Section = ({ title, products, isTrashed, setActiveTab, trashProducts, fetchProduct, activeTab }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [inventoryData, setInventoryData] = useState({
    supplierProductId: "",
    status: "",
    stock: "",
    price: "",
  });
  // Single tab state shared by both sections
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setInventoryData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [isEdit, setIsEdit] = useState(false);

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

      const url = isEdit ? `http://localhost:3001/api/dropshipper/product/my/${id}` : "http://localhost:3001/api/dropshipper/product";

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
            supplierProductId: "",
            stock: "",
            price: "",
            status: "",
          });
          setShowPopup(false);
          fetchProduct('my');
          setActiveTab('my')
          setIsEdit(false)
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


  const handleDelete = async (item) => {
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
        `http://localhost:3001/api/dropshipper/product/my/${item.id}`,
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
        title: "Trash!",
        text: result.message || `${item.name} has been Trashed successfully.`,
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
        `http://localhost:3001/api/dropshipper/product/my/${item.id}/destroy`,
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

      await trashProducts();
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

  const handleRestore = useCallback(async (item) => {
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
        `http://localhost:3001/api/dropshipper/product/my/${item?.id}/restore`,
        {
          method: "PATCH",
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
      if (result.status) {
        Swal.fire({
          icon: "success",
          text: `product Has Been Restored Successfully !`,
        });
        await trashProducts();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [router, trashProducts]);
  const handleEdit = async (item) => {
    setIsEdit(true);
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
        `http://localhost:3001/api/dropshipper/product/my/${item.id}`,
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
          text: errorMessage.message || "Your session has expired. Please log in again.",
        });
        throw new Error(errorMessage.message);
      }

      const result = await response.json();
      const items = result?.dropshipperProduct || {};

      setInventoryData({
        supplierProductId: items.id || "",
        status: items.status || "",
        stock: items.stock || "",
        price: items.price || "",
      });
      setShowPopup(true);

    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setLoading(false);
    }

    console.log('item', item)
  }
  return (
    <>
      <div className="flex justify-between items-center mb-4 mt-6">

        <h2 className="md:text-[24px] text-lg text-[#F98F5C] font-lato font-bold">{title}</h2>
        <Link href="/dropshipping/product-list" className="text-[16px] text-[#222222] hover:text-orange-500 flex items-center gap-2 font-lato">
          View All <IoIosArrowForward className='text-[#F98F5C]' />
        </Link>
      </div>
      <div className="md:w-[293px] border-b-3 border-[#F98F5C] mt-1 mb-4"></div>


      <div className="products-grid grid xl:grid-cols-5 lg:grid-cols-3 gap-4 xl:gap-6 lg:gap-4 mt-4">
        <div className="h-full rounded-xl shadow-xl overflow-hidden cursor-default">
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
          const price = variant?.shipowl_price ?? "N/A";

          return (
            <div
              key={index}
              className="bg-white rounded-xl cursor-pointer shadow-sm relative"
            >
              <Image
                src={productimg || imageUrl}
                alt={productName}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />

              {activeTab === "my" && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  {isTrashed ? (
                    <>
                      <button onClick={() => handleRestore(product)} className="bg-green-500 text-white px-3 py-1 text-sm rounded">Restore</button>
                      <button onClick={() => handlePermanentDelete(product)} className="bg-red-500 text-white px-3 py-1 text-sm rounded">Permanent Delete</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-3 py-1 text-sm rounded">Edit</button>
                      <button onClick={() => handleDelete(product)} className="bg-red-500 text-white px-3 py-1 text-sm rounded">Trash</button>
                    </>
                  )}
                </div>
              )}


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

                {activeTab === "notmy" && (
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
                )}

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
                          onClick={() => {
                            setShowPopup(false);
                            setIsEdit(false);
                          }}
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
    </>
  );
};

export default NewlyLaunched;
