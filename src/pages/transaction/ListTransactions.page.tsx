/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Container, Group, NativeSelect, Switch } from '@mantine/core';
import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getData } from '@/lib/utils/getData';

export default function ListTransactionsPage() {
  const [limit, setLimit] = React.useState(10);
  const [desc, setDesc] = React.useState(true);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [timeCreatedSearchInputGTE, setTimeCreatedSearchInputGTE] = React.useState<Date | null>(
    null
  );
  const [timeCreatedSearchInputLTE, setTimeCreatedSearchInputLTE] = React.useState<Date | null>(
    null
  );

  const Transactions = useQuery(
    'search-orders',
    () =>
      getData(
        `/transaction?pageNumber=${pageNumber}&limit=${limit}&timeCreatedGTE=${
          timeCreatedSearchInputGTE ? timeCreatedSearchInputGTE?.toISOString() : ''
        }&timeCreatedLTE=${
          timeCreatedSearchInputLTE ? timeCreatedSearchInputLTE?.toISOString() : ''
        }&desc=${desc}`
      ),
    { cacheTime: 0 }
  );

  return (
    <Container>
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
              Transactions.refetch();
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
      <Group>
        <Button
          my="md"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => Transactions.refetch()}
        >
          Filter
        </Button>
        <Button my="md" component={Link} to="/admin/dashboard/transactions/create">
          Create New Transaction
        </Button>
      </Group>
    </Container>
  );
}
