<template>
    <div class="register-container">
        <h2>Đăng ký</h2>
        <form @submit.prevent="handleRegister">
            <div>
                <label>Tên :</label>
                <input v-model="name" type="string" required />
            </div>
            <div>
                <label>Email :</label>
                <input v-model="email" type="email" required />
            </div>
            <div>
                <label>Mật khẩu :</label>
                <input v-model="password" type="password" required />
            </div>
            <div>
                <label>Xác nhận mật khẩu :</label>
                <input v-model="confirmPassword" type="password" required />
            </div>
            <button type="submit">Đăng ký</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>
<script setup>
 import {ref} from 'vue';

 import register from '../api/register.js';

 const email=ref('');
 const name=ref('');
 const password=ref('');
 const confirmPassword=ref('');
 const handleRegister=async()=>{
    if(password.value!== confirmPassword.value) {
        alert("Mật khẩu không khớp. Vui lòng kiểm tra lại.");
        return
    }
    const senddata={
        name:name.value,
        email:email.value,
        password: password.value
    }
    try{
        const response=await register(senddata);
        console.log("Đăng ký thành công:", response);
        alert("Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.");
    }
    catch(error){
        console.error("Đăng ký thất bại:", error);
        alert("Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.");
    }
 }
</script>