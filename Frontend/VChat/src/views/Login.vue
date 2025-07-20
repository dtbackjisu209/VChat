<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="title"> VinChat</h2>
      <p class="subtitle">Chào mừng bạn quay lại</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <div class="input-wrapper">
            <span class="icon">@</span>
            <input v-model="email" type="email" placeholder="Nhập email của bạn" required />
          </div>
        </div>
        <div class="form-group">
          <label>Mật khẩu</label>
          <div class="input-wrapper">
            <span class="icon">🔒</span>
            <input v-model="password" type="password" placeholder="Nhập mật khẩu" required />
          </div>
        </div>
        <button type="submit" class="login-btn">Đăng nhập</button>
      </form>
      <p class="footer">Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import login from "../api/login.js";
import socket from "../socket.js";

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  const data = {
    email: email.value,
    password: password.value
  }
  try {
    const response = await login(data);
    console.log("Đăng nhập thành công:", response);
    alert("Đăng nhập thành công. Chào mừng bạn đến với VChat!");
    console.log("User ID:", response.userID);
    socket.emit("join",response.userID);
   
    router.push('/VChat');
  } catch (error) {
    console.error("Đăng nhập thất bại:", error);
    alert("Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.");
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
.login-page {
  position: fixed; /* ✅ thay vì chỉ dùng height */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(120deg, #0f2027, #203a43, #2c5364);
  font-family: 'Poppins', sans-serif;
  overflow: hidden; /* đảm bảo không cuộn */
}


.login-card {
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: fadeInUp 0.6s ease;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
}

.subtitle {
  font-size: 0.95rem;
  color: #7f8c8d;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
  color: #2c3e50;
}

.input-wrapper {
  position: relative;
}

.input-wrapper .icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  font-size: 1rem;
  color: #aaa;
}

input {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border-radius: 10px;
  border: 1px solid #ccc;
  transition: 0.3s ease;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 8px;
}

.login-btn:hover {
  background-color: #2980b9;
}

.footer {
  margin-top: 18px;
  font-size: 0.9rem;
  color: #555;
}

.footer a {
  color: #3498db;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

@keyframes fadeInUp {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
