import Create from '@/components/admin/citymanagement/Create'
import React,{Suspense} from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
   
      <Create />
      </Suspense>
  )
}
