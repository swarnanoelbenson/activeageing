<template>
  <nav class="appnav">
    <span class="appnav-logo" @click="router.push('/')">ActiveAgeing</span>
    <div class="appnav-links">
      <a :class="{ active: active === 'home' }"     @click="router.push('/')">Home</a>
      <a :class="{ active: active === 'events' }"   @click="router.push('/events')">Events</a>
      <a :class="{ active: active === 'wellness' }" @click="router.push('/results')">Wellness Snapshot</a>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({ active: { type: String, default: '' } })
const router = useRouter()
</script>

<style scoped>
.appnav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px 40px;
  box-sizing: border-box;
}

.appnav-logo {
  font-weight: 700;
  font-size: 20px;
  color: #0b5d57;
  cursor: pointer;
}

.appnav-links {
  display: flex;
  gap: 32px;
  font-size: 16px;
  font-weight: 500;
}

.appnav-links a {
  color: #0b5d57;
  text-decoration: none;
  cursor: pointer;
}

.appnav-links a:hover { color: #084a45; }

.appnav-links a.active {
  text-decoration: underline;
  text-underline-offset: 4px;
}

@media (max-width: 768px) {
  .appnav {
    max-width: 100%;
    padding: 16px 20px;
  }
  .appnav-logo { font-size: 18px; }
  .appnav-links { gap: 20px; font-size: 14px; }
}
</style>
