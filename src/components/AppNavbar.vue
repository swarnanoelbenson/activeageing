<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  active: {
    type: String,
    default: ''
  }
})

const router = useRouter()
</script>

<template>
  <nav class="nav">
    <div class="nav-inner">
      <div class="logo" @click="router.push('/')">ActiveAgeing</div>
      <div class="nav-links">
        <span class="nav-link" :class="{ active: active === 'home' }" @click="router.push('/')">Home</span>
        <span class="nav-link" :class="{ active: active === 'checkin' }" @click="router.push('/survey')">Check-In</span>
        <span class="nav-link" :class="{ active: active === 'events' }" @click="router.push('/events')">Events</span>
        <span class="nav-link" :class="{ active: active === 'routeplan' }" @click="router.push('/routesurvey')">Plan Route</span>
        <span class="nav-link" :class="{ active: active === 'snapshot' }" @click="router.push('/results')">My Snapshot</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');

/* Fixed at top, always visible */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #FAF9F8;
  border-bottom: 1px solid rgba(11,93,87,0.08);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 800;
  font-size: 22px;
  color: #0b5d57;
  cursor: pointer;
  letter-spacing: -0.3px;
}

.nav-links {
  display: flex;
  gap: 36px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 500;
}

.nav-link {
  color: #0b5d57;
  cursor: pointer;
  transition: color 0.2s;
  padding-bottom: 2px;
}
.nav-link:hover { color: #084a45; }
.nav-link.active {
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-thickness: 2px;
}

@media (max-width: 768px) {
  .nav-inner { padding: 14px 20px; }
  .logo { font-size: 20px; }
  .nav-links { gap: 12px; font-size: 20px; }
}

@media (max-width: 600px) {
  .nav-inner { padding: 10px 14px; }
  .logo { font-size: 20px; flex-shrink: 0; }
  .nav-links {
    gap: 14px;
    font-size: 16px;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 2px;
    scrollbar-width: none;
  }
  .nav-links::-webkit-scrollbar { display: none; }
}
</style>
