import { Container, Loader } from '@mantine/core';
import { Suspense } from 'react';
import { BlogGenerator } from '@/components/Dashboard';

export default function CreateBlogPage({ TeamMemberFlag }: { TeamMemberFlag?: boolean }) {
  return (
    <Container size="xl">
      <Suspense fallback={<Loader />}>
        <BlogGenerator teamMemberFlag={TeamMemberFlag} />
      </Suspense>
    </Container>
  );
}
