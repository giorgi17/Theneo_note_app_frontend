import { NavigateFunction } from 'react-router-dom';

export interface GetNotesRequest {
    page: number;
    perPage: number;
    sort: {
        name: 'createdAt' | 'updatedAt' | 'category' | 'title';
        order: 1 | -1;
    };
}

export type UserWithFilter = User & { matchedFilter: boolean };

export interface GetSearchedNotesRequest {
    page: number;
    perPage: number;
    searchText: string;
    filters?: {
        createdAt?: {
            from: string;
            to: string;
        };
        updatedAt?: {
            from: string;
            to: string;
        };
        categories?: string[];
        creators?: {
            selected: string[];
            selectAll: boolean;
        };
    };
}

export interface CreateNoteRequest {
    title: string;
    description: string;
    category: string;
    isPrivate: boolean;
    assignedTo: string[];
    navigate: NavigateFunction;
}

export interface EditNoteRequest {
    _id: string;
    title: string;
    description: string;
    category: string;
    isPrivate: boolean;
    assignedTo: string[];
    navigate: NavigateFunction;
}

export interface Note {
    _id: string;
    title: string;
    description: string;
    category: Category;
    creator: User[];
    isPrivate: boolean;
    assignedTo: string[] | User[];
}

export interface Category {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    _id: string;
    firstName: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    notes: Note[];
}
