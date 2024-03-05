import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  Input,
  Loader,
  Menu,
  Modal,
  NativeSelect,
  Pagination,
  Switch,
  Table,
  rem,
} from '@mantine/core';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { IconEdit, IconEye, IconMenuOrder, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'react-toastify';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { useSelector } from 'react-redux';
import { getData } from '@/lib/utils/getData';
import { TransactionEntityProps } from '@/components/Dashboard/types';
import { eAxios } from '@/lib/utils';
import { useSubmit } from '@/lib/hooks';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';

export default function ListTransactionsPage() {
  const [limit, setLimit] = React.useState(10);
  const [desc, setDesc] = React.useState(true);
  const [pageNumber, setPageNumber] = React.useState(1);
  const userInfo = useSelector(selectUserInfo);
  const [timeCreatedSearchInputGTE, setTimeCreatedSearchInputGTE] = React.useState<Date | null>(
    null
  );
  const [timeCreatedSearchInputLTE, setTimeCreatedSearchInputLTE] = React.useState<Date | null>(
    null
  );
  const [usernameSearchInput, setUsernameSearchInput] = React.useState('');
  const [orderId, setTransactionId] = React.useState('');
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const FormActions = useSubmit();
  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = React.useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [
    SubmitTransactionResultOpened,
    { open: openSubmitTransactionResult, close: closeSubmitTransactionResult },
  ] = useDisclosure(false);
  const [
    ApproveTransactionResultOpened,
    { open: openApproveTransactionResult, close: closeApproveTransactionResult },
  ] = useDisclosure(false);

  const handlePageChange = (event: number) => {
    setPageNumber(event);
  };

  const CardToCardPaymentResultForm = useForm({
    initialValues: {
      senderName: '',
      sender: '',
      reciver: '',
      validatorCode: '',
      validatorId: '',
      bankName: '',
      amount: '',
      description: '',
      date: new Date(),
    },
    validate: {
      senderName: isNotEmpty('Sender Name is Required!'),
      sender: isNotEmpty('Sender Card Number is Required!'),
      reciver: isNotEmpty('Reciver Card Number is Required!'),
      validatorCode: isNotEmpty('Validator Code is Required!'),
      validatorId: isNotEmpty('Validator ID is Required!'),
      bankName: isNotEmpty('Bank Name is Required!'),
      amount: isNotEmpty('Amount is Required!'),
      description: isNotEmpty('Description is Required!'),
      date: isNotEmpty('Date is Required!'),
    },
  });

  const Transactions = useQuery(
    'search-transactions',
    () =>
      getData(
        `/transaction?pageNumber=${pageNumber}&limit=${limit}&timeCreatedGTE=${
          timeCreatedSearchInputGTE ? timeCreatedSearchInputGTE?.toISOString() : ''
        }&timeCreatedLTE=${
          timeCreatedSearchInputLTE ? timeCreatedSearchInputLTE?.toISOString() : ''
        }&desc=${desc}&username=${usernameSearchInput}`
      ),
    { cacheTime: 0 }
  );

  const CardToCardOptions = useQuery(
    'Card-To-Card-Options',
    () => getData('/app/payment-options?type=Card-To-Card', userInfo?.token),
    { cacheTime: 10 * 60 }
  );

  async function DeleteOneTransaction({ id }: { id: string }) {
    setDeleteLoading(true);
    try {
      const response = await eAxios.delete(`/transaction/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token || localStorage.getItem('access_token')}`,
        },
      });
      toast.success(response.data.message);
      Transactions.refetch();
    } catch (error) {
      toast.error((error as CustomError)?.response?.data.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  async function CreatePaymentProcess({ id }: { id: string }) {
    setPaymentLoading(true);
    try {
      const response = await eAxios.post(`/transaction/${id}/payment-process`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token || localStorage.getItem('access_token')}`,
        },
      });
      toast.success(response.data.message);
      Transactions.refetch();
    } catch (error) {
      toast.error((error as CustomError)?.response?.data.message);
    } finally {
      setPaymentLoading(false);
    }
  }

  const handleSubmitCardToCardResult = () => {
    console.log(CardToCardPaymentResultForm.values);
    FormActions.sendRequest(
      `/transaction/${selectedTransactionId}/submit-payment-result`,
      CardToCardPaymentResultForm,
      'patch',
      'Payment Result submited Successfully!',
      'Failed to submit payment result! Please try again.',
      () => {
        Transactions.refetch();
        closeSubmitTransactionResult();
      }
    );
  };

  useEffect(() => {
    if (CardToCardOptions.isSuccess && CardToCardOptions.data.length > 0) {
      CardToCardPaymentResultForm.setFieldValue('reciver', CardToCardOptions.data[0]._id);
    }
  }, [CardToCardOptions.isSuccess]);

  const rows = Transactions.data?.transactions?.map((element: TransactionEntityProps) => (
    <Table.Tr key={element._id}>
      <Table.Td>{element._id}</Table.Td>
      <Table.Td>{element.user.username}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>{new Date(element.createdAt).toLocaleString()}</Table.Td>
      <Table.Td>{new Date(element.updatedAt).toLocaleString()}</Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button color="gray">Actions</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Select an Action</Menu.Label>
            <Link to={`/admin/dashboard/transactions/show/${element._id}`}>
              <Menu.Item leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                View
              </Menu.Item>
            </Link>
            <Link to={`/admin/dashboard/orders/show/${element._id}`}>
              <Menu.Item
                leftSection={<IconMenuOrder style={{ width: rem(14), height: rem(14) }} />}
              >
                View Order
              </Menu.Item>
            </Link>

            <Menu.Item
              disabled={paymentLoading}
              onClick={() => {
                CreatePaymentProcess({ id: element._id });
              }}
              leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
            >
              Create a Payment Process
            </Menu.Item>

            <Menu.Item
              onClick={() => {
                openSubmitTransactionResult();
                setSelectedTransactionId(element._id);
                CardToCardPaymentResultForm.setFieldValue('sender', element.user._id);
              }}
              leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
            >
              Submit a Payment Result
            </Menu.Item>

            <Menu.Item
              onClick={() => {
                openApproveTransactionResult();
                setSelectedTransactionId(element._id);
              }}
              leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
            >
              Approve Payment
            </Menu.Item>

            <Link to={`/admin/dashboard/transactions/edit/${element._id}`}>
              <Menu.Item leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                Edit
              </Menu.Item>
            </Link>
            <Menu.Item
              leftSection={<IconX style={{ width: rem(14), height: rem(14) }} />}
              onClick={() => {
                setTransactionId(element._id);
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
                  DeleteOneTransaction({ id: orderId });
                  close();
                }}
              >
                Yes
              </Button>
              <Button onClick={close}>No</Button>
            </Group>
          </Modal>
          {CardToCardOptions.isLoading ? (
            <Loader />
          ) : CardToCardOptions.data.length > 0 ? (
            <Modal opened={SubmitTransactionResultOpened} onClose={close}>
              <p>Submit a Payment Result</p>
              <Box
                component="form"
                onSubmit={CardToCardPaymentResultForm.onSubmit(handleSubmitCardToCardResult)}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                <Input
                  {...CardToCardPaymentResultForm.getInputProps('senderName')}
                  placeholder="Sender Name"
                  required
                />
                <Input
                  {...CardToCardPaymentResultForm.getInputProps('sender')}
                  placeholder="Sender Card Number"
                  required
                  disabled
                />
                <NativeSelect
                  label="Select Reciver Card Number"
                  data={CardToCardOptions.data?.map(
                    (card: { _id: string; cardNumber: string }) => ({
                      label: card.cardNumber,
                      value: card._id,
                    })
                  )}
                  value={CardToCardPaymentResultForm.values.reciver}
                  onChange={(event) => {
                    CardToCardPaymentResultForm.setFieldValue('reciver', event.currentTarget.value);
                  }}
                />
                <Input
                  {...CardToCardPaymentResultForm.getInputProps('validatorCode')}
                  placeholder="Validator Code"
                  required
                />
                <Input
                  {...CardToCardPaymentResultForm.getInputProps('validatorId')}
                  placeholder="Validator ID"
                  required
                />
                <Input
                  {...CardToCardPaymentResultForm.getInputProps('bankName')}
                  placeholder="Bank Name"
                  required
                />
                <Input
                  {...CardToCardPaymentResultForm.getInputProps('amount')}
                  placeholder="Amount"
                  required
                />
                <Input
                  {...CardToCardPaymentResultForm.getInputProps('description')}
                  placeholder="Description"
                  required
                />

                <DateTimePicker
                  value={CardToCardPaymentResultForm.values.date}
                  onChange={(event) => {
                    CardToCardPaymentResultForm.setFieldValue('date', event as Date);
                  }}
                  placeholder="Date"
                  required
                />

                <Group justify="space-between">
                  <Button type="submit">Submit</Button>
                  <Button onClick={closeSubmitTransactionResult}>Cancel</Button>
                </Group>
              </Box>
            </Modal>
          ) : (
            <p>No Options Available!</p>
          )}
          <Modal opened={ApproveTransactionResultOpened} onClose={close}>
            <p>Are You Sure You Want to Approve this Payment?</p>
            <Group>
              <Button
                onClick={() => {
                  FormActions.sendRequest(
                    `/transaction/${selectedTransactionId}/approve-payment`,
                    {},
                    'patch',
                    'Payment Approved Successfully!',
                    'Failed to approve payment! Please try again.',
                    () => {
                      Transactions.refetch();
                      closeApproveTransactionResult();
                    }
                  );
                }}
              >
                Yes
              </Button>
              <Button onClick={closeApproveTransactionResult}>No</Button>
            </Group>
          </Modal>
        </>
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    Transactions.refetch();
  }, [
    pageNumber,
    limit,
    desc,
    timeCreatedSearchInputGTE,
    timeCreatedSearchInputLTE,
    usernameSearchInput,
  ]);

  return Transactions.isLoading ? (
    <Loader />
  ) : (
    Transactions.isSuccess && (
      <Container>
        <Flex gap="md" wrap="wrap" my="sm">
          <Input
            placeholder="Search By Name"
            value={usernameSearchInput}
            onChange={(event) => {
              setUsernameSearchInput(event.currentTarget.value);
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />
        </Flex>
        <Group my="sm">
          <NativeSelect
            w="fit-content"
            placeholder="Limit"
            value={limit}
            onChange={(event) => {
              setLimit(Number(event.currentTarget.value));
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
        <Table withTableBorder withColumnBorders style={{ padding: '2rem' }}>
          <Table.Thead style={{ height: 'max-content' }}>
            <Table.Tr>
              <Table.Th>Transaction ID</Table.Th>
              <Table.Th>Username</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Updated At</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <Pagination
          disabled={Transactions.isLoading}
          total={Transactions.data.length / limit}
          value={pageNumber}
          onChange={(event) => handlePageChange(event)}
          mt="sm"
        />
      </Container>
    )
  );
}
