import React, { Suspense } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Alert, Loader, LoadingOverlay } from '@mantine/core';
import { useSelector } from 'react-redux';
import { getData } from '@/lib/utils/getData';
import { ProductGenerator } from '@/components/Dashboard';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';

export default function EditProductPage() {
  const { id } = useParams();
  const userInfo = useSelector(selectUserInfo);

  const ProductData = useQuery(
    `product-data-${id}`,
    () => getData(`/product/${id}`, userInfo?.token),
    {
      cacheTime: 0,
    }
  );
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
