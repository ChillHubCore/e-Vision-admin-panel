import { hasLength, useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  FileInput,
  Flex,
  Grid,
  Group,
  Image,
  Modal,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useSubmit, useUpload } from '@/lib/hooks';
import { RTE } from '../common/RTE';
import blackBG from '@/assets/black-bg.png';

export interface ProductVariantProps {
  images: string[];
  sharedDetails: {
    key: string;
    value: string;
  }[];
  SKU: string;
  price: {
    regularPrice: number;
    discountedPrice?: number;
  };
  inStock: number;
  availability: boolean;
}

export interface ProductEntityProps {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: {
    short: string;
    full: string;
  };
  variants: ProductVariantProps[];
  relatedProducts: string[];
  creator: string;
  sharedDetails: {
    key: string;
    value: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductGenerator({
  ProductData,
  editFlag,
}: {
  ProductData?: ProductEntityProps;
  editFlag: boolean;
}) {
  const ProductGeneratorForm = useForm({
    initialValues: {
      name: ProductData?.name || '',
      slug: ProductData?.slug || '',
      category: ProductData?.category || '',
      description: ProductData?.description || {
        short: '',
        full: '',
      },
      variants: ProductData?.variants || [],
      relatedProducts: ProductData?.relatedProducts || [],
      creator: ProductData?.creator || '',
      sharedDetails: ProductData?.sharedDetails || [],
    },
    validate: {
      name: hasLength({ min: 3, max: 255 }, 'Name must be 3-255 characters long'),
      slug: hasLength({ min: 2, max: 255 }, 'Slug must be 3-255 characters long'),
      category: hasLength({ min: 3, max: 255 }, 'Category must be 3-255 characters long'),
      description: {
        short: hasLength({ min: 3, max: 255 }, 'Short Description must be 3-255 characters long'),
        full: hasLength({ min: 3, max: 255 }, 'Full Description must be 3-255 characters long'),
      },
      variants: (value: ProductVariantProps[]) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      relatedProducts: (value) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      creator: hasLength({ min: 3, max: 255 }, 'Creator must be 3-255 characters long'),
      sharedDetails: (value) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
    },
  });
  const VariantGeneratorForm = useForm({
    initialValues: {
      images: [blackBG],
      sharedDetails: [
        {
          key: '',
          value: '',
        },
      ],
      SKU: '',
      price: {
        regularPrice: 0,
        discountedPrice: 0,
        specialOffers: [],
      },
      inStock: 0,
      availability: false,
    },
    validate: {
      images: (value) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      sharedDetails: (value) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      SKU: hasLength({ min: 3, max: 255 }, 'SKU must be 3-255 characters long'),
      price: {
        regularPrice: (value) => {
          if (typeof value === 'number') {
            return null;
          }
          return 'Type of Value is Wrong!';
        },
        discountedPrice: (value) => {
          if (typeof value === 'number') {
            return null;
          }
          return 'Type of Value is Wrong!';
        },
        specialOffers: (value) => {
          if (Array.isArray(value)) {
            return null;
          }
          return 'Type of Value is Wrong!';
        },
      },
      inStock: (value) => {
        if (typeof value === 'number') {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      availability: (value) => {
        if (typeof value === 'boolean') {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
    },
  });
  const [opened, { open, close }] = useDisclosure(false);
  const FormActions = useSubmit();
  const navigate = useNavigate();
  const uploadHandle = useUpload();
  const RichTextEditorRef = useRef();

  const handleSubmit = () => {
    if (editFlag) {
      FormActions.sendRequest(
        `/product/${ProductData?._id}`,
        ProductGeneratorForm,
        'put',
        'Product Edited Successfully!',
        'Failed to edit product! Please try again.',
        () => navigate('/admin/dashboard/products')
      );
    } else {
      FormActions.sendRequest(
        '/product',
        ProductGeneratorForm,
        'post',
        'Product Created Successfully!',
        'Failed to create product! Please try again.',
        () => navigate('/admin/dashboard/products')
      );
    }
  };

  console.log('tracecode#pg207', uploadHandle.data);

  const VariantInputModal = (
    <Modal opened={opened} onClose={close} title="Add New Variant">
      <Flex direction="column" gap="md">
        <TextInput
          label="SKU"
          placeholder="Enter Product SKU"
          required
          {...VariantGeneratorForm.getInputProps('SKU')}
        />
        <TextInput
          label="Regular Price"
          type="number"
          placeholder="Enter Product Regular Price"
          required
          {...VariantGeneratorForm.getInputProps('price.regularPrice')}
        />
        <TextInput
          label="Discounted Price"
          type="number"
          placeholder="Enter Product Discounted Price"
          {...VariantGeneratorForm.getInputProps('price.discountedPrice')}
        />
        <TextInput
          label="In Stock"
          type="number"
          placeholder="Enter Product In Stock"
          required
          {...VariantGeneratorForm.getInputProps('inStock')}
        />
        <Group>
          <FileInput
            disabled={uploadHandle.isLoading}
            onChange={(value) =>
              uploadHandle.sendFile(
                '/upload',
                value as File,
                'Image Uploaded Successfully!',
                'Failed to upload image! Please try again.',
                (url: string) => {
                  if (VariantGeneratorForm.values.images[0] === blackBG) {
                    VariantGeneratorForm.setFieldValue('images', [url]);
                  } else {
                    VariantGeneratorForm.setFieldValue('images', [
                      ...VariantGeneratorForm.values.images,
                      url,
                    ]);
                  }
                }
              )
            }
            label="Choose a Picture to Upload"
          />

          {VariantGeneratorForm.values.images.length > 0 &&
            VariantGeneratorForm.values.images.map((image) => {
              console.log(image);
              return (
                <Image
                  key={image}
                  src={image as string}
                  h={100}
                  w={100}
                  alt="product image"
                  style={{ objectFit: 'cover' }}
                />
              );
            })}
        </Group>
        <Switch label="Availability" {...VariantGeneratorForm.getInputProps('availability')} />
        <Button
          onClick={() => {
            ProductGeneratorForm.setFieldValue('variants', [
              ...ProductGeneratorForm.values.variants,
              VariantGeneratorForm.values,
            ]);
            VariantGeneratorForm.reset();
            close();
          }}
        >
          Submit Variant
        </Button>
      </Flex>
    </Modal>
  );
  const renderVariants =
    ProductGeneratorForm.values.variants.length > 0 ? (
      ProductGeneratorForm.values.variants.map((variant: ProductVariantProps) => (
        <Grid.Col key={variant.SKU} span={{ base: 12, md: 6, lg: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                height={160}
                alt="Norway"
              />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Norway Fjord Adventures</Text>
              <Badge color="pink">On Sale</Badge>
            </Group>

            <Text size="sm" c="dimmed">
              With Fjord Tours you can explore more of the magical fjord landscapes with tours and
              activities on and around the fjords of Norway
            </Text>

            <Button color="blue" fullWidth mt="md" radius="md">
              Book classic tour now
            </Button>
          </Card>
        </Grid.Col>
      ))
    ) : (
      <Text>No Variants Added Yet!</Text>
    );

  return (
    <Container size="lg">
      <Box
        component="form"
        onSubmit={ProductGeneratorForm.onSubmit(handleSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        <Title order={2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {editFlag ? 'Edit Product' : 'Create New Product'}
        </Title>
        <TextInput
          label="Name"
          placeholder="Enter Product Name"
          required
          {...ProductGeneratorForm.getInputProps('name')}
        />
        <TextInput
          label="Slug"
          placeholder="Enter Product Slug"
          required
          {...ProductGeneratorForm.getInputProps('slug')}
        />
        <TextInput
          label="Category"
          placeholder="Enter Product Category"
          required
          {...ProductGeneratorForm.getInputProps('category')}
        />
        <Textarea
          label="Short Description"
          placeholder="Enter Short Description"
          required
          {...ProductGeneratorForm.getInputProps('description.short')}
        />
        <Box my="md">
          <Title mb="lg" ta="center" order={3}>
            Write a Full Description For The Product.
          </Title>
          <RTE ref={RichTextEditorRef} />
        </Box>
        <Box>
          <Stack>
            <Group my="sm">
              <TextInput
                labelProps={{ my: 'xs' }}
                label="Product Variant Key"
                placeholder="Enter Product Variant Key"
                required
              />
              <TextInput
                labelProps={{ my: 'xs' }}
                label="Product Variant Value"
                placeholder="Enter Product Variant Value"
                required
              />
            </Group>

            <Button w="fit-content" my="md" onClick={open}>
              Add
            </Button>
            {VariantInputModal}
          </Stack>
          <Grid>{renderVariants}</Grid>
        </Box>
      </Box>
    </Container>
  );
}
