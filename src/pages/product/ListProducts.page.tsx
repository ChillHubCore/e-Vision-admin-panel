import {
  Button,
  Container,
  Flex,
  Group,
  Input,
  Loader,
  LoadingOverlay,
  Modal,
  NativeSelect,
  Pagination,
  ScrollArea,
  Switch,
  Table,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { IconCheck, IconEdit, IconEye, IconPlus, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'react-toastify';
import { DatePickerInput } from '@mantine/dates';
import { useSelector } from 'react-redux';
import { getData } from '@/lib/utils/getData';
import { eAxios } from '@/lib/utils';
import { ProductEntityProps } from '@/components/Dashboard/types';
import { VariantCard } from '@/components/common';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';

export default function ListProductsPage() {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectOpened, { open: selectOpen, close: selectClose }] = useDisclosure(false);
  const [productId, setProductId] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [desc, setDesc] = useState<boolean>(true);
  const [timeCreatedSearchInputGTE, setTimeCreatedSearchInputGTE] = useState<Date | null>(null);
  const [timeCreatedSearchInputLTE, setTimeCreatedSearchInputLTE] = useState<Date | null>(null);
  const [nameSearchInput, setNameSearchInput] = useState<string>('');
  const [brandSearchInput, setBrandSearchInput] = useState<string>('');
  const [categorySearchInput, setCategorySearchInput] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductEntityProps | null>(null);
  const userInfo = useSelector(selectUserInfo);

  const Products = useQuery(
    'search-product',
    () =>
      getData(
        `/product?pageNumber=${pageNumber}&limit=${limit}&desc=${desc}&name=${nameSearchInput}&brand=${brandSearchInput}&category=${categorySearchInput}&timeCreatedGTE=${
          timeCreatedSearchInputGTE ? timeCreatedSearchInputGTE?.toISOString() : ''
        }&timeCreatedLTE=${
          timeCreatedSearchInputLTE ? timeCreatedSearchInputLTE?.toISOString() : ''
        }`,
        userInfo?.token
      ),
    { cacheTime: 0 }
  );

  useEffect(() => {
    Products.refetch();
  }, [
    desc,
    limit,
    pageNumber,
    timeCreatedSearchInputGTE,
    timeCreatedSearchInputLTE,
    nameSearchInput,
    brandSearchInput,
    categorySearchInput,
  ]);

  if (Products.isLoading) return <LoadingOverlay />;

  const handlePageChange = (event: number) => {
    setPageNumber(event);
  };

  async function DeleteOneProduct({ id }: { id: string }) {
    setDeleteLoading(true);
    try {
      const response = await eAxios.delete(`/product/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token || localStorage.getItem('access_token')}`,
        },
      });
      toast.success(response.data.message);
      Products.refetch();
    } catch (error) {
      toast.error((error as CustomError)?.response?.data.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  const rows = Products.data?.products?.map((element: ProductEntityProps) => (
    <Table.Tr key={element._id}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.slug}</Table.Td>
      <Table.Td>{element.brand}</Table.Td>
      <Table.Td>{element.category}</Table.Td>
      <Table.Td>
        {element.variants
          .reduce((maxPrice, variant) => {
            if (variant.price.regularPrice > maxPrice) {
              return variant.price.regularPrice;
            }
            return maxPrice;
          }, 0)
          .toLocaleString()}
      </Table.Td>
      <Table.Td>{element.variants.length}</Table.Td>
      <Table.Td>{element.variants.filter((variant) => variant.availability).length}</Table.Td>
      <Table.Td>
        {element.variants.some((variant) => variant.inStock > 0) ? (
          <IconCheck color="green" />
        ) : (
          <IconX color="red" />
        )}
      </Table.Td>
      <Table.Td>{element.variants.reduce((acc, variant) => acc + variant.soldAmount, 0)}</Table.Td>
      <Table.Td>{new Date(element.createdAt).toLocaleString()}</Table.Td>
      <Table.Td>{new Date(element.updatedAt).toLocaleString()}</Table.Td>
      <Table.Td>
        <>
          <Modal opened={opened} onClose={close} title="Alert">
            <p>You are About to Delete a Product Are You Sure? This is Unrecoverable!</p>
            <Group>
              <Button
                onClick={() => {
                  DeleteOneProduct({ id: productId });
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
            setProductId(element._id);
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
          onClick={() => navigate(`/admin/dashboard/products/edit/${element._id}`)}
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
          onClick={() => navigate(`/admin/dashboard/products/show/${element._id}`)}
        >
          <IconEye color="green" />
        </UnstyledButton>
      </Table.Td>
      <Table.Td>
        <UnstyledButton
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => {
            setSelectedProduct(element);
            selectOpen();
          }}
        >
          <Tooltip label="Add To Cart">
            <IconPlus />
          </Tooltip>
        </UnstyledButton>
        <Modal opened={selectOpened} onClose={selectClose} title="Select Variants" centered>
          <ScrollArea h="35rem">
            <Flex direction="column" gap="sm">
              {selectedProduct?.variants.map((variant) => (
                <VariantCard
                  key={variant._id}
                  VariantData={variant}
                  addFlag
                  ProductData={selectedProduct}
                />
              ))}
            </Flex>
          </ScrollArea>
        </Modal>
      </Table.Td>
    </Table.Tr>
  ));

  return Products.isLoading ? (
    <Loader />
  ) : Products.isError ? (
    <div>error</div>
  ) : (
    Products.data && (
      <Container size="lg">
        <Flex gap="md" wrap="wrap" my="sm">
          <Input
            placeholder="Search By Product Name"
            value={nameSearchInput}
            onChange={(event) => {
              setNameSearchInput(event.currentTarget.value);
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />
          <Input
            placeholder="Search By Brand Name"
            value={brandSearchInput}
            onChange={(event) => {
              setBrandSearchInput(event.currentTarget.value);
            }}
            rightSectionPointerEvents="all"
            mt="md"
          />
          <Input
            placeholder="Search By Category Name"
            value={categorySearchInput}
            onChange={(event) => {
              setCategorySearchInput(event.currentTarget.value);
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
        <Group>
          <Button
            my="md"
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => Products.refetch()}
          >
            Filter
          </Button>
          <Button component={Link} to="/admin/dashboard/products/create">
            Create New Product
          </Button>
        </Group>

        <Table withTableBorder withColumnBorders style={{ padding: '2rem' }}>
          <Table.Thead style={{ height: 'max-content' }}>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Slug</Table.Th>
              <Table.Th>Brand</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Variant Count</Table.Th>
              <Table.Th>Available Variants</Table.Th>
              <Table.Th>in-Stock</Table.Th>
              <Table.Th>Sold Count</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Updated At</Table.Th>
              <Table.Th>Delete</Table.Th>
              <Table.Th>Edit</Table.Th>
              <Table.Th>Show</Table.Th>
              <Table.Th>Add To Cart</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <Pagination
          disabled={Products.isLoading}
          total={Math.ceil(Products.data.length / limit)}
          value={pageNumber}
          onChange={(event) => handlePageChange(event)}
          mt="sm"
        />
      </Container>
    )
  );
}
