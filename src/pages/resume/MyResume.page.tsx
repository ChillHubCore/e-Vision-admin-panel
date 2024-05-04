import { Suspense } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Alert, Loader } from '@mantine/core';
import ResumeGenerator from '@/components/Dashboard/ResumeGenerator';
import { getData } from '@/lib/utils/getData';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';

export default function MyResumePage() {
  const userInfo = useSelector(selectUserInfo);
  const ResumeData = useQuery('my-resume', () => getData('/resume/mine/resume', userInfo?.token), {
    cacheTime: 0,
  });
  return ResumeData.isError ? (
    <Alert>
      {ResumeData.error instanceof Error ? ResumeData.error.message : 'An error occurred'}
    </Alert>
  ) : ResumeData.isLoading ? (
    <Loader />
  ) : (
    <div style={{ width: '100%' }}>
      <Suspense fallback={<Loader />}>
        <ResumeGenerator ResumeData={ResumeData.data} />
      </Suspense>
    </div>
  );
}
