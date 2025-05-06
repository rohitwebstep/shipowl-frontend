import Update from '@/components/admin/statemanagement/Update'
import React, { Suspense } from 'react';

export default function Page() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
       <Update />
     </Suspense>
  )
}
