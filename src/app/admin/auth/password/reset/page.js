import ResetPassword from '@/components/admin/ResetPassword'
import React, { Suspense } from 'react'

export default function Page() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
         <ResetPassword />
   </Suspense>  )
}



