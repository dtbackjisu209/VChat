<template>
     <form @submit.prevent="SetPass">
          <input model="NewPass" type="text"></input>
          <button></button>

    </form>

</template>
<script setup>
 import {ref} from 'vue';
 import SetPass from "../api/SetPass.js"
 const NewPass=ref('');
 const SetPass=async()=>{
    try{
        const response=await SetPass(NewPass.value);
        console.log(response.data);
    }
    catch(error)
    {
        console.log("Đổi pass thất bại",error.message);
    }
 }
</script>