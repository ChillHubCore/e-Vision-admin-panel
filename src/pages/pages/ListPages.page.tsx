import {
  Button,
  Container,
  Divider,
  Flex,
  Group,
  List,
  Loader,
  Menu,
  NativeSelect,
  Pagination,
  rem,
  Spoiler,
  Switch,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { DatePickerInput } from '@mantine/dates';
import { IconArticle, IconTrash, IconX } from '@tabler/icons-react';
import { eAxios } from '@/lib/utils';
import { getData } from '@/lib/utils/getData';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';
import { PageEntityProps } from '@/components/Dashboard/types';

export default function ListPagesPage() {
  const [limit, setLimit] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [desc, setDesc] = useState(true);
  const [pageTitleSearchInput, setPageTitleSearchInput] = useState('');
  const [slugSearchInput, setSlugSearchInput] = useState('');
  const [timeCreatedSearchInputGTE, setTimeCreatedSearchInputGTE] = useState<Date | null>(null);
  const [timeCreatedSearchInputLTE, setTimeCreatedSearchInputLTE] = useState<Date | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const userInfo = useSelector(selectUserInfo);

  const Pages = useQuery(
    'search-pages',
    () =>
      getData(
        `/page?pageNumber=${pageNumber}&timeCreatedGTE=${
          timeCreatedSearchInputGTE ? timeCreatedSearchInputGTE?.toISOString() : ''
        }&timeCreatedLTE=${
          timeCreatedSearchInputLTE ? timeCreatedSearchInputLTE?.toISOString() : ''
        }&desc=${desc}&limit=${limit}&title=${pageTitleSearchInput}&slug=${slugSearchInput}`
      ),
    {
      cacheTime: 0,
    }
  );
  async function DeleteOnePage({ id }: { id: string }) {
    setDeleteLoading(true);
    try {
      const response = await eAxios.delete(`/page/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token || localStorage.getItem('access_token')}`,
        },
      });
      toast.success(response.data.message);
      Pages.refetch();
    } catch (error) {
      toast.error((error as CustomError)?.response?.data.message);
    } finally {
      setDeleteLoading(false);
    }
  }
  useEffect(() => {
    Pages.refetch();
  }, [
    pageNumber,
    timeCreatedSearchInputGTE,
    timeCreatedSearchInputLTE,
    desc,
    limit,
    pageTitleSearchInput,
    slugSearchInput,
  ]);
  const rows = Pages.data?.pages?.map((element: PageEntityProps) => (
    <Table.Tr key={element._id}>
      <Table.Td ta="center">{element.title}</Table.Td>
      <Table.Td ta="center">{element.slug}</Table.Td>
      <Table.Td ta="center">{element.description}</Table.Td>
      <Table.Td ta="center">{element.active ? 'Yes' : 'No'}</Table.Td>
      <Table.Td ta="center">
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button color="gray">Actions</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Select an Action</Menu.Label>
            <Menu.Item
              onClick={() => {
                DeleteOnePage({ id: element._id });
              }}
              leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));
  return Pages.isLoading ? (
    <Loader />
  ) : (
    Pages.isSuccess && (
      <Container w="100%" size="xl">
        <Spoiler
          pb="md"
          maxHeight={120}
          showLabel="Show More Filters"
          hideLabel="Hide Filters"
          hiddenFrom="sm"
        >
          <Flex gap="md" wrap="wrap" my="sm">
            <Group w="100%">
              <Button loading={deleteLoading} component={Link} to="/admin/dashboard/pages/create">
                Create New Page
              </Button>
              <TextInput
                placeholder="Search by title"
                value={pageTitleSearchInput}
                onChange={(event) => setPageTitleSearchInput(event.currentTarget.value)}
              />
              <TextInput
                placeholder="Search by slug"
                value={slugSearchInput}
                onChange={(event) => setSlugSearchInput(event.currentTarget.value)}
              />
            </Group>
            <Group w="100%" my="sm">
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
            <Group w="100%" my="sm">
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
          </Flex>
        </Spoiler>
        <Flex gap="md" wrap="wrap" my="sm" visibleFrom="sm">
          <Group w="100%">
            <Button component={Link} to="/admin/dashboard/pages/create">
              Create New Page
            </Button>
            <TextInput
              placeholder="Search by title"
              value={pageTitleSearchInput}
              onChange={(event) => setPageTitleSearchInput(event.currentTarget.value)}
            />
            <TextInput
              placeholder="Search by slug"
              value={slugSearchInput}
              onChange={(event) => setSlugSearchInput(event.currentTarget.value)}
            />
          </Group>
          <Group w="100%" my="sm">
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
          <Group w="100%" my="sm">
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
        </Flex>
        <Table withTableBorder withColumnBorders style={{ padding: '2rem' }} visibleFrom="sm">
          <Table.Thead style={{ height: 'max-content' }}>
            <Table.Tr>
              <Table.Th ta="center">Title</Table.Th>
              <Table.Th ta="center">Slug</Table.Th>
              <Table.Th ta="center">Description</Table.Th>
              <Table.Th ta="center">Active</Table.Th>
              <Table.Th ta="center">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <List hiddenFrom="sm">
          {Pages.data?.pages?.map((element: PageEntityProps) => (
            <div key={element._id}>
              <List.Item
                p="sm"
                my="md"
                icon={
                  <ThemeIcon color="blue" size={24} radius="md" mr="sm">
                    <IconArticle />
                  </ThemeIcon>
                }
              >
                <Title style={{ width: '15rem', overflow: 'hidden' }} order={3}>
                  {element.title}
                </Title>
                <Text>{element.slug}</Text>
                <Text>{new Date(element.createdAt).toLocaleString()}</Text>
              </List.Item>
              <Divider mt="sm" />
            </div>
          ))}
        </List>
        <Pagination
          disabled={Pages.isLoading}
          total={Math.ceil(Pages.data.length / limit)}
          value={pageNumber}
          onChange={(event) => setPageNumber(event)}
          mt="sm"
        />
      </Container>
    )
  );
}
