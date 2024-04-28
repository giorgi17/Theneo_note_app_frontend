import React, { useEffect } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppErrorBoundary from './components/Errors/ErrorBoundary';
import Error404 from './components/Errors/404';
import routes from './routes';
import MainLayout from './components/MainLayout';
import themeConfig from './themes/mainTheme';
import { checkAuthFromLocalStorage } from './utils/helpers';
import { AppDispatch, RootState } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedInUser } from './store/userSlice';

const App = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();
    const loggedIn = useSelector((state: RootState) => state.user.loggedIn);

    const router = createBrowserRouter([
        {
            element: (
                <AppErrorBoundary>
                    <MainLayout />
                </AppErrorBoundary>
            ),
            errorElement: <Error404 />,
            children: routes,
        },
    ]);

    useEffect(() => {
        // Check localStorage only once when the component mounts
        const { token, userId } = checkAuthFromLocalStorage();

        if (token && userId && !loggedIn) {
            // Dispatch an action to set the user as logged in in your Redux store
            dispatch(setLoggedInUser({ token, userId }));
        }
    }, []);

    return (
        <ConfigProvider theme={themeConfig}>
            <RouterProvider router={router} />
        </ConfigProvider>
    );
};

export default App;
