import { clientAxios } from '@app/config/Axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified?: boolean;
}

export interface AuthState {
  token?: string | null;
  profile: User | null;
}

const initialState: AuthState = {
  token: null,
  profile: null,
};

export const authSlice: any = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    setToken: (state: any, action: any) => {
      const token: string = action.payload;
      state.token = token;
      clientAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
  },
});

export const { setProfile, setToken } = authSlice.actions;

export default authSlice.reducer;
