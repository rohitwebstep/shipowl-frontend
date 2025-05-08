'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Update = dynamic(() => import('@/components/dropshipping/payments/Update'), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Update />
    </Suspense>
  );
}
