<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const showDialog = ref(false);

// const handleAuthAction = () => {
//   if (authStore.isLoggedIn) {
//     showDialog.value = true; // 显示对话框
//   } else {
//     router.push('/login'); // 导航到登录页面
//   }
// };

const logout = () => {
  authStore.logout(); // 调用 store 中的 logout 方法
  router.push('/login'); // 注销后重定向到登录页面
  showDialog.value = false; // 关闭对话框
  alert('您已登出，请重新登录'); // 弹出提示框
};

const closeDialog = () => {
  showDialog.value = false;
};
</script>

<template>
<div class="container-fluid">
  <span class="title">
    <router-link to="/" class="navbar-brand">ToDoList</router-link>
  </span>
    
    <div class="navbar-nav">
      <li v-if="!authStore.isLoggedIn">
        <router-link to="/login" class="nav-link">登錄</router-link>
      </li>
      <li v-if="!authStore.isLoggedIn">
        <router-link to="/register" class="nav-link">註冊</router-link>
      </li>
      <li v-if="authStore.isLoggedIn">
        <span class="walcome">歡迎 {{ authStore.userName }}</span>
      </li>
      <li v-if="authStore.isLoggedIn">
        <button @click="logout">登出</button>
      </li>
    </div>

    <!-- 登出确认对话框 -->
    <div v-if="showDialog" class="dialog-overlay" @click="closeDialog">
      <div class="dialog" @click.stop>
        <p>您确定要注销吗？</p>
        <button @click="logout">确认</button>
        <button @click="closeDialog">取消</button>
      </div>
    </div>
  </div>
 
</template>

<style>
div{
    width: 100%;
}
.container-fluid{
    margin: 4%;
    display: flex;
    align-items: center;
    background-color: #d1c1f1;
}
.container-fluid .title{
  margin: 0 10%;
}
.container-fluid .navbar-brand{
    margin: 0 5%;
    font-size: 30px;
}

.container-fluid .navbar-nav{
  display: flex;
  align-items: center;
    font-size: 25px;
}
.navbar-nav li{
  border: 1px solid black;
  margin: 2%;
}
.nav-link{
  display: flex;
}
.nav-link:hover{
    background-color: #582ca8;
}

.walcome{
  display: flex;
  font-size: 30px;
  color: blue;
}
.navbar-nav button{
  margin: 8% 0;
}
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  background: white;
  padding: 1em;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.dialog button {
  margin: 0 0.5em;
}
@media screen and (min-width: 768px) {

    .container-fluid .navbar-brand{
    font-size: 40px;
}
.container-fluid .title{
  margin: 0 20%;
}
.navbar-nav{
  width: 100%;
}
.navbar-nav li{
  font-size: 40px;
}

}


</style>
