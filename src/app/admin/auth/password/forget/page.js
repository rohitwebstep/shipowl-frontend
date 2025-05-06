'use client'

import dynamic from 'next/dynamic'

const ForgotPassword = dynamic(() => import('@/components/admin/ForgotPassword'), {
  ssr: false // Disable server-side rendering for this component
})

export default function Page() {
  return <ForgotPassword />
}
