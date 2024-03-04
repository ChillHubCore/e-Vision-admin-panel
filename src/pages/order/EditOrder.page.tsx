import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Alert, Loader, LoadingOverlay } from '@mantine/core';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { getData } from '@/lib/utils/getData';
import { OrderGenerator } from '@/components/Dashboard';
import { OrderEntityProps } from '@/components/Dashboard/types';
import { selectUserInfo } from '@/lib/redux/User/UserSlice';

export default function EditOrderPage() {
  const { id } = useParams();
  const userInfo = useSelector(selectUserInfo);

  const OrderData = useQuery(`order-data-${id}`, () => getData(`/order/${id}`, userInfo?.token), {
    cacheTime: 0,
  });
  const updatedCartItems = (OrderData.data as OrderEntityProps)?.cartItems.map((item) => {
    const variant = item.product.variants.find(
      (v) => v._id?.toString() === item.variant.toString()
    );
    return {
      ...item,
      variant,
    };
  });
  const updatedOrderData = { ...OrderData.data, cartItems: updatedCartItems };

  return OrderData.isLoading ? (
    <LoadingOverlay />
  ) : OrderData.isError ? (
    <Alert color="red">Something Went Wrong</Alert>
  ) : (
    <Suspense fallback={<Loader />}>
      <OrderGenerator cartItems={updatedCartItems} OrderData={updatedOrderData} editFlag />
    </Suspense>
  );
}
