import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Alert, Divider, Group, Loader, TypographyStylesProvider } from '@mantine/core';
import { useEffect } from 'react';
import { getData } from '@/lib/utils/getData';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';

export default function EmailViewer({
  id,
  functionToCall,
}: {
  id: string;
  functionToCall: () => void;
}) {
  const userInfo = useSelector(selectUserInfo);
  const EmailFullData = useQuery(`email-id-${id}`, () => getData(`/email/${id}`, userInfo?.token), {
    cacheTime: 60 * 1000,
  });
  useEffect(() => {
    if (
      EmailFullData.data &&
      !EmailFullData.data.readFlag &&
      EmailFullData.data.receiverUsername === userInfo?.username
    ) {
      console.log('Refetch Called!');
      functionToCall();
    }
  }, [EmailFullData]);

  return EmailFullData.isLoading ? (
    <Loader />
  ) : EmailFullData.isError ? (
    <Alert>{(EmailFullData.error as Error)?.message || 'Failed to fetch email'}</Alert>
  ) : (
    EmailFullData.data && (
      <div>
        <Group justify="space-between">
          <p>Sender : </p> <p>{EmailFullData.data.senderUsername}</p>
        </Group>
        <Divider my="sm" />
        <Group justify="space-between">
          <p>Mail Subject : </p> <p>{EmailFullData.data.title}</p>
        </Group>
        <Divider mt="sm" mb="md" />
        <TypographyStylesProvider
          style={{ border: '0.01rem solid', padding: '1rem', borderRadius: '0.5rem' }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: EmailFullData.data.content,
            }}
          />
        </TypographyStylesProvider>
      </div>
    )
  );
}
