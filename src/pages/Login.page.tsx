import { TextInput, PasswordInput, Button } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';

const LoginPage = () => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: isEmail('Invalid email'),
      password: (value: string) => value.length >= 6 && (value.match(/\D/g) || []).length >= 4,
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <TextInput
        label="Email"
        placeholder="Enter your email"
        {...form.getInputProps('email')}
        required
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        {...form.getInputProps('password')}
        required
      />

      <Button type="submit">Sign In</Button>
    </form>
  );
};

export default LoginPage;
