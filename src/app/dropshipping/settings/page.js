import Settings from '@/components/dropshipping/setting/Setting'
import React, { Suspense } from 'react';
export default function Page() {
  return (
   <Suspense fallback={<div>Loading...</div>}>
         <Settings />
   </Suspense>
  )
}
