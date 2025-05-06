'use client';

import React, { Suspense } from 'react';
import Orders from '@/components/admin/orders/Order';

function Page() {
  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <Orders />
    </Suspense>
  );
}

export default Page;
