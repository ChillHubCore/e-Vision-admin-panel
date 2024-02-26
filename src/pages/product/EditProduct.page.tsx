import React, { Suspense } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Alert, Loader, LoadingOverlay } from '@mantine/core';
import { getData } from '@/lib/utils/getData';
import { ProductGenerator } from '@/components/Dashboard';

export default function EditProductPage() {
  const { id } = useParams();

  const ProductData = useQuery(`product-data-${id}`, () => getData(`/product/${id}`), {
    cacheTime: 0,
  });
  return ProductData.isLoading ? (
    <LoadingOverlay />
  ) : ProductData.isError ? (
    <Alert color="red">Something Went Wrong</Alert>
  ) : (
    <Suspense fallback={<Loader />}>
      <ProductGenerator ProductData={ProductData.data} editFlag />
    </Suspense>
  );
}
