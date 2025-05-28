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
import product1img from '@/app/assets/watch.png';
import product2img from '@/app/assets/watch2.png';
import coupen from '@/app/assets/coupen.png';
import gift from '@/app/assets/gift.png';
import ship from '@/app/assets/delivery.png';
import img1 from '@/app/assets/quality.png';
import img2 from '@/app/assets/free-delivery.png';
import img3 from '@/app/assets/cod.png';
import img4 from '@/app/assets/return.png';

import { FaCalculator } from "react-icons/fa";
import { BsBoxSeam, BsTruck } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdInventory, MdKeyboardArrowDown } from "react-icons/md";
import { GiWeight } from "react-icons/gi";
import { HiShieldCheck } from "react-icons/hi";
import { LuArrowUpRight } from "react-icons/lu";
import { IoIosReturnLeft } from "react-icons/io";

const ProductDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const type = searchParams.get('type');
  const [showPopup, setShowPopup] = useState(false);
  // Dynamic images setup
  const images = [productimg, product1img, product2img, productimg];
  const [selectedImage, setSelectedImage] = useState(images[0]);

  // Product and related products state
  const [productDetails, setProductDetails] = useState([]);
  const [variantDetails, setVariantDetails] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

 const [inventoryData, setInventoryData] = useState({
    supplierProductId: "",
    id: '',
    variant: [],
    isVarientExists: '',
  });
  const fetchProductDetails = useCallback(async () => {
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
      let url;
      if (type === "notmy") {
        url = `https://sleeping-owl-we0m.onrender.com/api/dropshipper/product/inventory/${id}`;
      } else {
        url = `https://sleeping-owl-we0m.onrender.com/api/dropshipper/product/my-inventory/${id}`;

      }
      const response = await fetch(url, {
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
          title: "Something went wrong!",
          text: result.error || result.message || "Your session has expired. Please log in again.",
        });
        throw new Error(result.message || result.error || "Something went wrong!");
      }


      if (type === "notmy") {
        const ProductDataSup = result?.supplierProduct;
        setProductDetails(ProductDataSup?.product || []);
        setVariantDetails(ProductDataSup.variants || []);
        setSelectedVariant(ProductDataSup?.variants[0]?.variant)
        if (ProductDataSup) {
        fetchRelatedProducts(ProductDataSup?.product?.categoryId)

      }
      }
      else {
        const ProductDataDrop = result?.dropshipperProduct;
        setProductDetails(ProductDataDrop?.product || []);
        setVariantDetails(ProductDataDrop.variants || []);
        setSelectedVariant(ProductDataDrop?.variants[0]?.supplierProductVariant?.variant);
          if (ProductDataDrop) {
        fetchRelatedProducts(ProductDataDrop?.product?.categoryId)

      }
      }

      const data = result?.product;
      if (data) {
        fetchRelatedProducts(data?.categoryId)

      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  // Fetch related products by category
  const fetchRelatedProducts = useCallback(async (catId) => {
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
      const response = await fetch(`https://sleeping-owl-we0m.onrender.com/api/dropshipper/product?category=${catId}`, {
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
          title: "Something went wrong!",
          text: result.error || result.message || "Your session has expired. Please log in again.",
        });
        throw new Error(result.message || result.error || "Something went wrong!");
      }

      setRelatedProducts(result?.products || []);
    } catch (error) {
      console.error("Error fetching related products:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);
  const [selectedVariant, setSelectedVariant] = useState(null);

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
      const url =  "https://sleeping-owl-we0m.onrender.com/api/dropshipper/product/my-inventory";

      const response = await fetch(url, {
        method:  "POST",
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
          title:  "Creation Failed",
          text: result.message || result.error || "An error occurred",
        });
        return;
      }

      // On success
      Swal.fire({
        icon: "success",
        title:  "Product Created",
        text:result.message || "The Product has been created successfully!",
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          setInventoryData({
            productId: "",
            variant: [],
            id: '',
          });
          setShowPopup(false);
          fetchProductDetails();
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


  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
  };
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
  console.log('variantDetails', selectedVariant)
  return (
    <>
    {productDetails.length > 0 ? (
    <div>
      <div className="container mx-auto  gap-4 justify-between  rounded-lg flex flex-col md:flex-row">
        {/* Image Slider */}
        <div className='w-full md:w-4/12'>
          <div className=" rounded-lg bg-white border border-[#E0E2E7] p-4">
            <div className="rounded-lg p-4 flex justify-center">
              <Image src={selectedImage} alt="Productimg" className="w-80 h-80 object-cover" />
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
                    src={image}
                    alt={`Thumbnail ${index}`}
                    className={`w-20 h-20 object-cover cursor-pointer rounded-lg  ${selectedImage === image ? 'border-blue-500' : 'border-gray-300'}`}
                    onClick={() => setSelectedImage(image)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>


        <div className="w-full md:w-8/12 bg-white rounded-lg border border-[#E0E2E7] p-6">
          <h2 className="text-3xl font-bold text-[#2C3454] pb-4">
            {productDetails?.name}
          </h2>

          <p className="text-gray-600">
            Sold: <span className="text-black">1,316 </span> | Rating: ⭐
            <span className="text-black"> {selectedVariant?.stock} </span> | Stock:
            <span className="text-black"> 25 </span> | Message:
            <span className="text-black"> 140</span>
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
                  <h2 className="text-2xl font-bold">₹{selectedVariant?.suggested_price}</h2>
                  <p className="text-gray-500 flex items-center text-sm">
                    <a href="#" className="underline text-sm">
                      Including GST & Shipping Charges
                    </a>
                    <AiOutlineInfoCircle className="ml-1" />
                  </p>
                </div>

                <div className="flex items-center bg-purple-100 p-2 rounded-md mt-3 cursor-pointer">
                  <FaCalculator className="text-purple-700 mr-2 text-2xl" />
                  <span className="text-black underline font-semibold text-sm">
                    Calculate <br /> Expected Profit
                  </span>
                </div>
              </div>

              <div className="bg-yellow-100 p-2 rounded-md mt-3 flex items-center cursor-pointer">
                <span className="bg-pink-500 text-white rounded-full px-2 py-1 mr-2">
                  💰
                </span>
                <span className="font-semibold underline">
                  Get upto ₹124 discount per order
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4 text-gray-700 text-sm">
              <div className="flex items-center">
                <BsBoxSeam className="mr-2 text-green-600" /> Units Sold:
                <strong className="ml-1">''</strong>
              </div>
              <div className="flex items-center">
                <BsTruck className="mr-2 text-blue-600" /> Delivery Rate: --
              </div>
              <div className="flex items-center">
                <MdInventory className="mr-2 text-green-600" /> Inventory:
                <strong className="ml-1">''</strong>
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

          <h3 className="mt-4 font-bold text-[18px] pb-2">Variants</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {variantDetails.map((item, index) => {
              let variant;
              if (type === "notmy") {
                variant = item?.variant;
              } else {
                variant = item?.supplierProductVariant?.variant;
              }
              const isSelected = selectedVariant?.id === variant.id;

              return (
                <div
                  onClick={() => handleVariantClick(variant)}
                  key={index}
                  className={`px-4 py-3 rounded-lg border transition-shadow duration-300 cursor-pointer ${isSelected
                    ? "border-dotted border-2 border-orange-600 shadow-md bg-orange-50"
                    : "border-gray-300 hover:shadow-lg bg-white"
                    }`}
                >
                  <div className="w-32 h-32 overflow-hidden rounded-lg mb-4 mx-auto">
                    <Image
                      src={productimg || variant?.image}
                      alt={variant?.name || "Variant Image"}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-md mb-3 text-center">
                    <span className="capitalize">{variant?.name || 'NIL'}</span>
                  </button>
                  <div className="text-sm text-gray-700 space-y-1 text-center">
                    <div>Color: <span className="font-medium">{variant?.color || 'NIL'}</span></div>
                    <div>Modal: <span className="font-medium">{variant?.modal}</span></div>
                    <div className="text-green-600 font-semibold">
                      Price: ₹{variant?.suggested_price}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>



          <div className="mt-4 border-t border-[#E0E2E7] pt-0">
            <h3 className=" text-[18px] pt-5 font-bold">Color Variant</h3>
            <div className="flex flex-wrap gap-3 mt-2">
              {variantDetails.map((item, index) => {
                const variant = item?.supplierProductVariant?.variant;
                const color = variant?.color?.toLowerCase();

                return color ? (
                  <button
                    key={index}
                    style={{ backgroundColor: color }}
                    className="px-4 py-2 text-white rounded-md mb-2"
                  >
                    <span>{variant?.color}</span>
                  </button>
                ) : (
                  <div key={index} className="px-4 py-2 bg-gray-300 text-black rounded-md mb-2">
                    <span>No Color Found</span>
                  </div>
                );
              })}

            </div>
          </div>

          <p className="pt-5 text-[18px] font-bold">Desciption</p>
          <p className=" text-[#858D9D] text-[16px]">{productDetails?.description}</p>

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
                    supplierProductId: productDetails.id,
                    id: productDetails.id,
                    variant: variantDetails,
                    isVarientExists: productDetails?.isVarientExists
                  });
                }} className="bg-orange-500 text-white px-6 py-3 text-xl flex items-center justify-center w-full sm:w-autofont-semibold">
                  <LuArrowUpRight className="mr-2" /> Add To List
                </button>

              ) :
                (
                  <button className="bg-black text-white px-6 py-3 text-xl flex items-center justify-center w-full sm:w-autofont-semibold">
                    <LuArrowUpRight className="mr-2" /> Push To Shopify
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


      </div>
      {relatedProducts.length>0 ?(
    <section className='py-5'>

        <h4 className='text-2xl text-black mb-3 font-semibold'>From different sellers </h4>
        <div className="products-grid grid xl:grid-cols-5 lg:grid-cols-4  gap-4  xl:gap-10 lg:gap-4">
          {relatedProducts.map((product, index) => {
            const variant = product.variants?.[0];

            return (
              <div key={index} onClick={() => viewProduct(product)} className="bg-white rounded-xl cursor-pointer shadow-sm">
                <Image
                  src={productimg || imageUrl}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <div className='p-3 mb:pb-0'>
                  <div className='flex justify-between'>
                    <p className="text-lg font-extrabold font-lato">₹{variant?.shipowl_price ?? "N/A"}</p>
                    <div className="coupen-box flex gap-2 items-center">
                      <Image src={coupen} className='w-5' alt='Coupon' />
                      <span className='text-[#249B3E] font-lato font-bold text-[12px]'>WELCOME10</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#ADADAD] font-lato font-semibold">{product.name}</p>
                  <div className="flex items-center border-t pt-2 mt-5 border-[#EDEDED] justify-between  text-sm text-gray-600">
                    <div className='flex items-center gap-1'>
                      <Image src={gift} className='w-5' alt="Gift" />
                      <span className='font-lato text-[#2C3454] font-bold'> 100-10k</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Image src={ship} className='w-5' alt='Shipping' />
                      <span className='font-lato text-[#2C3454] font-bold'>4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </section>
      ):(
        <p className="text-center font-bold text-3xl mt-8">No Related Products Found</p>
      )}
    
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl shadow-xl relative">
            <h2 className="text-xl font-semibold mb-4">Variant Details</h2>

            {(() => {
              const varinatExists = inventoryData?.isVarientExists ? 'yes' : 'no';
              const isExists = varinatExists === "yes";
              console.log('inventoryData',inventoryData)
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
                      {inventoryData.variant?.map((v, idx) => {
                        const variantInfo = {
                          ...(v.variant || {}), // nested variant data (name, sku, image, etc.)
                          ...v, // direct data (dropStock, dropPrice, Dropstatus, etc.)
                        };

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
                                      src={url}
                                      alt={variantInfo.name || 'NIL'}
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

                            <td className="border px-4 py-2">
                              {variantInfo.lowestOtherSupplierSuggestedPrice ?? variantInfo.suggested_price ?? 'NIL'}
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
      </div>
      ):(
        <p className="text-center font-bold text-3xl mt-8"> Product Not Found</p>
      )}
    </>


  );
};

export default ProductDetails;
