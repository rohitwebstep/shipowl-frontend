import AddProduct from '@/components/admin/addproducts/AddProduct';
import React, { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddProduct />
    </Suspense>
  );
}
