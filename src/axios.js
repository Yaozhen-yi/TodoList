import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000/api', // 後端api的基礎url
    timeout: 10000, // 請求超過時間
    headers: {
        'Content-Type': 'application/json'
    }    
});


// 在這裡設置 Axios 攔截器
axiosInstance.interceptors.request.use(
    config => {
        // 在請求發送之前可以添加 token 或其他 headers
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // 處理響應錯誤
        if (error.response && error.response.status === 401) {
            // 未經授權，重新導向到登入頁面或顯示提示
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;