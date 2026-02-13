import { apiSlice } from './api/apiSlice';
import { configureStore } from '@reduxjs/toolkit';
import productsListSlice from './slices/productsListSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    productsList: productsListSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
