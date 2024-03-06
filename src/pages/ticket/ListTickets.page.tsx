import { Button, Container, Group } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';

export default function ListTicketsPage() {
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
