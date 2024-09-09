<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const showDialog = ref(false);


const logout = () => {
  authStore.logout(); // 調用 store 中的 logout 方法
  router.push('/login'); // 註冊後重新導向登入畫面
  showDialog.value = false; // 關閉彈跳視窗
  alert('您已登出，請重新登入'); // 弹出提示框
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
        <router-link to="/login" class="nav-link">登入</router-link>
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
