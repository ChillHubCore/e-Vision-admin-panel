import React, { Suspense } from 'react';
import { Loader } from '@mantine/core';
import { ProductGenerator } from '@/components/Dashboard';

export default function CreateProductPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductGenerator editFlag={false} />
    </Suspense>
  );
}
