<template>
  <div class="page">
    <AppNavbar />

    <main class="main">
      <h1 class="title">Help</h1>
      <p class="todo">To do — content coming soon.</p>
    </main>

    <footer class="footer">
      <div class="footer-logo">ActiveAgeing</div>
      <div class="footer-links">
        <a @click="router.push('/terms')">Terms of Service</a>
        <a @click="router.push('/privacy')">Privacy Policy</a>
        <a @click="router.push('/contact')">Contact Support</a>
      </div>
      <p class="footer-copy">© 2024 ActiveAgeing Australia.</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
const router = useRouter()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
.page { min-height: 100vh; background: #f4f1eb; font-family: 'Poppins', sans-serif; color: #1a2e2b; display: flex; flex-direction: column; }
.nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 20px 40px; width: 100%; box-sizing: border-box; }
.logo { font-weight: 700; font-size: 20px; color: #0b5d57; cursor: pointer; }
.nav-links { display: flex; gap: 32px; font-size: 16px; font-weight: 500; }
.nav-link { color: #0b5d57; text-decoration: none; cursor: pointer; }
.nav-link.active { text-decoration: underline; text-underline-offset: 4px; }
.nav-link.active { color: #1a5c52; text-decoration: underline; text-underline-offset: 3px; }
.main { max-width: 1200px; margin: 0 auto; padding: 60px 40px; flex: 1; width: 100%; box-sizing: border-box; }
.title { font-size: 40px; font-weight: 700; color: #0f3d35; margin-bottom: 24px; }
.todo { font-size: 16px; color: #5a6b67; }
.footer { border-top: 1px solid #ddd; text-align: center; padding: 32px 48px 24px; }
.footer-logo { font-size: 16px; font-weight: 700; color: #0b5d57; margin-bottom: 12px; }
.footer-links { display: flex; justify-content: center; gap: 24px; margin-bottom: 10px; }
.footer-links a { font-size: 13px; color: #555; font-weight: 500; cursor: pointer; }
.footer-links a:hover { color: #0b5d57; }
.footer-copy { font-size: 12px; color: #888; }
@media (max-width: 768px) {
  .page { overflow-x: hidden; width: 100%; }
  .nav { max-width: 100%; margin: 0; padding: 16px 20px; }
  .logo { font-size: 18px; }
  .nav-links { gap: 20px; font-size: 14px; }
  .main { max-width: 100%; margin: 0; padding: 32px 20px; }
  .title { font-size: 28px; }
}
</style>
