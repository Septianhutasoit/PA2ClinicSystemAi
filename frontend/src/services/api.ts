import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
});

// INTERCEPTOR: Menambahkan token ke setiap request secara otomatis
api.interceptors.request.use((config) => {
    // Ambil token dari localStorage atau Cookies
    const token = localStorage.getItem('token') || Cookies.get('token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;