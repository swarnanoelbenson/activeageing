<template>
  <div class="page">
    <AppNavbar />

    <!--
      PRIVACY POLICY CONTENT
      This page is reserved for the full Privacy Policy text — what data the
      app collects, how it's stored, and users' rights. Linked from the footer
      so it's always reachable. No data collection logic exists yet, so the
      full copy will be written once that is finalised.
    -->
    <main class="main">
      <h1 class="title">Privacy Policy</h1>
      <p class="todo">To do &#8208; content coming soon.</p>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
// No logic needed — static placeholder until the Privacy Policy copy
// is finalised after legal review.
import AppNavbar from '../components/AppNavbar.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* ── Page shell ──────── flex-column so AppFooter anchors to the bottom
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
