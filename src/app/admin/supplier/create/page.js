import Profile from '@/components/admin/supplier/Profile'
import React,{Suspense} from 'react'

export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <Profile/>
          </Suspense>

    )
}
