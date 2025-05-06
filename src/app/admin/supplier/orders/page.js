import React, { Suspense } from 'react';

// Dynamically import the Orders component
const Orders = React.lazy(() => import('@/components/admin/orders/Order'));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Orders />
    </Suspense>
  );
}
