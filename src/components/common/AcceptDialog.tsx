import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';

export default function AcceptDialog({ message }: { message: string }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication">
        <p>{message}</p>
      </Modal>

      <Button onClick={open}>Open modal</Button>
    </>
  );
}
