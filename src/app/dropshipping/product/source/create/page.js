import React, { Suspense } from 'react';
import SourceProductForm from '@/components/dropshipping/product/SourceProductForm';

export default function page() {
  return (
   <Suspense fallback={<div>Loading...</div>}>
   <SourceProductForm/>
   </Suspense>
  )
}
