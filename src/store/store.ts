import {configureStore} from '@reduxjs/toolkit';

import {authSlice} from './reducers/auth';
import {uiSlice} from './reducers/ui';
// import {createLogger} from 'redux-logger';
// import usersReducer from './reducers/users/usersSlice';
import { setupListeners } from "@reduxjs/toolkit/dist/query";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    // users: usersReducer,
  },
  /* middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware().concat(createLogger())
  ] */
});

setupListeners(store.dispatch);

export default store;
