import { Button, Container, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function ListPromotionsPage() {
  return (
    <Container size="xl">
      <Group>
        <Button component={Link} to="/admin/dashboard/promotions/create">
          Create a New Promotion
        </Button>
      </Group>
    </Container>
  );
}
