// /media/es/DDrive/projects/web-Veo/egyPyramid-dashboard-in_githubPage/src/services/api.js
import axios from 'axios';

const api = axios.create();

// دالة لجلب الرابط من ملف الإعدادات الخارجي
const setupBaseURL = async () => {
    try {
        // الحل: استخدام import.meta.env.BASE_URL لضمان المسار الصحيح
        const configPath = `${import.meta.env.BASE_URL}config.json`;
        const response = await fetch(configPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const config = await response.json();
        api.defaults.baseURL = config.API_URL;
        console.log("✅ API Base URL set to:", config.API_URL);
    } catch (error) {
        console.error("❌ تعذر تحميل إعدادات السيرفر، استخدام الافتراضي:", error);
        api.defaults.baseURL = 'https://egystreamer-guardian-ultra.hf.space';
    }
};

// تشغيل الإعداد
setupBaseURL();

// Interceptors...
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;