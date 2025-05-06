import React, { Suspense } from 'react';
import AddProduct from '@/components/admin/addproducts/AddProduct';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddProduct />
    </Suspense>
  );
}
