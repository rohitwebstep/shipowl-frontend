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


  const validateFormData = () => {
    const requiredFields = {
      category: 'Category',
      name: 'Product Name',
      main_sku: 'Main SKU',
      description: 'Description',
      brands: 'Brand',
      origin_country: 'Origin Country',
      shipping_country: 'Shipping Country',
      list_as: 'List As',
      Shipping_time: 'Shipping Time',
      weight: 'Weight',
      package_length: 'Package Length',
      package_width: 'Package Width',
      package_height: 'Package Height',
      chargable_weight: 'Chargable Weight',
      upc: 'UPC',
      ean: 'EAN',
      hsn_code: 'HSN Code',
      tax_rate: 'Tax Rate',
      rto_address: 'RTO Address',
      pickup_address: 'Pickup Address',
    };
  
    for (const [key, label] of Object.entries(requiredFields)) {
      if (!formData[key] || formData[key].toString().trim() === '') {
        return {
          isValid: false,
          message: `${label} is required.`,
        };
      }
    }
  
    // Validate at least one variant exists and is complete
    if (!Array.isArray(formData.variants) || formData.variants.length === 0) {
      return {
        isValid: false,
        message: 'At least one product variant is required.',
      };
    }
  
    for (let i = 0; i < formData.variants.length; i++) {
      const variant = formData.variants[i];
      const requiredVariantFields = ['color', 'sku', 'qty', 'currency', 'article_id', 'suggested_price', 'shipowl_price', 'rto_suggested_price', 'rto_price'];
      for (const field of requiredVariantFields) {
        if (!variant[field] || variant[field].toString().trim() === '') {
          return {
            isValid: false,
            message: `Variant ${i + 1}: ${field.replace(/_/g, ' ')} is required.`,
          };
        }
      }
    }
  
    return { isValid: true };
  };
  
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
      const response = await fetch('https://shipping-owl-vd4s.vercel.app/api/category', {
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
      const response = await fetch('https://shipping-owl-vd4s.vercel.app/api/brand', {
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
      const response = await fetch('https://shipping-owl-vd4s.vercel.app/api/location/country', {
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
