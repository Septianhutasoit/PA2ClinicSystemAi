import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
        : 'http://127.0.0.1:8000/api/v1',
    timeout: 45000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// INTERCEPTOR REQUEST
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

// INTERCEPTOR RESPONSE
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

            // DAFTAR HALAMAN YANG TIDAK BOLEH DI-REDIRECT KE LOGIN
            const bypassPages = [
                '/',
                '/login',
                '/register',
                '/patient/dashboard',
                '/patient/services',
                '/patient/about',
                '/patient/doctors',
                '/patient/visiMisi'
            ];

            // Jika user sedang di halaman login/register, JANGAN hapus token & jangan redirect
            // Biarkan halaman login menangani error-nya sendiri (misal: tampilkan pesan 'Password Salah')
            if (currentPath === '/login' || currentPath === '/register') {
                return Promise.reject(error);
            }

            // Jika di halaman publik lainnya, bersihkan token tapi JANGAN redirect
            if (bypassPages.includes(currentPath)) {
                localStorage.removeItem('token');
                Cookies.remove('token');
                return Promise.reject(error);
            }

            // Jika di halaman rahasia (seperti /admin atau /patient/profile), baru paksa ke login
            localStorage.removeItem('token');
            Cookies.remove('token');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;