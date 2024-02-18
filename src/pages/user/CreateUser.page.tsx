import { Suspense } from 'react';
import { Loader } from '@mantine/core';
import { UserGenerator } from '@/components/Dashboard';

export default function CreateUserPage() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <UserGenerator editFlag={false} />
      </Suspense>
    </>
  );
}
