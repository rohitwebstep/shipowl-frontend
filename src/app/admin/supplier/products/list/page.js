import Products from '@/components/admin/products/Products'
import React,{Suspense} from 'react'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
         <Products />
       </Suspense>
  )
}
