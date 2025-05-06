

'use client'
import dynamic from 'next/dynamic'

const Dropshippers = dynamic(() => import('@/components/admin/dropshipper/Dropshipper'), {
  ssr: false // Disable server-side rendering
})

export default function Page() {
  return <Dropshippers />
}
