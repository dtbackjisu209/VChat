<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  

  <RouterView />
</template>

<style>
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* ✅ Ngăn cuộn ngang */

  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>