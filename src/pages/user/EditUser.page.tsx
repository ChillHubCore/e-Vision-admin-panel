import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Alert, Loader, LoadingOverlay } from '@mantine/core';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { getData } from '@/lib/utils/getData';
import { UserGenerator } from '@/components/Dashboard';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';

export default function EditUserPage() {
  const { id } = useParams();
  const userInfo = useSelector(selectUserInfo);
  const UserData = useQuery(`user-data-${id}`, () => getData(`/user/${id}`, userInfo?.token), {
    cacheTime: 0,
  });

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
