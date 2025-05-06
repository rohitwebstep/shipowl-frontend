import Update from '@/components/supplier/warehouses/Update'
import React, { Suspense } from 'react';

export default function Page() {
  return (
 <Suspense fallback={<>Loading...</>}>
      <Update />
    </Suspense>

)
}
