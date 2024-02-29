import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './User/UserSlice';
import { shoppingCartSlice } from './ShoppingCart/ShoppingCart';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    shoppingCart: shoppingCartSlice.reducer,
  },
});

export default store;
