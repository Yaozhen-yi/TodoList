import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true'); // 從 localStorage 中讀取登入狀態
    const userName = ref(localStorage.getItem('userName') || ''); // 從 localStorage 中讀取用戶名
    const userId = ref(localStorage.getItem('userId') || null); // 從 localStorage 中讀取用户ID

    const login = (name, id) => {
        isLoggedIn.value = true;
        userName.value = name; 
        userId.value = id;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('userId', id);
        console.log('Local Storage Content:', localStorage);
    };
    // 登出方法
    const logout = () => {
        isLoggedIn.value = false; // 設置未登入狀態
        userName.value = ''; // 清空用戶名
        userId.value = null; // 清空用户ID
        localStorage.removeItem('isLoggedIn'); // 清除 localStorage 中的登入狀態
        localStorage.removeItem('userName'); // 清除 localStorage 中的用户名
        localStorage.removeItem('userId'); // 清除 localStorage 中的用户ID
    };

    // 重新加载用户數據（可以在頁面初始化時調用）
    const reload = () => {
        isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true';
        userName.value = localStorage.getItem('userName') || '';
        userId.value = localStorage.getItem('userId') || null;
    };

    // 初始化調用reload方法，確保狀態與localStorage同步
    reload();

    return { isLoggedIn, userName, userId, login, logout, reload };
});


