<template>
  <div class="login-container">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Mật khẩu:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Đăng nhập</button>
    </form>
  </div>
</template>
<script setup>
 import { ref } from 'vue';
import { useRouter } from 'vue-router';
import login from "../api/login.js";
const email=ref('');
const password=ref('');
const router = useRouter();
const handleLogin=async()=>{
    const data={
        email: email.value,
        password: password.value
    }
    try{
        const response=await login(data);
        console.log("Đăng nhập thành công:", response);
        alert("Đăng nhập thành công. Chào mừng bạn đến với VChat!");
        router.push('/VChat');
    }
    catch(error){
        console.error("Đăng nhập thất bại:", error);
        alert("Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.");
    }   
}


</script>