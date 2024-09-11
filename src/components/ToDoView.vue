<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';
import axiosInstance from '@/axios';

const authStore = useAuthStore();
const newTask = ref('');
const tasks  = ref([]);
const filterStatus = ref('all');
// 跳轉路由
const router = useRouter();

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login');
  }  else {
    await loadTasks();
  }

});

// 加載用戶的任務數據
const loadTasks = async () => {
    try {
        const response = await axiosInstance.post('/tasks', {
            user_id: authStore.userId
        });

        if (response.data.success) {
            tasks.value = response.data.tasks;
        } else {
            alert('加載任務失敗');
        }
    } catch (error) {
        console.error('加載任務失敗:', error);
        alert('加載任務失敗');
    }
};


//添加新任務
const addTask =  async () => {
    if (newTask.value.trim() === '') {
        alert('請輸入代辦事項');
        return;
    }

    if (!authStore.isLoggedIn) {
        alert('請先登入');
        return;
    }

    try {
    const response = await axiosInstance.post('/create', {
      text: newTask.value,
      user_id: authStore.userId
    });

    if (response.data.success) {
      await loadTasks(); // 重新加载任务
      newTask.value = '';
      alert('新增成功');
    } else {
      throw new Error('響應數據格式不正確');
    }
  } catch (error) {
    console.error('新增失敗:', error);
    alert('新增失敗');
  }
};

// 篩選任務狀態
const filteredTasks = computed(() => {
    if (filterStatus.value === 'all') {
        return tasks.value;
    }
    return tasks.value.filter(tasks => tasks.status === filterStatus.value);
});

</script>

<template>
    <div class="content">
        <input class="text" type="text" v-model="newTask" placeholder="請輸入代辦事項">
        <button class="ad" @click="addTask">新增</button>
    </div>
    <div class="button-group">
        <button @click="filterStatus = 'all'" :class="{ active: filterStatus === 'all' }" >全部(all)</button>
        <button @click="filterStatus = '已完成'" :class="{ active: filterStatus === 'true' }" >已完成 (Completed)</button>
        <button @click="filterStatus = '未完成'" :class="{ active: filterStatus === 'false' }" >未完成(Not completed)</button>
    </div>
    <div class="input-group">
        <div>
            <p>
                <span>代辦事項ID:</span><span>代辦事項:</span><span>狀態:</span>
            </p>
            
            <li v-for="task in filteredTasks" :key="task.id" >
                <div class="detail">
                <input class="checkbox" type="checkbox" v-model="task.status" @change="saveTasks" :true-value="'已完成'" :false-value="'未完成'">
                
                <span>{{ task.createid }}</span>
                <span>{{ task.text }}</span>
                <span :style="{ color: task.status === '已完成' ? '#dc3545' : 'black' }">{{ task.status }}</span>
                </div>
                
            </li>
        </div>

    </div>

</template>

<style>
.content{
    display: flex;
    justify-content: center;
    width: 100%;
    font-size: 25px;
}
.text{
    margin: 0 5%;
    text-align: center;
}

.ad{
    font-weight: 700;
}
.button-group{
    width: 100%;
    display: flex;
    align-items: center;
}
.button-group button{
    margin: 5% 2%;
    font-size: 20px;
}
.button-group button.active {
    background-color: #d4dbd4;
}
.input-group p span{
    margin: 0 4%;
    font-size: 25px;
    font-weight: 700;
}
.input-group .detail{
    display: flex;
    align-items: center;
}
.input-group .detail .checkbox{
    width: 50px;
    height: 50px;
    margin: 3%;
}
.input-group .detail span{
    margin:  0 9%;
    font-size: 20px;
}
.input-group li{
    text-align: center;
    list-style: none;
    border: 1px solid#ccc;
    margin: 5% 2%;
}

@media screen and (min-width: 768px) {
.text{
    margin: 0 10%;
    font-size: 40px;
}
.ad{
  font-size: 40px;
}
.button-group{
    margin:auto;
}
.button-group button{
    margin: 5% auto;
    font-size: 25px;
}
.input-group p span{
    font-size: 40px;
    margin: 0 5%;
}
.input-group  .detail span{
    font-size: 40px;
    margin: 0 auto;
}
}@media screen and (min-width: 1024px) {
    .input-group p span{
    font-size: 40px;
    margin: 0 8%;
}
}
</style>
