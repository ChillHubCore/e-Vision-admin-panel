import { Box, Button, Center, PasswordInput, Switch, TextInput, Title } from '@mantine/core';
import { hasLength, isEmail, matches, matchesField, useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { useSubmit } from '@/lib/hooks';

export default function CreateUserPage() {
  const CreateUserForm = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      isCreator: false,
      isAdmin: false,
    },
    validate: {
      username: hasLength({ min: 4, max: 255 }, 'Username must be 4-10 characters long'),
      firstName: hasLength({ min: 2, max: 255 }, 'First Name must be 2-10 characters long'),
      lastName: hasLength({ min: 2, max: 255 }, 'Last Name must be 2-10 characters long'),
      email: isEmail('Invalid email'),
      password: matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, 'Password is too weak'),
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
    },
  });
  const FormActions = useSubmit();
  const navigate = useNavigate();
  const handleSubmit = () => {
    FormActions.sendRequest(
      '/user',
      CreateUserForm,
      'post',
      'User Created Successfully!',
      'Failed to create user! Please try again.',
      () => navigate('/admin/dashboard/users')
    );
  };
  return (
    <Center>
      <Box
        component="form"
        onSubmit={CreateUserForm.onSubmit(handleSubmit)}
        w={{ base: '100%', sm: '80%', md: '60%', lg: '40%', xl: '30%' }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <Title order={2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Create New User Form
        </Title>

        <TextInput
          disabled={FormActions.isLoading}
          label="First Name"
          placeholder="Client first name"
          {...CreateUserForm.getInputProps('firstName')}
          required
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="last Name"
          placeholder="Client last name"
          {...CreateUserForm.getInputProps('lastName')}
          required
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="username"
          placeholder="Client username"
          {...CreateUserForm.getInputProps('username')}
          required
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="Phone"
          placeholder="Client phone number"
          {...CreateUserForm.getInputProps('phone')}
          required
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="Email"
          placeholder="Client email"
          {...CreateUserForm.getInputProps('email')}
          required
        />

        <PasswordInput
          disabled={FormActions.isLoading}
          label="Password"
          placeholder="Client password"
          {...CreateUserForm.getInputProps('password')}
          required
        />

        <PasswordInput
          disabled={FormActions.isLoading}
          label="Confirm Password"
          placeholder="Confirm Client password"
          {...CreateUserForm.getInputProps('confirmPassword')}
          required
        />
        <Switch
          disabled={FormActions.isLoading}
          {...CreateUserForm.getInputProps('isAdmin')}
          label="Client Has Admin Pemissions"
        />
        <Switch
          disabled={FormActions.isLoading}
          {...CreateUserForm.getInputProps('isCreator')}
          label="Client Has Creator Pemissions"
        />

        <Button w="max-content" type="submit" disabled={FormActions.isLoading}>
          Create
        </Button>
      </Box>
    </Center>
  );
}
