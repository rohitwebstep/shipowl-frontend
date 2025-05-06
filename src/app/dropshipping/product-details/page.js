"use client"

import dynamic from 'next/dynamic';

// Dynamically import ProductDetails with ssr: false to disable SSR for this component
const ProductDetails = dynamic(() => import('@/components/dropshipping/home/ProductDetails'), { 
  ssr: false // This disables SSR and renders it only on the client
});

export default function Page() {
  return (
    <div>
      <ProductDetails />
    </div>
  );
}
