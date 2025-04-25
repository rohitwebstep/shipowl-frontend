import Update from '@/components/supplier/warehouses/Update'
import React, { Suspense } from 'react';

export default function page() {
  return (
 <Suspense fallback={<>Loading...</>}>
      <Update />
    </Suspense>

)
}
