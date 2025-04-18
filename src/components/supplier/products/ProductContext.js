'use client';

import { useState, createContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const router = useRouter();

  const [categoryData, setCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [isEdit, setIsEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    name: '',
    main_sku: '',
    description: '',
    tags: [{}],
    brands: '',
    origin_country: '',
    shipping_country: '',
    video_url: '',
    list_as: '',
    variant_images_0: '',
    variants: [
      {
        color: '',
        sku: '',
        qty: 1,
        currency: '',
        article_id: '',
        suggested_price:"",
        shipowl_price:"",
        rto_suggested_price:"",
        rto_price:""
      },
    ],
    Shipping_time: '',
    weight: '',
    package_length: '',
    package_width: '',
    package_height: '',
    chargable_weight: '',
    package_weight_image: '',
    package_length_image: '',
    package_width_image: '',
    package_height_image: '',
    product_detail_video: '',
    upload_training_guidance_video: '',
    upc: '',
    ean: '',
    hsn_code: '',
    tax_rate: '',
    rto_address: '',
    pickup_address: '',
  });

  const fetchCategory = useCallback(async () => {
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
      const response = await fetch('https://sleeping-owl-we0m.onrender.com/api/category', {
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
          title: 'Session Expired',
          text:
            errorMessage.error ||
            errorMessage.message ||
            'Your session has expired. Please log in again.',
        });
        throw new Error(errorMessage.message || errorMessage.error || 'Session expired');
      }

      const result = await response.json();
      if (result?.categories) {
        setCategoryData(result.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [router]);

  const fetchBrand = useCallback(async () => {
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
      const response = await fetch('https://sleeping-owl-we0m.onrender.com/api/brand', {
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
          title: 'Session Expired',
          text:
            errorMessage.error ||
            errorMessage.message ||
            'Your session has expired. Please log in again.',
        });
        throw new Error(errorMessage.message || errorMessage.error || 'Session expired');
      }

      const result = await response.json();
      if (result?.brands) {
        setBrandData(result.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  }, [router]);

  const fetchCountry = useCallback(async () => {
    const adminData = JSON.parse(localStorage.getItem('shippingData'));

   

    const admintoken = adminData?.security?.token;
    if (!admintoken) {
      router.push('/admin/auth/login');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://sleeping-owl-we0m.onrender.com/api/location/country', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admintoken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text:
            errorMessage.error ||
            errorMessage.message ||
            'Your session has expired. Please log in again.',
        });
        throw new Error(errorMessage.message || errorMessage.error || 'Session expired');
      }

      const result = await response.json();
      if (result?.countries) {
        setCountryData(result.countries);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  console.log('formData',formData)

  return (
    <ProductContext.Provider
      value={{
        formData,
        setFormData,
        categoryData,
        setCategoryData,
        brandData,
        setBrandData,
        countryData,
        setCountryData,
        isEdit,
        setIsEdit,
        fetchCategory,
        fetchBrand,
        fetchCountry,
        loading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export { ProductProvider };
