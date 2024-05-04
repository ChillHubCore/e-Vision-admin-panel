import {
  Box,
  Button,
  Fieldset,
  FileInput,
  Group,
  Image,
  Loader,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { hasLength, isEmail, isNotEmpty, useForm } from '@mantine/form';
import { IconFileLike } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserEntityProps } from './types';
import { useSubmit, useUpload } from '@/lib/hooks';

export default function MyProfile({ UserData }: { UserData: UserEntityProps }) {
  const UserProfileForm = useForm({
    initialValues: {
      firstName: UserData?.firstName,
      lastName: UserData?.lastName,
      username: UserData?.username,
      profilePicture: UserData?.profilePicture,
      birthDate: UserData?.birthDate ? new Date(UserData.birthDate) : null,
      email: UserData?.email,
      countryCode: UserData?.countryCode,
      phone: UserData?.phone,
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: hasLength({ min: 4, max: 255 }, 'Username must be 4-10 characters long'),
      firstName: hasLength({ min: 2, max: 255 }, 'First Name must be 2-10 characters long'),
      lastName: hasLength({ min: 2, max: 255 }, 'Last Name must be 2-10 characters long'),
      countryCode: isNotEmpty('Country Code is required'),
      phone: isNotEmpty('Phone is required'),
      email: isEmail('Invalid email'),
    },
  });
  const FormActions = useSubmit();
  const uploadHandle = useUpload();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (UserProfileForm.values.confirmPassword.trim() !== UserProfileForm.values.password.trim()) {
      toast.error('Passwords do not match!');
      return;
    }
    FormActions.sendRequest(
      '/user/mine/profile',
      UserProfileForm,
      'put',
      'Profile Updated Successfully!',
      'Failed to update profile! Please try again.',
      () => navigate('/team/dashboard')
    );
  };
  return (
    <div>
      <Title order={3}>
        <Text ta="center">My Profile</Text>
      </Title>
      <Box component="form" onSubmit={UserProfileForm.onSubmit(handleSubmit)}>
        <Fieldset
          m="sm"
          legend="Personal information"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <Group justify="space-between">
            <FileInput
              disabled={uploadHandle.isLoading}
              onChange={(value) =>
                uploadHandle.sendFile(
                  '/upload',
                  value as File,
                  'Image Uploaded Successfully!',
                  'Failed to upload image! Please try again.',
                  (url: string) => {
                    UserProfileForm.setFieldValue('profilePicture', url);
                  }
                )
              }
              rightSection={uploadHandle.isLoading ? <Loader size="xs" /> : <IconFileLike />}
              label="Choose a Picture to Upload"
            />
            <div>
              <Image
                src={UserProfileForm.values.profilePicture}
                alt="Profile Picture"
                width={100}
                height={100}
                radius="xl"
                fit="contain"
              />
            </div>
          </Group>
          <TextInput
            required
            label="First Name"
            placeholder="John"
            value={UserProfileForm.values.firstName}
            onChange={(event) =>
              UserProfileForm.setFieldValue('firstName', event.currentTarget.value)
            }
            error={UserProfileForm.errors.firstName}
          />
          <TextInput
            required
            label="Last Name"
            placeholder="Doe"
            value={UserProfileForm.values.lastName}
            onChange={(event) =>
              UserProfileForm.setFieldValue('lastName', event.currentTarget.value)
            }
            error={UserProfileForm.errors.lastName}
          />
          <TextInput
            required
            label="Username"
            placeholder="johndoe"
            value={UserProfileForm.values.username}
            onChange={(event) =>
              UserProfileForm.setFieldValue('username', event.currentTarget.value)
            }
            error={UserProfileForm.errors.username}
          />
          <TextInput
            required
            label="Email"
            placeholder="user@example.com"
            value={UserProfileForm.values.email}
            onChange={(event) => UserProfileForm.setFieldValue('email', event.currentTarget.value)}
            error={UserProfileForm.errors.email}
          />
          <TextInput
            required
            label="Country Code"
            placeholder="+1"
            value={UserProfileForm.values.countryCode}
            onChange={(event) =>
              UserProfileForm.setFieldValue('countryCode', event.currentTarget.value)
            }
            error={UserProfileForm.errors.countryCode}
          />
          <TextInput
            required
            label="Phone"
            placeholder="1234567890"
            value={UserProfileForm.values.phone}
            onChange={(event) => UserProfileForm.setFieldValue('phone', event.currentTarget.value)}
            error={UserProfileForm.errors.phone}
          />
        </Fieldset>
        <Fieldset
          m="sm"
          legend="Change Password"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <TextInput
            type="password"
            label="Password"
            placeholder="Password"
            value={UserProfileForm.values.password}
            onChange={(event) =>
              UserProfileForm.setFieldValue('password', event.currentTarget.value)
            }
            error={UserProfileForm.errors.password}
          />
          <TextInput
            type="password"
            label="Confirm Password"
            placeholder="Confirm Password"
            value={UserProfileForm.values.confirmPassword}
            onChange={(event) =>
              UserProfileForm.setFieldValue('confirmPassword', event.currentTarget.value)
            }
            error={UserProfileForm.errors.confirmPassword}
          />
        </Fieldset>
        <Button m="md" w="max-content" type="submit" disabled={FormActions.isLoading}>
          Update Profile
        </Button>
      </Box>
    </div>
  );
}
