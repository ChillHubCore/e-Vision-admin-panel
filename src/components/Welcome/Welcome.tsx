import { Title, Text } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title order={2} className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          e-Vision Admin Panel
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="md" maw={580} mx="auto" mt="xl">
        This is e-Vision E-Commerce Admin Panel Which Provides You With The Ability To Manage Your
        Store Products, Orders, Customers, And More.
      </Text>
    </>
  );
}
