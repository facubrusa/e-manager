import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersState {
  active: User[];
}

const initialState: UsersState = {
  active: [
    {
      id: '6436073290313450a06f8431',
      name: 'Facu Brusa',
      email: 'facundobrusa11@gmail.com',
      role: 'admin',
    },
    {
      id: '6436073290313450a06f8432',
      name: 'Dukex',
      email: 'dukex@gmail.com',
      role: 'user',
    },
  ],
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.active.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addUser } = usersSlice.actions;

export default usersSlice.reducer;
