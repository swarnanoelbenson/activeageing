<template>
  <div class="page">
    <nav class="navbar">
      <div class="logo" @click="router.push('/')">ActiveAgeing</div>
      <div class="nav-links">
        <a class="nav-link" @click="router.push('/')">Home</a>
        <a class="nav-link" @click="router.push('/events')">Events</a>
      </div>
    </nav>

    <main class="main">
      <h1 class="title">It's okay to take a break.</h1>
      <p class="subtitle">
        You've already completed {{ progressPercent }}% of your session—<br />
        that's a fantastic effort!
      </p>

      <div class="progress-card">
        <div class="progress-label-row">
          <span class="progress-label-text">CURRENT PROGRESS</span>
          <span class="progress-pct">{{ progressPercent }}%</span>
        </div>
        <div class="track">
          <div class="fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" @click="resumeSession">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
          Resume Session
        </button>
        <button class="btn-ghost" @click="finishForToday">Finish for Today</button>
      </div>
    </main>

    <footer class="footer">
      <h3 class="footer-logo">ActiveAgeing</h3>
      <div class="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
      <p>© 2024 ActiveAgeing Australia. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()


const progressPercent = Number(route.query.progress ?? 65)

function resumeSession() {
  router.back()
}

function finishForToday() {
  router.push({ name: 'Results' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.page { min-height: 100vh; background: #f4f1eb; font-family: 'Poppins', sans-serif; color: #1a2e2b; display: flex; flex-direction: column; overflow-x: hidden; width: 100%; box-sizing: border-box; }

.navbar { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; width: 100%; padding: 20px 40px; }
.logo { font-weight: 700; font-size: 20px; color: #0b5d57; cursor: pointer; }
.nav-links { display: flex; gap: 32px; font-size: 16px; font-weight: 500; }
.nav-link { color: #0b5d57; text-decoration: none; cursor: pointer; }

.main { flex: 1; max-width: 680px; margin: 0 auto; width: 100%; padding: 60px 40px; }

.title { font-size: 42px; font-weight: 700; color: #0b5d57; line-height: 1.2; margin: 0 0 16px; }
.subtitle { font-size: 15px; color: #5a6b67; line-height: 1.65; margin: 0 0 40px; }

.progress-card { background: #ffffff; border-radius: 16px; padding: 24px 28px; margin-bottom: 36px; }
.progress-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.progress-label-text { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; color: #5a6b67; text-transform: uppercase; }
.progress-pct { font-size: 22px; font-weight: 700; color: #c85f1a; }
.track { height: 10px; background: #e0dbd3; border-radius: 99px; overflow: hidden; }
.fill { height: 100%; background: #0b5d57; border-radius: 99px; transition: width 0.6s ease; }

.actions { display: flex; align-items: center; gap: 24px; }
.btn-primary { background: #0b5d57; color: #ffffff; border: none; border-radius: 12px; padding: 14px 28px; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.btn-ghost { background: none; border: none; font-size: 15px; font-weight: 600; color: #1a2e2b; cursor: pointer; }

.footer { text-align: center; padding: 40px 0; color: #555; }
.footer-logo { color: #0b5d57; margin-bottom: 12px; }
.footer-links { display: flex; justify-content: center; gap: 20px; margin-bottom: 12px; }
.footer-links a { color: #555; text-decoration: none; }

@media (max-width: 768px) {
  .navbar { max-width: 100%; margin: 0; padding: 16px 20px; box-sizing: border-box; width: 100%; }
  .logo { font-size: 18px; }
  .nav-links { gap: 20px; font-size: 14px; }
  .main { max-width: 100%; margin: 0; padding: 32px 20px; box-sizing: border-box; width: 100%; }
  .title { font-size: 28px; }
  .subtitle { font-size: 14px; }
  .actions { flex-direction: column; align-items: stretch; }
  .btn-primary { justify-content: center; }
}
</style>