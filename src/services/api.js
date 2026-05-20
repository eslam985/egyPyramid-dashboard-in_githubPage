// src/services/api.js
import axios from 'axios';

// التعديل: استخدام متغير بيئي لسهولة التبديل بين التطوير والإنتاج
const baseURL = import.meta.env.VITE_API_URL || '/api';
// الرابط الصحيح للـ Space الخاص بك
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://eslam315-egypyramid-guardian-ultra.hf.space' || 'http://localhost:8000'
});
// إضافة "مستمع" يضيف التوكن تلقائياً لكل طلب
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('user_token');
            window.location.href = '/#/login';
        }
        return Promise.reject(error);
    }
);

export default api;