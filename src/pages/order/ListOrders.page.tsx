import {
  Alert,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Input,
  Loader,
  Menu,
  Modal,
  NativeSelect,
  Pagination,
  Radio,
  Switch,
  Table,
  Title,
  rem,
} from '@mantine/core';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { DatePickerInput } from '@mantine/dates';
import { IconCheck, IconEdit, IconEye, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'react-toastify';
import { getData } from '@/lib/utils/getData';
import { OrderEntityProps } from '@/components/Dashboard/types';
import { eAxios } from '@/lib/utils';

export default function ListOrdersPage() {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [timeCreatedSearchInputGTE, setTimeCreatedSearchInputGTE] = React.useState<Date | null>(
    null
  );
  const [timeCreatedSearchInputLTE, setTimeCreatedSearchInputLTE] = React.useState<Date | null>(
    null
  );
  const [desc, setDesc] = React.useState(false);
  const [limit, setLimit] = React.useState(10);
  const [orderStatus, setOrderStatus] = React.useState<OrderEntityProps['status'] | 'all'>('all');
  const [isPaid, setIsPaid] = React.useState<OrderEntityProps['isPaid'] | 'all'>('all');
  const [isDelivered, setIsDelivered] = React.useState<OrderEntityProps['isDelivered'] | 'all'>(
    'all'
  );

  const [isRecived, setIsRecived] = React.useState<OrderEntityProps['isRecived'] | 'all'>('all');
  const [reciverNameSearchStr, setReciverNameSearchStr] = React.useState('');
  const [reciverPhoneSearchStr, setReciverPhoneSearchStr] = React.useState('');
  const [reciverCitySearchStr, setReciverCitySearchStr] = React.useState('');
  const [reciverProvinceSearchStr, setReciverProvinceSearchStr] = React.useState('');
  const [reciverCountrySearchStr, setReciverCountrySearchStr] = React.useState('');
  const [reciverAddressSearchStr, setReciverAddressSearchStr] = React.useState('');
  const [reciverPostalCodeSearchStr, setReciverPostalCodeSearchStr] = React.useState('');
  const [shippingMethod, setShippingMethod] = React.useState<
    OrderEntityProps['shippingAddress']['shippingMethod'] | 'all'
  >('all');
  const [paymentMethod, setPaymentMethod] = React.useState<
    OrderEntityProps['paymentMethod'] | 'all'
  >('all');
  const [promotionsUsed, setPromotionsUsed] = React.useState<string[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [orderId, setOrderId] = React.useState('');

  const Orders = useQuery(
    'search-orders',
    () =>
      getData(
        `/order?pageNumber=${pageNumber}&limit=${limit}&timeCreatedGTE=${
          timeCreatedSearchInputGTE ? timeCreatedSearchInputGTE?.toISOString() : ''
        }&timeCreatedLTE=${
          timeCreatedSearchInputLTE ? timeCreatedSearchInputLTE?.toISOString() : ''
        }&desc=${desc}&status=${orderStatus !== 'all' ? orderStatus : ''}&isPaid=${
          isPaid !== 'all' ? isPaid : ''
        }&isDelivered=${isDelivered !== 'all' ? isDelivered : ''}&isRecived=${
          isRecived !== 'all' ? isRecived : ''
        }&reciverName=${reciverNameSearchStr}&reciverPhone=${reciverPhoneSearchStr}&reciverCity=${reciverCitySearchStr}&reciverProvince=${reciverProvinceSearchStr}&reciverCountry=${reciverCountrySearchStr}&reciverAddress=${reciverAddressSearchStr}&reciverPostalCode=${reciverPostalCodeSearchStr}&shippingMethod=${
          shippingMethod !== 'all' ? shippingMethod : ''
        }&paymentMethod=${
          paymentMethod !== 'all' ? paymentMethod : ''
        }&promotions=${promotionsUsed.join(',')}`
      ),
    { cacheTime: 0 }
  );

  const handlePageChange = (event: number) => {
    setPageNumber(event);
  };

  async function DeleteOneOrder({ id }: { id: string }) {
    setDeleteLoading(true);
    try {
      const response = await eAxios.delete(`/order/${id}`);
      toast.success(response.data.message);
      Orders.refetch();
    } catch (error) {
      toast.error((error as CustomError)?.response?.data.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  const rows = Orders.data?.orders?.map((element: OrderEntityProps) => (
    <Table.Tr key={element._id}>
      <Table.Td>{element.shippingAddress.receiverName}</Table.Td>
      <Table.Td>{element.shippingAddress.receiverPhone}</Table.Td>
      <Table.Td>{element.shippingAddress.city}</Table.Td>
      <Table.Td>{element.shippingAddress.country}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>{element.isPaid ? <IconCheck color="green" /> : <IconX color="red" />}</Table.Td>
      <Table.Td>
        {element.isDelivered ? <IconCheck color="green" /> : <IconX color="red" />}
      </Table.Td>
      <Table.Td>{element.isRecived ? <IconCheck color="green" /> : <IconX color="red" />}</Table.Td>
      <Table.Td>{new Date(element.createdAt).toLocaleString()}</Table.Td>
      <Table.Td>{new Date(element.updatedAt).toLocaleString()}</Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button color="gray">Actions</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Select an Action</Menu.Label>
            <Link to={`/admin/dashboard/orders/show/${element._id}`}>
              <Menu.Item leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                View
              </Menu.Item>
            </Link>
            <Link to={`/admin/dashboard/transactions/create/${element._id}`}>
              <Menu.Item leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                Create Transaction For This Order
              </Menu.Item>
            </Link>
            <Link to={`/admin/dashboard/orders/edit/${element._id}`}>
              <Menu.Item leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                Edit
              </Menu.Item>
            </Link>
            <Menu.Item
              leftSection={<IconX style={{ width: rem(14), height: rem(14) }} />}
              onClick={() => {
                setOrderId(element._id);
                open();
              }}
              disabled={deleteLoading}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <>
          <Modal opened={opened} onClose={close} title="Alert">
            <p>You are About to Delete an Order Are You Sure? This is Unrecoverable!</p>
            <Group>
              <Button
                onClick={() => {
                  DeleteOneOrder({ id: orderId });
                  close();
                }}
              >
                Yes
              </Button>
              <Button onClick={close}>No</Button>
            </Group>
          </Modal>
        </>
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    Orders.refetch();
  }, [
    pageNumber,
    reciverNameSearchStr,
    reciverPhoneSearchStr,
    reciverCitySearchStr,
    reciverProvinceSearchStr,
    reciverCountrySearchStr,
    reciverAddressSearchStr,
    reciverPostalCodeSearchStr,
    shippingMethod,
    paymentMethod,
    promotionsUsed,
    timeCreatedSearchInputGTE,
    timeCreatedSearchInputLTE,
    desc,
    limit,
    orderStatus,
    isPaid,
    isDelivered,
    isRecived,
  ]);

  return Orders.isLoading ? (
    <Loader />
  ) : Orders.isError ? (
    <Alert>Oh No! Something Went Wrong...</Alert>
  ) : (
    Orders.isSuccess && (
      <Container size="lg">
        <Title order={3}>Order List</Title>
        <Flex gap="md" wrap="wrap" my="sm">
          <Input
            placeholder="Search By Name"
            value={reciverNameSearchStr}
            onChange={(event) => {
              setReciverNameSearchStr(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                Orders.refetch();
              }
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />
          <Input
            placeholder="Search By Phone"
            value={reciverPhoneSearchStr}
            onChange={(event) => {
              setReciverPhoneSearchStr(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                Orders.refetch();
              }
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />
          <Input
            placeholder="Search By City"
            value={reciverCitySearchStr}
            onChange={(event) => {
              setReciverCitySearchStr(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                Orders.refetch();
              }
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />
          <Input
            placeholder="Search By Province"
            value={reciverProvinceSearchStr}
            onChange={(event) => {
              setReciverProvinceSearchStr(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                Orders.refetch();
              }
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />
          <Input
            placeholder="Search By Country"
            value={reciverCountrySearchStr}
            onChange={(event) => {
              setReciverCountrySearchStr(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                Orders.refetch();
              }
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />
          <Input
            placeholder="Search By Address"
            value={reciverAddressSearchStr}
            onChange={(event) => {
              setReciverAddressSearchStr(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                Orders.refetch();
              }
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />
          <Input
            placeholder="Search By Postal Code"
            value={reciverPostalCodeSearchStr}
            onChange={(event) => {
              setReciverPostalCodeSearchStr(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                Orders.refetch();
              }
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />

          <NativeSelect
            data={[
              { label: 'All', value: 'all' },
              { label: 'Pishtaz', value: 'Pishtaz' },
              { label: 'Post', value: 'Post' },
            ]}
            placeholder="Search By Shipping Method"
            value={shippingMethod}
            onChange={(event) => {
              setShippingMethod(
                event.currentTarget.value as OrderEntityProps['shippingAddress']['shippingMethod']
              );
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                Orders.refetch();
              }
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />
          <NativeSelect
            data={[
              { label: 'All', value: 'all' },
              { label: 'Card-To-Card', value: 'Card-To-Card' },
            ]}
            placeholder="Search By Payment Method"
            value={paymentMethod}
            onChange={(event) => {
              setPaymentMethod(event.currentTarget.value as OrderEntityProps['paymentMethod']);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                Orders.refetch();
              }
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />
          <Input
            placeholder="Search By Promotions Used"
            value={promotionsUsed.join(',')}
            onChange={(event) => {
              setPromotionsUsed(event.currentTarget.value.split(','));
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                Orders.refetch();
              }
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />
        </Flex>

        <Flex direction="row" gap="sm">
          <Radio.Group
            name="Payment Status"
            label="Select a Paymnet Status"
            onChange={(event) => {
              if (event === 'all') {
                setIsPaid('all');
              } else {
                if (event === 'true') setIsPaid(true);
                if (event === 'false') setIsPaid(false);
              }
            }}
          >
            <Group mt="xs">
              <Radio value="true" label="Yes" />
              <Radio value="false" label="No" />
              <Radio value="all" label="All" />
            </Group>
          </Radio.Group>
          <Divider orientation="vertical" />
          <Radio.Group
            name="Order Status"
            label="Select a Order Status"
            onChange={(event) => {
              setOrderStatus(event as OrderEntityProps['status'] | 'all');
            }}
          >
            <Group mt="xs">
              <Radio value="pending" label="Pending" />
              <Radio value="processing" label="Processing" />
              <Radio value="shipped" label="Shipped" />
              <Radio value="delivered" label="Delivered" />
              <Radio value="all" label="All" />
            </Group>
          </Radio.Group>
          <Divider orientation="vertical" />
          <Radio.Group
            name="Delivery Status"
            label="Select a Delivery Status"
            onChange={(event) => {
              if (event === 'all') {
                setIsDelivered('all');
              } else {
                if (event === 'true') setIsDelivered(true);
                if (event === 'false') setIsDelivered(false);
              }
            }}
          >
            <Group mt="xs">
              <Radio value="true" label="Yes" />
              <Radio value="false" label="No" />
              <Radio value="all" label="All" />
            </Group>
          </Radio.Group>
          <Divider orientation="vertical" />
          <Radio.Group
            name="Recived Status"
            label="Select a Recived Status"
            onChange={(event) => {
              if (event === 'all') {
                setIsRecived('all');
              } else {
                if (event === 'true') setIsRecived(true);
                if (event === 'false') setIsRecived(false);
              }
            }}
          >
            <Group mt="xs">
              <Radio value="true" label="Yes" />
              <Radio value="false" label="No" />
              <Radio value="all" label="All" />
            </Group>
          </Radio.Group>
          <Divider orientation="vertical" />
        </Flex>
        <Group my="md">
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
                Orders.refetch();
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
            onClick={() => Orders.refetch()}
          >
            Filter
          </Button>
          <Button my="md" component={Link} to="/admin/dashboard/orders/create">
            Create New Order
          </Button>
        </Group>
        <Table withTableBorder withColumnBorders style={{ padding: '2rem' }}>
          <Table.Thead style={{ height: 'max-content' }}>
            <Table.Tr>
              <Table.Th>Reciver Name</Table.Th>
              <Table.Th>Reciver Phone</Table.Th>
              <Table.Th>Reciver City</Table.Th>
              <Table.Th>Reciver Country</Table.Th>
              <Table.Th>Order Status</Table.Th>
              <Table.Th>Payment Status</Table.Th>
              <Table.Th>Delivery Status</Table.Th>
              <Table.Th>Recived Status</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Updated At</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <Pagination
          disabled={Orders.isLoading}
          total={Orders.data.length / limit}
          value={pageNumber}
          onChange={(event) => handlePageChange(event)}
          mt="sm"
        />
      </Container>
    )
  );
}
