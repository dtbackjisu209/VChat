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

      <div class="message-chat">
        <div class="message" v-for="(message, index) in messagedata" :key="message._id"
          :class="message.SenderID === UserLoginID ? 'sent' : 'received'">
          <div class="bubble" @click="ShowTimeFunction(message._id)">
            {{ message.Content }}
          </div>
          <div v-if="ShowTimeStampID === message._id" class="TimeStamp">
            {{ FormatTime(message.TimeStamp) }}
          </div>


        </div>
        <form @submit.prevent="Send()" class="chat-input-wrapper-fixed">
          <input v-model="SendMessageData" type="text" placeholder="Nhập tin nhắn..." class="chat-input" />
          <button class="send-button">Gửi</button>
        </form>



      </div>



    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import socket from '../socket.js'
import { FormatTime } from '../Utils/FormatTime.js'
import getuserfrominputtext from '../api/getuserfrominputtext.js'
import getmessagedata from '../api/getmessagedata.js'
import GetUserLoginID from '../Utils/GetUserLoginID.js'
const searchText = ref('')
const UserDataList = ref([])
const selectedUser = ref(null)
const responsemessage = ref([])
const messagedata = ref([])
const ShowTimeStampID = ref(null)
const UserLoginID = ref('')

const ReceiverID = ref('');
const SendMessageData = ref('');
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
  console.log('ID người dùng', user._id);
  ReceiverID.value = user._id;
  console.log('Đã chọn user:', user)
  try {
    responsemessage.value = await getmessagedata(user._id)
    console.log('Dữ liệu tin nhắn', responsemessage)
    messagedata.value = responsemessage._rawValue.MessageDataAandB.map((msg) => ({
      _id: msg._id,
      SenderID: msg.SenderID,
      ReceiverID: msg.ReceiverID,
      Content: msg.Content,
      TimeStamp: msg.TimeStamp,
      SendStatus: msg.SendStatus,
      LastMessage: msg.LastMessage,
    })).sort((a, b) => new Date(a.TimeStamp) - new Date(b.TimeStamp))
    UserLoginID.value = responsemessage._rawValue.SenderID;
  } catch (error) {
    console.error('Lỗi khi truy vấn dữ liệu tin nhắn A and B', error.message)
  }
}
const ShowTimeFunction = (messageID) => {
  ShowTimeStampID.value = ShowTimeStampID.value === messageID ? null : messageID
}
const Send = () => {
  const content = SendMessageData.value.trim()
  if (!ReceiverID.value || content === '') {
    return; 
  }
  else {
    const SendData = {
      sendMessageData: SendMessageData.value,
      SenderID: UserLoginID.value,
      ReceiverID: ReceiverID.value

    }
    console.log("SendData", SendData);
    socket.emit("SendMessage", SendData);
    SendMessageData.value = '';
  }




}
onMounted(async () => {

  try {
    const res = await GetUserLoginID();
    UserLoginID.value = res.UserLoginID;
    console.log("UserLoginID:", UserLoginID.value);
  } catch (error) {
    console.error("Lỗi khi lấy ID người dùng đăng nhập", error);
  }

  socket.on('receive-message', (data) => {
    messagedata.value.push(data);
  });

})
</script>
<style scoped>
.vchat-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
}

.messenger-container {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #ffffff;
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

.message-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #e5ddd5;
  overflow-y: auto;
    padding-bottom: 80px;
}

.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  max-width: 100%;
}

.message.sent {
  align-items: flex-end;
}

.message.received {
  align-items: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 18px;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message.sent .bubble {
  background-color: #1877f2;
  color: white;
  border-bottom-right-radius: 4px;
  /* Làm tròn nhẹ góc dưới bên phải */
}

.message.received .bubble {
  background-color: #f0f0f0;
  color: black;
  border-bottom-left-radius: 4px;
  /* Làm tròn nhẹ góc dưới bên trái */
}

.TimeStamp {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
  text-align: center;
}

.chat-input-wrapper-fixed {
  position: fixed;
  bottom: 0;
  left: 30%; /* bằng chiều rộng sidebar */
  width: 70%; /* phần còn lại của màn hình */
  display: flex;
  padding: 12px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  align-items: center;
  gap: 10px;
  z-index: 10;
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.chat-input:focus {
  border-color: #1877f2;
}

.send-button {
  background-color: #1877f2;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #145dc2;
}

</style>