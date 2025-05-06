import React, { Suspense } from 'react'
import ManageOrders from "@/components/dropshipping/manageorders/ManageOrders";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManageOrders />
    </Suspense>
  )
}
