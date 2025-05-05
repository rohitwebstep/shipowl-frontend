'use client'; // Ensure the code runs on the client-side only

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy-load the Order component with Suspense
const Order = dynamic(() => import('@/components/admin/orders/Order'), {
  suspense: true,
});

// Disable static prerendering for this page
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <Order />
    </Suspense>
  );
}
