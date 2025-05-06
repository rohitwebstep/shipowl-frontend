import Create from '@/components/admin/statemanagement/Create'
import React,{Suspense} from 'react'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>

    <Create/>
    
    </Suspense>
  )
}
