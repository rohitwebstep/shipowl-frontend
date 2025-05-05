// page.tsx
'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Order = dynamic(() => import('@/components/admin/orders/Order'), {
  suspense: true,
});

export default function Page() {
  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <Order />
    </Suspense>
  );
}
