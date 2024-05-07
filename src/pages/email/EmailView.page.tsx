import { useParams } from 'react-router-dom';
import { Box } from '@mantine/core';
import { EmailViewer } from '@/components/Dashboard';

export default function EmailViewPage() {
  const { id } = useParams();
  return (
    <Box w="100%">
      <EmailViewer id={id as string} />
    </Box>
  );
}
