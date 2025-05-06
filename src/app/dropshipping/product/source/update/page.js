
import Update from '@/components/dropshipping/product/Update';
import React, { Suspense } from 'react';

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Update />
    </Suspense>
  );
}

export default Page;
