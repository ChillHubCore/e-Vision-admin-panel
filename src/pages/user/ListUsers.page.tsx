import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Button,
  CloseButton,
  Container,
  Flex,
  Input,
  LoadingOverlay,
  Pagination,
  Table,
  UnstyledButton,
} from '@mantine/core';
import { IconCheck, IconEdit, IconX } from '@tabler/icons-react';
import { getData } from '@/lib/utils/getData';
import classes from '@/lib/styles/User.module.scss';

export interface UserProps {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  addresses: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    isPrimary: boolean;
  }[];
  watchList: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ListUsersPage() {
  const [nameSearchInput, setNameSearchInput] = useState<string>('');
  const [lastNameSearchInput, setLastNameSearchInput] = useState<string>('');
  const [phoneSearchInput, setPhoneSearchInput] = useState<string>('');
  const [emailSearchInput, setEmailSearchInput] = useState<string>('');
  const [primaryCitySearchInput, setPrimaryCitySearchInput] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);

  const Users = useQuery(
    'all-users',
    () =>
      getData(
        `/user?pageNumber=${pageNumber}&firstName=${nameSearchInput}&lastName=${lastNameSearchInput}&phone=${phoneSearchInput}&email=${emailSearchInput}&primaryCity=${primaryCitySearchInput}`
      ),
    {
      cacheTime: 1 * 60000, // Cache data for 1 minute (adjust the value as needed)
    }
  );

  if (Users.isLoading) return <LoadingOverlay />;

  const rows = Users.data.map((element: UserProps) => (
    <Table.Tr key={element.phone}>
      <Table.Td>{element.firstName}</Table.Td>
      <Table.Td>{element.lastName}</Table.Td>
      <Table.Td>{element.username}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.phone}</Table.Td>
      <Table.Td>
        <Flex>
          {element.addresses.map((address) => (
            <div key={address.address} className={classes.primaryCity}>
              {address.isPrimary ? address.city : ''}
            </div>
          ))}
        </Flex>
      </Table.Td>
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
        <UnstyledButton
          style={{
            display: 'flex',
            alignItems: 'center',
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
        >
          <IconEdit color="blue" />
        </UnstyledButton>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container>
      <Flex gap="md" wrap="wrap" my="sm">
        <Button
          my="md"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Create New User
        </Button>
        <Input
          placeholder="Search By Name"
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
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => setNameSearchInput('')}
              style={{ display: nameSearchInput ? undefined : 'none' }}
            />
          }
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
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => setLastNameSearchInput('')}
              style={{ display: lastNameSearchInput ? undefined : 'none' }}
            />
          }
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
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => setPhoneSearchInput('')}
              style={{ display: phoneSearchInput ? undefined : 'none' }}
            />
          }
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
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => setEmailSearchInput('')}
              style={{ display: emailSearchInput ? undefined : 'none' }}
            />
          }
        />
        <Input
          placeholder="Search By Primary City"
          value={primaryCitySearchInput}
          onChange={(event) => {
            setPrimaryCitySearchInput(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              Users.refetch();
            }
          }}
          rightSectionPointerEvents="all"
          mt="md"
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => setPrimaryCitySearchInput('')}
              style={{ display: primaryCitySearchInput ? undefined : 'none' }}
            />
          }
        />
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
      </Flex>
      <Table withTableBorder withColumnBorders style={{ padding: '2rem' }}>
        <Table.Thead style={{ height: 'max-content' }}>
          <Table.Tr>
            <Table.Th>First Name</Table.Th>
            <Table.Th>Last Name</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Primary City</Table.Th>
            <Table.Th>Admin</Table.Th>
            <Table.Th>Creator</Table.Th>
            <Table.Th>Created At</Table.Th>
            <Table.Th>Updated At</Table.Th>
            <Table.Th>Remove</Table.Th>
            <Table.Th>Edit</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pagination
        total={Users.data.length - 1}
        value={pageNumber}
        onChange={(event) => {
          setPageNumber(event);
          Users.refetch();
        }}
        mt="sm"
      />
    </Container>
  );
}
