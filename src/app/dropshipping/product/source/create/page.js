import React, { Suspense } from 'react';
import SourceProductForm from '@/components/dropshipping/product/SourceProductForm';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SourceProductForm />
    </Suspense>
  );
}
