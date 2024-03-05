import {
  Box,
  Button,
  Center,
  NativeSelect,
  PasswordInput,
  Switch,
  TextInput,
  Title,
} from '@mantine/core';
import { hasLength, isEmail, isNotEmpty, matches, matchesField, useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DatePickerInput } from '@mantine/dates';
import { IconX } from '@tabler/icons-react';
import { useSubmit } from '@/lib/hooks';
import { UserEntityProps } from '@/components/Dashboard/types';
import { roles } from '@/lib/constants';

export default function UserGenerator({
  UserData,
  editFlag,
}: {
  UserData?: UserEntityProps;
  editFlag: boolean;
}) {
  const UserGeneratorForm = useForm({
    initialValues: {
      firstName: UserData?.firstName || '',
      lastName: UserData?.lastName || '',
      username: UserData?.username || '',
      birthDate: UserData?.birthDate ? new Date(UserData.birthDate) : null,
      loyaltyPoints: UserData?.loyaltyPoints || 0,
      shopTokenBalance: UserData?.shopTokenBalance || 0,
      role: UserData?.role || 'user',
      email: UserData?.email || '',
      countryCode: UserData?.countryCode || '',
      phone: UserData?.phone || '',
      password: '',
      confirmPassword: '',
      isCreator: UserData?.isCreator || false,
      isAdmin: UserData?.isAdmin || false,
      isEmailVerified: UserData?.isEmailVerified || false,
      isPhoneVerified: UserData?.isPhoneVerified || false,
    },
    validate: {
      username: hasLength({ min: 4, max: 255 }, 'Username must be 4-10 characters long'),
      firstName: hasLength({ min: 2, max: 255 }, 'First Name must be 2-10 characters long'),
      lastName: hasLength({ min: 2, max: 255 }, 'Last Name must be 2-10 characters long'),
      countryCode: isNotEmpty('Country Code is required'),
      phone: isNotEmpty('Phone is required'),
      email: isEmail('Invalid email'),
      password: editFlag
        ? (value, fieldValues) => {
            if (fieldValues.password === '') {
              return null; // Skip validation if password field is empty
            }
            return matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, 'Password is too weak')(value);
          }
        : matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, 'Password is too weak'),
      confirmPassword: matchesField('password', 'Passwords are not the same'),
      isCreator: (value) => {
        if (typeof value === 'boolean') {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      isAdmin: (value) => {
        if (typeof value === 'boolean') {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      isEmailVerified: (value) => {
        if (typeof value === 'boolean') {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
      isPhoneVerified: (value) => {
        if (typeof value === 'boolean') {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
    },
  });
  const FormActions = useSubmit();
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (UserGeneratorForm.values.confirmPassword !== UserGeneratorForm.values.password) {
      toast.error('Passwords do not match!');
      return;
    }
    if (editFlag) {
      FormActions.sendRequest(
        `/user/${UserData?._id}`,
        UserGeneratorForm,
        'put',
        'User Edited Successfully!',
        'Failed to edit user! Please try again.',
        () => navigate('/admin/dashboard/users')
      );
    } else {
      FormActions.sendRequest(
        '/user',
        UserGeneratorForm,
        'post',
        'User Created Successfully!',
        'Failed to create user! Please try again.',
        () => navigate('/admin/dashboard/users')
      );
    }
  };
  return (
    <Center>
      <Box
        component="form"
        onSubmit={UserGeneratorForm.onSubmit(handleSubmit)}
        w={{ base: '100%', sm: '80%', md: '60%', lg: '40%', xl: '30%' }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <Title order={2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {editFlag ? `Edit User "${UserData?.username}"` : 'Create New User'}
        </Title>

        <TextInput
          disabled={FormActions.isLoading}
          label="First Name"
          placeholder="Client first name"
          {...UserGeneratorForm.getInputProps('firstName')}
          required={!editFlag}
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="last Name"
          placeholder="Client last name"
          {...UserGeneratorForm.getInputProps('lastName')}
          required={!editFlag}
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="username"
          placeholder="Client username"
          {...UserGeneratorForm.getInputProps('username')}
          required={!editFlag}
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="Country Code"
          placeholder="Client country code"
          {...UserGeneratorForm.getInputProps('countryCode')}
          required={!editFlag}
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="Phone"
          placeholder="Client phone number"
          {...UserGeneratorForm.getInputProps('phone')}
          required={!editFlag}
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="Email"
          placeholder="Client email"
          {...UserGeneratorForm.getInputProps('email')}
          required={!editFlag}
        />

        <DatePickerInput
          {...UserGeneratorForm.getInputProps('birthDate')}
          placeholder="Client birth date"
          rightSection={
            <IconX
              onClick={() => {
                UserGeneratorForm.setFieldValue('birthDate', null);
              }}
            />
          }
        />
        <NativeSelect data={roles} label="Role" {...UserGeneratorForm.getInputProps('role')} />
        <TextInput
          disabled={FormActions.isLoading}
          label="Loyalty Points"
          placeholder="Client loyalty points"
          {...UserGeneratorForm.getInputProps('loyaltyPoints')}
        />
        <TextInput
          disabled={FormActions.isLoading}
          label="Shop Token Balance"
          placeholder="Client shop token balance"
          {...UserGeneratorForm.getInputProps('shopTokenBalance')}
        />
        <PasswordInput
          disabled={FormActions.isLoading}
          label="Password"
          placeholder="Client password"
          {...UserGeneratorForm.getInputProps('password')}
          required={!editFlag}
        />

        <PasswordInput
          disabled={FormActions.isLoading}
          label="Confirm Password"
          placeholder="Confirm Client password"
          {...UserGeneratorForm.getInputProps('confirmPassword')}
          required={!editFlag}
        />
        <Switch
          defaultChecked={UserData?.isCreator}
          disabled={FormActions.isLoading}
          {...UserGeneratorForm.getInputProps('isAdmin')}
          label="Client Has Admin Pemissions"
        />
        <Switch
          defaultChecked={UserData?.isCreator}
          disabled={FormActions.isLoading}
          {...UserGeneratorForm.getInputProps('isCreator')}
          label="Client Has Creator Pemissions"
        />
        <Switch
          defaultChecked={UserData?.isEmailVerified}
          disabled={FormActions.isLoading}
          {...UserGeneratorForm.getInputProps('isEmailVerified')}
          label="Client Email Verified"
        />
        <Switch
          defaultChecked={UserData?.isPhoneVerified}
          disabled={FormActions.isLoading}
          {...UserGeneratorForm.getInputProps('isPhoneVerified')}
          label="Client Phone Verified"
        />

        <Button w="max-content" type="submit" disabled={FormActions.isLoading}>
          {editFlag ? 'Edit' : 'Create'}
        </Button>
      </Box>
    </Center>
  );
}
