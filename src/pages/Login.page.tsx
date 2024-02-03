import { TextInput, PasswordInput, Button, Center, Box, Title } from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useDispatch } from 'react-redux';
// import { useEffect } from 'react';
import { useSubmit } from '@/lib/hooks';
import { signIn } from '@/lib/redux/User/UserSlice';

const LoginPage = () => {
  const SignInForm = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: isEmail('Invalid email'),
      password: isNotEmpty('Password is required'),
    },
  });

  const FormActions = useSubmit();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    FormActions.sendRequest(
      '/user/signin',
      SignInForm,
      'post',
      'Congratulations! You have signed in successfully!',
      'Failed to sign in! Please try again.'
    );
  };
  if (FormActions.success) dispatch(signIn(FormActions.data as UserInfo));

  return (
    <Center>
      <Box
        w={{ base: '100%', sm: '80%', md: '60%', lg: '40%', xl: '30%' }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
        component="form"
        onSubmit={SignInForm.onSubmit(handleSubmit)}
      >
        <Title order={2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Login Form
        </Title>
        <TextInput
          label="Email"
          placeholder="Enter your email"
          {...SignInForm.getInputProps('email')}
          required
          disabled={FormActions.isLoading}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          {...SignInForm.getInputProps('password')}
          required
          disabled={FormActions.isLoading}
        />

        <Button type="submit" disabled={FormActions.isLoading}>
          Log In
        </Button>
      </Box>
    </Center>
  );
};

export default LoginPage;
