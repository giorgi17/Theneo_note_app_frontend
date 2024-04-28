import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { NavigateFunction } from 'react-router-dom';
import { CustomError } from '.';
import restClient from '../apiClients/rest';
import {
    CreateNoteRequest,
    EditNoteRequest,
    GetNotesRequest,
    GetSearchedNotesRequest,
    Note,
    UserWithFilter,
} from './interfaces';

interface initialStateProps {
    notes: {
        data: Note[];
        currentPage: number;
        totalItems: number;
        hasNext: boolean;
    };
    searchedNotes: {
        data: Note[];
        usersWithMatchedFilter: UserWithFilter[];
        currentPage: number;
        totalItems: number;
        hasNext: boolean;
    };
    note: Note | null;
    isLoading: boolean;
    error: null | CustomError;
}

const initialState: initialStateProps = {
    notes: {
        data: [],
        currentPage: 1,
        totalItems: 0,
        hasNext: false,
    },
    searchedNotes: {
        data: [],
        usersWithMatchedFilter: [],
        currentPage: 1,
        totalItems: 0,
        hasNext: false,
    },
    note: null,
    isLoading: false,
    error: null,
};

export const getNotes = createAsyncThunk(
    'note/getNotes',
    async ({ page, perPage, sort }: GetNotesRequest, { rejectWithValue }) => {
        try {
            const res = await restClient.post('/api/note/getNotes', {
                page,
                perPage,
                sort,
            });
            const data = await res.data;
            return data;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    },
);

export const getNote = createAsyncThunk('note/getNote', async ({ noteId }: { noteId: string }, { rejectWithValue }) => {
    try {
        const res = await restClient.get(`/api/note/getNote/${noteId}`);
        const data = await res.data;
        return data;
    } catch (error: unknown) {
        return rejectWithValue(error);
    }
});

export const createNote = createAsyncThunk(
    'note/createNote',
    async (
        { title, description, category, isPrivate, assignedTo, navigate }: CreateNoteRequest,
        { rejectWithValue },
    ) => {
        try {
            const res = await restClient.post('/api/note/create', {
                title,
                description,
                category,
                isPrivate,
                assignedTo,
            });

            navigate('/');
            const data = await res.data;
            return data;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    },
);

export const deleteNote = createAsyncThunk(
    'note/deleteNote',
    async ({ noteId, navigate }: { noteId: string; navigate: NavigateFunction }, { rejectWithValue }) => {
        try {
            const res = await restClient.delete(`/api/note/${noteId}`);

            navigate('/');
            const data = await res.data;
            return data;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    },
);

export const editNote = createAsyncThunk(
    'note/editNote',
    async (
        {
            noteId,
            noteData,
            navigate,
        }: { noteId: string; noteData: Omit<EditNoteRequest, 'navigate'>; navigate: NavigateFunction },
        { rejectWithValue },
    ) => {
        try {
            const res = await restClient.patch(`/api/note/${noteId}`, noteData);

            navigate('/');
            const data = await res.data;
            return data;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    },
);

export const getSearchedNotes = createAsyncThunk(
    'note/getSearchedNotes',
    async ({ page, perPage, searchText, filters }: GetSearchedNotesRequest, { rejectWithValue }) => {
        try {
            const res = await restClient.post('/api/note/search', {
                page,
                perPage,
                searchText,
                filters,
            });
            const data = await res.data;
            return data;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    },
);

export const noteSlice = createSlice({
    name: 'note',
    initialState,
    reducers: {
        changeFetchedNotesPage: (state, action) => {
            state.notes.currentPage = action.payload;
        },
        changeNotesSearchPage: (state, action) => {
            state.searchedNotes.currentPage = action.payload;
        },
        clearNote: (state) => {
            state.note = null;
        },
    },
    extraReducers: (builder) => {
        // Fetching notes
        builder.addCase(getNotes.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(getNotes.fulfilled, (state, action) => {
            if (action.payload) {
                state.notes.data = action.payload.notes;
                state.notes.totalItems = action.payload.totalItems;
                state.notes.hasNext = action.payload.hasNext;
                state.isLoading = false;
                state.error = null;
            }
        });

        builder.addCase(getNotes.rejected, (state, action) => {
            const error: AxiosError = action.payload as AxiosError;

            state.isLoading = false;
            if (error.response?.data) state.error = error.response?.data as CustomError;
        });

        // Fetch single note data
        builder.addCase(getNote.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(getNote.fulfilled, (state, action) => {
            if (action.payload) {
                state.note = action.payload.note;
                state.isLoading = false;
                state.error = null;
            }
        });

        builder.addCase(getNote.rejected, (state, action) => {
            const error: AxiosError = action.payload as AxiosError;

            state.isLoading = false;
            if (error.response?.data) state.error = error.response?.data as CustomError;
        });

        // Create new note
        builder.addCase(createNote.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(createNote.fulfilled, (state, action) => {
            if (action.payload) {
                state.isLoading = false;
                state.error = null;
            }
        });

        builder.addCase(createNote.rejected, (state, action) => {
            const error: AxiosError = action.payload as AxiosError;

            state.isLoading = false;
            if (error.response?.data) state.error = error.response?.data as CustomError;
        });

        // Delete note
        builder.addCase(deleteNote.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(deleteNote.fulfilled, (state, action) => {
            if (action.payload) {
                state.isLoading = false;
                state.error = null;
            }
        });

        builder.addCase(deleteNote.rejected, (state, action) => {
            const error: AxiosError = action.payload as AxiosError;

            state.isLoading = false;
            if (error.response?.data) state.error = error.response?.data as CustomError;
        });

        // Edit note
        builder.addCase(editNote.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(editNote.fulfilled, (state, action) => {
            if (action.payload) {
                state.isLoading = false;
                state.error = null;
            }
        });

        builder.addCase(editNote.rejected, (state, action) => {
            const error: AxiosError = action.payload as AxiosError;

            state.isLoading = false;
            if (error.response?.data) state.error = error.response?.data as CustomError;
        });

        // Search notes
        builder.addCase(getSearchedNotes.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(getSearchedNotes.fulfilled, (state, action) => {
            if (action.payload) {
                state.searchedNotes.data = action.payload.notes;
                state.searchedNotes.totalItems = action.payload.totalItems;
                state.searchedNotes.hasNext = action.payload.hasNext;

                if (action.payload?.usersWithMatchedFilter) {
                    state.searchedNotes.usersWithMatchedFilter = action.payload?.usersWithMatchedFilter;
                } else {
                    state.searchedNotes.usersWithMatchedFilter = [];
                }

                state.isLoading = false;
                state.error = null;
            }
        });

        builder.addCase(getSearchedNotes.rejected, (state, action) => {
            const error: AxiosError = action.payload as AxiosError;

            state.isLoading = false;
            if (error.response?.data) state.error = error.response?.data as CustomError;
        });
    },
});

export const { changeFetchedNotesPage, changeNotesSearchPage, clearNote } = noteSlice.actions;

export default noteSlice.reducer;
