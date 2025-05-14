
import Create from '@/components/dropshipping/subusers/Create';
import React,{Suspense} from 'react';
export const dynamic = 'force-dynamic';
export default function Page() {
  return(
    <Suspense fallback={<div>Loading...</div>}>

   <Create />
   </Suspense>
  )
}
