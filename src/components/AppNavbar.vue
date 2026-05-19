<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  active: {
    type: String,
    default: ''
  }
})

const router   = useRouter()
const sideOpen = ref(false)
const navEl    = ref(null)
let   ro       = null

function setNavbarHeight() {
  if (navEl.value) {
    document.documentElement.style.setProperty('--navbar-h', navEl.value.offsetHeight + 'px')
  }
}

onMounted(() => {
  setNavbarHeight()
  ro = new ResizeObserver(setNavbarHeight)
  if (navEl.value) ro.observe(navEl.value)
})

onBeforeUnmount(() => {
  if (ro) ro.disconnect()
})

function navigate(path) {
  sideOpen.value = false
  router.push(path)
}
</script>

<template>
  <nav class="nav" ref="navEl">
    <div class="nav-inner">
      <div class="logo" @click="navigate('/')">ActiveAgeing</div>

      <!-- Desktop links -->
      <div class="nav-links">
        <span class="nav-link" :class="{ active: active === 'home' }"      @click="navigate('/')">Home</span>
        <span class="nav-link" :class="{ active: active === 'checkin' }"   @click="navigate('/survey')">Check-In</span>
        <span class="nav-link" :class="{ active: active === 'exercises' }" @click="navigate('/exercises')">All Exercises</span>
        <span class="nav-link" :class="{ active: active === 'events' }"    @click="navigate('/events')">Events</span>
        <span class="nav-link" :class="{ active: active === 'routeplan' }" @click="navigate('/routesurvey')">Plan Route</span>
        <span class="nav-link" :class="{ active: active === 'snapshot' }"  @click="navigate('/results')">My Snapshot</span>
      </div>

      <!-- Hamburger (mobile only) -->
      <button class="hamburger" :class="{ open: sideOpen }" @click="sideOpen = !sideOpen" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile sidebar backdrop -->
    <Transition name="fade-backdrop">
      <div v-if="sideOpen" class="sidebar-backdrop" @click="sideOpen = false"></div>
    </Transition>

    <!-- Mobile sidebar -->
    <Transition name="slide-sidebar">
      <div v-if="sideOpen" class="sidebar">
        <div class="sidebar-header">
          <div class="logo" @click="navigate('/')">ActiveAgeing</div>
          <button class="sidebar-close" @click="sideOpen = false">✕</button>
        </div>
        <nav class="sidebar-links">
          <span class="sidebar-link" :class="{ active: active === 'home' }"      @click="navigate('/')">Home</span>
          <span class="sidebar-link" :class="{ active: active === 'checkin' }"   @click="navigate('/survey')">Check-In</span>
          <span class="sidebar-link" :class="{ active: active === 'exercises' }" @click="navigate('/exercises')">All Exercises</span>
          <span class="sidebar-link" :class="{ active: active === 'events' }"    @click="navigate('/events')">Events</span>
          <span class="sidebar-link" :class="{ active: active === 'routeplan' }" @click="navigate('/routesurvey')">Plan Route</span>
          <span class="sidebar-link" :class="{ active: active === 'snapshot' }"  @click="navigate('/results')">My Snapshot</span>
        </nav>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #FAF9F8;
  border-bottom: 1px solid rgba(11,93,87,0.08);
  /* push content below the device status bar on notched phones */
  padding-top: env(safe-area-inset-top, 0px);
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
  flex-shrink: 0;
}

/* ── Desktop links ── */
.nav-links {
  display: flex;
  gap: 28px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 500;
}

.nav-link {
  color: #0b5d57;
  cursor: pointer;
  transition: color 0.2s;
  padding-bottom: 2px;
  white-space: nowrap;
}
.nav-link:hover { color: #084a45; }
.nav-link.active {
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-thickness: 2px;
}

/* ── Hamburger ── */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  width: 36px;
  height: 36px;
}
.hamburger span {
  display: block;
  height: 2px;
  background: #0b5d57;
  border-radius: 2px;
  transition: transform 0.25s, opacity 0.25s;
  transform-origin: center;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── Sidebar backdrop ── */
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 200;
}

/* ── Sidebar panel ── */
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 72vw;
  max-width: 300px;
  background: #faf9f8;
  z-index: 300;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0,0,0,0.14);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(11,93,87,0.08);
}

.sidebar-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #555;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}
.sidebar-close:hover { background: #f0f0f0; }

.sidebar-links {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  font-family: 'Poppins', sans-serif;
}

.sidebar-link {
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  color: #0b5d57;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background 0.15s, border-color 0.15s;
}
.sidebar-link:hover { background: #f0f7f6; }
.sidebar-link.active {
  font-weight: 700;
  border-left-color: #0b5d57;
  background: #e8f4f3;
}

/* ── Transitions ── */
.fade-backdrop-enter-active, .fade-backdrop-leave-active { transition: opacity 0.25s; }
.fade-backdrop-enter-from,   .fade-backdrop-leave-to     { opacity: 0; }

.slide-sidebar-enter-active, .slide-sidebar-leave-active { transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }
.slide-sidebar-enter-from,   .slide-sidebar-leave-to     { transform: translateX(100%); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .nav-inner { padding: 14px 20px; }
  .nav-links  { display: none; }
  .hamburger  { display: flex; }
}
</style>
