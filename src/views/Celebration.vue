<template>
  <div class="celebration-page">
    <!-- Header -->
    <header class="header">
      <span class="logo">ActiveAgeing</span>
    </header>

    <!-- Hero Section -->
    <main class="hero">
      <div class="hero-content">
        <!-- Badge -->
        <div class="badge">
          <span class="badge-icon">✦</span>
          SESSION COMPLETE
        </div>

        <!-- Heading -->
        <h1 class="heading">
          Well done! You've finished your session.
        </h1>

        <!-- Subtext -->
        <p class="subtext">
          Take a deep breath and acknowledge your progress.
          Every movement is a step toward a clearer, more vibrant you.
        </p>

        <!-- Social Proof -->
        <div class="social-proof">
          <div class="avatars">
            <img
              v-for="(avatar, i) in avatars"
              :key="i"
              :src="avatar"
              :alt="'User ' + (i + 1)"
              class="avatar"
            />
          </div>
          <div class="social-text">
            <strong>1,240 other Melburnians</strong> completed a session this week.<br />
            <span class="sub-label">You're part of the movement!</span>
          </div>
        </div>

        <!-- CTAs -->
        <div class="cta-group">
          <button class="btn btn-primary" @click="goToDashboard">
            Go to Dashboard <span class="arrow">→</span>
          </button>
          <button class="btn btn-secondary" @click="findEvents">
            Find Events <span class="calendar-icon">📅</span>
          </button>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="hero-image-wrap">
        <img
          src="../assets/myphoto.png"
          alt="Seniors doing yoga"
          class="hero-image"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-brand">ActiveAgeing</div>
      <nav class="footer-nav">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Contact Support</a>
      </nav>
      <p class="footer-copy">© 2024 ActiveAgeing Australia. Your journey to wellness, clarified.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'  
const router = useRouter()              

const avatars = ref([
  'https://i.pravatar.cc/40?img=47',
  'https://i.pravatar.cc/40?img=32',
  'https://i.pravatar.cc/40?img=15',
])

function goToDashboard() {
  router.push({ name: 'Results' })  
}

function findEvents() {
  router.push({ name: 'Events' })     
}
</script>

<style scoped>
/* ─── Reset & Base ─── */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.celebration-page {
  font-family: 'Georgia', 'Times New Roman', serif;
  background-color: #f5f3ef;
  color: #1a3a35;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ─── Header ─── */
.header {
  padding: 20px 48px;
}

.logo {
  font-family: 'Georgia', serif;
  font-size: 18px;
  font-weight: 700;
  color: #1a7a6a;
  letter-spacing: 0.02em;
}

/* ─── Hero ─── */
.hero {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  padding: 32px 48px 64px;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  flex: 1;
}

.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #fce8df;
  color: #b85c38;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 6px 14px;
  border-radius: 999px;
  width: fit-content;
  font-family: 'Helvetica Neue', sans-serif;
}

.badge-icon {
  font-size: 12px;
}

/* Heading */
.heading {
  font-family: 'Georgia', serif;
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 700;
  line-height: 1.15;
  color: #1a3a35;
}

/* Subtext */
.subtext {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 15px;
  line-height: 1.65;
  color: #4a6460;
  max-width: 380px;
}

/* Social Proof */
.social-proof {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border: 1px solid #e2ded8;
  border-radius: 12px;
  padding: 14px 18px;
  max-width: 420px;
}

.avatars {
  display: flex;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #f5f3ef;
  object-fit: cover;
  margin-left: -8px;
}

.avatar:first-child {
  margin-left: 0;
}

.social-text {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  color: #1a3a35;
  line-height: 1.5;
}

.social-text strong {
  color: #1a7a6a;
}

.sub-label {
  color: #7a9490;
  font-size: 12px;
}

/* CTAs */
.cta-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 8px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  width: fit-content;    
  flex-shrink: 0;        
}

.btn-primary {
  background-color: #1a5c50;
  color: #ffffff;
  border-color: #1a5c50;
}

.btn-primary:hover {
  background-color: #14483e;
  border-color: #14483e;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(26, 92, 80, 0.25);
}

.btn-secondary {
  background-color: #ffffff;
  color: #1a3a35;
  border-color: #c8c3bb;
}

.btn-secondary:hover {
  border-color: #1a5c50;
  color: #1a5c50;
  transform: translateY(-1px);
}

.arrow,
.calendar-icon {
  font-size: 14px;
}

/* Hero Image */
.hero-image-wrap {
  flex: 0 0 auto;
  width: 320px;
}

.hero-image {
  width: 100%;
  height: 340px;
  object-fit: cover;
  border-radius: 16px;
  display: block;
}

/* ─── Footer ─── */
.footer {
  margin-top: auto;
  background-color: #edeae4;
  padding: 40px 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.footer-brand {
  font-family: 'Georgia', serif;
  font-size: 15px;
  font-weight: 700;
  color: #1a7a6a;
}

.footer-nav {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-nav a {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  color: #4a6460;
  text-decoration: none;
  transition: color 0.15s;
}

.footer-nav a:hover {
  color: #1a5c50;
}

.footer-copy {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 12px;
  color: #7a9490;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    padding: 24px 24px 48px;
  }

  .hero-image-wrap {
    width: 100%;
  }

  .hero-image {
    height: 240px;
  }

  .header {
    padding: 16px 24px;
  }

  .footer {
    padding: 32px 24px;
  }
}
</style>