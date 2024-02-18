import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Alert, Loader, LoadingOverlay } from '@mantine/core';

import { Suspense } from 'react';
import { getData } from '@/lib/utils/getData';
import { UserGenerator } from '@/components/Dashboard';

export default function EditUserPage() {
  const { id } = useParams();

  const UserData = useQuery(`user-data-${id}`, () => getData(`/user/${id}`), { cacheTime: 0 });

  return UserData.isLoading ? (
    <LoadingOverlay />
  ) : UserData.isError ? (
    <Alert color="red">Something Went Wrong</Alert>
  ) : (
    <Suspense fallback={<Loader />}>
      <UserGenerator UserData={UserData.data} editFlag />
    </Suspense>
  );
}
