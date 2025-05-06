import Orders from '@/components/admin/orders/Order';
import React, { Suspense } from 'react';
export default function Page() {
return (
    <Suspense fallback={<div>Loading...</div>}>
      <Orders />
    </Suspense>
  );}
