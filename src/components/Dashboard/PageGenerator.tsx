import { Box, Button, Divider, TagsInput, Textarea, TextInput, Title } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { useSubmit } from '@/lib/hooks';

export default function PageGenerator() {
  const PageGeneratorForm = useForm({
    initialValues: {
      title: '',
      slug: '',
      description: '',
      keywords: [] as string[],
    },
    validate: {
      title: isNotEmpty('Title is required'),
      slug: (value) => {
        if (value.trim() === '') {
          return 'Slug is required';
        }
        if (value.includes(' ')) {
          return 'Slug cannot contain spaces';
        }
        return null;
      },
      description: isNotEmpty('Description is required'),
      keywords: (value) => {
        if (Array.isArray(value)) {
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
      '/page',
      PageGeneratorForm,
      'post',
      'Page Created Successfully',
      'Failed to create Page',
      () => navigate('/admin/dashboard/pages')
    );
  };
  return (
    <Box
      component="form"
      onSubmit={PageGeneratorForm.onSubmit(handleSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <Title order={3}>Page Details - SEO</Title>
      <TextInput
        required
        label="Page Title"
        placeholder="Write a title for the page"
        {...PageGeneratorForm.getInputProps('title')}
      />
      <TextInput
        required
        label="Slug"
        placeholder="Write a slug for the page"
        {...PageGeneratorForm.getInputProps('slug')}
      />
      <Textarea
        required
        label="Description"
        placeholder="Write a description for the page"
        {...PageGeneratorForm.getInputProps('description')}
      />
      <TagsInput
        required
        label="Keywords"
        placeholder="Write keywords for the page"
        {...PageGeneratorForm.getInputProps('keywords')}
      />
      <Divider />
      <Button loading={FormActions.isLoading} type="submit" w="fit-content">
        Submit
      </Button>
    </Box>
  );
}
