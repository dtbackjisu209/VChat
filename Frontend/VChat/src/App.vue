<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <div class="layout">
    <RouterView />
  </div>
</template>


<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.vchat-wrapper {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}


.layout {
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
}

</style>