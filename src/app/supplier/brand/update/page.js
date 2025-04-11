'use client'

import React, { Suspense } from 'react';
import Update from '@/components/supplier/brand/Update'

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Update />
    </Suspense>
  );
}

export default Page;
