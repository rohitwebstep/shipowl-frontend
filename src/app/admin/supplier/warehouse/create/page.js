import AddWarehouse from '@/components/admin/warehouse/AddWarehouse'
import React from 'react'

export default function Page() {
  return (
    <div>
      {typeof window !== 'undefined' ? <AddWarehouse /> : null}
    </div>
  )
}
