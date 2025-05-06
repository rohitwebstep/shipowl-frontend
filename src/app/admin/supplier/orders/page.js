
import React, { Suspense } from 'react';
import Orders from '@/components/admin/orders/Order';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <Orders />
    </Suspense>
  );
}
