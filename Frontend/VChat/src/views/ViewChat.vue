<template>
  <div class="vchat-wrapper">
    <div class="messenger-container">
      <div class="sidebar">
        <input type="text" v-model="searchText" placeholder="Tìm kiếm người dùng" @input="searchUser"
          class="search-input" />
        <ul class="user-list">
          <li v-for="user in UserDataList" :key="user.id" :class="{ active: user.id === selectedUser?.id }"
            @click="selectUser(user)">
            <span class="UserName">{{ user.name }}</span>
          </li>
        </ul>

        <div v-if="UserDataList.length === 0 && searchText.trim() !== ''" class="no-user">
          Không tìm thấy người dùng nào.
        </div>
      </div>

     
      <div class="message-container">

        <div style="background: red">HELLO</div>

        <div class="message" v-for="message in messagedata" :key="message._id">
          <div class="message-bubble">
            {{ message.Content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import getuserfrominputtext from '../api/getuserfrominputtext.js'
import getmessagedata from '../api/getmessagedata.js'
const searchText = ref('')
const UserDataList = ref([])
const selectedUser = ref(null)
const responsemessage = ref([])
const messagedata = ref([])

const searchUser = async () => {
  if (searchText.value.trim() === '') {
    UserDataList.value = []
    return
  }
  try {
    const res = await getuserfrominputtext(searchText.value);
    UserDataList.value = res.Users || []
  } catch (error) {
    console.error('Lỗi khi tìm kiếm:', error.message)
  }
}

const selectUser = async (user) => {
  console.log('ID người dùng', user._id)
  console.log('Đã chọn user:', user)
  try {
    responsemessage.value = await getmessagedata(user._id);
    console.log("Dữ liệu tin nhắn", responsemessage);
    messagedata.value = responsemessage._rawValue.MessageDataAandB.map(msg => ({
      _id: msg._id,
      SenderID: msg.SenderID,
      ReceiverID: msg.ReceiverID,
      Content: msg.Content,
      TimeStamp: msg.TimeStamp,
      SendStatus: msg.SendStatus,
      LastMessage: msg.LastMessage
    }));
    console.log(messagedata.value);

  } catch (error) {
    console.error('Lỗi khi truy vấn dữ liệu tin nhắn A and B', error.message)
  }
}
</script>
<style scoped>
.messenger-container {
  width: 100%;
  height: 100%;
  display: flex;

  background-color: #ffffff;
  border-radius: 0;
  
  box-shadow: none;
  
}

.sidebar {
  width: 30%;
  border-right: 1px solid #ddd;
  padding: 10px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.search-input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  margin-bottom: 10px;
  font-size: 14px;
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
}

.user-list li {
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.user-list li:hover {
  background-color: #e4e6eb;
}

.user-list li.active {
  background-color: #1877f2;
  color: white;
}

.UserName {
  font-weight: 500;
}

.no-user {
  margin-top: 10px;
  text-align: center;
  color: #888;
  font-style: italic;
}

.message-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #e5ddd5;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.message-bubble {
  max-width: 60%;
  padding: 10px 14px;
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  word-break: break-word;
}
</style>
