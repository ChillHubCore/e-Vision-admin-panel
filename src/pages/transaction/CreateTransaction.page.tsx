import { Box, Button, Container, Input, LoadingOverlay, Title } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useQuery } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getData } from '@/lib/utils/getData';
import { useSubmit } from '@/lib/hooks';

export default function CreateTransactionPage() {
  const { id } = useParams();

  const OrderData = useQuery(`order-data-${id}`, () => getData(`/order/${id}`), { cacheTime: 0 });

  const CreateTransactionForm = useForm({
    initialValues: {
      user: '',
      order: '',
      description: '',
    },
    validate: {
      user: isNotEmpty('User is required'),
      order: isNotEmpty('Order is required'),
      description: isNotEmpty('Description is required'),
    },
  });
  const FormActions = useSubmit();
  const navigate = useNavigate();

  const handleSubmit = () => {
    FormActions.sendRequest(
      '/transaction',
      CreateTransactionForm,
      'post',
      'Transaction Created Successfully!',
      'Failed to create transaction! Please try again.',
      () => navigate('/admin/dashboard/transactions')
    );
  };
  return id === undefined ? (
    <Button component={Link} to="/admin/dashboard/orders">
      Please Choose an Order First Before Making a Transaction!
    </Button>
  ) : OrderData.isLoading ? (
    <LoadingOverlay />
  ) : (
    OrderData.data && (
      <Container>
        <Box component="form" onSubmit={CreateTransactionForm.onSubmit(handleSubmit)}>
          <Title my="md" ta="center" order={3}>
            Create Transaction
          </Title>
          <Input
            {...CreateTransactionForm.getInputProps('description')}
            placeholder="Description"
            required
            type="text"
          />
          <Button
            type="submit"
            my="md"
            loading={FormActions.isLoading}
            onClick={() => {
              CreateTransactionForm.setFieldValue('user', OrderData.data.user._id);
              CreateTransactionForm.setFieldValue('order', OrderData.data._id);
            }}
          >
            Create Transaction
          </Button>
        </Box>
      </Container>
    )
  );
}
