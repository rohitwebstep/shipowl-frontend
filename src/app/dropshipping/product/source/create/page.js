import SourceProductForm from '@/components/dropshipping/product/SourceProductForm';
import React, { Suspense } from 'react';

export default function page() {
  return (
   <Suspense fallback={<div>Loading...</div>}>
   <SourceProductForm/>
   </Suspense>
  )
}
