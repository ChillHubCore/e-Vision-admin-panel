import { useSelector } from 'react-redux';
import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { selectShoppingCart } from '@/lib/redux/ShoppingCart/ShoppingCart';
import { OrderGenerator } from '@/components/Dashboard';

export default function CreateOrderPage() {
  const shoppingCart = useSelector(selectShoppingCart);

  return shoppingCart.shoppingCart.cartItems.length === 0 ? (
    <Button component={Link} to="/admin/dashboard/products">
      Create a Shopping Cart First - Click to Continue!
    </Button>
  ) : (
    <OrderGenerator cartItems={shoppingCart.shoppingCart.cartItems} />
  );
}
