import NewProducts from '@/components/admin/products/NewProducts'
import React,{Suspense} from 'react'

export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
      <NewProducts />
    </Suspense>
    )
}
