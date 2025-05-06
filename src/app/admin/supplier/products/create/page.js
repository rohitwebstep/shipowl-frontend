import React ,{Suspense} from 'react'
import AddProduct from '@/components/admin/addproducts/AddProduct'
export default function page() {
  return (
     <Suspense fallback={<div>Loading...</div>}>
          <AddProduct />
        </Suspense>
  )
}
