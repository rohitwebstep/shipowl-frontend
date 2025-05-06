import React, { Suspense } from 'react';

// Dynamically import the Dropshippers component
const Dropshippers = React.lazy(() => import('@/components/admin/dropshipper/Dropshipper'));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dropshippers />
    </Suspense>
  );
}
