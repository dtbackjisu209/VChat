<template>
  <div class="container">
    <div class="card">
      <h2 class="title">VinChat</h2>
      <p class="subtitle">Đặt lại mật khẩu</p>

      <form @submit.prevent="sendResetEmail" class="form">
        <div class="input-group">
          <label for="email" class="label">Email</label>
          <div class="input-wrapper">
            <input
              v-model="ResetEmail"
              type="email"
              id="email"
              placeholder="Nhập email của bạn"
              class="input"
              :class="{ 'input-error': errorMessage }"
              required
            />
            <svg class="input-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M16 12H8m0 0l4 4m-4-4l4-4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          class="button button-primary"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Đang gửi...' : 'Gửi mã OTP' }}
        </button>
      </form>

      <div v-if="otpSent" class="otp-section">
        <div class="input-group">
          <label for="otp" class="label">Mã OTP</label>
          <input
            v-model="otp"
            id="otp"
            placeholder="Nhập mã OTP"
            class="input"
            required
          />
        </div>

        <div class="input-group">
          <label for="password" class="label">Mật khẩu mới</label>
          <input
            v-model="newPassword"
            id="password"
            type="password"
            placeholder="Nhập mật khẩu mới"
            class="input"
            required
          />
        </div>

        <button
          @click="ResetPassword"
          class="button button-success"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
        </button>
      </div>

      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
    </div>
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
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const sendResetEmail = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await SendResetEmail(ResetEmail.value);
    if (response.data?.message === "OTP đã được gửi đến email") {
      otpSent.value = true;
      successMessage.value = 'Mã OTP đã được gửi đến email của bạn!';
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Lỗi khi gửi mã OTP. Vui lòng thử lại.';
    console.error("Lỗi khi gửi reset email:", error);
  } finally {
    isLoading.value = false;
  }
};

const ResetPassword = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const data = {
      email: ResetEmail.value,
      otp: otp.value,
      newPass: newPassword.value,
    };
    const response = await resetPassword(data);
    successMessage.value = response.data?.message || 'Đổi mật khẩu thành công!';
    otpSent.value = false; // Reset form after success
    ResetEmail.value = '';
    otp.value = '';
    newPassword.value = '';
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Lỗi khi đổi mật khẩu. Vui lòng kiểm tra mã OTP.';
    console.error("Lỗi đặt lại mật khẩu:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #1e293b, #0c4a6e);
  padding: 1rem;
}

.card {
  width: 100%;
  max-width: 28rem;
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.input-wrapper {
  position: relative;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  ring: 2px;
  ring-color: #0ea5e9;
  border-color: #0ea5e9;
}

.input-error {
  border-color: #ef4444;
}

.input-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}

.button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
}

.button-primary {
  background: #0284c7;
  color: white;
}

.button-primary:hover:not(:disabled) {
  background: #0369a1;
}

.button-success {
  background: #059669;
  color: white;
}

.button-success:hover:not(:disabled) {
  background: #047857;
}

.button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.otp-section {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: fadeIn 0.3s ease-in;
}

.alert {
  margin-top: 1.25rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border-width: 1px;
  font-size: 0.875rem;
  animation: fadeIn 0.3s ease-in;
}

.alert-error {
  background: #fee2e2;
  color: #b91c1c;
  border-color: #fecaca;
}

.alert-success {
  background: #dcfce7;
  color: #166534;
  border-color: #bbf7d0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>


