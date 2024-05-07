import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Alert, Box, Divider, Group, Loader, TypographyStylesProvider } from '@mantine/core';
import { getData } from '@/lib/utils/getData';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';

export default function EmailViewer({ id }: { id: string }) {
  const userInfo = useSelector(selectUserInfo);
  const EmailFullData = useQuery(`email-id-${id}`, () => getData(`/email/${id}`, userInfo?.token), {
    cacheTime: 60 * 1000,
  });

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
        <TypographyStylesProvider>
          <Box
            p={{ xs: 'md', sm: 'lg' }}
            maw={{ xs: '100%', sm: '80%' }}
            style={{ wordWrap: 'break-word' }}
            dangerouslySetInnerHTML={{
              __html: EmailFullData.data.content,
            }}
          />
        </TypographyStylesProvider>
      </div>
    )
  );
}
