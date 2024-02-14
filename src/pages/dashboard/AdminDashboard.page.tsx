import { Loader } from '@mantine/core';
import { Suspense } from 'react';

import { ShopSummary } from '@/components/Dashboard';

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ShopSummary />
    </Suspense>
  );
}
