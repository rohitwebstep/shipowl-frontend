import Update from '@/components/dropshipping/product/Update';
import React, { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Update />
    </Suspense>
  );
}

export default Page;
