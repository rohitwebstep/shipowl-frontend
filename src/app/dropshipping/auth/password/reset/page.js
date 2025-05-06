import ResetPassword from '@/components/dropshipping/ResetPassword'
import {Suspense} from 'react'

export default function Page() {
  return (
       <Suspense fallback={<div>Loading...</div>}>
         <ResetPassword />
       </Suspense>
  )
}
