import { Loader } from '@mantine/core';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { PromotionGenerator } from '@/components/Dashboard';
import { selectShoppingCart } from '@/lib/redux/ShoppingCart/ShoppingCart';

export default function CreatePromotionPage() {
  const CartContext = useSelector(selectShoppingCart);
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <PromotionGenerator cartItems={CartContext.shoppingCart.cartItems} />
      </Suspense>
    </div>
  );
}
