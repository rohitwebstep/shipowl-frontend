'use client'

import Profile from '@/components/dropshipping/dropshipper/update/Profile';
import React, { Suspense } from 'react';

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Profile/>
    </Suspense>
  );
}

export default Page;
