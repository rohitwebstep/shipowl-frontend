import React, { Suspense } from 'react';
import NewProducts from '@/components/admin/products/NewProducts';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewProducts />
    </Suspense>
  );
}
