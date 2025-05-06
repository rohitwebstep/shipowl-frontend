import ManageOrders from "@/components/dropshipping/manageorders/ManageOrders";
import React, {Suspense} from React
export default function Page() {

  return (
    <>
     <Suspense fallback={<div>Loading...</div>}>
    
    <ManageOrders/>
       </Suspense>
    </>
  )
}
