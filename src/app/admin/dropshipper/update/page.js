import React, { Suspense } from 'react';
import Profile from '@/components/admin/dropshipper/update/Profile';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Profile />
    </Suspense>
  );
}
