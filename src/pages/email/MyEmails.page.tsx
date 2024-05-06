import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Container,
  Flex,
  Group,
  Input,
  Loader,
  Modal,
  NativeSelect,
  Pagination,
  Switch,
  Table,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';
import { getData } from '@/lib/utils/getData';
import { EmailGenerator } from '@/components/Dashboard';

interface EmailInterface {
  _id: string;
  sender: string | { _id: string; username: string };
  senderUsername: string;
  receiver: string | { _id: string; username: string };
  receiverUsername: string;
  title: string;
  content: string;
  attachments: string[];
  readFlag: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MyEmailsPage() {
  const userInfo = useSelector(selectUserInfo);
  const [sentFlag, setSentFlag] = useState(false);
  const [recivedFlag, setRecivedFlag] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [timeCreatedSearchInputGTE, setTimeCreatedSearchInputGTE] = useState<Date | null>(null);
  const [timeCreatedSearchInputLTE, setTimeCreatedSearchInputLTE] = useState<Date | null>(null);
  const [desc, setDesc] = useState(false);
  const [username, setUsername] = useState('');
  const [mailTitle, setMailTitle] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);
  const [opened, { open, close }] = useDisclosure(false);

  const MyMails = useQuery(
    'my-sent-mails',
    () =>
      getData(
        `/email/mine?pageNumber=${pageNumber}&limit=${limit}&timeCreatedGTE=${
          timeCreatedSearchInputGTE ? timeCreatedSearchInputGTE?.toISOString() : ''
        }&timeCreatedLTE=${
          timeCreatedSearchInputLTE ? timeCreatedSearchInputLTE?.toISOString() : ''
        }&desc=${desc}&readOnly=${readOnly}&unreadOnly=${unreadOnly}&sentFlag=${sentFlag}&recivedFlag=${recivedFlag}&username=${username}&title=${mailTitle}`,
        userInfo?.token
      ),
    {
      cacheTime: 0,
    }
  );

  useEffect(() => {
    MyMails.refetch();
  }, [
    sentFlag,
    recivedFlag,
    readOnly,
    unreadOnly,
    timeCreatedSearchInputGTE,
    timeCreatedSearchInputLTE,
    desc,
    username,
    pageNumber,
    limit,
  ]);

  const handlePageChange = (event: number) => {
    setPageNumber(event);
  };

  const rows = MyMails.data?.emails?.map((mail: EmailInterface) => (
    <Table.Tr key={mail._id}>
      <Table.Td ta="center">
        {
          (
            mail.sender as {
              _id: string;
              username: string;
            }
          ).username
        }
      </Table.Td>
      <Table.Td ta="center">
        {
          (
            mail.receiver as {
              _id: string;
              username: string;
            }
          ).username
        }
      </Table.Td>
      <Table.Td ta="center">{mail.title}</Table.Td>
      <Table.Td ta="center">{mail.readFlag ? 'Read' : 'Unread'}</Table.Td>
    </Table.Tr>
  ));

  return MyMails.isLoading ? (
    <Loader />
  ) : MyMails.isError ? (
    <Alert>Trouble fetching your emails. Please try again later.</Alert>
  ) : (
    MyMails.isSuccess && (
      <Container size="lg">
        <Title order={3}>My Emails</Title>
        <Flex gap="md" wrap="wrap" my="sm">
          <Input
            placeholder="Search by username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <Input
            placeholder="Search by title"
            value={mailTitle}
            onChange={(e) => setMailTitle(e.currentTarget.value)}
          />
          <Group my="md" w="100%">
            <DatePickerInput
              value={timeCreatedSearchInputGTE}
              onChange={setTimeCreatedSearchInputGTE}
              placeholder="Created After Date input"
              rightSection={<IconX onClick={() => setTimeCreatedSearchInputGTE(null)} />}
            />
            <DatePickerInput
              value={timeCreatedSearchInputLTE}
              onChange={setTimeCreatedSearchInputLTE}
              placeholder="Created Before Date input"
              rightSection={<IconX onClick={() => setTimeCreatedSearchInputLTE(null)} />}
            />
            <Button onClick={open}>Send an Email</Button>
          </Group>
          <Group my="sm">
            <NativeSelect
              w="fit-content"
              placeholder="Limit"
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.currentTarget.value));
              }}
              rightSectionPointerEvents="all"
              mt="md"
              data={[
                { label: '10', value: '10' },
                { label: '20', value: '20' },
                { label: '50', value: '50' },
                { label: '100', value: '100' },
              ]}
            />
            <Switch label="Descending" checked={desc} onChange={() => setDesc(!desc)} mt="md" />
            <Switch
              label="Sent Only Emails"
              checked={sentFlag}
              onChange={() => setSentFlag(!sentFlag)}
              mt="md"
            />
            <Switch
              label="Recived Only Emails"
              checked={recivedFlag}
              onChange={() => setRecivedFlag(!recivedFlag)}
              mt="md"
            />
            <Switch
              label="Opened Only"
              checked={readOnly}
              onChange={() => setReadOnly(!readOnly)}
              mt="md"
            />
            <Switch
              label="Unopened Only"
              checked={unreadOnly}
              onChange={() => setUnreadOnly(!unreadOnly)}
              mt="md"
            />
          </Group>
        </Flex>
        <Table withTableBorder withColumnBorders style={{ padding: '2rem' }}>
          <Table.Thead style={{ height: 'max-content' }}>
            <Table.Tr>
              <Table.Th ta="center">Sender</Table.Th>
              <Table.Th ta="center">Reciver</Table.Th>
              <Table.Th ta="center">Title</Table.Th>
              <Table.Th ta="center">Read Flag</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <Pagination
          disabled={MyMails.isLoading}
          total={MyMails.data.length / limit}
          value={pageNumber}
          onChange={(event) => handlePageChange(event)}
          mt="sm"
        />
        <>
          <Modal opened={opened} onClose={close} title="Write an Email">
            <EmailGenerator />
          </Modal>
        </>
      </Container>
    )
  );
}
