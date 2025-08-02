<template>
    <form @submit.prevent="SendResetEmail">
          <input model="ResetEmail" type="text"></input>
          <button></button>

    </form>
  

</template>
<script setup>
 import {ref} from 'vue';
 import SendResetEmail from '../api/SendResetEmail.js'
 const ResetEmail=ref('');
 const SendResetEmail=async()=>{
    try{
        const response=await SendResetEmail(ResetEmail.value)
        console.log(response);
    }
    catch(error)
    {
        console.log("Lỗi không gửi được ResetEmail",error.message);
    }


 }
 
</script>