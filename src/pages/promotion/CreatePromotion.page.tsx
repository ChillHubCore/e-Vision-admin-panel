import { Loader } from '@mantine/core';
import React, { Suspense } from 'react';
import { PromotionGenerator } from '@/components/Dashboard';

export default function CreatePromotionPage() {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <PromotionGenerator />
      </Suspense>
    </div>
  );
}
