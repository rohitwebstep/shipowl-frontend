'use client'

import Update from '@/components/admin/sourceproduct/Update';
import React, { Suspense } from 'react';

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Update />
    </Suspense>
  );
}

export default Page;
