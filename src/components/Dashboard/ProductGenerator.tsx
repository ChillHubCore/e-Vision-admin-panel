import { hasLength, useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  FileInput,
  Flex,
  Grid,
  Group,
  Image,
  Loader,
  Modal,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'react-toastify';
import { IconFileLike, IconPlus, IconX } from '@tabler/icons-react';
import { AnyExtension, Editor, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Image as TiptapImage } from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { ProductEntityProps, ProductVariantProps } from './types';
import VariantCard from '../common/VariantCard';
import blackBG from '@/assets/black-bg.png';
import { RTE } from '../common/RTE';
import { useSubmit, useUpload } from '@/lib/hooks';

export default function ProductGenerator({
  ProductData,
  editFlag,
}: {
  ProductData?: ProductEntityProps;
  editFlag: boolean;
}) {
  const ProductGeneratorForm = useForm({
    initialValues: {
      metaTitle: ProductData?.metaTitle || '',
      metaDescription: ProductData?.metaDescription || '',
      metaTags: ProductData?.metaTags || ([] as string[]),
      name: ProductData?.name || '',
      slug: ProductData?.slug || '',
      brand: ProductData?.brand || '',
      category: ProductData?.category || '',
      description: {
        short: ProductData?.description.short || '',
        full: ProductData?.description.full || '',
      },
      variants: ProductData?.variants || ([] as ProductVariantProps[]),
      relatedProducts: ProductData?.relatedProducts || ([] as string[]),
      sharedDetails: ProductData?.sharedDetails || ([] as { key: string; value: string }[]),
    },
    validate: {
      name: hasLength({ min: 3, max: 255 }, 'Name must be 3-255 characters long'),
      metaTitle: hasLength({ min: 3, max: 255 }, 'Meta Title must be 3-255 characters long'),
      metaDescription: hasLength(
        { min: 3, max: 255 },
        'Meta Description must be 3-255 characters long'
      ),
      metaTags: (value) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      slug: hasLength({ min: 2, max: 1023 }, 'Slug must be 3-255 characters long'),
      brand: hasLength({ min: 3, max: 255 }, 'Brand must be 3-255 characters long'),
      category: hasLength({ min: 3, max: 255 }, 'Category must be 3-255 characters long'),
      description: {
        short: hasLength({ min: 3, max: 255 }, 'Short Description must be 3-255 characters long'),
        full: hasLength({ min: 3, max: 10000 }, 'Full Description must be 3-255 characters long'),
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
      // creator: hasLength({ min: 3, max: 255 }, 'Creator must be 3-255 characters long'),
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
      details: [] as { key: string; value: string }[],
      SKU: '',
      soldAmount: 0,
      price: {
        regularPrice: 0,
        discountedPrice: false as false | number,
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
      details: (value) => {
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
          if (typeof value === 'number' || value === false) {
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
  const [discountFlag, setDiscountFlag] = useState(false);
  const RichTextEditorRef = useRef(null);
  const [sharedDetail, setSharedDetail] = useState({
    key: '',
    value: '',
  });
  const [variantDetail, setVariantDetail] = useState({
    key: '',
    value: '',
  });
  const [variantEditFlag, setVariantEditFlag] = useState(false);
  const [metaTagInput, setMetaTagInput] = useState('' as string);
  const [variantToBeEdited, setVariantToBeEdited] = useState({ _id: '', SKU: '' });

  const content = ProductGeneratorForm.values.description.full;

  const editor = useEditor({
    extensions: [
      StarterKit as AnyExtension,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TiptapImage.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
  });

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
        <Switch
          label="Does This Product Has a Discounted Price?"
          defaultChecked={discountFlag}
          onChange={() => {
            setDiscountFlag(!discountFlag);
            if (!discountFlag) {
              VariantGeneratorForm.setFieldValue(
                'price.discountedPrice',
                VariantGeneratorForm.values.price.regularPrice
              );
            } else {
              VariantGeneratorForm.setFieldValue('price.discountedPrice', false);
            }
          }}
        />
        {discountFlag && (
          <TextInput
            label="Discounted Price"
            type="number"
            placeholder="Enter Product Discounted Price"
            {...VariantGeneratorForm.getInputProps('price.discountedPrice')}
          />
        )}
        <TextInput
          label="In Stock"
          type="number"
          placeholder="Enter Product In Stock"
          required
          {...VariantGeneratorForm.getInputProps('inStock')}
        />
        <TextInput
          label="Sold Amount"
          type="number"
          placeholder="Enter Product Sold Amount ( Default is 0 )"
          required
          {...VariantGeneratorForm.getInputProps('soldAmount')}
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
            rightSection={uploadHandle.isLoading ? <Loader size="xs" /> : <IconFileLike />}
            label="Choose a Picture to Upload"
          />

          {VariantGeneratorForm.values.images.length > 0 &&
            VariantGeneratorForm.values.images.map((image) => (
              <div key={image}>
                <Image
                  src={image as string}
                  h={100}
                  w={100}
                  alt="product image"
                  style={{ objectFit: 'cover' }}
                />
                <UnstyledButton
                  onClick={() => {
                    VariantGeneratorForm.setFieldValue(
                      'images',
                      VariantGeneratorForm.values.images.filter((i) => i !== image)
                    );
                  }}
                >
                  <IconX color="red" />
                </UnstyledButton>
              </div>
            ))}
        </Group>
        <Box>
          <Group>
            <TextInput
              labelProps={{ my: 'md' }}
              label="Detail Key"
              placeholder="Enter Key"
              required
              value={variantDetail.key}
              onChange={(e) => setVariantDetail({ ...variantDetail, key: e.target.value })}
            />
            <TextInput
              labelProps={{ my: 'md' }}
              label="Detail Value"
              placeholder="Enter Value"
              required
              value={variantDetail.value}
              onChange={(e) => setVariantDetail({ ...variantDetail, value: e.target.value })}
            />
          </Group>
          <Button
            my="lg"
            onClick={() => {
              if (variantDetail.key.trim() === '' || variantDetail.value.trim() === '') {
                toast.error('Key or value cannot be empty');
              } else {
                VariantGeneratorForm.setFieldValue('details', [
                  ...VariantGeneratorForm.values.details,
                  variantDetail,
                ]);
                setVariantDetail({ key: '', value: '' });
              }
            }}
          >
            Add Detail
          </Button>
          {VariantGeneratorForm.values.details.length > 0 ? (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Key</Table.Th>
                  <Table.Th>Value</Table.Th>
                  <Table.Th>Remove</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {VariantGeneratorForm.values.details.map((item) => (
                  <Table.Tr key={item.key}>
                    <Table.Td>{item.key}</Table.Td>
                    <Table.Td>{item.value}</Table.Td>
                    <Table.Td>
                      <Button
                        onClick={() =>
                          VariantGeneratorForm.setFieldValue(
                            'details',
                            VariantGeneratorForm.values.details.filter((i) => i.key !== item.key)
                          )
                        }
                      >
                        Remove
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text>No Details Added Yet!</Text>
          )}
        </Box>
        <Switch
          defaultChecked={VariantGeneratorForm.values.availability}
          label="Availability"
          {...VariantGeneratorForm.getInputProps('availability')}
        />
        <Button
          onClick={() => {
            if (variantEditFlag) {
              ProductGeneratorForm.setFieldValue(
                'variants',
                ProductGeneratorForm.values.variants.map((variant) => {
                  if (variant.SKU === variantToBeEdited.SKU) {
                    return VariantGeneratorForm.values;
                  }
                  return variant;
                })
              );
              setVariantEditFlag(false);
              VariantGeneratorForm.reset();
              setVariantToBeEdited({ _id: '', SKU: '' });
            } else {
              ProductGeneratorForm.setFieldValue('variants', [
                ...ProductGeneratorForm.values.variants,
                VariantGeneratorForm.values,
              ]);
            }
            VariantGeneratorForm.reset();
            close();
          }}
        >
          {variantEditFlag ? 'Edit' : 'Add'}
        </Button>
      </Flex>
    </Modal>
  );
  const renderVariants =
    ProductGeneratorForm.values.variants.length > 0 ? (
      ProductGeneratorForm.values.variants.map((variant: ProductVariantProps) => (
        <Grid.Col key={variant.SKU} span={{ base: 12, md: 6, lg: 3 }}>
          <Suspense>
            <Stack>
              <VariantCard VariantData={variant} ProductData={ProductData as ProductEntityProps} />
              <Group>
                <Button
                  onClick={() => {
                    ProductGeneratorForm.setFieldValue(
                      'variants',
                      ProductGeneratorForm.values.variants.filter((i) => i.SKU !== variant.SKU)
                    );
                  }}
                >
                  Remove
                </Button>
                <Button
                  onClick={() => {
                    setVariantToBeEdited({ _id: variant._id as string, SKU: variant.SKU });
                    setVariantEditFlag(true);
                    ProductGeneratorForm.reset();
                    VariantGeneratorForm.setValues({
                      ...variant,
                      price: {
                        ...variant.price,
                        discountedPrice: variant.price.discountedPrice || false, // Assign a default value of 0 if discountedPrice is undefined
                      },
                    });
                    setDiscountFlag(!!variant.price.discountedPrice);
                    open();
                  }}
                >
                  Edit
                </Button>
              </Group>
            </Stack>
          </Suspense>
        </Grid.Col>
      ))
    ) : (
      <Text>No Variants Added Yet!</Text>
    );

  useEffect(() => {
    if (editFlag) {
      editor?.commands.setContent(ProductGeneratorForm.values.description.full);
    }
  }, []);

  return (
    <Container size="lg">
      <Box
        component="form"
        onSubmit={ProductGeneratorForm.onSubmit(handleSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        <Title order={2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {editFlag ? `Edit Product ${ProductData?.name}` : 'Create New Product'}
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
          label="Brand"
          placeholder="Enter Product Brand"
          required
          {...ProductGeneratorForm.getInputProps('brand')}
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

        <Title my="md" order={4} style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Product Meta Data (SEO Optimization)
        </Title>
        <TextInput
          label="Meta Title"
          placeholder="Enter Product Meta Title"
          required
          {...ProductGeneratorForm.getInputProps('metaTitle')}
        />
        <Textarea
          label="Meta Description"
          placeholder="Enter Product Meta Description"
          required
          {...ProductGeneratorForm.getInputProps('metaDescription')}
        />
        <TextInput
          name="metaTags"
          label="Meta Tags"
          placeholder="Enter Product Meta Tags, Press Enter to Add New Tag"
          value={metaTagInput}
          onChange={(e) => setMetaTagInput(e.target.value)}
          rightSection={
            <UnstyledButton
              w="fit-content"
              onClick={() => {
                const isDuplicate = ProductGeneratorForm.values.metaTags.includes(metaTagInput);
                if (isDuplicate) {
                  toast.error('Duplicate meta tag');
                } else {
                  ProductGeneratorForm.setFieldValue('metaTags', [
                    ...ProductGeneratorForm.values.metaTags,
                    metaTagInput,
                  ]);
                  setMetaTagInput('');
                }
              }}
            >
              <Tooltip label="Add Meta Tag">
                <IconPlus color="blue" style={{ marginTop: '0.4rem' }} />
              </Tooltip>
            </UnstyledButton>
          }
        />
        {Array.isArray(ProductGeneratorForm.values.metaTags) &&
          ProductGeneratorForm.values.metaTags.length > 0 && (
            <Flex>
              {ProductGeneratorForm.values.metaTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  style={{ marginRight: '0.5rem' }}
                  rightSection={
                    <UnstyledButton
                      onClick={() =>
                        ProductGeneratorForm.setFieldValue(
                          'metaTags',
                          (ProductGeneratorForm.values.metaTags as string[]).filter(
                            (i) => i !== tag
                          )
                        )
                      }
                    >
                      <Center>
                        <IconX size={15} />
                      </Center>
                    </UnstyledButton>
                  }
                >
                  {tag}
                </Badge>
              ))}
            </Flex>
          )}
        <Box my="md">
          <Title mb="lg" ta="center" order={3}>
            Write a Full Description For The Product.
          </Title>
          <RTE ref={RichTextEditorRef} editor={editor as Editor} />
        </Box>
        <Divider />
        <Box my="lg">
          <Stack>
            <Button
              w="fit-content"
              my="lg"
              onClick={() => {
                setVariantEditFlag(false);
                VariantGeneratorForm.reset();
                open();
              }}
            >
              Add
            </Button>
            {VariantInputModal}
          </Stack>
          <Grid>{renderVariants}</Grid>
        </Box>
        <Divider />
        <Box>
          <Group>
            <TextInput
              labelProps={{ my: 'md' }}
              label="Shared Detail Key"
              placeholder="Enter Key"
              // required
              value={sharedDetail.key}
              onChange={(e) => setSharedDetail({ ...sharedDetail, key: e.target.value })}
            />
            <TextInput
              labelProps={{ my: 'md' }}
              label="Shared Detail Value"
              placeholder="Enter Value"
              // required
              value={sharedDetail.value}
              onChange={(e) => setSharedDetail({ ...sharedDetail, value: e.target.value })}
            />
          </Group>
          <Button
            my="lg"
            onClick={() => {
              if (sharedDetail.key.trim() === '' || sharedDetail.value.trim() === '') {
                toast.error('Key or value cannot be empty');
              } else {
                ProductGeneratorForm.setFieldValue('sharedDetails', [
                  ...ProductGeneratorForm.values.sharedDetails,
                  sharedDetail,
                ]);
                setSharedDetail({ key: '', value: '' });
              }
            }}
          >
            Add Shared Detail
          </Button>
          {ProductGeneratorForm.values.sharedDetails.length > 0 ? (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Key</Table.Th>
                  <Table.Th>Value</Table.Th>
                  <Table.Th>Remove</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {ProductGeneratorForm.values.sharedDetails.map((item) => (
                  <Table.Tr key={item.key}>
                    <Table.Td>{item.key}</Table.Td>
                    <Table.Td>{item.value}</Table.Td>
                    <Table.Td>
                      <Button
                        onClick={() =>
                          ProductGeneratorForm.setFieldValue(
                            'sharedDetails',
                            ProductGeneratorForm.values.sharedDetails.filter(
                              (i) => i.key !== item.key
                            )
                          )
                        }
                      >
                        Remove
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text>No Shared Details Added Yet!</Text>
          )}
        </Box>
        <Divider />
        <Button
          onClick={() => {
            ProductGeneratorForm.setFieldValue('description.full', editor?.getHTML() || '');
          }}
          type="submit"
          color="blue"
          size="lg"
          radius="md"
        >
          {editFlag ? 'Edit Product' : 'Create Product'}
        </Button>
      </Box>
    </Container>
  );
}
