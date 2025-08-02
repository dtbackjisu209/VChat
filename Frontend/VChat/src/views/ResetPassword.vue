<template>
  <form @submit.prevent="sendResetEmail">
    <input v-model="ResetEmail" type="text" placeholder="Nhập email" />
    <button>Gửi mã OTP</button>
  </form>

  <div v-if="otpSent">
    <input v-model="otp" placeholder="Nhập mã OTP" />
    <input v-model="newPassword" placeholder="Mật khẩu mới" type="password" />
    <button @click="ResetPassword">Đổi mật khẩu</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SendResetEmail from '../api/SendResetEmail.js';
import resetPassword from '../api/resetPassword.js';

const ResetEmail = ref('');
const otpSent = ref(false);
const newPassword = ref('');
const otp = ref('');

const sendResetEmail = async () => {
  try {
    const response = await SendResetEmail(ResetEmail.value);
    console.log(response.data);
      if (response.data?.message === "OTP đã được gửi đến email") {
      otpSent.value = true;
    }
  } catch (error) {
    console.log("Lỗi khi gửi reset email", error.message);
  }
};

const ResetPassword = async () => {
  try {
    const data = {
      email: ResetEmail.value,
      otp: otp.value,
      newPass: newPassword.value
    };
    const response = await resetPassword(data);
    console.log(response.data);
  } catch (error) {
      console.error("Lỗi đặt lại mật khẩu FULL:", error);
  }
};
</script>
