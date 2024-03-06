import {
  Alert,
  Box,
  Button,
  Container,
  FileInput,
  Flex,
  Image,
  Loader,
  NativeSelect,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useQuery } from 'react-query';
import { IconFileLike } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { getData } from '@/lib/utils/getData';
import { TicketEntityProps, UserEntityProps } from './types';
import { useSubmit, useUpload } from '@/lib/hooks';

export default function TicketGenerator({
  TicketData,
  editFlag,
}: {
  TicketData?: TicketEntityProps;
  editFlag?: boolean;
}) {
  const TicketGeneratorForm = useForm({
    initialValues: {
      title: TicketData?.title || '',
      description: TicketData?.description || '',
      priority: TicketData?.priority || ('Low' as TicketEntityProps['priority'] | ''),
      status: TicketData?.status || ('Open' as TicketEntityProps['status'] | ''),
      assignedTo:
        TicketData?.assignedTo ||
        ({
          label: 'Unassigned',
          value: '',
        } as UserEntityProps | { label: string; value: string } | ''),
      attachments: TicketData?.attachments || ([] as string[]),
      ticketType: TicketData?.ticketType || ('Other' as TicketEntityProps['ticketType'] | ''),
    },
    validate: {
      title: isNotEmpty('Please enter a title for the ticket'),
      description: isNotEmpty('Please enter a description for the ticket'),
    },
  });
  const BasicUsers = useQuery('basicUsers', () => getData('/user?role=1'));
  const uploadHandle = useUpload();
  const FormActions = useSubmit();
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (editFlag) {
      FormActions.sendRequest(
        `/ticket/${TicketData?._id}`,
        TicketGeneratorForm,
        'put',
        'Ticket Edited Successfully!',
        'Failed to edit Ticket! Please try again.',
        () => navigate('/admin/dashboard/tickets')
      );
    } else {
      FormActions.sendRequest(
        '/ticket',
        TicketGeneratorForm,
        'post',
        'Ticket Created Successfully!',
        'Failed to create Ticket! Please try again.',
        () => navigate('/admin/dashboard/tickets')
      );
    }
  };
  return (
    <Container size="xl">
      <Title order={3}>{editFlag ? 'Edit Ticket' : 'Create a Ticket'}</Title>
      <Box component="form" onSubmit={TicketGeneratorForm.onSubmit(handleSubmit)}>
        <TextInput
          label="Title"
          placeholder="Enter ticket title"
          required
          {...TicketGeneratorForm.getInputProps('title')}
        />
        <Textarea
          label="Description"
          placeholder="Enter ticket description"
          required
          {...TicketGeneratorForm.getInputProps('description')}
        />
        <NativeSelect
          data={['Low', 'Medium', 'High', 'Urgent']}
          label="Priority"
          required
          {...TicketGeneratorForm.getInputProps('priority')}
        />
        <NativeSelect
          data={['Open', 'Closed', 'In-Progress', 'Pending']}
          label="Status"
          required
          {...TicketGeneratorForm.getInputProps('status')}
        />
        {BasicUsers.isLoading ? (
          <Loader />
        ) : BasicUsers.isError ? (
          <Alert color="red">Failed to fetch users</Alert>
        ) : (
          BasicUsers.data && (
            <NativeSelect
              data={[
                {
                  label: 'Unassigned',
                  value: '',
                },
                ...(BasicUsers.data.users.map((user: UserEntityProps) => ({
                  label: `${user.firstName} ${user.lastName}`,
                  value: user._id,
                })) as { label: string; value: string }[]),
              ]}
              label="Assigned To"
              required
              {...TicketGeneratorForm.getInputProps('assignedTo')}
            />
          )
        )}
        <NativeSelect
          data={[
            'Bug/Error',
            'Feature Request',
            'Product Consultation',
            'Order Issue',
            'Transaction Issue',
            'Feedback',
            'Other',
          ]}
          label="Ticket Type"
          required
          {...TicketGeneratorForm.getInputProps('ticketType')}
        />
        <FileInput
          label="Upload Attachments"
          onChange={(value) =>
            uploadHandle.sendFile(
              '/upload',
              value as File,
              'Image Uploaded Successfully!',
              'Failed to upload image! Please try again.',
              (url: string) => {
                TicketGeneratorForm.setFieldValue('attachments', [
                  ...TicketGeneratorForm.values.attachments,
                  url,
                ]);
              }
            )
          }
          rightSection={uploadHandle.isLoading ? <Loader size="xs" /> : <IconFileLike />}
        />
        <Flex m="sm" gap="md">
          {TicketGeneratorForm.values.attachments.map((attachment, index) => (
            <Image
              key={index}
              src={attachment}
              h={100}
              w={100}
              alt="file attachment"
              style={{ objectFit: 'cover' }}
            />
          ))}
        </Flex>
        <Button my="xl" type="submit">
          {editFlag ? 'Update Ticket' : 'Create Ticket'}
        </Button>
      </Box>
    </Container>
  );
}
