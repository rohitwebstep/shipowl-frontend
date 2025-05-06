import ProductList from '@/components/dropshipping/product/ProductList'
import React, { Suspense } from 'react';

function Page() {
  return (
   <Suspense fallback={<div>Loading...</div>}>
    <ProductList/>
   </Suspense>
  )
}

export default Page