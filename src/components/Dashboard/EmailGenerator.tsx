import { Box, Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { AnyExtension, Editor, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import { useSubmit } from '@/lib/hooks';
import { RTE } from '../common/RTE';

export default function EmailGenerator({ functionToCall }: { functionToCall: () => void }) {
  const EmailGeneratorForm = useForm({
    initialValues: {
      receiver: '',
      title: '',
      content: '',
      attachments: [] as string[],
    },
    validate: {},
  });

  const FormActions = useSubmit();
  const handleSubmit = () => {
    FormActions.sendRequest(
      '/email',
      EmailGeneratorForm,
      'post',
      'Email Sent Successfully',
      'Failed to send Email',
      functionToCall
    );
  };
  const content = '';
  const editor = useEditor({
    extensions: [
      StarterKit as AnyExtension,
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

  return (
    <Box
      component="form"
      onSubmit={EmailGeneratorForm.onSubmit(handleSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <TextInput
        label="Input Receiver Username"
        placeholder="Receiver"
        {...EmailGeneratorForm.getInputProps('receiver')}
      />
      <TextInput
        label="Write a Title"
        placeholder="Title"
        {...EmailGeneratorForm.getInputProps('title')}
      />
      <RTE editor={editor as Editor} />
      <Button
        my="md"
        onClick={() => {
          EmailGeneratorForm.setFieldValue('content', editor?.getHTML() || '');
        }}
        w="fit-content"
        type="submit"
        loading={FormActions.isLoading}
      >
        Send
      </Button>
    </Box>
  );
}
