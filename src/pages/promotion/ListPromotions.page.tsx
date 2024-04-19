import {
  Alert,
  Button,
  Container,
  Group,
  Loader,
  Modal,
  NativeSelect,
  Stack,
  Switch,
  Table,
  TextInput,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IconEdit, IconEye, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DatePickerInput } from '@mantine/dates';
import { getData } from '@/lib/utils/getData';
import { PromotionEntityProps } from '@/components/Dashboard/types';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';
import { eAxios } from '@/lib/utils';

export default function ListPromotionsPage() {
  const [timeCreatedSearchInputGTE, setTimeCreatedSearchInputGTE] = useState<Date | null>(null);
  const [timeCreatedSearchInputLTE, setTimeCreatedSearchInputLTE] = useState<Date | null>(null);
  const [desc, setDesc] = useState(true);
  const [promotionIdentifierSearchInput, setPromotionIdentifierSearchInput] = useState('');
  const [activeFromSearchInput, setActiveFromSearchInput] = useState<Date | null>(null);
  const [activeUntilSearchInput, setActiveUntilSearchInput] = useState<Date | null>(null);
  const [isPromotionActive, setIsPromotionActive] = useState<boolean | ''>('');
  const [promotionId, setPromotionId] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);

  const Promotions = useQuery(
    'search-promotions',
    () =>
      getData(
        `/promotion?timeCreatedGTE=${
          timeCreatedSearchInputGTE ? timeCreatedSearchInputGTE?.toISOString() : ''
        }&timeCreatedLTE=${
          timeCreatedSearchInputLTE ? timeCreatedSearchInputLTE?.toISOString() : ''
        }&desc=${desc}&promotionIdentifier=${promotionIdentifierSearchInput}&activeFrom=${
          activeFromSearchInput ? activeFromSearchInput?.toISOString() : ''
        }&activeUntil=${
          activeUntilSearchInput ? activeUntilSearchInput?.toISOString() : ''
        }&active=${isPromotionActive}`
      ),
    { cacheTime: 0 }
  );
  async function DeleteOnePromotion({ id }: { id: string }) {
    setDeleteLoading(true);
    try {
      const response = await eAxios.delete(`/promotion/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token || localStorage.getItem('access_token')}`,
        },
      });
      toast.success(response.data.message);
      Promotions.refetch();
    } catch (error) {
      toast.error((error as CustomError)?.response?.data.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  const rows = Promotions.data?.map((promotion: PromotionEntityProps) => (
    <Table.Tr key={promotion._id}>
      <Table.Td>{promotion.promotionIdentifier}</Table.Td>
      <Table.Td>{promotion.description}</Table.Td>
      <Table.Td>{new Date(promotion.activeFrom).toDateString()}</Table.Td>
      <Table.Td>{new Date(promotion.activeUntil).toDateString()}</Table.Td>
      <Table.Td>
        <Button color={promotion.active ? 'teal' : 'red'}>
          {promotion.active ? 'Active' : 'Inactive'}
        </Button>
      </Table.Td>
      <Table.Td>
        <>
          <Modal opened={opened} onClose={close} title="Alert">
            <p>You are About to Delete a Promotion Are You Sure? This is Unrecoverable!</p>
            <Group>
              <Button
                onClick={() => {
                  DeleteOnePromotion({ id: promotionId });
                  close();
                }}
              >
                Yes
              </Button>
              <Button onClick={close}>No</Button>
            </Group>
          </Modal>
        </>
        <UnstyledButton
          disabled={deleteLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => {
            setPromotionId(promotion._id);
            open();
          }}
        >
          <IconX color="red" />
        </UnstyledButton>
      </Table.Td>
      <Table.Td>
        <UnstyledButton
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => navigate(`/admin/dashboard/promotions/edit/${promotion._id}`)}
        >
          <IconEdit color="blue" />
        </UnstyledButton>
      </Table.Td>
      <Table.Td>
        <UnstyledButton
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => navigate(`/admin/dashboard/promotions/show/${promotion._id}`)}
        >
          <IconEye color="green" />
        </UnstyledButton>
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    Promotions.refetch();
  }, [
    desc,
    timeCreatedSearchInputGTE,
    timeCreatedSearchInputLTE,
    promotionIdentifierSearchInput,
    activeFromSearchInput,
    activeUntilSearchInput,
    isPromotionActive,
  ]);

  return Promotions.isLoading ? (
    <Loader />
  ) : Promotions.isSuccess ? (
    <Container size="xl">
      <Stack my="md">
        <Group my="sm">
          <Switch label="Descending" checked={desc} onChange={() => setDesc(!desc)} mt="md" />
          <NativeSelect
            data={[
              { label: 'All', value: '' },
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
            onChange={(e) => {
              if (e.target.value === '') {
                setIsPromotionActive('');
              } else if (e.target.value === 'true') {
                setIsPromotionActive(true);
              } else {
                setIsPromotionActive(false);
              }
            }}
          />
        </Group>
        <Group my="sm">
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
          <DatePickerInput
            value={activeFromSearchInput}
            onChange={setActiveFromSearchInput}
            placeholder="Active From Date input"
            rightSection={<IconX onClick={() => setActiveFromSearchInput(null)} />}
          />
          <DatePickerInput
            value={activeUntilSearchInput}
            onChange={setActiveUntilSearchInput}
            placeholder="Active Until Date input"
            rightSection={<IconX onClick={() => setActiveUntilSearchInput(null)} />}
          />
        </Group>
        <Group my="sm">
          <Tooltip label="Search By Promotion Identifier">
            <TextInput
              value={promotionIdentifierSearchInput}
              onChange={(event) => {
                setPromotionIdentifierSearchInput(event.target.value);
              }}
              placeholder="Search promotions"
            />
          </Tooltip>
        </Group>
        <Button w="fit-content" component={Link} to="/admin/dashboard/promotions/create">
          Create a New Promotion
        </Button>
      </Stack>
      <Table withTableBorder withColumnBorders style={{ padding: '2rem' }}>
        <Table.Thead style={{ height: 'max-content' }}>
          <Table.Tr>
            <Table.Th>Promotion Identifier</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Active From</Table.Th>
            <Table.Th>Active Until</Table.Th>
            <Table.Th>Active</Table.Th>
            <Table.Th>Delete</Table.Th>
            <Table.Th>Edit</Table.Th>
            <Table.Th>View</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  ) : (
    <Alert title="Error" color="red">
      An error occurred while fetching Promotions!
    </Alert>
  );
}
