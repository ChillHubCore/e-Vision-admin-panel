import React, { Suspense } from 'react';
import { ProductGenerator } from '@/components/Dashboard';

export default function CreateProductPage() {
  return (
    <Suspense>
      <ProductGenerator />
    </Suspense>
  );
}
