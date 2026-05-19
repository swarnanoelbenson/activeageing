<template>
  <div class="celebration-page">
    <!--
      PAGE HEADER
      A minimal top bar showing only the ActiveAgeing logo — no navigation.
      The session is over so there's nothing to navigate away to, and keeping
      the header clean puts all the focus on the celebration moment itself.
    -->
    <header class="header">
      <span class="logo">ActiveAgeing</span>
    </header>

    <!--
      CELEBRATION HERO
      The heart of the page. It confirms the session is complete with an
      encouraging headline and a short motivational line underneath.
      The social proof row ("1,240 other Melburnians completed a session this
      week") is shown with real-looking avatars to give the user a sense that
      they're part of something bigger than themselves.
    -->
    <main class="hero">
      <div class="hero-content">
        <!-- Small "SESSION COMPLETE" pill badge that sits above the headline -->
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

        <!--
          ACTION BUTTONS
          Two options after finishing: go to the main dashboard (Home), or
          jump straight to finding upcoming events to keep the momentum going.
        -->
        <div class="cta-group">
          <button class="btn btn-primary" @click="goToDashboard">
            Go to Dashboard <span class="arrow">→</span>
          </button>
          <button class="btn btn-secondary" @click="findEvents">
            Find Events <span class="calendar-icon">📅</span>
          </button>
        </div>
      </div>

      <!--
        HERO IMAGE
        A photo of seniors doing yoga sits on the right side of the hero to
        reinforce the positive, active feeling of the page without adding any
        extra text or pressure.
      -->
      <div class="hero-image-wrap">
        <img
          src="../assets/myphoto.png"
          alt="Seniors doing yoga"
          class="hero-image"
        />
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppFooter from '../components/AppFooter.vue'
const router = useRouter()

// pravatar.cc serves consistent placeholder faces keyed by img number.
// Using fixed img IDs means the same three faces appear every time rather
// than random photos that could change between renders.
const avatars = ref([
  'https://i.pravatar.cc/40?img=47',
  'https://i.pravatar.cc/40?img=32',
  'https://i.pravatar.cc/40?img=15',
])

// "Dashboard" maps to the Results page — the wellness snapshot is the
// closest thing to a personal dashboard in the current information architecture.
function goToDashboard() {
  router.push({ name: 'Results' })
}

function findEvents() {
  router.push({ name: 'Events' })
}
</script>

<style scoped>
/* ─── Reset & Base ────────────────────────────────────────────────────────
   Global box-sizing reset scoped to this component. flex column layout so
   AppFooter sticks to the bottom even when hero content is short. */
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

/* ─── Header ──────────────────────────────────────────────────────────────
   Minimal header with only the logo — no full AppNavbar — to keep the user
   focused on the celebration moment rather than navigating away immediately. */
.header {
  padding: 20px 48px;
}

.logo {
  font-family: 'Georgia', serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a7a6a;
  letter-spacing: 0.02em;
}

/* ─── Hero ────────────────────────────────────────────────────────────────
   Two-column flex layout: content left, image right. flex: 1 on hero-content
   lets it fill available width while the photo has a fixed 320px column.
   On mobile (<768px), these stack vertically. */
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
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 6px 14px;
  border-radius: 999px;
  width: fit-content;
  font-family: 'Helvetica Neue', sans-serif;
}

.badge-icon {
  font-size: 20px;
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
  font-size: 20px;
  line-height: 1.65;
  color: #4a6460;
  max-width: 380px;
}

/* Social proof ────────────────────────────────────────────────────────────
   Overlapping avatar images (negative margin-left) give the impression of
   a crowd, reinforcing that the user is part of a larger community. */
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
  font-size: 20px;
  color: #1a3a35;
  line-height: 1.5;
}

.social-text strong {
  color: #1a7a6a;
}

.sub-label {
  color: #7a9490;
  font-size: 20px;
}

/* CTAs ────────────────────────────────────────────────────────────────────
   Primary (teal) and secondary (white/outline) button pair. translateY(-1px)
   on hover gives a subtle lift without shifting layout. */
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
  font-size: 20px;
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
  font-size: 20px;
}

/* Hero image ──────────────────────────────────────────────────────────────
   Fixed 320px column that shrinks to full-width on mobile. object-fit: cover
   with a fixed height keeps the aspect ratio consistent across screen sizes. */
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


/* ─── Responsive ──────────────────────────────────────────────────────────
   On mobile the two-column hero stacks vertically and the hero image
   shrinks in height so the content above stays accessible without scrolling. */
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

}
</style>