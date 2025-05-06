import React, { Suspense } from 'react'
import Dropshippers from '@/components/admin/dropshipper/Dropshipper'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dropshippers />
    </Suspense>
  )
}
