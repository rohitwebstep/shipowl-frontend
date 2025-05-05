import React from 'react';
import Create from '@/components/admin/courier/Create';

// ✅ Prevents prerender crash by disabling static generation
export const dynamic = 'force-dynamic';

export default function Page() {
  return <Create />;
}
