import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  Button,
  Container,
  Flex,
  Group,
  Input,
  Loader,
  LoadingOverlay,
  Modal,
  NativeSelect,
  Pagination,
  Switch,
  Table,
  UnstyledButton,
} from '@mantine/core';
import { IconCheck, IconEdit, IconEye, IconX } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { DatePickerInput } from '@mantine/dates';
import { getData } from '@/lib/utils/getData';
import { eAxios } from '@/lib/utils';

export interface UserEntityProps {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  addresses: AddressProps[];
  watchList: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AddressProps {
  address: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  isPrimary: boolean;
}

export default function ListUsersPage() {
  const [nameSearchInput, setNameSearchInput] = useState<string>('');
  const [lastNameSearchInput, setLastNameSearchInput] = useState<string>('');
  const [phoneSearchInput, setPhoneSearchInput] = useState<string>('');
  const [emailSearchInput, setEmailSearchInput] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);
  const [userId, setUserId] = useState<string>('');
  const [timeCreatedSearchInputGTE, setTimeCreatedSearchInputGTE] = useState<Date | null>();
  const [timeCreatedSearchInputLTE, setTimeCreatedSearchInputLTE] = useState<Date | null>();
  const [desc, setDesc] = useState<boolean>(true);
  const [opened, { open, close }] = useDisclosure(false);

  const navigate = useNavigate();

  const Users = useQuery(
    'search-users',
    () =>
      getData(
        `/user?pageNumber=${pageNumber}&firstName=${nameSearchInput}&lastName=${lastNameSearchInput}&phone=${phoneSearchInput}&email=${emailSearchInput}&limit=${limit}&timeCreatedGTE=${
          timeCreatedSearchInputGTE ? timeCreatedSearchInputGTE?.toISOString() : ''
        }&timeCreatedLTE=${
          timeCreatedSearchInputLTE ? timeCreatedSearchInputLTE?.toISOString() : ''
        }&desc=${desc}`
      ),
    { cacheTime: 0 }
  );

  useEffect(() => {
    Users.refetch();
  }, [
    pageNumber,
    nameSearchInput,
    lastNameSearchInput,
    phoneSearchInput,
    emailSearchInput,
    limit,
    timeCreatedSearchInputGTE,
    timeCreatedSearchInputLTE,
    desc,
  ]);

  const handlePageChange = (event: number) => {
    setPageNumber(event);
  };

  if (Users.isLoading) return <LoadingOverlay />;

  async function DeleteOneUser({ id }: { id: string }) {
    setDeleteLoading(true);
    try {
      const response = await eAxios.delete(`/user/${id}`);
      toast.success(response.data.message);
      Users.refetch();
    } catch (error) {
      toast.error((error as CustomError)?.response?.data.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  const rows = Users.data.users.map((element: UserEntityProps) => (
    <Table.Tr key={element.phone}>
      <Table.Td>{element.firstName}</Table.Td>
      <Table.Td>{element.lastName}</Table.Td>
      <Table.Td>{element.username}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.phone}</Table.Td>

      <Table.Td>
        <UnstyledButton
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {element.isAdmin ? <IconCheck color="green" /> : <IconX color="red" />}
        </UnstyledButton>
      </Table.Td>
      <Table.Td>
        <UnstyledButton
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {element.isCreator ? <IconCheck color="green" /> : <IconX color="red" />}
        </UnstyledButton>
      </Table.Td>
      <Table.Td>{new Date(element.createdAt).toLocaleString()}</Table.Td>
      <Table.Td>{new Date(element.updatedAt).toLocaleString()}</Table.Td>
      <Table.Td>
        <>
          <Modal opened={opened} onClose={close} title="Alert">
            <p>You are About to Delete a User Are You Sure? This is Unrecoverable!</p>
            <Group>
              <Button
                onClick={() => {
                  DeleteOneUser({ id: userId });
                  close();
                }}
              >
                Yes
              </Button>
              <Button onClick={close}>No</Button>
            </Group>
          </Modal>
        </>
        <UnstyledButton
          disabled={deleteLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => {
            setUserId(element._id);
            open();
          }}
        >
          <IconX color="red" />
        </UnstyledButton>
      </Table.Td>
      <Table.Td>
        <UnstyledButton
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => navigate(`/admin/dashboard/users/edit/${element._id}`)}
        >
          <IconEdit color="blue" />
        </UnstyledButton>
      </Table.Td>
      <Table.Td>
        <UnstyledButton
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => navigate(`/admin/dashboard/users/show/${element._id}`)}
        >
          <IconEye color="green" />
        </UnstyledButton>
      </Table.Td>
    </Table.Tr>
  ));

  return Users.isLoading ? (
    <Loader />
  ) : (
    <Container size="lg">
      <Flex gap="md" wrap="wrap" my="sm">
        <Input
          placeholder="Search By First Name"
          value={nameSearchInput}
          onChange={(event) => {
            setNameSearchInput(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              Users.refetch();
            }
          }}
          rightSectionPointerEvents="all"
          mt="md"
        />
        <Input
          placeholder="Search By Last Name"
          value={lastNameSearchInput}
          onChange={(event) => {
            setLastNameSearchInput(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              Users.refetch();
            }
          }}
          rightSectionPointerEvents="all"
          mt="md"
        />
        <Input
          placeholder="Search By Phone"
          value={phoneSearchInput}
          onChange={(event) => {
            setPhoneSearchInput(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              Users.refetch();
            }
          }}
          rightSectionPointerEvents="all"
          mt="md"
        />
        <Input
          placeholder="Search By Email"
          value={emailSearchInput}
          onChange={(event) => {
            setEmailSearchInput(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              Users.refetch();
            }
          }}
          rightSectionPointerEvents="all"
          mt="md"
        />
      </Flex>

      <Group my="sm">
        <NativeSelect
          w="fit-content"
          placeholder="Limit"
          value={limit}
          onChange={(event) => {
            setLimit(Number(event.currentTarget.value));
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              Users.refetch();
            }
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
      </Group>

      <Group my="sm">
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

      <Group>
        <Button
          my="md"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => Users.refetch()}
        >
          Filter
        </Button>
        <Button
          my="md"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => navigate('/admin/dashboard/users/create')}
        >
          Create New User
        </Button>
      </Group>

      <Table withTableBorder withColumnBorders style={{ padding: '2rem' }}>
        <Table.Thead style={{ height: 'max-content' }}>
          <Table.Tr>
            <Table.Th>First Name</Table.Th>
            <Table.Th>Last Name</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Admin</Table.Th>
            <Table.Th>Creator</Table.Th>
            <Table.Th>Created At</Table.Th>
            <Table.Th>Updated At</Table.Th>
            <Table.Th>Delete</Table.Th>
            <Table.Th>Edit</Table.Th>
            <Table.Th>View</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pagination
        disabled={Users.isLoading}
        total={Users.data.length / limit}
        value={pageNumber}
        onChange={(event) => handlePageChange(event)}
        mt="sm"
      />
    </Container>
  );
}
