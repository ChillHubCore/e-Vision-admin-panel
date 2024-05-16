import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Modal,
  Text,
  TypographyStylesProvider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { getData } from '@/lib/utils/getData';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';
import styles from '@/lib/styles/EmailViewer.module.scss';
import EmailGenerator from './EmailGenerator';

export default function EmailViewer({ id }: { id: string }) {
  const userInfo = useSelector(selectUserInfo);
  const EmailFullData = useQuery(`email-id-${id}`, () => getData(`/email/${id}`, userInfo?.token), {
    cacheTime: 60 * 1000,
  });
  const [opened, { open, close }] = useDisclosure(false);
  useDisclosure(false);
  const [refresh, setRefresh] = useState(false);

  return EmailFullData.isLoading ? (
    <Loader />
  ) : EmailFullData.isError ? (
    <Alert>{(EmailFullData.error as Error)?.message || 'Failed to fetch email'}</Alert>
  ) : (
    EmailFullData.data && (
      <Container size="lg" className={styles.container}>
        <Group justify="space-between" className={styles.infoContainer}>
          <Text size="md">Sender : </Text>
          <Text size="md">{EmailFullData.data.senderUsername}</Text>
        </Group>
        <Divider my="sm" />
        <Group justify="space-between" className={styles.infoContainer}>
          <Text size="md">Mail Subject : </Text> <Text size="md">{EmailFullData.data.title}</Text>
        </Group>
        <Divider mt="sm" mb="md" />
        <TypographyStylesProvider className={styles.typographyContainer}>
          <Box
            dangerouslySetInnerHTML={{
              __html: EmailFullData.data.content,
            }}
          />
        </TypographyStylesProvider>
        <Button mt="lg" onClick={open}>
          Reply
        </Button>

        <>
          <Modal opened={opened} onClose={close} title="Write an Email">
            <EmailGenerator
              receiverUser={EmailFullData.data.senderUsername}
              functionToCall={() => {
                setRefresh(!refresh);
                close();
              }}
            />
          </Modal>
        </>
      </Container>
    )
  );
}
