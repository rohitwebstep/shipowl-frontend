'use client'

import React, { Suspense } from 'react';
import Products from '@/components/supplier/products/Products';

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Products />
    </Suspense>
  );
}

export default Page;
