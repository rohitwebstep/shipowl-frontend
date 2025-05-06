import Dropshippers from '@/components/admin/dropshipper/Dropshipper'
import React,{Suspense} from 'react'

export default function Page() {
  return    <Suspense fallback={<div>Loading...</div>}>
           <Dropshippers />
     </Suspense>
}
