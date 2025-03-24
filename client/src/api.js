import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000'
});

// request interceptor to include the token in the headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;