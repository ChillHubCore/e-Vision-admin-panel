import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Divider,
  FileInput,
  Flex,
  Group,
  Image,
  Loader,
  Modal,
  NumberInput,
  ScrollArea,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { hasLength, isEmail, isNotEmpty, useForm } from '@mantine/form';
import { Icon3dCubeSphere, IconFileLike, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';
import { useDisclosure } from '@mantine/hooks';
import { useSelector } from 'react-redux';
import { useSubmit, useUpload } from '@/lib/hooks';
import { getData } from '@/lib/utils/getData';
import { ShopSettingsProps } from './types';
import blackBG from '@/assets/black-bg.png';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';

export default function GeneralSettingsPage() {
  const GeneralSettingsForm = useForm({
    initialValues: {
      name: '',
      primaryCurrency: '',
      extraCurrenciesSupported: [] as string[],
      description: '',
      logo: '',
      taxRate: '',
      userStatus: [] as string[],
      contactAddresses: {
        physical: '',
        email: '',
        countryCode: '',
        phone: '',
        postalCode: '',
      },
      postalOptions: [] as string[],
      paymentOptions: [] as string[],
      CardToCard: [] as unknown as {
        cardNumber: string;
        cardShabaNumber: string;
        cardOwner: string;
        available: boolean;
      }[],
    },
    validate: {
      name: hasLength({ min: 3, max: 255 }, 'Name must be 3-255 characters long'),
      primaryCurrency: hasLength(
        { min: 3, max: 255 },
        'Primary currency must be 3-255 characters long'
      ),
      extraCurrenciesSupported: (value) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      description: hasLength({ min: 3, max: 255 }, 'Description must be 3-255 characters long'),
      logo: isNotEmpty('Logo is required'),
      taxRate: isNotEmpty('Tax rate is required'),
      userStatus: (value) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      contactAddresses: {
        physical: hasLength({ min: 3, max: 255 }, 'Physical address must be 3-255 characters long'),
        email: isEmail('Invalid email address'),
        countryCode: isNotEmpty('Country code is required'),
        phone: isNotEmpty('Phone is required'),
        postalCode: isNotEmpty('Postal code is required'),
      },
      postalOptions: (value) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      paymentOptions: (value) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
    },
  });
  const [CurrencyInputValue, setCurrencyInputValue] = useState('');
  const [UserStatusInputValue, setUserStatusInputValue] = useState('');
  const [PostalOptionsInputValue, setPostalOptionsInputValue] = useState('');
  const [PaymentOptionsInputValue, setPaymentOptionsInputValue] = useState('');
  const [versionSelected, setVersionSelected] = useState('+');
  const [opened, { open, close }] = useDisclosure(false);
  const [CardInfoInputs, setCardInfoInputs] = useState({
    cardNumber: '',
    cardShabaNumber: '',
    cardOwner: '',
    available: false,
  });
  const uploadHandle = useUpload();
  const FormActions = useSubmit();
  const userInfo = useSelector(selectUserInfo);
  const ShopSettingsData = useQuery('general-settings', () => getData('/app', userInfo?.token), {
    cacheTime: 0,
  });
  const handleSubmit = () => {
    FormActions.sendRequest(
      '/app',
      GeneralSettingsForm,
      'post',
      'Changes Submited Successfully!',
      'Failed to Save Changes! Please try again.',
      () => {
        ShopSettingsData.refetch();
        GeneralSettingsForm.reset();
        setVersionSelected('');
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    );
  };

  return (
    <Container size="md" w="100%">
      {ShopSettingsData.isLoading ? (
        <Loader />
      ) : ShopSettingsData.data.length > 0 ? (
        <Chip.Group multiple={false} value={versionSelected} onChange={setVersionSelected}>
          <Title order={3} my="md">
            Select a Version
          </Title>
          <ScrollArea w={{ base: '85vw', md: '60vw' }} py="lg">
            <Flex direction="row" gap="sm">
              <Chip
                value="+"
                onClick={() => {
                  GeneralSettingsForm.reset();
                  setVersionSelected('');
                }}
              >
                +
              </Chip>
              {ShopSettingsData.data.map((data: ShopSettingsProps, index: number) => (
                <Chip
                  key={data.version}
                  value={data.version.toString()}
                  onClick={() => {
                    GeneralSettingsForm.setValues(data);
                    setVersionSelected(data.version);
                  }}
                >
                  {index === 0 ? (
                    <Flex justify="space-between" align="center" gap="md">
                      <Tooltip label="This is The Latest And Active Version!">
                        <Icon3dCubeSphere />
                      </Tooltip>
                      {data.version}
                    </Flex>
                  ) : (
                    data.version
                  )}
                </Chip>
              ))}
            </Flex>
          </ScrollArea>
        </Chip.Group>
      ) : (
        <p>No Versions Has Been Submited Yet!</p>
      )}
      <Box
        component="form"
        onSubmit={GeneralSettingsForm.onSubmit(handleSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        <Title order={3} my="md">
          General Shop Settings
        </Title>
        <TextInput
          label="Shop Name"
          placeholder="Enter Shop Name"
          required
          {...GeneralSettingsForm.getInputProps('name')}
        />
        <TextInput
          label="Primary Currency"
          placeholder="Enter Primary Currency"
          required
          {...GeneralSettingsForm.getInputProps('primaryCurrency')}
        />
        <TextInput
          label="Extra Currencies Supported"
          placeholder="Enter Extra Currencies Supported"
          value={CurrencyInputValue}
          onChange={(e) => setCurrencyInputValue(e.currentTarget.value)}
          rightSection={
            <UnstyledButton
              w="fit-content"
              onClick={() => {
                if (
                  GeneralSettingsForm.values.extraCurrenciesSupported.includes(CurrencyInputValue)
                ) {
                  toast.error('Currency already exists');
                } else {
                  GeneralSettingsForm.setFieldValue('extraCurrenciesSupported', [
                    ...GeneralSettingsForm.values.extraCurrenciesSupported,
                    CurrencyInputValue,
                  ]);
                  setCurrencyInputValue('');
                }
              }}
            >
              <Tooltip label="Add Currency">
                <IconPlus color="blue" style={{ marginTop: '0.4rem' }} />
              </Tooltip>
            </UnstyledButton>
          }
        />

        <Divider my="md" />

        <Box bg="gray" style={{ borderRadius: '1rem' }} p="md">
          {GeneralSettingsForm.values.extraCurrenciesSupported.length > 0 ? (
            GeneralSettingsForm.values.extraCurrenciesSupported.map((currency: string) => (
              <Group justify="space-between" key={currency}>
                <p>{currency}</p>
                <Tooltip label="Remove This Currency">
                  <UnstyledButton
                    c="orange"
                    onClick={() => {
                      GeneralSettingsForm.setFieldValue(
                        'extraCurrenciesSupported',
                        GeneralSettingsForm.values.extraCurrenciesSupported.filter(
                          (c) => c !== currency
                        )
                      );
                    }}
                  >
                    Remove
                  </UnstyledButton>
                </Tooltip>
              </Group>
            ))
          ) : (
            <p>No Extra Currencies Supported</p>
          )}
        </Box>
        <Divider my="md" />
        <Textarea
          label="Description"
          placeholder="Enter Description"
          required
          {...GeneralSettingsForm.getInputProps('description')}
        />
        <Group justify="space-between" align="center" my="md">
          <FileInput
            w="50%"
            labelProps={{ my: 'sm' }}
            disabled={uploadHandle.isLoading}
            onChange={(value) =>
              uploadHandle.sendFile(
                '/upload',
                value as File,
                'Image Uploaded Successfully!',
                'Failed to upload image! Please try again.',
                (url: string) => {
                  GeneralSettingsForm.setFieldValue('logo', url);
                }
              )
            }
            label="Choose a Picture to Upload"
            rightSection={uploadHandle.isLoading ? <Loader size="xs" /> : <IconFileLike />}
          />

          <Image
            src={GeneralSettingsForm.values.logo ? GeneralSettingsForm.values.logo : blackBG}
            alt="Shop Logo"
            w={100}
            style={{ borderRadius: '1rem' }}
          />
        </Group>
        <NumberInput
          min={0}
          max={100}
          label="Tax Rate"
          placeholder="Enter Tax Rate"
          required
          {...GeneralSettingsForm.getInputProps('taxRate')}
        />
        <TextInput
          label="User Status"
          placeholder="Enter User Status"
          value={UserStatusInputValue}
          onChange={(e) => setUserStatusInputValue(e.currentTarget.value)}
          rightSection={
            <UnstyledButton
              w="fit-content"
              onClick={() => {
                if (GeneralSettingsForm.values.userStatus.includes(UserStatusInputValue)) {
                  toast.error('This User Status already exists');
                } else {
                  GeneralSettingsForm.setFieldValue('userStatus', [
                    ...GeneralSettingsForm.values.userStatus,
                    UserStatusInputValue,
                  ]);
                  setUserStatusInputValue('');
                }
              }}
            >
              <Tooltip label="Add User Status">
                <IconPlus color="blue" style={{ marginTop: '0.4rem' }} />
              </Tooltip>
            </UnstyledButton>
          }
        />
        <Divider my="md" />
        <Box bg="gray" style={{ borderRadius: '1rem' }} p="md">
          {GeneralSettingsForm.values.userStatus.length > 0 ? (
            GeneralSettingsForm.values.userStatus.map((status: string) => (
              <Group justify="space-between" key={status}>
                <p>{status}</p>
                <Tooltip label="Remove This User Status">
                  <UnstyledButton
                    c="orange"
                    onClick={() => {
                      GeneralSettingsForm.setFieldValue(
                        'userStatus',
                        GeneralSettingsForm.values.userStatus.filter((c) => c !== status)
                      );
                    }}
                  >
                    Remove
                  </UnstyledButton>
                </Tooltip>
              </Group>
            ))
          ) : (
            <p>No User Status</p>
          )}
        </Box>
        <Divider my="md" />
        <Textarea
          label="Physical Address"
          placeholder="Enter Physical Address"
          required
          {...GeneralSettingsForm.getInputProps('contactAddresses.physical')}
        />
        <TextInput
          label="Email"
          placeholder="Enter Email"
          required
          {...GeneralSettingsForm.getInputProps('contactAddresses.email')}
        />
        <TextInput
          label="Country Code"
          placeholder="Enter Country Code"
          required
          {...GeneralSettingsForm.getInputProps('contactAddresses.countryCode')}
        />
        <TextInput
          label="Phone"
          placeholder="Enter Phone"
          required
          {...GeneralSettingsForm.getInputProps('contactAddresses.phone')}
        />
        <TextInput
          label="Postal Code"
          placeholder="Enter Postal Code"
          required
          {...GeneralSettingsForm.getInputProps('contactAddresses.postalCode')}
        />
        <Divider my="md" />
        <TextInput
          label="Postal Options"
          placeholder="Enter Postal Options"
          value={PostalOptionsInputValue}
          onChange={(e) => setPostalOptionsInputValue(e.currentTarget.value)}
          rightSection={
            <UnstyledButton
              w="fit-content"
              onClick={() => {
                if (GeneralSettingsForm.values.postalOptions.includes(PostalOptionsInputValue)) {
                  toast.error('Postal Option already exists');
                } else {
                  GeneralSettingsForm.setFieldValue('postalOptions', [
                    ...GeneralSettingsForm.values.postalOptions,
                    PostalOptionsInputValue,
                  ]);
                  setPostalOptionsInputValue('');
                }
              }}
            >
              <Tooltip label="Add Postal Option">
                <IconPlus color="blue" style={{ marginTop: '0.4rem' }} />
              </Tooltip>
            </UnstyledButton>
          }
        />
        <Divider my="md" />
        <Box bg="gray" style={{ borderRadius: '1rem' }} p="md">
          {GeneralSettingsForm.values.postalOptions.length > 0 ? (
            GeneralSettingsForm.values.postalOptions.map((option: string) => (
              <Group justify="space-between" key={option}>
                <p>{option}</p>
                <Tooltip label="Remove This Postal Option">
                  <UnstyledButton
                    c="orange"
                    onClick={() => {
                      GeneralSettingsForm.setFieldValue(
                        'postalOptions',
                        GeneralSettingsForm.values.postalOptions.filter((c) => c !== option)
                      );
                    }}
                  >
                    Remove
                  </UnstyledButton>
                </Tooltip>
              </Group>
            ))
          ) : (
            <p>No Postal Options</p>
          )}
        </Box>
        <Divider my="md" />
        <TextInput
          label="Payment Options"
          placeholder="Enter Payment Options"
          value={PaymentOptionsInputValue}
          onChange={(e) => setPaymentOptionsInputValue(e.currentTarget.value)}
          rightSection={
            <UnstyledButton
              w="fit-content"
              onClick={() => {
                if (GeneralSettingsForm.values.paymentOptions.includes(PaymentOptionsInputValue)) {
                  toast.error('Payment Option already exists');
                } else {
                  GeneralSettingsForm.setFieldValue('paymentOptions', [
                    ...GeneralSettingsForm.values.paymentOptions,
                    PaymentOptionsInputValue,
                  ]);
                  setPaymentOptionsInputValue('');
                }
              }}
            >
              <Tooltip label="Add Payment Option">
                <IconPlus color="blue" style={{ marginTop: '0.4rem' }} />
              </Tooltip>
            </UnstyledButton>
          }
        />
        <Divider my="md" />
        <Box bg="gray" style={{ borderRadius: '1rem' }} p="md">
          {GeneralSettingsForm.values.paymentOptions.length > 0 ? (
            GeneralSettingsForm.values.paymentOptions.map((option: string) => (
              <Group justify="space-between" key={option}>
                <p>{option}</p>
                <Tooltip label="Remove This Payment Option">
                  <UnstyledButton
                    c="orange"
                    onClick={() => {
                      GeneralSettingsForm.setFieldValue(
                        'paymentOptions',
                        GeneralSettingsForm.values.paymentOptions.filter((c) => c !== option)
                      );
                    }}
                  >
                    Remove
                  </UnstyledButton>
                </Tooltip>
              </Group>
            ))
          ) : (
            <p>No Payment Options</p>
          )}
        </Box>

        <Divider my="md" />
        <Text my="sm">Manage Card Information For Card-To-Card Payment Option.</Text>
        <Box my="sm">
          <Button onClick={open}>Add a Card Information</Button>
          <Modal opened={opened} onClose={close} title="Add New Card Information">
            <Flex direction="column" gap="md">
              <p>Fill The Card Information</p>
              <TextInput
                label="Card Number"
                placeholder="Enter Card Number"
                required
                value={CardInfoInputs.cardNumber}
                onChange={(e) =>
                  setCardInfoInputs({ ...CardInfoInputs, cardNumber: e.currentTarget.value })
                }
              />
              <TextInput
                label="Card Shaba Number"
                placeholder="Enter Card Shaba Number"
                required
                value={CardInfoInputs.cardShabaNumber}
                onChange={(e) =>
                  setCardInfoInputs({ ...CardInfoInputs, cardShabaNumber: e.currentTarget.value })
                }
              />
              <TextInput
                label="Card Owner"
                placeholder="Enter Card Owner"
                required
                value={CardInfoInputs.cardOwner}
                onChange={(e) =>
                  setCardInfoInputs({ ...CardInfoInputs, cardOwner: e.currentTarget.value })
                }
              />
              <Checkbox
                label="Available"
                checked={CardInfoInputs.available}
                onChange={(e) =>
                  setCardInfoInputs({ ...CardInfoInputs, available: e.currentTarget.checked })
                }
              />
              <Button
                onClick={() => {
                  const existingCard = GeneralSettingsForm.values.CardToCard.find(
                    (card) => card.cardNumber === CardInfoInputs.cardNumber
                  );
                  if (existingCard) {
                    // Display error toast
                    toast.error('Card with same card number already exists');
                  } else {
                    GeneralSettingsForm.setFieldValue('CardToCard', [
                      ...GeneralSettingsForm.values.CardToCard,
                      CardInfoInputs,
                    ]);
                    setCardInfoInputs({
                      cardNumber: '',
                      cardShabaNumber: '',
                      cardOwner: '',
                      available: false,
                    });
                    close();
                  }
                }}
              >
                Submit
              </Button>
            </Flex>
          </Modal>
        </Box>

        <Divider my="md" />
        {GeneralSettingsForm.values.CardToCard.length > 0 && (
          <Box>
            {GeneralSettingsForm.values.CardToCard.map(
              (card: {
                cardNumber: string;
                cardShabaNumber: string;
                cardOwner: string;
                available: boolean;
              }) => (
                <Group key={card.cardNumber} justify="space-between" align="center">
                  <p>{card.cardNumber}</p>
                  <p>{card.cardShabaNumber}</p>
                  <p>{card.cardOwner}</p>
                  <p>{card.available ? 'Available' : 'Not Available'}</p>
                  <Button
                    onClick={() => {
                      GeneralSettingsForm.setFieldValue(
                        'CardToCard',
                        GeneralSettingsForm.values.CardToCard.filter((c) => c !== card)
                      );
                    }}
                  >
                    Remove
                  </Button>
                </Group>
              )
            )}
          </Box>
        )}

        <Divider my="md" />
        <Button type="submit" style={{ alignSelf: 'flex-end' }}>
          Submit Changes
        </Button>
      </Box>
    </Container>
  );
}
