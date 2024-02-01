import { TextInput, PasswordInput, Button } from '@mantine/core';
import { hasLength, isEmail, matches, matchesField, useForm } from '@mantine/form';

const SignupPage: React.FC = () => {
  const SignUpForm = useForm({
    initialValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: hasLength({ min: 4, max: 255 }, 'Username must be 4-10 characters long'),
      firstName: hasLength({ min: 2, max: 255 }, 'First Name must be 2-10 characters long'),
      lastName: hasLength({ min: 2, max: 255 }, 'Last Name must be 2-10 characters long'),
      email: isEmail('Invalid email'),
      password: matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g, 'Password is too weak'),
      confirmPassword: matchesField('password', 'Passwords are not the same'),
    },
  });

  return (
    <form onSubmit={SignUpForm.onSubmit((values) => console.log(values))}>
      <TextInput
        label="Username"
        placeholder="Enter your username"
        {...SignUpForm.getInputProps('username')}
        required
      />

      <TextInput
        label="First Name"
        placeholder="Enter your first name"
        {...SignUpForm.getInputProps('firstName')}
        required
      />

      <TextInput
        label="Last Name"
        placeholder="Enter your last name"
        {...SignUpForm.getInputProps('lastName')}
        required
      />

      <TextInput
        label="Email"
        placeholder="Enter your email"
        {...SignUpForm.getInputProps('email')}
        required
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        {...SignUpForm.getInputProps('password')}
        required
      />

      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm your password"
        {...SignUpForm.getInputProps('confirmPassword')}
        required
      />

      <Button type="submit">Sign Up</Button>
    </form>
  );
};

export default SignupPage;
