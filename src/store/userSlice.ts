import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { CustomError } from '.';
import restClient from '../apiClients/rest';
import { LoginValues } from '../pages/Login/interfaces';
import { RegisterValues } from '../pages/Register/interfaces';
import { removeUserLoginInfo } from '../utils/helpers';
import { User } from './interfaces';

interface initialStateProps {
    users: User[];
    loggedIn: boolean;
    isLoading: boolean;
    error: null | CustomError;
    userId?: string | null;
    token?: string | null;
}

const initialState: initialStateProps = {
    users: [],
    loggedIn: false,
    isLoading: false,
    error: null,
    userId: null,
    token: null,
};

export const login = createAsyncThunk('user/login', async ({ email, password }: LoginValues, { rejectWithValue }) => {
    try {
        const res = await restClient.post('/api/user/login', {
            email,
            password,
        });
        const data = await res.data;
        return data;
    } catch (error: unknown) {
        return rejectWithValue(error);
    }
});

export const signup = createAsyncThunk(
    'user/signup',
    async (
        { firstname, lastname, username, email, password, confirmPassword, navigate }: RegisterValues,
        { rejectWithValue },
    ) => {
        try {
            const res = await restClient.post('/api/user/signup', {
                firstname,
                lastname,
                username,
                email,
                password,
                confirmPassword,
            });

            navigate('/login');
            const data = await res.data;
            return data;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    },
);

export const getUsers = createAsyncThunk('user/getUsers', async (payload, { rejectWithValue }) => {
    try {
        const res = await restClient.get('/api/user/getUsers');
        const data = await res.data;
        return data;
    } catch (error: unknown) {
        return rejectWithValue(error);
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            // Clear the data from localStorage
            removeUserLoginInfo();
            window.location.href = '/login';

            state.loggedIn = false;
            state.token = null;
            state.userId = null;
        },
        setLoggedInUser: (state, action) => {
            state.loggedIn = true;
            state.userId = action.payload.userId;
            state.token = action.payload.token;
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.loggedIn = true;
            state.userId = action.payload.userId;
            state.token = action.payload.token;
            state.error = null;

            // Store the token and user ID in localStorage
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('userId', action.payload.userId);
        });

        builder.addCase(login.rejected, (state, action) => {
            const error: AxiosError = action.payload as AxiosError;

            state.isLoading = false;
            if (error.response?.data) state.error = error.response?.data as CustomError;
        });

        // Signup
        builder.addCase(signup.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(signup.fulfilled, (state) => {
            state.isLoading = false;
            state.error = null;
        });

        builder.addCase(signup.rejected, (state, action) => {
            const error: AxiosError = action.payload as AxiosError;

            state.isLoading = false;
            if (error.response?.data) state.error = error.response?.data as CustomError;
        });

        // getUsers
        builder.addCase(getUsers.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.users = action.payload.users;
            state.isLoading = false;
            state.error = null;
        });

        builder.addCase(getUsers.rejected, (state, action) => {
            const error: AxiosError = action.payload as AxiosError;

            state.isLoading = false;
            if (error.response?.data) state.error = error.response?.data as CustomError;
        });
    },
});

export const { logout, setLoggedInUser } = userSlice.actions;

export default userSlice.reducer;
