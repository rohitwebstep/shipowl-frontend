import ProductDetails from '@/components/dropshipping/home/ProductDetails'
import React, { Suspense } from 'react';

export default function page() {
  return (
        <Suspense fallback={<div>Loading...</div>}>
    <ProductDetails/></Suspense>
  )
}
