import { Loader } from '@mantine/core';
import React, { Suspense } from 'react';
import { TicketGenerator } from '@/components/Dashboard';

export default function CreateTicketPage() {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <TicketGenerator />
      </Suspense>
    </div>
  );
}
