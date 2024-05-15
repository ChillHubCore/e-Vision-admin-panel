import { Container, Loader } from '@mantine/core';
import { Suspense } from 'react';
import { PageGenerator } from '@/components/Dashboard';

export default function CreatePagePage() {
  return (
    <Container w="100%" size="xl">
      <Suspense fallback={<Loader />}>
        <PageGenerator />
      </Suspense>
    </Container>
  );
}
