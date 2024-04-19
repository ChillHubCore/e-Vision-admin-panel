import { Alert, Button, Container, Group, Loader, Stack, Table } from '@mantine/core';
import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getData } from '@/lib/utils/getData';
import { TicketEntityProps } from '@/components/Dashboard/types';

export default function ListTicketsPage() {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [timeCreatedSearchInputGTE, setTimeCreatedSearchInputGTE] = React.useState<Date | null>(
    null
  );
  const [timeCreatedSearchInputLTE, setTimeCreatedSearchInputLTE] = React.useState<Date | null>(
    null
  );
  const [desc, setDesc] = React.useState(false);
  const Tickets = useQuery('search-tickets', () =>
    getData(
      `/ticket?pageNumber=${pageNumber}&limit=${limit}&timeCreatedGTE=${
        timeCreatedSearchInputGTE ? timeCreatedSearchInputGTE?.toISOString() : ''
      }&timeCreatedLTE=${
        timeCreatedSearchInputLTE ? timeCreatedSearchInputLTE?.toISOString() : ''
      }&desc=${desc}`
    )
  );
  const rows = Tickets.data?.map((ticket: TicketEntityProps) => (
    <Table.Tr key={ticket._id}>
      <Table.Td>{ticket.title}</Table.Td>
      <Table.Td>{new Date(ticket.createdAt).toLocaleString()}</Table.Td>
      <Table.Td>{ticket.status}</Table.Td>
      <Table.Td>{ticket.priority}</Table.Td>
      <Table.Td>{ticket.ticketType}</Table.Td>
      <Table.Td>{(ticket.assignedTo as { username: string }).username}</Table.Td>
      <Table.Td>
        <Button
          component={Link}
          to={`/admin/dashboard/tickets/${ticket._id}`}
          variant="outline"
          color="blue"
        >
          View
        </Button>
      </Table.Td>
    </Table.Tr>
  ));
  return Tickets.isLoading ? (
    <Loader />
  ) : Tickets.isSuccess ? (
    <Container size="xl">
      <Stack my="md">
        <Group>
          <Button component={Link} to="/admin/dashboard/tickets/create">
            Create New Ticket
          </Button>
        </Group>
      </Stack>
      <Table withTableBorder withColumnBorders style={{ padding: '2rem' }}>
        <Table.Thead style={{ height: 'max-content' }}>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Time Created</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Priority</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Assigned To</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  ) : (
    <Alert title="Error" color="red">
      An error occurred while fetching Tickets!
    </Alert>
  );
}
