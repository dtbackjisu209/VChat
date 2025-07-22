<template>
  <div class="messenger-container">
    <div class="sidebar">
      <input
        type="text"
        v-model="searchText"
        placeholder="Tìm kiếm người dùng"
        @input="searchUser"
        class="search-input"
      />
      <ul class="user-list">
        <li
          v-for="user in UserDataList"
          :key="user.id"
          :class="{ active: user.id === selectedUser?.id }"
          @click="selectUser(user)"
        >
          <span class="UserName">{{ user.name }}</span>
        </li>
      </ul>

      <div v-if="UserDataList.length === 0 && searchText.trim() !== ''" class="no-user">
        Không tìm thấy người dùng nào.
      </div>
    </div>

    <!-- Vùng chat bên phải -->
    <div class="message-container">
      <div>Debug: {{ JSON.stringify(mainmessagedata) }}</div>
      <div style="background: red">HELLO</div>

      <div class="message" v-for="message in mainmessagedata" :key="message._id">
        <div class="message-bubble" >
          {{ message.Content }}
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
const messagedata = ref([])
const mainmessagedata = ref([])
const searchUser = async () => {
  if (searchText.value.trim() === '') {
    UserDataList.value = []
    return
  }
  try {
    const res = await getuserfrominputtext(searchText.value)
    UserDataList.value = res.Users || []
  } catch (error) {
    console.error('Lỗi khi tìm kiếm:', error.message)
  }
}

const selectUser = async (user) => {
  console.log('ID người dùng', user._id)
  console.log('Đã chọn user:', user)
  try {
    messagedata.value = await getmessagedata(user._id)
    console.log('Dữ liệu tin nhắn 1', messagedata.value)
    console.log('Dữ liệu tin nhắn2 ', messagedata._rawValue.MessageDataAandB)
    console.log('Full messagedata:', JSON.stringify(messagedata.value, null, 2))
   mainmessagedata.value = [];
messagedata.value.MessageDataAandB.forEach((msg) => {
  mainmessagedata.value.push({
    _id: msg._id,
    Content: msg.Content,
    TimeStamp: msg.TimeStamp,
    SendStatus: msg.SendStatus,
    LastMessage: msg.LastMessage
  });
});


    console.log('mainmessagedata sau khi push', JSON.stringify(mainmessagedata.value, null, 2))
    console.log('mainmessagedata sau khi map', mainmessagedata.value)
  } catch (error) {
    console.error('Lỗi khi truy vấn dữ liệu tin nhắn A and B', error.message)
  }
}
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
.messenger-container {
  display: flex;
  height: 100vh;
}

.message-container {
 

  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Một tin nhắn */
.message {
  display: flex;
  margin-bottom: 10px;
}

/* Tin nhắn của chính mình */
.message.from-self {
  justify-content: flex-end;
}

/* Tin nhắn của người khác */
.message.from-other {
  justify-content: flex-start;
}

/* Bong bóng tin nhắn */
.message-bubble {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 20px;
  line-height: 1.4;
  font-size: 15px;
  /* Sửa lại kích thước chữ hợp lý */
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Màu cho mình */
.message.from-self .message-bubble {
  background-color: #0084ff;
  color: white;
  border-bottom-right-radius: 2px;
}

/* Màu cho người khác */
.message.from-other .message-bubble {
  background-color: #e4e6eb;
  color: black;
  border-bottom-left-radius: 2px;
}
</style>
