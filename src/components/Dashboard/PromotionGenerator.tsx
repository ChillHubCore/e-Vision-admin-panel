import {
  Box,
  Button,
  Center,
  Container,
  MultiSelect,
  NumberInput,
  Pagination,
  Stack,
  Switch,
  Table,
  TextInput,
  Textarea,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { DatePickerInput } from '@mantine/dates';
import { useSubmit } from '@/lib/hooks';
import { PromotionEntityProps } from './types';
import { addToCart, clearCart, removeFromCart } from '@/lib/redux/ShoppingCart/ShoppingCart';
import { roles } from '@/lib/constants';

export default function PromotionGenerator({
  editFlag,
  PromotionData,
  cartItems,
}: {
  editFlag?: boolean;
  PromotionData?: PromotionEntityProps;
  cartItems: ShoppingCartPayloadProps[];
}) {
  if (editFlag && !PromotionData) return null;
  const PromotionGeneratorForm = useForm({
    initialValues: {
      promotionIdentifier: PromotionData?.promotionIdentifier || '',
      applicableProducts: cartItems,
      minTotalOrder: PromotionData?.minTotalOrder || {
        active: false,
        price: 0,
      },
      accessibleRoles: PromotionData?.accessibleRoles || ([] as string[]),
      maximumDiscount: PromotionData?.maximumDiscount || {
        active: false,
        price: 0,
      },
      description: PromotionData?.description || '',
      active: PromotionData?.active || false,
      activeFrom: PromotionData?.activeFrom ? new Date(PromotionData.activeFrom) : null,
      activeUntil: PromotionData?.activeUntil ? new Date(PromotionData.activeUntil) : null,
      usageCap: PromotionData?.usageCap || {
        isCaped: false,
        timesUsed: 0,
        maxTimesToUse: 0,
      },
      percentageDiscount: PromotionData?.percentageDiscount || {
        active: false,
        percentage: 0,
      },
      fixedDiscount: PromotionData?.fixedDiscount || {
        active: false,
        price: 0,
      },
    },
    validate: {},
  });
  const FormActions = useSubmit();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const handleSubmit = () => {
    if (editFlag) {
      FormActions.sendRequest(
        `/promotion/${PromotionData?._id}`,
        PromotionGeneratorForm,
        'put',
        'Promotion updated successfully.',
        'Promotion update failed. Please try again.',
        () => {
          dispatch(clearCart());
          navigate('/admin/dashboard/promotions');
        }
      );
    } else {
      FormActions.sendRequest(
        '/promotion',
        PromotionGeneratorForm,
        'post',
        'Promotion created successfully.',
        'Failed to create promotion. Please try again.',
        () => {
          dispatch(clearCart());
          navigate('/admin/dashboard/promotions');
        }
      );
    }
  };

  const rows = cartItems.map((element) => (
    <Table.Tr key={element.variant.SKU}>
      <Table.Td>{element.product.name}</Table.Td>
      <Table.Td>{element.variant.SKU}</Table.Td>
      <Table.Td>{element.quantity}</Table.Td>
      <Table.Td>
        <UnstyledButton onClick={() => dispatch(addToCart({ ...element, quantity: 1 }))}>
          <IconPlus color="green" />
        </UnstyledButton>
      </Table.Td>
      <Table.Td>
        <UnstyledButton onClick={() => dispatch(removeFromCart({ ...element, quantity: 1 }))}>
          <IconMinus color="red" />
        </UnstyledButton>
      </Table.Td>
    </Table.Tr>
  ));

  return !cartItems || cartItems.length === 0 ? (
    <Container size="xl">
      <Stack ta="center">
        <Title order={3} ta="center">
          No products in cart to create promotion for! Please Select Some Products First!
        </Title>
        <Center>
          <Button w="fit-content" component={Link} to="/admin/dashboard/products">
            Go To Product Section
          </Button>
        </Center>
      </Stack>
    </Container>
  ) : (
    <Container size="xl">
      <Table my="md" withTableBorder withColumnBorders style={{ padding: '2rem' }}>
        <Table.Thead style={{ height: 'max-content' }}>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th>Variant</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Add</Table.Th>
            <Table.Th>Remove</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pagination
        total={cartItems.length}
        value={pageNumber}
        onChange={(event) => setPageNumber(event)}
        my="md"
      />
      <Box
        my="xl"
        component="form"
        onSubmit={PromotionGeneratorForm.onSubmit(handleSubmit)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          justifyContent: 'center',
        }}
      >
        <TextInput
          label="Promotion Identifier"
          type="text"
          placeholder="Enter promotion identifier"
          required
          {...PromotionGeneratorForm.getInputProps('promotionIdentifier')}
        />
        <Textarea
          label="Description"
          placeholder="Enter promotion description"
          required
          {...PromotionGeneratorForm.getInputProps('description')}
        />
        <DatePickerInput
          required
          {...PromotionGeneratorForm.getInputProps('activeFrom')}
          placeholder="Enter active from date"
          rightSection={
            <IconX
              onClick={() => {
                PromotionGeneratorForm.setFieldValue('activeFrom', null);
              }}
            />
          }
        />
        <DatePickerInput
          required
          {...PromotionGeneratorForm.getInputProps('activeUntil')}
          placeholder="Enter active until date"
          rightSection={
            <IconX
              onClick={() => {
                PromotionGeneratorForm.setFieldValue('activeUntil', null);
              }}
            />
          }
        />
        <Switch
          label="Acitve Minimum Total Order Rule"
          {...PromotionGeneratorForm.getInputProps('minTotalOrder.active')}
        />
        <NumberInput
          disabled={!PromotionGeneratorForm.values.minTotalOrder.active}
          label="Minimum Total Order"
          placeholder="Enter minimum total order"
          required
          {...PromotionGeneratorForm.getInputProps('minTotalOrder.price')}
        />
        <Switch
          label="Acitve Maximum Discount Rule"
          {...PromotionGeneratorForm.getInputProps('maximumDiscount.active')}
        />
        <NumberInput
          disabled={!PromotionGeneratorForm.values.maximumDiscount.active}
          label="Maximum Discount"
          placeholder="Enter maximum discount"
          required
          {...PromotionGeneratorForm.getInputProps('maximumDiscount.price')}
        />
        <Switch
          label="Acitve Usage Cap Rule"
          {...PromotionGeneratorForm.getInputProps('usageCap.isCaped')}
        />
        <NumberInput
          disabled={!PromotionGeneratorForm.values.usageCap.isCaped}
          label="Maximum Times To Use"
          placeholder="Enter maximum times to use"
          required
          {...PromotionGeneratorForm.getInputProps('usageCap.maxTimesToUse')}
        />
        <NumberInput
          disabled={!PromotionGeneratorForm.values.usageCap.isCaped}
          label="Times Used"
          placeholder="Enter times used"
          required
          {...PromotionGeneratorForm.getInputProps('usageCap.timesUsed')}
        />
        <Switch
          label="Acitve Percentage Discount Rule"
          {...PromotionGeneratorForm.getInputProps('percentageDiscount.active')}
        />
        <TextInput
          disabled={!PromotionGeneratorForm.values.percentageDiscount.active}
          label="Percentage Discount"
          type="number"
          placeholder="Enter percentage discount"
          required
          {...PromotionGeneratorForm.getInputProps('percentageDiscount.percentage')}
        />
        <Switch
          label="Acitve Fixed Discount Rule"
          {...PromotionGeneratorForm.getInputProps('fixedDiscount.active')}
        />
        <NumberInput
          disabled={!PromotionGeneratorForm.values.fixedDiscount.active}
          label="Fixed Discount"
          placeholder="Enter fixed discount"
          required
          {...PromotionGeneratorForm.getInputProps('fixedDiscount.price')}
        />
        <MultiSelect
          label="Accessible Roles"
          placeholder="Pick accessible roles"
          data={roles}
          {...PromotionGeneratorForm.getInputProps('accessibleRoles')}
        />
        <Switch
          label="Is Promotion Active?"
          defaultValue={PromotionGeneratorForm.values.active ? 'true' : 'false'}
          defaultChecked={PromotionGeneratorForm.values.active}
          onChange={(e) => {
            PromotionGeneratorForm.setFieldValue('active', e.target.value !== 'true');
          }}
        />
        <Button w="fit-content" type="submit" loading={FormActions.isLoading}>
          {editFlag ? 'Update Promotion' : 'Create Promotion'}
        </Button>
      </Box>
    </Container>
  );
}
