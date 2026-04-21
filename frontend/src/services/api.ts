import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
        : 'http://127.0.0.1:8000/api/v1',
    timeout: 8000, // 8 detik timeout — cegah loading stuck selamanya
    headers: {
        'Content-Type': 'application/json',
    },
});

// INTERCEPTOR REQUEST: Tambahkan token ke setiap request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// INTERCEPTOR RESPONSE: Handle 401 otomatis
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired — bersihkan dan arahkan ke login
            localStorage.removeItem('token');
            localStorage.removeItem('user_role');
            Cookies.remove('token');
            Cookies.remove('role');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;