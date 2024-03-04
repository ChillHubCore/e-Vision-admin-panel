import { Box, Button, TextInput } from '@mantine/core';
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
import { useSubmit } from '@/lib/hooks';
import { RTE } from '../common/RTE';

export default function BlogGenerator({
  blogData,
  editFlag,
}: {
  blogData?: {
    title: string;
    content: string;
  };
  editFlag?: boolean;
}) {
  const BlogGeneratorForm = useForm({
    initialValues: {
      title: blogData?.title || '',
      content: blogData?.content || '',
    },
    validate: {
      title: isNotEmpty('Title is required'),
      content: isNotEmpty('Content is required'),
    },
  });

  const content = BlogGeneratorForm.values.content || '';

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
    FormActions.sendRequest(
      '/blogs',
      BlogGeneratorForm,
      'post',
      'Blog created successfully!',
      'Failed to create blog. Please try again later',
      () => navigate('/admin/dashboard/blogs')
    );
  };

  return (
    <Box
      component="form"
      onSubmit={BlogGeneratorForm.onSubmit(handleSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <TextInput
        placeholder="Write a Title For The Blog"
        {...BlogGeneratorForm.getInputProps('title')}
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
        Create Blog
      </Button>
    </Box>
  );
}
