import Update from '@/components/admin/high-rto/Update';
import React, { Suspense } from 'react'

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Update />
    </Suspense>
  )
}
