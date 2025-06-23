'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import { Navigation } from 'swiper/modules';
import Swal from 'sweetalert2';
import { HashLoader } from 'react-spinners';
import productimg from '@/app/assets/product1.png';
import gift from '@/app/assets/gift.png';
import ship from '@/app/assets/delivery.png';
import img1 from '@/app/assets/quality.png';
import img2 from '@/app/assets/free-delivery.png';
import img3 from '@/app/assets/cod.png';
import img4 from '@/app/assets/return.png';
import { X, Send } from "lucide-react"; // Lucide icons
import { FaCalculator } from "react-icons/fa";
import { BsBoxSeam, BsTruck } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdInventory, MdKeyboardArrowDown } from "react-icons/md";
import { GiWeight } from "react-icons/gi";
import { HiShieldCheck } from "react-icons/hi";
import { LuArrowUpRight } from "react-icons/lu";
import { IoIosReturnLeft } from "react-icons/io";
import { TbCube } from "react-icons/tb";
import { GoArrowUpRight } from "react-icons/go";
import { FiArrowDownLeft } from "react-icons/fi";
import { RiResetRightLine } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { ChevronRight, ChevronDown } from "lucide-react"; // Optional: Lucide icons
import { useImageURL } from "@/components/ImageURLContext";
const tabs = [
  { key: "notmy", label: "Not Listed Products" },
  { key: "my", label: "Listed Products" },
];
const ProductDetails = () => {
  const { fetchImages } = useImageURL();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const type = searchParams.get('type');
  const [showPopup, setShowPopup] = useState(false);
  // Dynamic images setup
  const [openSection, setOpenSection] = useState(null);
  const [shipCost, setShipCost] = useState([]);
  const [openDescriptionId, setOpenDescriptionId] = useState(null);

  const [activeModal, setActiveModal] = useState('Shipowl');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };
  const [activeTab, setActiveTab] = useState('notmy');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [openCalculator, setOpenCalculator] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [otherSuppliers, setOtherSuppliers] = useState([]);
  const images = selectedVariant?.variant?.image?.split(",") || selectedVariant?.image?.split(",") || [];
  const [shopifyStores, setShopifyStores] = useState([]);

  const [selectedImage, setSelectedImage] = useState("");

  // This will update selectedImage when selectedVariant changes
  useEffect(() => {
    const images =
      selectedVariant?.variant?.image?.split(",") ||
      selectedVariant?.image?.split(",") ||
      [];

    setSelectedImage(images[0] ?? "");
  }, [selectedVariant]);
  const [categoryId, setCategoryId] = useState('');
  const [variantDetails, setVariantDetails] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState({
    productId: "",
    variant: [],
    id: '',
    isVarientExists: '',
  });



  const [form, setForm] = useState({
    sellingPrice: '',
    totalOrderQty: '',
    confirmOrderPercentage: '90',
    deliveryPercentage: '50',
    adSpends: '',
    miscCharges: '',
  });

  const [errors, setErrors] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleChange = (key, value) => {
    const updatedForm = { ...form, [key]: value };
    setForm(updatedForm);

    const validationPassed = validate(updatedForm);
    setShowResult(validationPassed);
  };

  const validate = (formToValidate = form) => {
    const newErrors = {};

    Object.keys(formToValidate).forEach((key) => {
      if (key === 'miscCharges') return; // Skip missCharge

      if (!formToValidate[key] || isNaN(formToValidate[key])) {
        newErrors[key] = 'This Field is Required';
      }
    });

    if (
      formToValidate.sellingPrice &&
      !isNaN(formToValidate.sellingPrice) &&
      parseFloat(formToValidate.sellingPrice) < selectedVariant?.price
    ) {
      newErrors.sellingPrice = 'Selling price should be Greater than on equal to Shipowl price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const resetForm = () => {
    setForm({
      sellingPrice: '',
      totalOrderQty: '',
      confirmOrderPercentage: '90',
      deliveryPercentage: '50',
      adSpends: '',
      miscCharges: '',
    });
    setErrors({});
    setShowResult(false);
  };

  // Safely parsed values
  const sellingPrice = parseFloat(form.sellingPrice) || 0;
  const totalOrderQty = parseFloat(form.totalOrderQty) || 0;
  const confirmOrderPercentage = parseFloat(form.confirmOrderPercentage) || 0;
  const deliveryPercentage = parseFloat(form.deliveryPercentage) || 0;
  const deliveryRTOPercentage = 100 - deliveryPercentage;
  const adSpends = parseFloat(form.adSpends) || 0;
  const miscCharges = parseFloat(form.miscCharges) || 0;
  const productPrice = selectedVariant?.price;
  const deliveryCostPerUnit = shipCost;
  const confirmedQtyrAW = totalOrderQty * (confirmOrderPercentage / 100);
  const confirmedQty = Math.round(confirmedQtyrAW);
  const deliveredQtyRaw = confirmedQty * (deliveryPercentage / 100);
  const deliveredQty = Math.round(deliveredQtyRaw);
  // Calculate Delivered RTO Quantity
  const deliveredRTOQty = confirmedQty - deliveredQty;
  // Cost Calculations
  const productCostForDelivered = deliveredQty * productPrice;
  const revenueFromDelivered = deliveredQty * sellingPrice;
  const totalRTODeliveryCost = deliveredRTOQty * deliveryCostPerUnit;
  // Final Margin Calculation
  const totalAddSpend = adSpends * totalOrderQty; //order*adSpends
  const perOrderMargin = sellingPrice - productPrice;
  const finalEarnings = perOrderMargin * deliveredQty;
  const totalExpenses = totalRTODeliveryCost + totalAddSpend + miscCharges;
  const finalMargin = finalEarnings - totalExpenses; //total earning-totalspend
  const profitPerOrder = finalMargin / totalOrderQty;
  const fetchProductDetails = useCallback(async () => {
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
      let url;
      if (type === "notmy") {
        url = `https://sleeping-owl-we0m.onrender.com/api/supplier/product/inventory/${id}`;
      } else {
        url = `https://sleeping-owl-we0m.onrender.com/api/supplier/product/my-inventory/${id}`;

      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${suppliertoken}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: result.error || result.message || "Your session has expired. Please log in again.",
        });
        throw new Error(result.message || result.error || "Something went wrong!");
      }
      setShipCost(result?.shippingCost || []);

      if (type === "notmy") {
        const ProductDataSup = result?.product;
        const ProductDataOther = result?.otherSuppliers;

        setProductDetails(ProductDataSup || {});
        setOtherSuppliers(ProductDataOther || []);

        const sortedVariants = (ProductDataSup?.variants || []).slice().sort(
          (a, b) => a.suggested_price - b.suggested_price
        );
        setVariantDetails(sortedVariants);
        setSelectedVariant(sortedVariants[0]);

        if (ProductDataSup) {
          setCategoryId(ProductDataSup?.product?.categoryId);
          fetchRelatedProducts(ProductDataSup?.categoryId, activeTab);
        }

      } else {
        const ProductDataDrop = result?.supplierProduct;

        setProductDetails(ProductDataDrop?.product || {});

        const sortedVariants = (ProductDataDrop?.variants || []).slice().sort(
          (a, b) => a.price - b.price
        );
        setVariantDetails(sortedVariants);
        setSelectedVariant(sortedVariants[0]);

        if (ProductDataDrop) {
          setCategoryId(ProductDataDrop?.product?.categoryId);
          fetchRelatedProducts(ProductDataDrop?.product?.categoryId, activeTab);
        }
      }


    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  }, [id, router, activeTab]);
  const handleEdit = async (item) => {


  };
  // Fetch related products by category
  const fetchRelatedProducts = useCallback(async (catid, tab) => {
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
      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/supplier/product/inventory?category=${catid}&type=${tab}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${suppliertoken}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: result.error || result.message || "Your session has expired. Please log in again.",
        });
        throw new Error(result.message || result.error || "Something went wrong!");
      }

      setRelatedProducts(result?.products || []);
      setShopifyStores(result?.shopifyStores || []);

    } catch (error) {
      console.error("Error fetching related products:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleVariantChange = (id, field, value) => {
    setInventoryData((prevData) => ({
      ...prevData,
      variant: prevData.variant.map((v) =>
        v.id === id ? { ...v, [field]: field === 'qty' || field === 'shipowl_price' ? Number(value) : value } : v
      ),
    }));
  };

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
      const simplifiedVariants = inventoryData.variant
        .filter(v => v.status === true) // Only include variants with status true
        .map(v => ({
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


  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
  };


  const groupedByModal = variantDetails.reduce((acc, curr) => {
    const model = curr?.model || curr?.variant?.model || "Unknown";
    if (!acc[model]) acc[model] = [];
    acc[model].push(curr);
    return acc;
  }, {});

  const modalNames = Object.keys(groupedByModal);
  const totalModals = modalNames.length;

  const getVariantData = (v) => ({
    id: v?.id || v?.variant?.id,
    name: v?.name || v?.variant?.name || "NIL",
    model: v?.model || v?.variant?.model || "Unknown",
    color: v?.color || v?.variant?.color || "NIL",
    image: (v?.image || v?.variant?.image || "").split(",")[0],
    suggested_price: v?.price || v?.suggested_price,
    full: v,
  });
  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <HashLoader size={60} color="#F97316" loading={true} />
      </div>
    );
  }
  const viewProduct = (id) => {
    if (type == "notmy") {
      router.push(`/supplier/product/?id=${id}&type=${type}`);
    } else {

      router.push(`/supplier/product/?id=${id}`);
    }
  };
  console.log('selectedImage', selectedImage)
  return (
    <>
      {productDetails && Object.keys(productDetails).length > 0 ? (
        <div>
          <div className="container mx-auto  gap-4 justify-between  rounded-lg flex flex-col md:flex-row">
            {/* Image Slider */}
            <div className="w-full md:w-4/12">
              <div className="rounded-lg bg-white border border-[#E0E2E7] p-4">
                <div className="rounded-lg p-4 w-full">
                  <Image

                    src={fetchImages(selectedImage)}
                    alt="Product Image"
                    width={320}
                    height={320}
                    className="w-full h-100  object-cover rounded-lg"
                  />
                </div>

                <Swiper
                  spaceBetween={10}
                  slidesPerView={4}
                  navigation
                  modules={[Navigation]}
                  className="mt-4"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        src={fetchImages(image)}

                        alt={`Thumbnail ${index + 1}`}
                        width={80}
                        height={80}
                        className={`w-20 h-20 object-cover cursor-pointer rounded-lg border-2 ${selectedImage === image ? "border-blue-500" : "border-gray-300"
                          }`}
                        onClick={() => setSelectedImage(image)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>


            <div className="w-full md:w-8/12 bg-white rounded-lg border border-[#E0E2E7] p-6">
              <h2 className="text-3xl font-bold text-[#2C3454] pb-4 capitalize">
                {productDetails?.name}
              </h2>

              <p className="text-gray-600">
                Sold: <span className="text-black">1,316 </span> | Rating: ⭐
                <span className="text-black"> {selectedVariant?.variant?.stock || selectedVariant?.stock} </span> | Stock:
                <span className="text-black"> 25 </span>
              </p>

              <div className="md:flex justify-between pb-3 pt-2">
                <p className="text-[#858D9D]">
                  C-Code: <span className="text-black">#302012</span>
                </p>
                <p className="text-[#858D9D]">
                  Created: <span className="text-black">{productDetails?.createdAt ? new Date(productDetails.createdAt).toLocaleDateString() : 'Not Available'}</span>
                </p>
              </div>

              <div className="xl:flex gap-3 items-start justify-between">
                <div>
                  <div className="md:flex gap-3 items-end">
                    <div>
                      <h2 className="text-2xl font-bold">₹{selectedVariant?.price || selectedVariant?.suggested_price}</h2>
                      <p className="text-gray-500 flex items-center text-sm">
                        <a href="#" className="underline text-sm">
                          Including GST & Shipping Charges
                        </a>
                        <AiOutlineInfoCircle className="ml-1" />
                      </p>
                    </div>

                    {/* <div onClick={() => setOpenCalculator(true)} className="flex items-center bg-purple-100 p-2 rounded-md mt-3 cursor-pointer">
                      <FaCalculator className="text-purple-700 mr-2 text-2xl" />
                      <span className="text-black underline font-semibold text-sm">
                        Calculate <br /> Expected Profit
                      </span>
                    </div> */}
                  </div>


                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4 text-gray-700 text-sm">
                  <div className="flex items-center">
                    <BsBoxSeam className="mr-2 text-green-600" /> Units Sold:
                    <strong className="ml-1"></strong>
                  </div>
                  <div className="flex items-center">
                    <BsTruck className="mr-2 text-blue-600" /> Delivery Rate: --
                  </div>
                  <div className="flex items-center">
                    <MdInventory className="mr-2 text-green-600" /> Inventory:
                    <strong className="ml-1"></strong>
                  </div>
                  <div className="flex items-center">
                    <GiWeight className="mr-2 text-brown-600" /> Weight:
                    <strong className="ml-1">{productDetails?.weight} g</strong>
                  </div>
                  <div className="flex items-center">
                    <HiShieldCheck className="mr-2 text-blue-600" /> Supplier Score:
                    <strong className="ml-1">4/5</strong>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-purple-600">📦</span> Product GST:
                    <strong className="ml-1">18%</strong>
                  </div>
                </div>
              </div>
              {
                totalModals === 1 && groupedByModal[modalNames[0]].length === 1 ? null : (
                  totalModals === 2 && modalNames.every(model => groupedByModal[model].length === 1) ? (
                    <h3 className="mt-4 font-bold text-[18px] pb-2">Modals</h3>
                  ) : (
                    <h3 className="mt-4 font-bold text-[18px] pb-2">Variants</h3>
                  )
                )
              }

              <div className="">
                {(() => {


                  // CASE 1: 1 model, 1 variant
                  if (totalModals === 1 && groupedByModal[modalNames[0]].length === 1) {
                    const variant = getVariantData(groupedByModal[modalNames[0]][0]);
                    return (
                      null
                    );
                  }

                  // CASE 2: 1 model, multiple variants
                  if (totalModals === 1 && groupedByModal[modalNames[0]].length > 1) {
                    return (
                      <>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {groupedByModal[modalNames[0]]
                            .map(getVariantData)
                            .sort((a, b) => a.suggested_price - b.suggested_price)
                            .map((variant, index) => {
                              const isSelected = selectedVariant?.id === variant.id;

                              return (
                                <div
                                  key={index}
                                  onClick={() => handleVariantClick(variant.full)}
                                  className={`px-4 py-3 rounded-lg border transition-shadow duration-300 cursor-pointer ${isSelected
                                    ? "border-dotted border-2 border-orange-600 shadow-md bg-orange-50"
                                    : "border-gray-300 hover:shadow-lg bg-white"
                                    }`}
                                >


                                  <div className="flex gap-3">
                                    <div className="md:w-4/12 w-40 overflow-hidden rounded-lg mb-4 mx-auto">
                                      <Image

                                        src={fetchImages(variant.image)}
                                        alt={variant.name}
                                        width={140}
                                        height={140}
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                    <div className="text-sm md:w-8/12 text-gray-700 space-y-1 text-left">
                                      <div>
                                        Name: <span className="font-medium">{variant.name}</span>
                                      </div>
                                      <div>
                                        Color: <span className="font-medium">{variant.color}</span>
                                      </div>
                                      <div>
                                        Model: <span className="font-medium">{variant.model}</span>
                                      </div>
                                      <div className="text-green-600 font-semibold">
                                        Price: ₹{variant.suggested_price}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </>
                    );
                  }


                  if (totalModals === 2 && modalNames.every(model => groupedByModal[model].length === 1)) {
                    return (
                      <div className="space-y-4">
                        {modalNames.map((model, index) => {
                          const variant = getVariantData(groupedByModal[model][0]);
                          const isSelected = selectedVariant?.id === variant.id;
                          return (
                            <label key={index} className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name="model"
                                value={model}
                                checked={isSelected}
                                onChange={() => handleVariantClick(variant.full)}
                              />
                              <span className="text-gray-800 font-medium">{model}</span>
                              {isSelected && (
                                <span className="ml-2 text-green-600 font-semibold">
                                  ₹{variant.suggested_price}
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    );
                  }

                  // CASE 3: Multiple modals with multiple variants → TABS
                  if (totalModals > 1 && modalNames.some(model => groupedByModal[model].length > 1)) {
                    return (
                      <>
                        {/* Tabs */}
                        <div className="flex gap-3 mb-4 border-b pb-2">
                          {modalNames.map((model, index) => (
                            <button
                              key={index}
                              className={`px-4 py-2 rounded-t-lg text-sm font-medium border-b-2 ${activeModal === model
                                ? "border-orange-600 text-orange-600"
                                : "border-transparent text-gray-600 hover:text-orange-500"
                                }`}
                              onClick={() => {
                                const sorted = groupedByModal[model]
                                  .map(getVariantData)
                                  .sort((a, b) => a.suggested_price - b.suggested_price);
                                setActiveModal(model);
                                setSelectedVariant(sorted[0].full);
                              }}
                            >
                              {model}
                            </button>
                          ))}
                        </div>

                        {/* Variant Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {(groupedByModal[activeModal] || [])
                            .map(getVariantData)
                            .sort((a, b) => a.suggested_price - b.suggested_price)
                            .map((variant, index) => {
                              const isSelected = selectedVariant?.id === variant.id;
                              return (
                                <div
                                  key={index}
                                  onClick={() => handleVariantClick(variant.full)}
                                  className={`px-4 py-3 rounded-lg border transition-shadow duration-300 cursor-pointer ${isSelected
                                    ? "border-dotted border-2 border-orange-600 shadow-md bg-orange-50"
                                    : "border-gray-300 hover:shadow-lg bg-white"
                                    }`}
                                >
                                  <div className="flex gap-3">
                                    <div className="md:w-4/12 w-40 overflow-hidden rounded-lg mb-4 mx-auto">
                                      <Image
                                        src={fetchImages(variant.image)}
                                        alt={variant.name}
                                        width={140}
                                        height={140}
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                    <div className="text-sm md:w-8/12 text-gray-700 space-y-1 text-left">
                                      <div>Name: <span className="font-medium">{variant.name}</span></div>
                                      <div>Color: <span className="font-medium">{variant.color}</span></div>
                                      <div className="text-green-600 font-semibold">Price: ₹{variant.suggested_price}</div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </>
                    );
                  }

                  return <div>No variant available.</div>;
                })()}
              </div>
              <div className="mt-4 border-t border-[#E0E2E7] pt-0">
                <div className="flex gap-6">
                  {
                    totalModals === 1 && groupedByModal[modalNames[0]]?.length === 1 ? null : (
                      <div>
                        <h3 className="text-[18px] pt-5 font-bold">Color Variant</h3>
                        <div className="flex flex-wrap gap-3 mt-2">
                          {
                            (() => {
                              const colors = [
                                ...new Set(
                                  variantDetails
                                    .map((item) => {
                                      const color = type === "notmy" ? item?.color : item?.variant?.color;
                                      return color?.trim().toLowerCase();
                                    })
                                    .filter(Boolean)
                                ),
                              ];

                              return colors.length > 0 ? (
                                colors.map((color, index) => (
                                  <button
                                    key={index}
                                    style={{ backgroundColor: color }}
                                    className="px-4 py-2 text-white rounded-md mb-2"
                                  >
                                    <span className="capitalize">{color}</span>
                                  </button>
                                ))
                              ) : (
                                <span className="text-gray-500 italic">No color found</span>
                              );
                            })()
                          }
                        </div>
                      </div>
                    )
                  }



                  <div className="">
                    <h3 className=" text-[18px] pt-5 font-bold">Product Tags</h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {(() => {
                        try {
                          const tags = JSON.parse(productDetails?.tags || '[]');
                          if (Array.isArray(tags)) {
                            return tags.map((tag, index) => (
                              <button
                                key={index}
                                className="px-4 py-2 text-white capitalize bg-blue-400 rounded-md mb-2"
                              >
                                <span>{tag}</span>
                              </button>
                            ));
                          }
                        } catch (err) {
                          console.warn('Invalid tags JSON:', productDetails?.tags);
                          return (
                            <span className="text-sm text-gray-500">No valid tags found</span>
                          );
                        }
                      })()}
                    </div>
                  </div>
                  {/* {otherSuppliers.length > 0 && (
                    <div className="">
                      <h3 className=" text-[18px] pt-5 font-bold">Other Suppliers</h3>
                      {otherSuppliers.map((sup, index) => {
                        // Find the variant with the lowest price
                        const lowestPriceVariant = sup.variants.reduce((min, v) =>
                          v.price < min.price ? v : min
                        );

                        return (
                          <div onClick={() => viewProduct(sup?.id)} key={index} className="mb-4 p-3 border-dotted  border-2 border-orange-600 shadow-md bg-orange-50  rounded">
                            <div>
                              <strong>Supplier ID:</strong> {sup?.supplier?.uniqueId || 'NIL'}
                            </div>

                            <div>
                              <strong> Price:</strong> ₹{lowestPriceVariant.price}
                            </div>

                          </div>
                        );
                      })}

                    </div>
                  )} */}

                </div>
              </div>

              <p className="pt-5 text-[18px] font-bold">Desciption</p>


              {/* HTML Description Content */}
              {productDetails.description ? (
                <div
                  className="max-w-none prose [&_iframe]:h-[200px] [&_iframe]:max-h-[200px] [&_iframe]:w-full [&_iframe]:aspect-video"
                  dangerouslySetInnerHTML={{ __html: productDetails.description }}
                />
              ) : (
                <p className="text-gray-500">NIL</p>
              )}


              <p className="pt-2 text-[18px] font-bold border-t mt-3 border-[#E0E2E7]">Platform Assurance</p>
              <div className="xl:grid lg:grid-cols-4 flex my-5 md:my-0 overflow-auto gap-8">
                <div className="col">
                  <Image src={img1} alt="" className="md:p-3 max-w-[150px] xl:max-w-full lg:w-full" />
                </div>
                <div className="col">
                  <Image src={img2} alt="" className="md:p-3 max-w-[150px] xl:max-w-full lg:w-full" />
                </div>
                <div className="col">
                  <Image src={img3} alt="" className="md:p-3 max-w-[150px] xl:max-w-full lg:w-full" />
                </div>
                <div className="col">
                  <Image src={img4} alt="" className="md:p-3 max-w-[150px] xl:max-w-full lg:w-full" />
                </div>
              </div>

              <div className='border-t mt-3 border-[#E0E2E7] pt-2'>
                <h3 className="text-[18px] font-bold">Weight & Dimension:</h3>
                <p className="text-black font-medium pt-2">
                  {productDetails?.weight}kg / {productDetails?.package_length} CM, {productDetails?.package_width} CM, {productDetails?.package_height} CM <span className="text-gray-500">(H,L,W)</span>
                </p>

                <div className="mt-4 grid md:grid-cols-2 border-t border-[#E0E2E7] pt-4 items-stretch gap-3">
                  {type === "notmy" ? (
                    <button onClick={() => {
                      setShowPopup(true);
                      setInventoryData({
                        productId: productDetails.id,
                        id: productDetails.id,
                        variant: variantDetails,
                        isVarientExists: productDetails?.isVarientExists,
                      });
                    }} className="bg-orange-500 text-white px-6 py-3 text-xl flex items-center justify-center w-full sm:w-autofont-semibold">
                      <LuArrowUpRight className="mr-2" /> Add To List
                    </button>

                  ) :
                    (
                      <button className="bg-black text-white px-6 py-3 text-xl flex items-center justify-center w-full sm:w-autofont-semibold">
                        <LuArrowUpRight className="mr-2" />  Edit
                      </button>
                    )}


                  <div className="bg-gray-100 p-3 rounded-md gap-2 flex items-start w-full sm:w-auto text-sm text-gray-600">
                    <IoIosReturnLeft className="text-5xl text-gray-500" />
                    <p className="text-sm">
                      RTO & RVP charges are applicable and vary depending on the product
                      weight.{" "}
                      <a href="#" className="text-black underline font-semibold">
                        View charges for this product
                      </a>
                    </p>
                    <MdKeyboardArrowDown className="text-5xl text-gray-500" />
                  </div>
                </div>
              </div>
            </div>


          </div >


          <section className="py-5">
            <div className="flex gap-4 bg-white rounded-md p-4 mb-8 font-lato text-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`md:px-6 px-2 py-2 font-medium md:text-xl border-b-2 transition-all duration-300 ease-in-out
          ${activeTab === tab.key
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-orange-600"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <h4 className="text-2xl text-black mb-3 font-semibold">From different sellers</h4>

            {relatedProducts.length === 0 ? (
              <p className="text-center font-bold text-3xl mt-8">No Related Products Found</p>
            ) : (
              <div className="grid xl:grid-cols-5 lg:grid-cols-4 grid-cols-2 md:gap-6 gap-2 xl:gap-10">
                {relatedProducts.map((item, index) => {

                  const product = type == "notmy" ? item : item.product || {};
                  const variants = item.variants || [];

                  const prices = variants
                    .map(v => type === "notmy" ? v.suggested_price : v.price)
                    .filter(p => typeof p === "number");
                  console.log('prices', prices)
                  console.log('variants', variants)
                  const lowestPrice = prices.length > 0 ? Math.min(...prices) : "-";
                  const productName = product.name || "Unnamed Product";



                  return (
                    <div
                      key={index}
                      tabIndex={0} // Enables focus for mobile tap
                      className="bg-white relative overflow-hidden rounded-xl group cursor-pointer shadow-md transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] outline-none"
                    >
                      <div className="p-3">
                        {/* FLIP CARD */}
                        <div className="relative md:h-[200px] h-[100px] perspective">
                          <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180">
                            {/* FRONT */}
                            <Image
                              src={fetchImages(item.variants[0]?.image)}
                              alt={productName}
                              height={200}
                              width={100}
                              className="w-full h-full  object-cover backface-hidden"
                            />
                            {/* BACK */}
                            <div className="absolute inset-0 bg-black bg-opacity-40 text-white flex items-center justify-center rotate-y-180 backface-hidden">
                              <span className="text-sm">Back View</span>
                            </div>
                          </div>
                        </div>

                        {/* PRICE & NAME */}
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-lg font-extrabold font-lato text-[#2C3454]">
                            ₹{lowestPrice !== "-" ? lowestPrice : "-"}
                          </p>
                        </div>
                        <p className="text-[13px] text-[#7A7A7A] font-lato font-semibold mt-1 hover:text-black transition-colors duration-300">
                          {productName}
                        </p>

                        {/* FOOTER */}
                        <div className="flex items-center border-t pt-3 group-hover:pb-16 mt-5 border-[#EDEDED] justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Image src={gift} className="w-5" alt="Gift" />
                            <span className="font-lato text-[#2C3454] font-bold">MOQ: -</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Image src={ship} className="w-5" alt="Shipping" />
                            <span className="font-lato text-[#2C3454] font-bold">Rating: -</span>
                          </div>
                        </div>

                        {/* SLIDE-IN BUTTON PANEL */}
                        <div
                          className="absolute bottom-0 left-0 w-full p-3 bg-white z-10 border border-gray-100 shadow
                       opacity-0 translate-y-4 pointer-events-none overflow-hidden
                       group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
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
                                  variant: item.variants,
                                  isVarientExists: product?.isVarientExists,
                                });
                              }}
                              className="py-2 px-4 text-white rounded-md md:text-sm  text-xs w-full bg-[#2B3674] hover:bg-[#1f285a] transition duration-300 ease-in-out"
                            >
                              Push To Shopify
                            </button>
                          )}

                          {activeTab === "my" && (
                            <button
                              onClick={() => handleEdit(product.id)}
                              className="py-2 px-4 mt-2 text-white rounded-md md:text-sm  text-xs w-full bg-black hover:bg-gray-800 transition duration-300 ease-in-out"
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

            )}
          </section>



          {
            showPopup && (
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
                                        src={fetchImages(imageUrls)}
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
                                    <p><span className="font-semibold">Model:</span> {variant.model || "NIL"}</p>
                                    <p><span className="font-semibold">Suggested Price:</span> {variant.suggested_price || "NIL"}</p>
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
                                  <span className="text-sm font-medium">Add to List:</span>
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
            )
          }

        </div >
      ) : (
        <p className="text-center font-bold text-3xl mt-8"> Product Not Found</p>
      )}

     
    </>


  );
};

export default ProductDetails;
function InputField({ label, value, onChange, error, required }) {
  return (
    <>
      <div className='flex justify-between'>
        <label className="md:w-7/12 block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </label>

        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`md:w-5/12 bg-white border px-3 py-[6px] ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
      </div>
    </>
  );
}

// Result output component with conditional display
function ResultItem({ label, value, isVisible, placeholder = '-' }) {
  const numeric = parseFloat(value?.replace?.(/[₹,]/g, '')) || 0;
  return (
    <div className="flex justify-between text-sm w-full">
      <span className="font-medium text-black">{label}</span>
      <span className={` font-bold  text-green-800 ${!isVisible ? 'text-gray-400' : numeric < 0 ? 'text-red-800' : 'text-green-800'}`}>
        {isVisible ? value : placeholder}
      </span>
    </div>
  );
}

// Info box component
function ProductInfo({ label, value }) {
  return (
    <div className="flex items-center space-x-1 text-sm">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-black">{value}</span>
    </div>
  );
}

