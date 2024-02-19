import { Button } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';

export default function ListProductsPage() {
  return (
    <div>
      <Button component={Link} to="/admin/dashboard/products/create">
        Create New Product
      </Button>
    </div>
  );
}
