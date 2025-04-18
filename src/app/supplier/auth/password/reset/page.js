import ResetPassword from '@/components/supplier/ResetPassword'
import {Suspense} from 'react'

export default function page() {
  return (
 <Suspense fallback={<div>Loading...</div>}>
      <Update />
    </Suspense>  )
}
