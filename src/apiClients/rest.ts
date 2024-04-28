import axios from 'axios';
import { removeUserLoginInfo } from '../utils/helpers';

const restClient = axios.create({
    baseURL: process.env.REACT_APP_API_HOST,
});

restClient.interceptors.request.use((config) => {
    // Retrieve the token from localStorage
    const authToken = localStorage.getItem('token');

    // Set the Authorization header if a token is available
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
});

restClient.interceptors.response.use(
    (response) => {
        // If the response is successful, return it
        return response;
    },
    (error) => {
        let errorMessage = '';

        if (error.response) {
            // Server responded with an error status code (4xx or 5xx)
            errorMessage = error.response.data.message;
            const currentPagePath = window.location.pathname;

            if (error.response.status === 500) {
                if (errorMessage === 'jwt expired' && currentPagePath !== '/login') {
                    removeUserLoginInfo();
                    window.location.href = '/login';
                }
            } else if (error.response.status === 401) {
                if (errorMessage === 'Not authenticated.' && currentPagePath !== '/login') {
                    removeUserLoginInfo();
                    window.location.href = '/login';
                }
            }

            throw error;
        }
    },
);

export default restClient;
