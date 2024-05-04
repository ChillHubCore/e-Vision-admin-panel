import React, { Suspense } from 'react';
import { Alert, Box, Loader } from '@mantine/core';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import MyProfile from '@/components/Dashboard/MyProfile';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';
import { getData } from '@/lib/utils/getData';

export default function TeamDashboardPage() {
  const userInfo = useSelector(selectUserInfo);

  const UserData = useQuery('my-profile', () => getData('/user/mine/profile', userInfo?.token), {
    cacheTime: 0,
  });
  return UserData.isError ? (
    <Alert>{UserData.error instanceof Error ? UserData.error.message : 'An error occurred'}</Alert>
  ) : (
    UserData.isSuccess && (
      <Box w="100%">
        <Suspense fallback={<Loader />}>
          <MyProfile UserData={UserData.data} />
        </Suspense>
      </Box>
    )
  );
}
