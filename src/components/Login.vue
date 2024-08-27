<script setup>
import { ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength, email as emailValidator, helpers } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import axiosInstance from '@/axios';
import { useAuthStore } from '@/stores/useAuthStore';

const name = ref('');
const password = ref('');
const email = ref('');
const authStore = useAuthStore();


const rules = {
    name: {
        required:  helpers.withMessage('**姓名必須填寫**', required)
    },
    password: {
        required:  helpers.withMessage('**密碼必須填寫**', required),
        minLength:  helpers.withMessage('**密碼必須是4個數字**', minLength(4))
    },
    email: {
        required: helpers.withMessage('**email必須填寫**', required),
        email: helpers.withMessage('**不是一個有效的 e-mail 地址**', emailValidator)
    }
};

// 使用Vuelidate進行驗證
const $v = useVuelidate(rules, { name ,password, email });
// 跳轉路由
const router = useRouter();

const onLogin = async () => {
    $v.value.$touch();  // 觸發驗證
    if ($v.value.$invalid) return;

    try {
        const response = await axiosInstance.post('/login', {
            name: name.value,
            password: password.value,
            email: email.value
        });
        console.log('Login response:', response.data);

        if (response.data.success) {
            authStore.login(response.data.userName, response.data.userId);
            router.push('/todoview'); //跳轉到登錄驗面
        } else {
            alert('登入失敗，請檢查用戶姓名、密碼、email是否正確。');
        }
    } catch (error) {
        alert('登入過程出現錯誤，請重試。');
    }
};
</script>

<template>
    <div class="form">
        <form id="dataForm" @submit.prevent="onLogin" method="post">
            <label for="name">姓名(Name):</label>
            <input id="name" v-model="name" type="text" placeholder="請輸入姓名">
            <!-- 如果驗證錯誤，顯示錯誤訊息 -->
            <span v-show="$v.name.$error">
                <span v-for="(error, index) in $v.name.$errors" :key="index">{{ error.$message }}</span>
            </span>

            <br>
            <label for="password">密碼(Password):</label>
            <input type="password" id="password" name="password" v-model="password" placeholder="請輸入密碼">
            <!-- 如果驗證錯誤，顯示錯誤訊息 -->
            <span v-show="$v.password.$error">
                <span v-for="(error, index) in $v.password.$errors" :key="index">{{ error.$message }}</span>
            </span>
            <br>

            <label for="email">E-mail:</label>
            <input id="email" v-model="email" type="email" placeholder="請輸入email">
            <!-- 如果驗證錯誤，顯示錯誤訊息 -->
            <span v-show="$v.email.$error">
                <span v-for="(error, index) in $v.email.$errors" :key="index">{{ error.$message }}</span>
            </span>
           <br>
            <button type="submit">登錄(Login)</button>
        </form>
    </div>
</template>
<style>
.form{
    text-align: center;
    font-size: 25px;
}
label{
    margin:0 10%;
    font-weight: 700;
    font-size: 30px;
}
input{
    margin: 5% 0;
    text-align: center;
}
.form span {
  color: red;
  display: block;
}
button{
    margin: 5%;
    font-size: 25px;
}
.form button:hover{
    font-size: 35px;
    background-color: #d1c1f1;
}

@media screen and (min-width: 768px) {
label{
    font-size: 40px;
    width: 50%;
}
input{
    font-size: 40px;
}
button{
    font-size: 50px;
}
}
</style>
