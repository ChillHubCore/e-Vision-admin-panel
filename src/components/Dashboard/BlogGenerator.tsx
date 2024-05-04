import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  TextInput,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import Color from '@tiptap/extension-color';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { Editor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image as TiptapImage } from '@tiptap/extension-image';
import React, { useEffect } from 'react';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { useNavigate } from 'react-router-dom';
import { IconPlus, IconX } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useSubmit } from '@/lib/hooks';
import { RTE } from '../common/RTE';
import { BlogEntityProps } from './types';

export default function BlogGenerator({
  blogData,
  editFlag,
  teamMemberFlag,
}: {
  blogData?: BlogEntityProps;
  editFlag?: boolean;
  teamMemberFlag?: boolean;
}) {
  const BlogGeneratorForm = useForm({
    initialValues: {
      metaTitle: blogData?.metaTitle || '',
      metaDescription: blogData?.metaDescription || '',
      metaTags: blogData?.metaTags || ([] as string[]),
      title: blogData?.title || '',
      slug: blogData?.slug || '',
      content: blogData?.content || '',
    },
    validate: {
      metaTitle: isNotEmpty('Meta Title is required'),
      metaDescription: isNotEmpty('Meta Description is required'),
      metaTags: (value) => {
        if (Array.isArray(value)) {
          return null;
        }
        return 'Type of Value is Wrong!';
      },
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
      content: isNotEmpty('Content is required'),
    },
  });

  const content = BlogGeneratorForm.values.content || '';
  const [metaTagInput, setMetaTagInput] = React.useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TiptapImage.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
  });

  useEffect(() => {
    if (editFlag) {
      editor?.commands.setContent(BlogGeneratorForm.values.content);
    }
  }, []);
  const FormActions = useSubmit();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (editFlag) {
      FormActions.sendRequest(
        `/blog/${blogData?._id}`,
        BlogGeneratorForm,
        'put',
        'Blog updated successfully!',
        'Failed to update blog. Please try again later',
        () => navigate(teamMemberFlag ? '/team/dashboard/blogs' : '/admin/dashboard/blogs')
      );
    } else {
      FormActions.sendRequest(
        '/blog',
        BlogGeneratorForm,
        'post',
        'Blog created successfully!',
        'Failed to create blog. Please try again later',
        () => navigate(teamMemberFlag ? '/team/dashboard/blogs' : '/admin/dashboard/blogs')
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={BlogGeneratorForm.onSubmit(handleSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <TextInput
        placeholder="Write a Meta Title"
        {...BlogGeneratorForm.getInputProps('metaTitle')}
        required
      />
      <TextInput
        placeholder="Write a Meta Description"
        {...BlogGeneratorForm.getInputProps('metaDescription')}
        required
      />
      <TextInput
        name="metaTags"
        label="Meta Tags"
        placeholder="Enter Product Meta Tags, Press Enter to Add New Tag"
        value={metaTagInput}
        onChange={(e) => setMetaTagInput(e.target.value)}
        rightSection={
          <UnstyledButton
            w="fit-content"
            onClick={() => {
              const isDuplicate = BlogGeneratorForm.values.metaTags.includes(metaTagInput);
              if (isDuplicate) {
                toast.error('Duplicate meta tag');
              } else {
                BlogGeneratorForm.setFieldValue('metaTags', [
                  ...BlogGeneratorForm.values.metaTags,
                  metaTagInput,
                ]);
                setMetaTagInput('');
              }
            }}
          >
            <Tooltip label="Add Meta Tag">
              <IconPlus color="blue" style={{ marginTop: '0.4rem' }} />
            </Tooltip>
          </UnstyledButton>
        }
      />
      {Array.isArray(BlogGeneratorForm.values.metaTags) &&
        BlogGeneratorForm.values.metaTags.length > 0 && (
          <Flex>
            {BlogGeneratorForm.values.metaTags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                style={{ marginRight: '0.5rem' }}
                rightSection={
                  <UnstyledButton
                    onClick={() =>
                      BlogGeneratorForm.setFieldValue(
                        'metaTags',
                        (BlogGeneratorForm.values.metaTags as string[]).filter((i) => i !== tag)
                      )
                    }
                  >
                    <Center>
                      <IconX size={15} />
                    </Center>
                  </UnstyledButton>
                }
              >
                {tag}
              </Badge>
            ))}
          </Flex>
        )}
      <TextInput
        placeholder="Write a Title For The Blog"
        {...BlogGeneratorForm.getInputProps('title')}
        required
      />
      <TextInput
        placeholder="Write a Slug For The Blog"
        {...BlogGeneratorForm.getInputProps('slug')}
        required
      />

      <RTE editor={editor as Editor} />

      <Button
        my="md"
        onClick={() => {
          BlogGeneratorForm.setFieldValue('content', editor?.getHTML() || '');
        }}
        w="fit-content"
        type="submit"
        loading={FormActions.isLoading}
      >
        {editFlag ? 'Update Blog' : 'Create Blog'}
      </Button>
    </Box>
  );
}
