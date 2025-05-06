import React, { Suspense } from 'react'
import Create from '@/components/admin/api-credentials/Create'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Create />
    </Suspense>
  )
}
