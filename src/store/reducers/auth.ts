import {createSlice} from '@reduxjs/toolkit';

export interface AuthState {
  authentication?: null | string
}

const initialState: AuthState = {
  authentication: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthentication: (state: any, {payload}: any) => {
      state.authentication = payload;
    }
  }
});

export const {setAuthentication} = authSlice.actions;

export default authSlice.reducer;
