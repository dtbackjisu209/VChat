<template>
  <div class="vchat-wrapper">
    <div class="messenger-container">
      <div class="sidebar">
        <div class="user-info-container">
          <div class="avatar-container">
            <img
              :src="userAvatar || '/images/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg'"
              class="avatar-img"
              @click="triggerFileInput"
            />

            <input
              ref="fileInput"
              type="file"
              @change="handleFileChange"
              accept="image/*"
              style="display: none"
            />
            <div class="username-section">
              <div class="username-text">{{ userName }}</div>
              <button class="logout-btn" @click="logout" title="Đăng xuất">Log out</button>
            </div>
          </div>
        </div>

        <input
          type="text"
          v-model="searchText"
          placeholder="Tìm kiếm người dùng"
          @input="searchUser"
          class="search-input"
        />

        <div class="recent-users-container">
          <div
            class="recent-user"
            v-for="data in TextedUsersAndLastMessage"
            :key="data.user._id"
            @click="selectUser(data.user)"
          >
            <div class="recent-user-content">
              <img
                :src="
                  data.user.avatar ||
                  '/images/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg'
                "
                class="avatar-img"
                v-if="data.user.avatar"
              />
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

      <!-- Khu vực hiển thị tin nhắn -->
      <div v-if="selectedUser" class="message-chat">
        <div class="chat-header-fixed">
          <img
            :src="
              selectedUser.avatar || '/images/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg'
            "
            class="chat-header-avatar"
          />
          <div class="chat-header-name">{{ selectedUser.name }}</div>
          <button @click="startCall" class="call-btn">📞 Gọi</button>
            
        </div>
        <div v-if="inCall" class="video-call-container">
          <video ref="localVideo" autoplay playsinline muted></video>
          <video ref="remoteVideo" autoplay playsinline></video>
        </div>
        <button v-if="inCall" @click="endCall" class="end-call-btn">❌ Tắt</button>

        <div class="chat-messages">
          <div
            class="message"
            v-for="(message, index) in messagedata"
            :key="message._id"
            :class="message.SenderID === UserLoginID ? 'sent' : 'received'"
          >
            <img
              :src="selectedUser.avatar"
              alt="avatar"
              class="message-avatar"
              v-if="message.SenderID != UserLoginID"
            />
            <div class="bubble-container">
              <div class="bubble" @click="ShowTimeFunction(message._id)">
                {{ message.Content }}
              </div>
              <div v-if="ShowTimeStampID === message._id" class="TimeStamp">
                {{ FormatTime(message.TimeStamp) }}
              </div>
            </div>
          </div>
          <div ref="endOfMessages" />
        </div>
      </div>

      <form v-if="selectedUser" @submit.prevent="Send" class="chat-input-wrapper-fixed">
        <input
          v-model="SendMessageData"
          type="text"
          placeholder="Nhập tin nhắn..."
          class="chat-input"
        />
        <button class="send-button">Gửi</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/HomeView.css'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { onMounted } from 'vue'
import socket from '../socket.js'
import { FormatTime } from '../Utils/FormatTime.js'
import getuserfrominputtext from '../api/getuserfrominputtext.js'
import getmessagedata from '../api/getmessagedata.js'
import GetUserLoginID from '../Utils/GetUserLoginID.js'
import GetTextedUsersAndLastMessage from '../api/GetUserAndLastMessage.js'
import updateRecentUsers from '../api/updateRecentMessage.js'
import getavatarandusername from '../api/getavatarandusername.js'
import { uploadAvatar } from '../api/upload.js'
import { nextTick, watch } from 'vue'
const searchText = ref('')
const UserDataList = ref([])
const selectedUser = ref(null)
const responsemessage = ref([])
const messagedata = ref([])
const ShowTimeStampID = ref(null)
const UserLoginID = ref('')
const userAvatar = ref('')
const userName = ref(' ')
const ReceiverID = ref('')
const SendMessageData = ref('')
const TextedUsersAndLastMessage = ref([])
const selectedFile = ref(null)
const fileInput = ref(null)
const router = useRouter()
const endOfMessages = ref(null)
const localVideo = ref(null);
const remoteVideo = ref(null);
const localStream = ref(null);
let peerConnection = null;
const inCall = ref(false);
let remoteUserID = null; // để lưu id của người đang call với mình

const rtcConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};
watch(
  () => messagedata.value.length,
  async () => {
    await nextTick()
    endOfMessages.value?.scrollIntoView({ behavior: 'auto' })
  },
)
const triggerFileInput = () => {
  fileInput.value.click()
}

const onFileChange = (e) => {
  selectedFile.value = e.target.files[0]
}

const handleUpload = async () => {
  if (!selectedFile.value) {
    alert('Vui lòng chọn ảnh!')
    return
  }

  if (selectedFile.value.size > 10 * 1024 * 1024) {
    alert('Ảnh quá lớn, vui lòng chọn ảnh dưới 10MB')
    return
  }

  try {
    const data = await uploadAvatar(selectedFile.value, UserLoginID.value)

    if (data.success) {
      alert('Cập nhật ảnh đại diện thành công!')
      console.log('Link ảnh:', data.data.avatar)
      userAvatar.value = data.data.avatar
      await refreshRecentUsers()
    } else {
      alert('Đã xảy ra lỗi khi cập nhật.')
    }
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error)
    alert('Upload thất bại.')
  }
}
const handleFileChange = async (e) => {
  onFileChange(e)
  await handleUpload()
}

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
  ReceiverID.value = user._id
  selectedUser.value = user

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
    UserLoginID.value = responsemessage._rawValue.SenderID
  } catch (error) {
    console.error('Lỗi khi truy vấn dữ liệu tin nhắn A and B', error.message)
  }
  searchText.value = ''
  UserDataList.value = []
}
const ShowTimeFunction = (messageID) => {
  ShowTimeStampID.value = ShowTimeStampID.value === messageID ? null : messageID
}
const refreshRecentUsers = async () => {
  console.log('Refresh')
  TextedUsersAndLastMessage.value = await updateRecentUsers()
}
const Send = async () => {
  const content = SendMessageData.value.trim()
  if (!ReceiverID.value || content === '') {
    return
  } else {
    const SendData = {
      sendMessageData: SendMessageData.value,
      SenderID: UserLoginID.value,
      ReceiverID: ReceiverID.value,
    }
    console.log('SendData', SendData)
    socket.emit('SendMessage', SendData)
    SendMessageData.value = ''
    await refreshRecentUsers()
  }
}
const logout = async () => {
  localStorage.removeItem('token')
  router.replace('login')
}
// khai báo thêm
const pendingRemoteCandidates = ref([]); // lưu candidate chưa thể add
let callerUserID = null; // khi nhận offer, lưu người gọi

// cấu hình RTC


async function initPeerConnection() {
  peerConnection = new RTCPeerConnection(rtcConfig);

  // logs
  peerConnection.oniceconnectionstatechange = () => {
    console.log('ICE state:', peerConnection.iceConnectionState);
  };

  // Nhận track của đối phương
  peerConnection.ontrack = (event) => {
    console.log("Nhận track từ đối phương", event);
    if (remoteVideo.value) {
      remoteVideo.value.srcObject = event.streams[0];
    }
  };

  // Gửi ICE Candidate cho đối phương
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('Gửi candidate tới', remoteUserID, event.candidate);
      socket.emit("call-candidate", {
        to: remoteUserID,
        candidate: event.candidate
      });
    }
  };

  // Lấy camera/mic của mình (tách ra để trả về trước khi add track)
  try {
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideo.value) localVideo.value.srcObject = localStream.value;

    // Gửi track của mình cho peer
    localStream.value.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream.value);
    });
  } catch (err) {
    console.error('Lỗi getUserMedia', err);
    throw err;
  }
}

// gọi (caller)
const startCall = async () => {
  if (!ReceiverID.value) return;
  inCall.value = true;
  remoteUserID = ReceiverID.value;

  await initPeerConnection();

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  console.log('Emit call-offer to', remoteUserID);
  socket.emit("call-offer", {
    to: remoteUserID,
    offer
  });
};

// nhận offer (callee)
socket.on("call-offer", async ({ from, offer }) => {
  try {
    inCall.value = true;
    remoteUserID = from; // from là userID của đối phương
    callerUserID = from; // lưu để sau gửi answer/candidate

    pendingRemoteCandidates.value = []; // reset bộ đệm

    await initPeerConnection();

    console.log('Nhận offer, setRemoteDescription');
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // tạo answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // gửi answer về caller
    socket.emit("call-answer", {
      to: remoteUserID,
      answer
    });

    // thêm những candidate đã có trong bộ đệm
    if (pendingRemoteCandidates.value.length) {
      for (const c of pendingRemoteCandidates.value) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(c));
        } catch (err) {
          console.warn('Lỗi addBufferedCandidate', err);
        }
      }
      pendingRemoteCandidates.value = [];
    }
  } catch (err) {
    console.error('Lỗi xử lý call-offer', err);
  }
});

// nhận answer (caller)
socket.on("call-answer", async ({ answer }) => {
  try {
    console.log('Nhận answer, setRemoteDescription');
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

    // nếu có candidate đệm trước đó, add vào
    if (pendingRemoteCandidates.value.length) {
      for (const c of pendingRemoteCandidates.value) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(c));
        } catch (err) {
          console.warn('Lỗi addBufferedCandidate after answer', err);
        }
      }
      pendingRemoteCandidates.value = [];
    }
  } catch (err) {
    console.error('Lỗi khi nhận call-answer', err);
  }
});

// nhận ICE candidate
socket.on("call-candidate", async ({ candidate }) => {
  if (!candidate) return;
  try {
    // nếu chưa có remoteDescription -> lưu lại đệm
    if (!peerConnection || !peerConnection.remoteDescription || peerConnection.remoteDescription.type === '') {
      console.log('Đệm candidate (chưa có remoteDescription)');
      pendingRemoteCandidates.value.push(candidate);
    } else {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  } catch (err) {
    console.error('Lỗi thêm ICE Candidate', err);
  }
});

// kết thúc cuộc gọi từ bên kia
socket.on("call-ended", () => {
  console.log('Nhận call-ended');
  if (localStream.value) {
    localStream.value.getTracks().forEach(track => track.stop());
    localStream.value = null;
  }
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  inCall.value = false;
  pendingRemoteCandidates.value = [];
  remoteUserID = null;
});

// kết thúc cuộc gọi do mình bấm
const endCall = () => {
  // Tắt video/audio local
  if (localStream.value) {
    localStream.value.getTracks().forEach(track => track.stop());
    localStream.value = null;
  }

  // Đóng peerConnection
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  // Ẩn UI video call
  inCall.value = false;

  // Gửi tín hiệu báo cho đối phương
  if (remoteUserID) {
    socket.emit("call-ended", { to: remoteUserID });
  }

  pendingRemoteCandidates.value = [];
  remoteUserID = null;
};


onMounted(async () => {
  try {
    const res = await GetUserLoginID()
    const data = await GetTextedUsersAndLastMessage()
    const avatarandname = await getavatarandusername()

    TextedUsersAndLastMessage.value = data.map((item) => ({
      message: item.message,
      user: item.user,
    }))

    console.log('GetTextedUsersAndLastMessage', TextedUsersAndLastMessage)

    userAvatar.value = avatarandname.Avatar
    UserLoginID.value = res.UserLoginID
    userName.value = avatarandname.UserName
    console.log('UserLoginID:', UserLoginID.value)
    console.log(' userAvatar:', userAvatar.value)
  } catch (error) {
    console.error('Lỗi khi lấy ID người dùng đăng nhập', error)
  }
  socket.on('receive-message', async (data) => {
    const isCorrectChat =
      selectedUser.value &&
      ((data.SenderID === selectedUser.value._id && data.ReceiverID === UserLoginID.value) ||
        (data.ReceiverID === selectedUser.value._id && data.SenderID === UserLoginID.value))

    if (isCorrectChat) {
      messagedata.value.push(data)
    }

    await refreshRecentUsers()
  })
})
</script>
