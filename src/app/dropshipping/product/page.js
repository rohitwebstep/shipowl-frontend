'use client'; // Required if using Suspense + dynamic in app directory

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// ✅ Lazy-load the component with suspense
const ProductDetails = dynamic(() => import('@/components/dropshipping/home/ProductDetails'), {
  suspense: true,
});

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetails />
    </Suspense>
  );
}
