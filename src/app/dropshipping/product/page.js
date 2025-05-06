import ProductDetails from '@/components/dropshipping/home/ProductDetails';
import React, { Suspense } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetails />
    </Suspense>
  );
}
