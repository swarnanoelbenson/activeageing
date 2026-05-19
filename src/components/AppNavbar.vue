<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

// `active` is a string key (e.g. 'home', 'events') passed by each page so the
// correct nav link gets the underline style. Defaults to '' (nothing active).
const props = defineProps({
  active: {
    type: String,
    default: ''
  }
})

const router   = useRouter()
const sideOpen = ref(false)  // controls mobile sidebar open/closed state
const navEl    = ref(null)   // ref to the <nav> element for height measurement
let   ro       = null        // ResizeObserver instance — disconnected on unmount

// Writes the navbar's current pixel height to the CSS custom property --navbar-h.
// Every page that has content directly below the fixed navbar uses this value
// (via `padding-top: var(--navbar-h)`) so nothing gets hidden behind the bar.
// A ResizeObserver keeps it accurate when the navbar height changes (e.g. text
// wraps on a narrow screen or the browser font size is changed for accessibility).
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

// Closes the sidebar before navigating so it doesn't stay open on the next page.
function navigate(path) {
  sideOpen.value = false
  router.push(path)
}
</script>

<template>
  <nav class="nav" ref="navEl">
    <div class="nav-inner">
      <div class="logo" @click="navigate('/')">ActiveAgeing</div>

      <!--
        DESKTOP NAV LINKS
        Six links rendered as spans so they behave consistently across
        browsers without default button/anchor styling. The `active` prop
        passed from each page highlights the current section with an
        underline. Hidden on mobile — the hamburger takes over instead.
      -->
      <div class="nav-links">
        <span class="nav-link" :class="{ active: active === 'home' }"      @click="navigate('/')">Home</span>
        <span class="nav-link" :class="{ active: active === 'checkin' }"   @click="navigate('/survey')">Check-In</span>
        <span class="nav-link" :class="{ active: active === 'exercises' }" @click="navigate('/exercises')">All Exercises</span>
        <span class="nav-link" :class="{ active: active === 'events' }"    @click="navigate('/events')">Events</span>
        <span class="nav-link" :class="{ active: active === 'routeplan' }" @click="navigate('/routesurvey')">Plan Route</span>
        <span class="nav-link" :class="{ active: active === 'snapshot' }"  @click="navigate('/results')">My Snapshot</span>
      </div>

      <!--
        HAMBURGER BUTTON (mobile only)
        Three-bar icon that animates into an X when the sidebar is open —
        the top bar rotates 45°, the middle fades out, the bottom rotates
        -45°. Shown only on screens ≤768px via CSS; invisible on desktop.
      -->
      <button class="hamburger" :class="{ open: sideOpen }" @click="sideOpen = !sideOpen" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!--
      MOBILE SIDEBAR BACKDROP
      A semi-transparent dark overlay that sits behind the sidebar panel.
      Clicking it closes the sidebar — same behaviour as tapping outside a
      modal. Fades in/out with a 0.25s transition so it doesn't feel jarring.
    -->
    <Transition name="fade-backdrop">
      <div v-if="sideOpen" class="sidebar-backdrop" @click="sideOpen = false"></div>
    </Transition>

    <!--
      MOBILE SIDEBAR PANEL
      Slides in from the right at 72vw width (capped at 300px). Contains
      the same six links as the desktop nav but stacked vertically, with a
      left-border accent on the active item. The `navigate()` helper closes
      the sidebar before pushing the route so it doesn't stay open mid-
      transition.
    -->
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

/* ── Nav bar shell ────────────────────────────────────────────────────────────
   Fixed at the top so it stays visible while the page scrolls. z-index: 100
   sits above page content but below the sidebar (300) and backdrop (200).
   env(safe-area-inset-top) pushes the bar down on notched phones (iPhone X+)
   so content isn't clipped by the device status bar. */
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

/* ── Desktop links ─────────────────────────────────────────────────────────
   font-size: 20px is larger than typical nav to serve older users who may
   have lower vision. Gap of 28px keeps links breathable without crowding
   on a 1200px container. Hidden entirely on mobile — hamburger takes over. */
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

/* ── Hamburger ────────────────────────────────────────────────────────────
   Hidden on desktop (display: none), shown on mobile via the media query
   below. The three <span> bars animate into an X via CSS transforms when
   `.open` is applied — no JS animation needed. */
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

/* ── Sidebar backdrop ─────────────────────────────────────────────────────
   Full-screen dark overlay behind the sidebar panel. z-index: 200 puts it
   above page content (100) but below the sidebar panel (300). Clicking it
   closes the sidebar — standard "tap outside to dismiss" pattern. */
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 200;
}

/* ── Sidebar panel ────────────────────────────────────────────────────────
   72vw wide (max 300px) so it reveals enough of the underlying page that
   users know they can tap the backdrop to close. z-index: 300 sits above
   the backdrop. Box-shadow gives depth without a hard border. */
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
  font-size: 20px;
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
  font-size: 20px;
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

/* ── Transitions ──────────────────────────────────────────────────────────
   `fade-backdrop` fades the overlay in/out so it doesn't pop abruptly.
   `slide-sidebar` translates the panel in from the right — cubic-bezier
   chosen for a smooth deceleration that feels native on mobile. */
.fade-backdrop-enter-active, .fade-backdrop-leave-active { transition: opacity 0.25s; }
.fade-backdrop-enter-from,   .fade-backdrop-leave-to     { opacity: 0; }

.slide-sidebar-enter-active, .slide-sidebar-leave-active { transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }
.slide-sidebar-enter-from,   .slide-sidebar-leave-to     { transform: translateX(100%); }

/* ── Responsive ───────────────────────────────────────────────────────────
   At 768px and below, desktop links are hidden and the hamburger is shown.
   Nav inner padding shrinks so the logo and hamburger don't feel cramped. */
@media (max-width: 768px) {
  .nav-inner { padding: 14px 20px; }
  .nav-links  { display: none; }
  .hamburger  { display: flex; }
}
</style>
