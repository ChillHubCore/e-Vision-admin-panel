import {
  Button,
  Container,
  Divider,
  Flex,
  Group,
  List,
  Loader,
  Modal,
  NativeSelect,
  Pagination,
  Spoiler,
  Switch,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconArticle, IconEdit, IconEye, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getData } from '@/lib/utils/getData';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';
import { eAxios } from '@/lib/utils';
import { BlogEntityProps } from '@/components/Dashboard/types';

export default function ListBlogsPage({ TeamMemberFlag }: { TeamMemberFlag?: boolean }) {
  const [blogTitleSearchInput, setBlogTitleSearchInput] = useState('');
  const [slugSearchInput, setSlugSearchInput] = useState('');
  const [timeCreatedSearchInputGTE, setTimeCreatedSearchInputGTE] = useState<Date | null>(null);
  const [timeCreatedSearchInputLTE, setTimeCreatedSearchInputLTE] = useState<Date | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [blogId, setBlogId] = useState('');
  const [limit, setLimit] = useState(10);
  const [desc, setDesc] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const Blogs = useQuery(
    'search-blogs',
    () =>
      getData(
        `/blog?pageNumber=${pageNumber}&timeCreatedGTE=${
          timeCreatedSearchInputGTE ? timeCreatedSearchInputGTE?.toISOString() : ''
        }&timeCreatedLTE=${
          timeCreatedSearchInputLTE ? timeCreatedSearchInputLTE?.toISOString() : ''
        }&desc=${desc}$limit=${limit}&title=${blogTitleSearchInput}&slug=${slugSearchInput}&author=${
          TeamMemberFlag ? userInfo?.username : ''
        }`
      ),
    {
      cacheTime: 0,
    }
  );

  async function DeleteOneBlog({ id }: { id: string }) {
    setDeleteLoading(true);
    try {
      const response = await eAxios.delete(`/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token || localStorage.getItem('access_token')}`,
        },
      });
      toast.success(response.data.message);
      Blogs.refetch();
    } catch (error) {
      toast.error((error as CustomError)?.response?.data.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  const rows = Blogs.data?.blogs?.map((element: BlogEntityProps) => (
    <Table.Tr key={element._id}>
      <Table.Td>{element.title}</Table.Td>
      <Table.Td>{element.slug}</Table.Td>
      <Table.Td>{element.author.username}</Table.Td>
      <Table.Td>{new Date(element.createdAt).toLocaleString()}</Table.Td>
      <Table.Td>{new Date(element.updatedAt).toLocaleString()}</Table.Td>
      <Table.Td>
        <>
          <Modal opened={opened} onClose={close} title="Alert">
            <p>You are About to Delete a Blog Are You Sure? This is Unrecoverable!</p>
            <Group>
              <Button
                onClick={() => {
                  DeleteOneBlog({ id: blogId });
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
            setBlogId(element._id);
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
          onClick={() =>
            navigate(
              TeamMemberFlag
                ? `/team/dashboard/blogs/edit/${element._id}`
                : `/admin/dashboard/blogs/edit/${element._id}`
            )
          }
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
          onClick={() =>
            navigate(
              TeamMemberFlag
                ? `/team/dashboard/blogs/show/${element._id}`
                : `/admin/dashboard/blogs/show/${element._id}`
            )
          }
        >
          <IconEye color="green" />
        </UnstyledButton>
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    Blogs.refetch();
  }, [
    pageNumber,
    limit,
    desc,
    slugSearchInput,
    blogTitleSearchInput,
    timeCreatedSearchInputGTE,
    timeCreatedSearchInputLTE,
  ]);

  return Blogs.isLoading ? (
    <Loader />
  ) : (
    Blogs.isSuccess && (
      <Container size="xl">
        <Spoiler
          pb="md"
          maxHeight={120}
          showLabel="Show More Filters"
          hideLabel="Hide Filters"
          hiddenFrom="sm"
        >
          <Flex gap="md" wrap="wrap" my="sm">
            <Group justify="space-between">
              <Button
                component={Link}
                to={
                  TeamMemberFlag ? '/team/dashboard/blogs/create' : '/admin/dashboard/blogs/create'
                }
              >
                Create New Blog
              </Button>
              <TextInput
                value={blogTitleSearchInput}
                onChange={(event) => {
                  setBlogTitleSearchInput(event.target.value);
                }}
                placeholder="Search blogs by their Title"
              />
              <TextInput
                value={slugSearchInput}
                onChange={(event) => {
                  setSlugSearchInput(event.target.value);
                }}
                placeholder="Search blogs by their Slug"
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
          </Flex>
        </Spoiler>
        <Flex gap="md" wrap="wrap" my="sm" visibleFrom="sm">
          <Group justify="space-between">
            <Button
              component={Link}
              to={TeamMemberFlag ? '/team/dashboard/blogs/create' : '/admin/dashboard/blogs/create'}
            >
              Create New Blog
            </Button>
            <TextInput
              value={blogTitleSearchInput}
              onChange={(event) => {
                setBlogTitleSearchInput(event.target.value);
              }}
              placeholder="Search blogs by their Title"
            />
            <TextInput
              value={slugSearchInput}
              onChange={(event) => {
                setSlugSearchInput(event.target.value);
              }}
              placeholder="Search blogs by their Slug"
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
        </Flex>
        <Table withTableBorder withColumnBorders style={{ padding: '2rem' }} visibleFrom="sm">
          <Table.Thead style={{ height: 'max-content' }}>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Slug</Table.Th>
              <Table.Th>Creator</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Updated At</Table.Th>
              <Table.Th>Delete</Table.Th>
              <Table.Th>Edit</Table.Th>
              <Table.Th>View</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <List hiddenFrom="sm">
          {Blogs.data?.blogs?.map((element: BlogEntityProps) => (
            <div key={element._id}>
              <List.Item
                p="sm"
                my="md"
                onClick={() =>
                  navigate(
                    TeamMemberFlag
                      ? `/team/dashboard/blogs/edit/${element._id}`
                      : `/admin/dashboard/blogs/edit/${element._id}`
                  )
                }
                icon={
                  <ThemeIcon color="blue" size={24} radius="md" mr="sm">
                    <IconArticle />
                  </ThemeIcon>
                }
              >
                <Title style={{ width: '15rem', overflow: 'hidden' }} order={3}>
                  {element.title}
                </Title>
                <Text style={{ width: '15rem', overflow: 'hidden' }} c="dimmed">
                  {element.author.username}
                </Text>
                <Text>{new Date(element.createdAt).toLocaleString()}</Text>
              </List.Item>{' '}
              <Divider mt="sm" />
            </div>
          ))}
        </List>
        <Pagination
          disabled={Blogs.isLoading}
          total={Math.ceil(Blogs.data.length / limit)}
          value={pageNumber}
          onChange={(event) => setPageNumber(event)}
          mt="sm"
        />
      </Container>
    )
  );
}
