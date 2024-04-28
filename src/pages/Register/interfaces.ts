import { NavigateFunction } from 'react-router-dom';

export interface RegisterProps {}

export interface RegisterValues {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    navigate: NavigateFunction;
}
