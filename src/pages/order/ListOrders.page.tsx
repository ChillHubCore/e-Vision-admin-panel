import { Button } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';

export default function ListOrdersPage() {
  return (
    <div>
      <Button component={Link} to="/admin/dashboard/orders/create">
        Create New Order
      </Button>
    </div>
  );
}
