import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo') as string)
    : null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<UserInfo>) => {
      const newState = state;
      newState.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(newState.userInfo));
      localStorage.setItem('access_token', action.payload.token);
      toast.success('Logged In!');
    },
    signOut: (state) => {
      const newState = state;
      newState.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('access_token');
      toast.success('Logged Out!');
      window.location.replace('/login');
    },
  },
});

export const { signIn, signOut } = userSlice.actions;

export const selectUserInfo = (state: { user: UserState }) => state.user.userInfo;
