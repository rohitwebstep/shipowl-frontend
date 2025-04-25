'use client'

import React, { Suspense } from 'react';
import AddProduct from '@/components/supplier/products/AddProduct';

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddProduct />
    </Suspense>
  );
}

export default Page;
