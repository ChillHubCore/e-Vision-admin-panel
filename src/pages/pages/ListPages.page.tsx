import { Button, Container, Flex, Group } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';

export default function ListPagesPage() {
  return (
    <Container size="xl">
      <Flex gap="md" wrap="wrap" my="sm" visibleFrom="sm">
        <Group justify="space-between">
          <Button component={Link} to="/admin/dashboard/pages/create">
            Create New Page
          </Button>
        </Group>
      </Flex>
    </Container>
  );
}
