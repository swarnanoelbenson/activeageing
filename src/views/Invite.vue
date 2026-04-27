<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="page">
    <div class="content">
      <h1>Invite Others</h1>
      <p>This page is coming soon.</p>
      <button @click="router.back()">← Go back</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f2;
  font-family: 'Poppins', sans-serif;
}
.content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
h1 { font-size: 28px; font-weight: 800; color: #0b5d57; }
p  { font-size: 14px; color: #6a7a76; }
button {
  background: #0b5d57; color: white;
  border: none; border-radius: 8px;
  padding: 12px 24px; font-size: 14px; font-weight: 600;
  cursor: pointer; font-family: 'Poppins', sans-serif;
}
button:hover { background: #084a45; }
</style>