import { configureStore } from '@reduxjs/toolkit';
import categorySlice from './categorySlice';
import noteSlice from './noteSlice';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        note: noteSlice,
        category: categorySlice,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export interface CustomError {
    message: string;
    data: { type: string; value: string; msg: string; path: string }[];
}
