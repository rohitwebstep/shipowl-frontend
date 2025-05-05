'use client'

import React, { Suspense } from 'react';
import Profile from '@/components/supplier/userprofile/Profile';

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Profile />
    </Suspense>
  );
}

export default Page;
