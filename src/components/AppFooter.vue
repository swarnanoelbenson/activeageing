<template>
  <footer class="app-footer">

    <!--
      FOOTER LOGO
      The brand name in teal — gives every page a consistent closing mark
      and reminds users which app they're in without needing a full header.
    -->
    <div class="footer-logo">ActiveAgeing</div>

    <!--
      FOOTER LINKS
      Two legal links — Privacy Policy and Terms of Service — that are
      required across all pages. Using router.push (not <a href>) keeps
      navigation in-app so the browser doesn't do a full page reload.
      The actual content of both pages is still a placeholder pending
      the legal review.
    -->
    <div class="footer-links">
      <a @click="router.push('/privacy')">Privacy Policy</a>
      <a @click="router.push('/terms')">Terms of Service</a>
    </div>

  </footer>
</template>

<script setup>
// Router imported so the template can call router.push() in the link click
// handlers — using push() instead of plain <a href> keeps navigation in-app
// and avoids a full browser reload.
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* ── Footer shell ─────────────────────────────────────────────────────────────
   margin-top: auto is what makes the footer stick to the bottom of short pages.
   It works because the parent page uses `display: flex; flex-direction: column`
   and the footer is the last child — auto margin pushes it to the end. */
.app-footer {
  background: #f0eeea;
  border-top: 1px solid #ddd;
  text-align: center;
  padding: 32px 48px 24px;
  font-family: 'Poppins', sans-serif;
  margin-top: auto;
}

.footer-logo {
  font-size: 20px;
  font-weight: 700;
  color: #0b5d57;
  margin-bottom: 12px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 10px;
}

.footer-links a {
  text-decoration: none;
  font-size: 20px;
  color: #555;
  font-weight: 500;
  cursor: pointer;
}

.footer-links a:hover { color: #0b5d57; }

/* ── Responsive ───────────────────────────────────────────────────────────
   Tighter padding and wrapping links on very small screens so the two link
   labels don't get squeezed into each other. */
@media (max-width: 480px) {
  .app-footer { padding: 24px 20px 20px; }
  .footer-links { gap: 16px; flex-wrap: wrap; }
}
</style>
