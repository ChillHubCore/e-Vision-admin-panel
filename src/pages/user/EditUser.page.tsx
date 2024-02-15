import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Alert, Container, LoadingOverlay, TextInput, Title } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';

import { getData } from '@/lib/utils/getData';
import classes from '@/lib/styles/User.module.scss';

export default function EditUserPage() {
  const { id } = useParams();

  const UserData = useQuery(`user-data-${id}`, () => getData(`/user/${id}`));

  return UserData.isLoading ? (
    <LoadingOverlay />
  ) : UserData.isError ? (
    <Alert color="red">Something Went Wrong</Alert>
  ) : (
    <Container size="lg" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Title py="lg" order={3}>
        Edit User {UserData.data.username}
      </Title>
      <TextInput
        disabled
        label="First Name"
        value={UserData.data.firstName}
        rightSection={
          <IconEdit
            className={classes.iconButton}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          />
        }
      />
      <TextInput
        disabled
        label="Last Name"
        value={UserData.data.lastName}
        rightSection={
          <IconEdit
            className={classes.iconButton}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          />
        }
      />
      <TextInput
        disabled
        label="Email"
        value={UserData.data.email}
        rightSection={
          <IconEdit
            className={classes.iconButton}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          />
        }
      />
      <TextInput
        disabled
        label="Username"
        value={UserData.data.username}
        rightSection={
          <IconEdit
            className={classes.iconButton}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          />
        }
      />
      <TextInput
        disabled
        label="Phone"
        value={UserData.data.phone}
        rightSection={
          <IconEdit
            className={classes.iconButton}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          />
        }
      />
    </Container>
  );
}
