import axios from 'axios';
import Cookies from 'js-cookie';

const Api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

// Interceptor to inject Authorization header on every request
Api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor to handle 401 unauthorized
Api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        Cookies.remove('token');
        Cookies.remove('user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

export default Api;
