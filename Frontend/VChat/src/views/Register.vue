<template>
  <div class="register-wrapper">
    <div class="register-container">
      <h2>Đăng ký tài khoản</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Tên</label>
          <input v-model="name" type="text" id="name" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" required />
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <input v-model="password" type="password" id="password" required />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu</label>
          <input v-model="confirmPassword" type="password" id="confirmPassword" required />
        </div>

        <button type="submit" class="submit-btn">Đăng ký</button>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import register from '../api/register.js';

const email = ref('');
const name = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Mật khẩu không khớp. Vui lòng kiểm tra lại.';
    return;
  }

  const senddata = {
    name: name.value,
    email: email.value,
    password: password.value
  };

  try {
    const response = await register(senddata);
    console.log('Đăng ký thành công:', response);
    alert('Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.');
  } catch (error) {
    console.error('Đăng ký thất bại:', error);
    errorMessage.value = 'Đăng ký thất bại. Vui lòng thử lại.';
  }
};
</script>

<style scoped>
.register-wrapper {
  min-height: 100vh;
  width:100vw;
  position:fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #0f2027, #203a43, #2c5364);
  padding: 20px;
}

.register-container {
  background-color: white;
  padding: 30px 40px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-weight: 600;
  color: #555;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border 0.3s;
}

input:focus {
  border-color: #007bff;
}

.submit-btn {
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.error {
  margin-top: 15px;
  color: red;
  text-align: center;
}
</style>
