import Profile from '@/components/admin/supplier/Profile'
import { ProfileProvider } from '@/components/admin/supplier/ProfileContext'
import React from 'react'

export default function page() {
    return (
        <ProfileProvider>

            <Profile />
        </ProfileProvider>

    )
}
