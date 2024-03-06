import { Container, Loader } from '@mantine/core';
import { Suspense } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { BlogGenerator } from '@/components/Dashboard';
import { getData } from '@/lib/utils/getData';

export default function EditBlogPage() {
  const { id } = useParams();
  const BlogData = useQuery('search-blogs', () => getData(`/blog?id=${id}`), {
    cacheTime: 0,
  });
  return BlogData.isLoading ? (
    <Loader />
  ) : (
    BlogData.isSuccess && (
      <Container size="xl">
        <Suspense fallback={<Loader />}>
          <BlogGenerator editFlag blogData={BlogData.data.blogs[0]} />
        </Suspense>
      </Container>
    )
  );
}
