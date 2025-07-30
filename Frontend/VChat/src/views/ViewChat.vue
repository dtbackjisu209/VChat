<template>
  <div class="vchat-wrapper">
    <div class="messenger-container">
      <div class="sidebar">
        <div class="user-info-container">
          <div class="avatar-container">
            <img :src="userAvatar" alt="avatar" class="avatar-img" @click="triggerFileInput" />
            <input ref="fileInput" type="file" @change="handleFileChange" accept="image/*" style="display: none;" />
            <div class="username-section">
              <div class="username-text">{{ userName }}</div>
              <button class="logout-btn" @click="logout" title="Đăng xuất">Log out</button>
            </div>

          </div>

        </div>

        <input type="text" v-model="searchText" placeholder="Tìm kiếm người dùng" @input="searchUser"
          class="search-input" />

        <div class="recent-users-container">
          <div class="recent-user" v-for="data in TextedUsersAndLastMessage" :key="data.user._id"
            @click="selectUser(data.user)">
            <div class="recent-user-content">
              <img :src="data.user.avatar" alt="avatar" class="avatar-img" v-if="data.user.avatar" />
              <img :src="'/images/avatar-trang-2.jpg'" alt="avatar" class="avatar-img" v-else />
              <div class="user-text">
                <div class="UserName">{{ data.user.name }}</div>
                <div class="last-line">
                  <div class="last-message">{{ data.message.Content }}</div>
                  <div class="last-message2">{{ FormatTime(data.message.TimeStamp) }}</div>
                </div>
              </div>
            </div>
          </div>


        </div>

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

      <!-- Khu vực hiển thị tin nhắn -->
      <div v-if="selectedUser" class="message-chat">
        <div class="chat-header-fixed">
          <img :src="selectedUser.avatar" alt="avatar" class="chat-header-avatar" />
          <div class="chat-header-name">{{ selectedUser.name }}</div>
        </div>

        <div class="chat-messages">
          <div class="message" v-for="(message, index) in messagedata" :key="message._id"
            :class="message.SenderID === UserLoginID ? 'sent' : 'received'">
            <img :src="selectedUser.avatar" alt="avatar" class="message-avatar"
              v-if="message.SenderID != UserLoginID" />
            <div class="bubble-container">
              <div class="bubble" @click="ShowTimeFunction(message._id)">
                {{ message.Content }}
              </div>
              <div v-if="ShowTimeStampID === message._id" class="TimeStamp">
                {{ FormatTime(message.TimeStamp) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <form v-if="selectedUser" @submit.prevent="Send" class="chat-input-wrapper-fixed">
        <input v-model="SendMessageData" type="text" placeholder="Nhập tin nhắn..." class="chat-input" />
        <button class="send-button">Gửi</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/HomeView.css'
import { useRouter } from 'vue-router';
import { ref } from 'vue'
import { onMounted } from 'vue'
import socket from '../socket.js'
import { FormatTime } from '../Utils/FormatTime.js'
import getuserfrominputtext from '../api/getuserfrominputtext.js'
import getmessagedata from '../api/getmessagedata.js'
import GetUserLoginID from '../Utils/GetUserLoginID.js'
import GetTextedUsersAndLastMessage from '../api/GetUserAndLastMessage.js'
import updateRecentUsers from '../api/updateRecentMessage.js';
import getavatarandusername from '../api/getavatarandusername.js';
import { uploadAvatar } from '../api/upload.js';
const searchText = ref('')
const UserDataList = ref([])
const selectedUser = ref(null)
const responsemessage = ref([])
const messagedata = ref([])
const ShowTimeStampID = ref(null)
const UserLoginID = ref('')
const userAvatar = ref('')
const userName = ref(' ')
const ReceiverID = ref('');
const SendMessageData = ref('');
const TextedUsersAndLastMessage = ref([]);
const selectedFile = ref(null);
const fileInput = ref(null);
const router = useRouter();
const triggerFileInput = () => {
  fileInput.value.click();
};

const onFileChange = (e) => {
  selectedFile.value = e.target.files[0];
};


const handleUpload = async () => {
  if (!selectedFile.value) {
    alert('Vui lòng chọn ảnh!');
    return;
  }

  if (selectedFile.value.size > 10 * 1024 * 1024) {
    alert('Ảnh quá lớn, vui lòng chọn ảnh dưới 10MB');
    return;
  }

  try {
    const data = await uploadAvatar(selectedFile.value, UserLoginID.value);

    if (data.success) {
      alert('Cập nhật ảnh đại diện thành công!');
      console.log('Link ảnh:', data.data.avatar);
      userAvatar.value = data.data.avatar;
      await refreshRecentUsers();
    } else {
      alert('Đã xảy ra lỗi khi cập nhật.');
    }
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    alert('Upload thất bại.');
  }
};
const handleFileChange = async (e) => {
  onFileChange(e);
  await handleUpload();
};

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
  selectedUser.value = user;

  console.log('Đã chọn user:', user)
  try {
    responsemessage.value = await getmessagedata(user._id);
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
  searchText.value = '';
  UserDataList.value = [];
}
const ShowTimeFunction = (messageID) => {
  ShowTimeStampID.value = ShowTimeStampID.value === messageID ? null : messageID
}
const refreshRecentUsers = async () => {
  console.log("Refresh");
  TextedUsersAndLastMessage.value = await updateRecentUsers();
};
const Send = async () => {
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
    await refreshRecentUsers();
  }
}
const logout = async () => {
  localStorage.removeItem('token');
  router.replace('login');
}
onMounted(async () => {

  try {
    const res = await GetUserLoginID();
    const data = await GetTextedUsersAndLastMessage();
    const avatarandname = await getavatarandusername();

    TextedUsersAndLastMessage.value = data.map((item) => ({
      message: item.message,
      user: item.user
    }));

    console.log("GetTextedUsersAndLastMessage", TextedUsersAndLastMessage);

    userAvatar.value = avatarandname.Avatar;
    UserLoginID.value = res.UserLoginID;
    userName.value = avatarandname.UserName;
    console.log("UserLoginID:", UserLoginID.value);
    console.log(" userAvatar:", userAvatar.value);
  } catch (error) {
    console.error("Lỗi khi lấy ID người dùng đăng nhập", error);
  }
  socket.on('receive-message', async (data) => {

    const isCorrectChat =
      selectedUser.value &&
      (
        (data.SenderID === selectedUser.value._id && data.ReceiverID === UserLoginID.value) ||
        (data.ReceiverID === selectedUser.value._id && data.SenderID === UserLoginID.value)
      );

    if (isCorrectChat) {
      messagedata.value.push(data);
    }

    await refreshRecentUsers();
  });



})
</script>
