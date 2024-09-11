<script setup>
import { ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength, email as emailValidator, helpers } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import axiosInstance from '@/axios';

const name = ref('');
const password = ref('');
const email = ref('');
const isAuthenticated = ref(false);

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

const onRegister = async () => {
    $v.value.$touch(); // 觸發驗證
    if ($v.value.$invalid) return;

    try {
        const response = await axiosInstance.post('/register', {
            name: name.value,
            password: password.value,
            email: email.value,
        });

        console.log('Registration response:', response);
        
        if (response.data.success) {
            console.log('id:', response.data.userId); // 印出用戶id
            alert('註冊成功！');
            isAuthenticated.value = true; // 禁用註冊按鈕
            router.push('/login'); // 跳轉到登入頁面
        } else {
            alert('注册失败，可能是因为服务器返回了错误。');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('注册过程出现错误，请检查控制台获取更多信息。');
    }
};
</script>

<template>
    <div class="form">
        <form id="dataForm" @submit.prevent="onRegister" method="post">
            <label for="name">姓名(Name):</label>
            <input id="name" v-model="name" type="text" placeholder="請輸入姓名">
            <!-- 如果驗證錯誤，顯示錯誤訊息 -->
            <span v-show="$v.name.$error">
                <span v-for="(error, index) in $v.name.$errors" :key="index">{{ error.$message }}</span>
            </span>

            <label for="password">密碼(Password):</label>
            <input type="password" id="password" name="password" v-model="password" placeholder="請輸入密碼">
             <!-- 如果驗證錯誤，顯示錯誤訊息 -->
            <span v-show="$v.password.$error">
                <span v-for="(error, index) in $v.password.$errors" :key="index">{{ error.$message }}</span>
            </span>

            <label for="email">E-mail:</label>
            <input id="email" v-model="email" type="email" placeholder="請輸入email">
             <!-- 如果驗證錯誤，顯示錯誤訊息 -->
            <span v-show="$v.email.$error">
                <span v-for="(error, index) in $v.email.$errors" :key="index">{{ error.$message }}</span>
            </span>
            <br>
            <button type="submit" :disabled="isAuthenticated">註冊(Register)</button>
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

