<template>
    <div class="sidebar">
        <input type="text" v-model="searchText" placeholder="Tìm kiếm người dùng" @input="searchUser"
            class="search-input" />
        <ul class="user-list">
            <li v-for="user in UserDataList" :key="user.id" :class="{ active: user.id === selectedUser?.id }"
                @click="selectUser(user)">
                <img :src="user.avatar" alt="avatar" class="avatar" />
                <span class="UserName">{{ user.name }}</span>
            </li>
        </ul>

        <div v-if="UserDataList.length === 0 && searchText.trim() !== ''" class="no-user">
            Không tìm thấy người dùng nào.
        </div>
    </div>
    <div class="message-container">

    </div>
</template>

<script setup>
import { ref } from 'vue';
import getuserfrominputtext from '../api/getuserfrominputtext.js';

const searchText = ref('');
const UserDataList = ref([]);
const selectedUser = ref(null);
const messagedata=ref([]);

const searchUser = async () => {
    if (searchText.value.trim() === '') {
        UserDataList.value = [];
        return;
    }
    try {
        const res = await getuserfrominputtext(searchText.value);
        UserDataList.value = res.Users || [];
    } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error.message);
    }
};

const selectUser = async(user) => {

    console.log("ID người dùng", user._id);
    console.log('Đã chọn user:', user);
    messagedata.value=await getmessagedata(user._id);
};
</script>

<style scoped>
body {
    margin: 0;
}

.UserName {
    color: black;
}

html,
body,
#app {
    height: 100%;
}

.sidebar {


    width: 65%;
    height: 100vh;
    border-right: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}


.search-input {
    padding: 12px 15px;
    border: none;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    outline: none;
}

.user-list {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    flex-grow: 1;
}

.user-list li {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s;
}

.user-list li:hover {
    background-color: #f5f5f5;
}

.user-list li.active {
    background-color: #d0e7ff;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
    object-fit: cover;
}

.no-user {
    padding: 20px;
    color: #999;
    font-style: italic;
    text-align: center;
}
</style>
