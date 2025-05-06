import List from '@/components/admin/courier/List'
import React, { Suspense } from 'react'

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <List />
    </Suspense>
  )
}
