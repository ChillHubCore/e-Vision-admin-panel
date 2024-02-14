import { TextInput, PasswordInput, Button, Box, Title, Center } from '@mantine/core';
import { hasLength, isEmail, matches, matchesField, useForm } from '@mantine/form';
import { useDispatch } from 'react-redux';
import { useSubmit } from '@/lib/hooks';
import { signIn } from '@/lib/redux/User/UserSlice';

export interface SignupFormProps {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const SignUpForm = useForm({
    initialValues: {
      username: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: hasLength({ min: 4, max: 255 }, 'Username must be 4-10 characters long'),
      firstName: hasLength({ min: 2, max: 255 }, 'First Name must be 2-10 characters long'),
      lastName: hasLength({ min: 2, max: 255 }, 'Last Name must be 2-10 characters long'),
      email: isEmail('Invalid email'),
      password: matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, 'Password is too weak'),
      confirmPassword: matchesField('password', 'Passwords are not the same'),
    },
  });

  const FormActions = useSubmit();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    FormActions.sendRequest(
      '/user/signup',
      SignUpForm,
      'post',
      'Congratulations! You have signed up successfully!',
      'Failed to sign up! Please try again.'
    );
  };

  if (FormActions.success) dispatch(signIn(FormActions.data as UserInfo));

  return (
    <Center>
      <Box
        component="form"
        onSubmit={SignUpForm.onSubmit(handleSubmit)}
        w={{ base: '100%', sm: '80%', md: '60%', lg: '40%', xl: '30%' }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <Title order={2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Sign Up Form
        </Title>

        <TextInput
          disabled={FormActions.isLoading}
          label="First Name"
          placeholder="Enter your first name"
          {...SignUpForm.getInputProps('firstName')}
          required
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="Last Name"
          placeholder="Enter your last name"
          {...SignUpForm.getInputProps('lastName')}
          required
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="Username"
          placeholder="Enter your username"
          {...SignUpForm.getInputProps('username')}
          required
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="Phone"
          placeholder="Enter your phone number"
          {...SignUpForm.getInputProps('phone')}
          required
        />

        <TextInput
          disabled={FormActions.isLoading}
          label="Email"
          placeholder="Enter your email"
          {...SignUpForm.getInputProps('email')}
          required
        />

        <PasswordInput
          disabled={FormActions.isLoading}
          label="Password"
          placeholder="Enter your password"
          {...SignUpForm.getInputProps('password')}
          required
        />

        <PasswordInput
          disabled={FormActions.isLoading}
          label="Confirm Password"
          placeholder="Confirm your password"
          {...SignUpForm.getInputProps('confirmPassword')}
          required
        />

        <Button w="max-content" type="submit" disabled={FormActions.isLoading}>
          Sign Up
        </Button>
      </Box>
    </Center>
  );
};

export default SignupPage;