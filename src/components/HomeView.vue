<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore'; //引入pinia的store

const text = ref('');
const authStore = useAuthStore(); //使用pinia的useAuthStore來訪問authStore
const showMessage = ref(false); //控制是否顯示提示訊息

const addTodo  = () => {
    if(!authStore.isLoggedIn){
        alert("請先登入或註冊才能使用");
        showMessage.value = true;//顯示提示訊息
    }
   else{
    showMessage.value = false; //隱藏提示訊息
    Console.log(text.value)
    
   }
}
// 檢查值是否不為空
const isVisible = (text) => {
    return showMessage.value && text !== '';
};

</script>


<template>
    <div class="home">
        <h2 class="title">ToDo</h2>
       
        <div class="content">
            <input type="text" id="text" placeholder="請輸入代辦事項" v-model="text">
            <button class="addbtn" @click="addTodo">新增</button>
        </div>
        <div v-if="!authStore.isLoggedIn">
    </div>
    </div>
</template>

<style>
.title{
    display: flex;
    justify-content: center;
    font-size: 40px;
    font-weight: 700;
    margin: 5% 0;
}
.content{
    display: flex;
}
#text{
    width: 100%;
    font-size: 30px;
    margin: 0 2%;
    text-align: center;
}
.addbtn{
    width: 5rem;
    background-color: #a586e0;
    font-size: 25px;
    font-weight: 700;
}
@media screen and (min-width: 768px) {
    .title{
    font-size: 50px;
}
.addbtn{
    width: 50%;
    font-size: 40px;
    margin-right: 2%;
}
}

</style>