import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true'); // 從 localStorage 中讀取登入狀態
    const userName = ref(localStorage.getItem('userName') || ''); // 從 localStorage 中讀取用戶名
    const userId = ref(localStorage.getItem('userId') || null); // 从 localStorage 中读取用户ID

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
        isLoggedIn.value = false; // 设置未登录状态
        userName.value = ''; // 清空用户名
        userId.value = null; // 清空用户ID
        localStorage.removeItem('isLoggedIn'); // 清除 localStorage 中的登录状态
        localStorage.removeItem('userName'); // 清除 localStorage 中的用户名
        localStorage.removeItem('userId'); // 清除 localStorage 中的用户ID
    };

    // 重新加载用户数据（可以在页面初始化时调用）
    const reload = () => {
        isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true';
        userName.value = localStorage.getItem('userName') || '';
        userId.value = localStorage.getItem('userId') || null;
    };

    // 初始化时调用 reload，确保状态与 localStorage 同步
    reload();

    return { isLoggedIn, userName, userId, login, logout, reload };
});


