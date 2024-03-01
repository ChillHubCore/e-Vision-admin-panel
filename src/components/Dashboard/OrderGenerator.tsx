import {
  Alert,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Input,
  Loader,
  Pagination,
  Radio,
  Table,
  Text,
  Textarea,
  UnstyledButton,
} from '@mantine/core';
import { Suspense, useEffect, useState } from 'react';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { VariantCard } from '../common';
import { addToCart, removeFromCart } from '@/lib/redux/ShoppingCart/ShoppingCart';
import { getData } from '@/lib/utils/getData';
import { UserEntityProps } from '@/pages/user/ListUsers.page';
import { OrderEntityProps } from './types';
import { useSubmit } from '@/lib/hooks';

export default function OrderGenerator({
  cartItems,
  // OrderData,
}: {
  cartItems: ShoppingCartPayloadProps[];
  // OrderData?: OrderEntityProps;
}) {
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const [searchString, setSearchString] = useState('');
  const FormActions = useSubmit();
  const navigate = useNavigate();

  if (cartItems.length === 0) return <Alert color="orange">Cart is Empty</Alert>;

  const OrderGeneratorForm = useForm({
    initialValues: {
      cartItems: cartItems as ShoppingCartPayloadProps[],
      shippingAddress: {} as OrderEntityProps['shippingAddress'],
      notes: '',
      paymentMethod: '',
      user: '',
      promotions: [] as string[],
    },
    validate: {},
  });

  const Users = useQuery(
    'search-users',
    () => getData(`/user?pageNumber=${pageNumber}&limit=${10}&searchString=${searchString}`),
    { cacheTime: 0 }
  );
  const handlePageChange = (event: number) => {
    setPageNumber(event);
  };
  const handleSubmit = () => {
    FormActions.sendRequest(
      '/order/admin',
      OrderGeneratorForm,
      'post',
      'Order Created Successfully!',
      'Failed to create order! Please try again.',
      () => navigate('/admin/dashboard/orders')
    );
  };
  useEffect(() => {
    Users.refetch();
  }, [pageNumber, searchString]);

  const rows = Users?.data?.users?.map((element: UserEntityProps) => (
    <Table.Tr key={element.phone}>
      <Table.Td>{element.firstName}</Table.Td>
      <Table.Td>{element.lastName}</Table.Td>
      <Table.Td>{element.username}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>+ {element.countryCode}</Table.Td>
      <Table.Td>{element.phone}</Table.Td>
      <Table.Td>
        <Radio value={element._id} label="Select" />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Container>
      <Grid>
        {cartItems.map((item) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={item.variant._id}>
            <Suspense>
              <VariantCard VariantData={item.variant} ProductData={item.product} />
            </Suspense>
            <Flex
              direction="row"
              justify="space-between"
              align="center"
              style={{ borderRadius: '0.5rem' }}
              bg="gray"
              my="md"
              p="xs"
            >
              <UnstyledButton onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}>
                <IconPlus color="green" />
              </UnstyledButton>
              <Text ta="center">Quantity : {item.quantity}</Text>
              <UnstyledButton onClick={() => dispatch(removeFromCart({ ...item, quantity: 1 }))}>
                <IconMinus color="red" />
              </UnstyledButton>
            </Flex>
          </Grid.Col>
        ))}
      </Grid>
      <Text>
        Total Price :{' '}
        {cartItems.reduce(
          (acc, item) =>
            acc +
            (item.variant.price.discountedPrice
              ? item.variant.price.discountedPrice
              : item.variant.price.regularPrice) *
              item.quantity,
          0
        )}
      </Text>
      <Text>
        Total Price (Without Discount):{' '}
        {cartItems.reduce((acc, item) => acc + item.variant.price.regularPrice * item.quantity, 0)}
      </Text>
      <Text>
        Total Discount :{' '}
        {cartItems.reduce((acc, item) => acc + item.variant.price.regularPrice * item.quantity, 0) -
          cartItems.reduce(
            (acc, item) =>
              acc +
              (item.variant.price.discountedPrice
                ? item.variant.price.discountedPrice
                : item.variant.price.regularPrice) *
                item.quantity,
            0
          )}
      </Text>
      <Box component="form" onSubmit={OrderGeneratorForm.onSubmit(handleSubmit)}>
        <Input value={searchString} onChange={(e) => setSearchString(e.target.value)} my="md" />
        {Users.isLoading ? (
          <Loader />
        ) : Users.isError ? (
          <Alert color="red">Error</Alert>
        ) : (
          Users.isSuccess && (
            <Radio.Group {...OrderGeneratorForm.getInputProps('user')}>
              <Table withTableBorder withColumnBorders style={{ padding: '2rem' }}>
                <Table.Thead style={{ height: 'max-content' }}>
                  <Table.Tr>
                    <Table.Th>First Name</Table.Th>
                    <Table.Th>Last Name</Table.Th>
                    <Table.Th>Username</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Country Code</Table.Th>
                    <Table.Th>Phone</Table.Th>
                    <Table.Th>Select</Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
              <Pagination
                disabled={Users.isLoading}
                total={Users.data.length / 10}
                value={pageNumber}
                onChange={(event) => handlePageChange(event)}
                mt="sm"
              />
            </Radio.Group>
          )
        )}

        <Box my="md" display="flex" style={{ flexDirection: 'column', gap: '0.5rem' }}>
          <Text>Shipping Address</Text>
          <Input
            placeholder="Receiver Name"
            {...OrderGeneratorForm.getInputProps('shippingAddress.receiverName')}
          />
          <Input
            placeholder="Receiver Phone"
            {...OrderGeneratorForm.getInputProps('shippingAddress.receiverPhone')}
          />
          <Input
            placeholder="Address"
            {...OrderGeneratorForm.getInputProps('shippingAddress.address')}
          />
          <Input
            placeholder="Country"
            {...OrderGeneratorForm.getInputProps('shippingAddress.country')}
          />
          <Input
            placeholder="Province"
            {...OrderGeneratorForm.getInputProps('shippingAddress.province')}
          />
          <Input placeholder="City" {...OrderGeneratorForm.getInputProps('shippingAddress.city')} />
          <Input
            placeholder="Postal Code"
            {...OrderGeneratorForm.getInputProps('shippingAddress.postalCode')}
          />
          <Input
            placeholder="Shipping Method"
            {...OrderGeneratorForm.getInputProps('shippingAddress.shippingMethod')}
          />
          <Input
            placeholder="Shipping Price"
            {...OrderGeneratorForm.getInputProps('shippingAddress.shippingPrice')}
          />
        </Box>

        <Box my="md">
          <Text>Payment Method</Text>
          <Input
            placeholder="Payment Method"
            {...OrderGeneratorForm.getInputProps('paymentMethod')}
          />
        </Box>
        <Box my="md">
          <Text>Promotions</Text>
          <Input placeholder="Promotions" {...OrderGeneratorForm.getInputProps('promotions')} />
        </Box>
        <Box my="md">
          <Text>Notes</Text>
          <Textarea placeholder="Notes" {...OrderGeneratorForm.getInputProps('notes')} />
        </Box>
        <Button type="submit" my="md">
          Create Order
        </Button>
      </Box>
    </Container>
  );
}