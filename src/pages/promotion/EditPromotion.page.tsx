import React, { Suspense } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Alert, Container, Loader } from '@mantine/core';
import { getData } from '@/lib/utils/getData';
import { PromotionGenerator } from '@/components/Dashboard';
import { PromotionEntityProps } from '@/components/Dashboard/types';

export default function EditPromotionPage() {
  const { id } = useParams();

  const PromotionData = useQuery(`promotion-${id}`, () => getData(`/promotion?id=${id}`), {
    cacheTime: 0,
  });

  const updatedApplicableProducts =
    PromotionData.data &&
    (PromotionData.data[0] as PromotionEntityProps)?.applicableProducts?.map((item) => {
      const variant = item.product.variants.find(
        (v) => v._id?.toString() === item.variant.toString()
      );
      return {
        ...item,
        variant,
      };
    });
  const updatedPromotionData = {
    ...PromotionData.data,
    applicableProducts: updatedApplicableProducts,
  };
  return PromotionData.isLoading ? (
    <Loader />
  ) : PromotionData.isSuccess ? (
    <Container size="xl">
      <Suspense fallback={<Loader />}>
        <PromotionGenerator
          cartItems={updatedApplicableProducts}
          PromotionData={updatedPromotionData[0]}
          editFlag
        />
      </Suspense>
    </Container>
  ) : (
    <Alert>
      <h1>404</h1>
    </Alert>
  );
}
