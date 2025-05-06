import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Create to ensure it's client-side only (if needed)
const Create = dynamic(() => import('@/components/admin/statemanagement/Create'), {
  ssr: false, // disables server-side rendering
  suspense: true,
})

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Create />
    </Suspense>
  )
}
