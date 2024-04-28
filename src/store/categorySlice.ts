import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { CustomError } from '.';
import restClient from '../apiClients/rest';
import { Category } from './interfaces';

interface initialStateProps {
    categories: {
        items: Category[];
        currentPage: number;
        totalItems: number;
        hasNext: boolean;
    };
    category: Category | null;
    isLoading: boolean;
    error: null | CustomError;
}

const initialState: initialStateProps = {
    categories: {
        items: [],
        currentPage: 1,
        totalItems: 0,
        hasNext: false,
    },
    category: null,
    isLoading: false,
    error: null,
};

export const getCategories = createAsyncThunk(
    'category/getCategories',
    async (
        { page, perPage, noPaginate }: { page: number; perPage: number; noPaginate?: boolean },
        { rejectWithValue },
    ) => {
        try {
            const res = await restClient.post(`/api/category/getCategories`, {
                page,
                perPage,
                noPaginate,
            });
            const data = await res.data;
            return data;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    },
);

export const addCategory = createAsyncThunk(
    'category/addCategory',
    async ({ title }: { title: string }, { rejectWithValue }) => {
        try {
            const res = await restClient.post(`/api/category/create`, {
                title,
            });
            const data = await res.data;
            return data;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    },
);

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async ({ categoryId }: { categoryId: string }, { rejectWithValue }) => {
        try {
            const res = await restClient.delete(`/api/category/${categoryId}`);
            const data = await res.data;
            return data;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    },
);

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        changeCategoriesPage: (state, action) => {
            state.categories.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Getting categories
        builder.addCase(getCategories.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories.items = action.payload.categories;
            state.categories.totalItems = action.payload.totalItems;
            state.categories.hasNext = action.payload.hasNext;

            state.isLoading = false;
            state.error = null;
        });

        builder.addCase(getCategories.rejected, (state, action) => {
            const error: AxiosError = action.payload as AxiosError;

            state.isLoading = false;
            if (error.response?.data) state.error = error.response?.data as CustomError;
        });

        // Adding category
        builder.addCase(addCategory.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(addCategory.fulfilled, (state, action) => {
            state.category = action.payload.category;
            state.categories = { ...state.categories, currentPage: 1 };
            state.isLoading = false;
            state.error = null;
        });

        builder.addCase(addCategory.rejected, (state, action) => {
            const error: AxiosError = action.payload as AxiosError;

            state.isLoading = false;
            if (error.response?.data) state.error = error.response?.data as CustomError;
        });

        // Delete category
        builder.addCase(deleteCategory.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(deleteCategory.fulfilled, (state) => {
            state.isLoading = false;
            state.error = null;
        });

        builder.addCase(deleteCategory.rejected, (state, action) => {
            const error: AxiosError = action.payload as AxiosError;

            state.isLoading = false;
            if (error.response?.data) state.error = error.response?.data as CustomError;
        });
    },
});

export const { changeCategoriesPage } = categorySlice.actions;

export default categorySlice.reducer;
