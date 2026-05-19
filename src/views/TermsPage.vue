<template>
  <div class="page">
    <AppNavbar />

    <!--
      TERMS & CONDITIONS CONTENT
      Placeholder for the app's Terms of Service — acceptable use, liability
      disclaimers, and any health/medical disclaimers relevant to exercise
      guidance. Like the Privacy page, this is linked from the footer and will
      be written once the legal review is complete.
    -->
    <main class="main">
      <h1 class="title">Terms &amp; Conditions</h1>
      <p class="todo">To do &#8208; content coming soon.</p>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
// No logic needed — static placeholder until Terms & Conditions copy
// is written once health/liability disclaimer wording is approved.
import AppNavbar from '../components/AppNavbar.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* ── Page shell ──────── flex-column so AppFooter sticks to the bottom
   even when the placeholder content is just two lines. */
.page { min-height: 100vh; background: #f4f1eb; font-family: 'Poppins', sans-serif; color: #1a2e2b; display: flex; flex-direction: column; }

/* ── Content area ──────── flex: 1 fills all height above the footer */
.main { max-width: 1200px; margin: 0 auto; padding: 60px 40px; flex: 1; width: 100%; box-sizing: border-box; }
.title { font-size: 40px; font-weight: 700; color: #0f3d35; margin-bottom: 24px; }
.todo { font-size: 20px; color: #5a6b67; }

/* ── Responsive ──────── full-width padding on mobile */
@media (max-width: 768px) {
  .main { max-width: 100%; margin: 0; padding: 32px 20px; }
  .title { font-size: 28px; }
}
</style>
