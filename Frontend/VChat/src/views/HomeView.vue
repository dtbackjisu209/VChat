<script setup lang="ts">
</script>

<template>
  <div class="container">
    <div class="logo-section">
      
      <h1 class="title">VinChat</h1>
    </div>

    <div class="button-group">
      <router-link to="/login">
        <button class="btn">Đăng nhập</button>
      </router-link>
      <router-link to="/register">
        <button class="btn btn-outline">Đăng ký</button>
      </router-link>
    </div>

    <router-view />
  </div>
</template>

<style scoped>

.container {
  position: fixed; /* đảm bảo chiếm toàn màn */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #0f2027, #203a43, #2c5364);
  color: white;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.logo {
  width: 120px;
  height: auto;
  margin-bottom: 10px;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.button-group {
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  background-color: #00a8ff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #0091e0;
}

.btn-outline {
  background-color: transparent;
  border: 2px solid #00a8ff;
  color: #00a8ff;
}

.btn-outline:hover {
  background-color: #00a8ff;
  color: white;
}
</style>
