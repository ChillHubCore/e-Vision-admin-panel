import { Button, Container, Group } from '@mantine/core';
import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getData } from '@/lib/utils/getData';

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
  return (
    <Container size="xl">
      <Group>
        <Button component={Link} to="/admin/dashboard/tickets/create">
          Create New Ticket
        </Button>
      </Group>
    </Container>
  );
}
