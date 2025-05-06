import React, { Suspense } from 'react';
import Update from '@/components/admin/citymanagement/Update';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Update />
    </Suspense>
  );
}
