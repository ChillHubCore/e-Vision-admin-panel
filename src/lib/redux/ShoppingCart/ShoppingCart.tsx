import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const localStorageShoppingCart = {
  cartItems: localStorage.getItem('shoppingCart')
    ? JSON.parse(localStorage.getItem('shoppingCart') as string).cartItems
    : [],
  paymentMethod: localStorage.getItem('shoppingCart')
    ? JSON.parse(localStorage.getItem('shoppingCart') as string).paymentMethod
    : '',
  shippingAddress: localStorage.getItem('shoppingCart')
    ? JSON.parse(localStorage.getItem('shoppingCart') as string).shippingAddress
    : [],
  cartItemsEditState: localStorage.getItem('shoppingCart')
    ? JSON.parse(localStorage.getItem('shoppingCart') as string).cartItemsEditState
    : false,
};

const initialState = {
  shoppingCart: localStorageShoppingCart,
};

export const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ShoppingCartPayloadProps>) => {
      const { variant, product, quantity } = action.payload;
      const itemPayload = {
        product,
        variant,
        quantity,
      };
      const newState = state;
      const existingItemIndex = newState.shoppingCart.cartItems.findIndex(
        (item: ShoppingCartPayloadProps) => item.variant._id === variant._id
      );

      if (existingItemIndex !== -1) {
        const newQuantity = newState.shoppingCart.cartItems[existingItemIndex].quantity + quantity;
        const { inStock } = newState.shoppingCart.cartItems[existingItemIndex].variant;

        if (newQuantity <= inStock) {
          newState.shoppingCart.cartItems[existingItemIndex].quantity = newQuantity;
        } else {
          toast.error('Not enough stock available');
        }
      } else {
        newState.shoppingCart.cartItems.push(itemPayload);
      }

      if (window !== undefined) {
        localStorage.setItem('shoppingCart', JSON.stringify(newState.shoppingCart));
      }
    },
    removeFromCart: (state, action: PayloadAction<ShoppingCartPayloadProps>) => {
      const { variant, quantity } = action.payload;
      const newState = state;
      const existingItemIndex = newState.shoppingCart.cartItems.findIndex(
        (item: ShoppingCartPayloadProps) => item.variant._id === variant._id
      );
      if (existingItemIndex !== -1) {
        if (newState.shoppingCart.cartItems[existingItemIndex].quantity <= quantity) {
          newState.shoppingCart.cartItems.splice(existingItemIndex, 1);
        } else {
          newState.shoppingCart.cartItems[existingItemIndex].quantity -= quantity;
        }
      } else {
        toast.error('Item not found');
      }
      if (window !== undefined) {
        localStorage.setItem('shoppingCart', JSON.stringify(newState.shoppingCart));
      }
    },
    saveShippingAdrress: (state, action: PayloadAction<shippingAddressProps>) => {
      const shippingAddress = action.payload;
      const newState = state;
      newState.shoppingCart.shippingAddress = shippingAddress;
      if (window !== undefined) {
        localStorage.setItem('shoppingCart', JSON.stringify(state.shoppingCart));
      }
    },
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      const paymentMethod = action.payload;
      const newState = state;
      newState.shoppingCart.paymentMethod = paymentMethod;
      if (window !== undefined) {
        localStorage.setItem('shoppingCart', JSON.stringify(state.shoppingCart));
      }
    },
    clearCart: (state) => {
      const newState = state;
      newState.shoppingCart.cartItems = [];
      if (window !== undefined) {
        localStorage.setItem('shoppingCart', JSON.stringify(state.shoppingCart));
      }
    },
  },
});

export const { addToCart, removeFromCart, saveShippingAdrress, savePaymentMethod, clearCart } =
  shoppingCartSlice.actions;

export const selectShoppingCart = (state: { shoppingCart: ShoppingCartType }) => state.shoppingCart;
export const selectCartItems = (state: { shoppingCart: ShoppingCartType }) =>
  state.shoppingCart.shoppingCart.cartItems;
export const selectShippingAddress = (state: { shippingAddress: shippingAddressProps }) =>
  state.shippingAddress;
export const selectPaymentMethod = (state: { paymentMethod: string }) => state.paymentMethod;
