import axios from 'axios';

// Create axios instance with base configuration
export const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Get CSRF token from meta tag
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');
        if (token) {
            config.headers['X-CSRF-TOKEN'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/admin/login';
        }
        if (error.response?.status === 419) {
            // CSRF token mismatch - refresh page
            window.location.reload();
        }
        return Promise.reject(error);
    },
);

export default api;
