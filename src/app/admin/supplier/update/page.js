import React, { Suspense } from 'react';
import Profile from '@/components/admin/supplier/update/Profile';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Profile />
    </Suspense>
  );
}
