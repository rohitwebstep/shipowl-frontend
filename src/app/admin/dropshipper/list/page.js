import dynamic from 'next/dynamic'

// Dynamically import Dropshippers and disable SSR
const Dropshippers = dynamic(() => import('@/components/admin/dropshipper/Dropshipper'), {
  ssr: false // Disable server-side rendering for this component
})

export default function Page() {
  return <Dropshippers />
}
