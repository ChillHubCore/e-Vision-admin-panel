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
  List,
  Loader,
  Modal,
  NativeSelect,
  Pagination,
  rem,
  Spoiler,
  Switch,
  Table,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCircleDot, IconCircleDotted, IconEye, IconRefresh, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
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
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [sentFlag, setSentFlag] = useState(false);
  const [receivedFlag, setReceivedFlag] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [timeCreatedSearchInputGTE, setTimeCreatedSearchInputGTE] = useState<Date | null>(null);
  const [timeCreatedSearchInputLTE, setTimeCreatedSearchInputLTE] = useState<Date | null>(null);
  const [desc, setDesc] = useState(false);
  const [username, setUsername] = useState('');
  const [mailTitle, setMailTitle] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  useDisclosure(false);
  const [refresh, setRefresh] = useState(false);

  const MyMails = useQuery('my-mails', () =>
    getData(
      `/email/mine?pageNumber=${pageNumber}&limit=${limit}&timeCreatedGTE=${
        timeCreatedSearchInputGTE ? timeCreatedSearchInputGTE?.toISOString() : ''
      }&timeCreatedLTE=${
        timeCreatedSearchInputLTE ? timeCreatedSearchInputLTE?.toISOString() : ''
      }&desc=${desc}&readOnly=${readOnly}&unreadOnly=${unreadOnly}&sentFlag=${sentFlag}&receivedFlag=${receivedFlag}&username=${username}&title=${mailTitle}`,
      userInfo?.token
    )
  );

  const navigate = useNavigate();

  useEffect(() => {
    MyMails.refetch();
  }, [
    sentFlag,
    receivedFlag,
    readOnly,
    unreadOnly,
    timeCreatedSearchInputGTE,
    timeCreatedSearchInputLTE,
    desc,
    username,
    limit,
    mailTitle,
    pageNumber,
    refresh,
  ]);

  const handlePageChange = (event: number) => {
    setPageNumber(event);
  };

  const rows = MyMails.data?.emails?.map((mail: EmailInterface) => (
    <Table.Tr
      key={mail._id}
      style={{
        opacity: mail.readFlag ? 0.5 : 1,
      }}
    >
      <Table.Td ta="center">{mail.title}</Table.Td>
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
      {/* <Table.Td ta="center">{mail.readFlag ? 'Read' : 'Unread'}</Table.Td> */}
      <Table.Td ta="center">{new Date(mail.createdAt).toLocaleString()}</Table.Td>
      <Table.Td ta="center">
        <Button
          onClick={() => {
            navigate(`/team/dashboard/myemails/view/${mail._id}`);
          }}
          variant="subtle"
        >
          <IconEye />
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return MyMails.isLoading ? (
    <Loader />
  ) : MyMails.isError ? (
    MyMails.data && (
      <Alert color="red">{(MyMails.error as Error)?.message || 'Failed to fetch data'}</Alert>
    )
  ) : (
    <Container size="lg">
      <Title order={3}>My Emails</Title>
      <Spoiler
        pb="md"
        maxHeight={120}
        showLabel="Show More Filters"
        hideLabel="Hide Filters"
        hiddenFrom="sm"
      >
        <Flex gap="md" wrap="wrap" my="sm">
          <Button onClick={open}>Send an Email</Button>
          <Button
            onClick={() => {
              MyMails.refetch();
            }}
          >
            <IconRefresh />
          </Button>

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
              label="Outbox Only Emails"
              checked={sentFlag}
              onChange={() => {
                setSentFlag(true);
                setReceivedFlag(false);
              }}
              mt="md"
            />
            <Switch
              label="Inbox Only Emails"
              checked={receivedFlag}
              onChange={() => {
                setReceivedFlag(true);
                setSentFlag(false);
              }}
              mt="md"
            />
            <Switch
              label="Unread"
              checked={unreadOnly}
              onChange={() => {
                setUnreadOnly(!unreadOnly);
                setReadOnly(false);
              }}
              mt="md"
            />
          </Group>
        </Flex>
      </Spoiler>
      <Flex gap="md" wrap="wrap" my="sm" visibleFrom="sm">
        <Button onClick={open}>Send an Email</Button>
        <Button
          onClick={() => {
            MyMails.refetch();
          }}
        >
          <IconRefresh />
        </Button>

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
            label="Outbox Only Emails"
            checked={sentFlag}
            onChange={() => {
              setSentFlag(true);
              setReceivedFlag(false);
            }}
            mt="md"
          />
          <Switch
            label="Inbox Only Emails"
            checked={receivedFlag}
            onChange={() => {
              setReceivedFlag(true);
              setSentFlag(false);
            }}
            mt="md"
          />
          <Switch
            label="Unread"
            checked={unreadOnly}
            onChange={() => {
              setUnreadOnly(!unreadOnly);
              setReadOnly(false);
            }}
            mt="md"
          />
        </Group>
      </Flex>

      <Table
        withTableBorder
        highlightOnHover
        withColumnBorders
        style={{ padding: '2rem' }}
        visibleFrom="sm"
      >
        <Table.Thead style={{ height: 'max-content' }}>
          <Table.Tr>
            <Table.Th ta="center">Title</Table.Th>
            <Table.Th ta="center">Sender</Table.Th>
            <Table.Th ta="center">Reciver</Table.Th>
            {/* <Table.Th ta="center">Read Flag</Table.Th> */}
            <Table.Th ta="center">Created At</Table.Th>
            <Table.Th ta="center">View</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <List hiddenFrom="sm">
        {MyMails.data.emails.map((mail: EmailInterface) => (
          <List.Item
            p="sm"
            bg="gray"
            my="md"
            style={{ opacity: mail.readFlag ? 0.8 : 1, cursor: 'pointer', borderRadius: '0.5rem' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = mail.readFlag ? '0.6' : '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = mail.readFlag ? '0.8' : '1';
            }}
            onClick={() => {
              navigate(`/team/dashboard/myemails/view/${mail._id}`);
            }}
            icon={
              mail.readFlag ? (
                <ThemeIcon color="gray" size={24} radius="xl">
                  <IconCircleDotted style={{ width: rem(16), height: rem(16), opacity: 0.5 }} />
                </ThemeIcon>
              ) : (
                <ThemeIcon color="blue" size={24} radius="xl">
                  <IconCircleDot style={{ width: rem(16), height: rem(16) }} />
                </ThemeIcon>
              )
            }
            key={mail._id}
          >
            <Title order={4}>{mail.title}</Title>
            <Text>
              From {(mail.sender as { _id: string; username: string }).username} to{' '}
              {(mail.receiver as { _id: string; username: string }).username}
            </Text>
            <Text>{new Date(mail.createdAt).toLocaleString()}</Text>
          </List.Item>
        ))}
      </List>
      <Pagination
        disabled={MyMails.isLoading}
        total={Math.ceil(MyMails.data.length / limit)} // Calculate the total number of pages by dividing the length of MyMails.data by the limit and rounding up
        value={pageNumber}
        onChange={(event) => {
          handlePageChange(event);
        }}
        mt="sm"
      />

      <>
        <Modal opened={opened} onClose={close} title="Write an Email">
          <EmailGenerator
            functionToCall={() => {
              setRefresh(!refresh);
              close();
            }}
          />
        </Modal>
      </>
    </Container>
  );
}
