import React from 'react';
import PathConstants from './pathConstants';

const Home = React.lazy(() => import('../pages/Home'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const Note = React.lazy(() => import('../pages/Note'));
const NewNote = React.lazy(() => import('../pages/NewNote'));
const Categories = React.lazy(() => import('../pages/Categories'));
const NotesSearch = React.lazy(() => import('../pages/NotesSearch'));

const routes = [
    { path: PathConstants.HOME, element: <Home /> },
    { path: PathConstants.LOGIN, element: <Login /> },
    { path: PathConstants.REGISTER, element: <Register /> },
    { path: PathConstants.NOTE, element: <Note /> },
    { path: PathConstants.NEW_NOTE, element: <NewNote /> },
    { path: PathConstants.EDIT_NOTE, element: <NewNote /> },
    { path: PathConstants.CATEGORIES, element: <Categories /> },
    { path: PathConstants.NOTES_SEARCH, element: <NotesSearch /> },
];

export default routes;
