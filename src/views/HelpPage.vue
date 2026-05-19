<template>
  <div class="page">
    <AppNavbar />

    <!--
      HELP PAGE CONTENT
      Placeholder for FAQs, how-to guides, and accessibility information.
      Linked from the footer so users can always find guidance without
      leaving the app. Full content is yet to be added.
    -->
    <main class="main">
      <h1 class="title">Help</h1>
      <p class="todo">To do &#8208; content coming soon.</p>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
// No script logic — this is a placeholder page. AppNavbar and AppFooter
// are included to maintain the consistent shell across all pages.
import AppNavbar from '../components/AppNavbar.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* ── Page shell ─────────────────────────────────────────────────────────────
   flex column keeps AppFooter at the bottom even on this short placeholder
   page. Content will replace the .todo paragraph once FAQs are written. */
.page { min-height: 100vh; background: #f4f1eb; font-family: 'Poppins', sans-serif; color: #1a2e2b; display: flex; flex-direction: column; }
.main { max-width: 1200px; margin: 0 auto; padding: 60px 40px; flex: 1; width: 100%; box-sizing: border-box; }
.title { font-size: 40px; font-weight: 700; color: #0f3d35; margin-bottom: 24px; }
.todo { font-size: 20px; color: #5a6b67; }
@media (max-width: 768px) {
  .main { max-width: 100%; margin: 0; padding: 32px 20px; }
  .title { font-size: 28px; }
}
</style>
