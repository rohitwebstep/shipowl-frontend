import dynamic from 'next/dynamic'

// Dynamically import the Login component and disable SSR
const Login = dynamic(() => import('@/components/admin/Login'), {
  ssr: false, // Disable server-side rendering
})

export default function Page() {
  return <Login />
}
