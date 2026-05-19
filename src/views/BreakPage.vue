<template>
  <div class="page">
    <AppNavbar />

    <!--
      BREAK PAGE
      Shown when a user exits mid-session rather than completing it.
      The tone here is deliberately encouraging — the headline reassures
      them it's fine to stop, and the subtitle reminds them how much they
      already achieved so they leave feeling good rather than guilty.
    -->
    <main class="main">
      <h1 class="title">It's okay to take a break.</h1>
      <p class="subtitle">
        You've already completed {{ progressPercent }}% of your session&#8208;<br />
        that's a fantastic effort!
      </p>

      <!--
        PROGRESS CARD
        A white card that shows a labelled progress bar so the user can see
        exactly what percentage of their session they finished. The percentage
        is passed in from the exercise session page via the URL, so it always
        reflects their actual progress.
      -->
      <div class="progress-card">
        <div class="progress-label-row">
          <span class="progress-label-text">CURRENT PROGRESS</span>
          <span class="progress-pct">{{ progressPercent }}%</span>
        </div>
        <div class="track">
          <div class="fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <!--
        ACTION BUTTONS
        Two choices — "Resume Session" takes the user back to where they left
        off, and "Finish for Today" ends the session gracefully and navigates
        to the Results page so they can still see a summary of what they did.
      -->
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

    <AppFooter />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const route = useRoute()

// ExerciseSession.vue passes the session completion percentage as ?progress=N.
// 65 is the fallback if the user lands here without a proper handoff.
const progressPercent = Number(route.query.progress ?? 65)

// router.back() returns to ExerciseSession.vue, which resumes from wherever
// the user was — the session state is still alive in that component.
function resumeSession() {
  router.back()
}

function finishForToday() {
  router.push({ name: 'Results' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* ── Page shell ────────────────────────────────────────────────────────────
   flex column so AppFooter sticks to the bottom on this typically short page. */
.page { min-height: 100vh; background: #f4f1eb; font-family: 'Poppins', sans-serif; color: #1a2e2b; display: flex; flex-direction: column; overflow-x: hidden; width: 100%; box-sizing: border-box; }

.navbar { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; width: 100%; padding: 20px 40px; }
.logo { font-weight: 700; font-size: 20px; color: #0b5d57; cursor: pointer; }
.nav-links { display: flex; gap: 32px; font-size: 20px; font-weight: 500; }
.nav-link { color: #0b5d57; text-decoration: none; cursor: pointer; }

.main { flex: 1; max-width: 680px; margin: 0 auto; width: 100%; padding: 60px 40px; }

.title { font-size: 42px; font-weight: 700; color: #0b5d57; line-height: 1.2; margin: 0 0 16px; }
.subtitle { font-size: 20px; color: #5a6b67; line-height: 1.65; margin: 0 0 40px; }

/* ── Progress bar ──────────────────────────────────────────────────────────
   Progress pct label is orange (#c85f1a) to stand out warmly without alarm.
   The track fills with teal (#0b5d57) matching the brand's primary colour. */
.progress-card { background: #ffffff; border-radius: 16px; padding: 24px 28px; margin-bottom: 36px; }
.progress-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.progress-label-text { font-size: 20px; font-weight: 600; letter-spacing: 0.1em; color: #5a6b67; text-transform: uppercase; }
.progress-pct { font-size: 22px; font-weight: 700; color: #c85f1a; }
.track { height: 10px; background: #e0dbd3; border-radius: 99px; overflow: hidden; }
.fill { height: 100%; background: #0b5d57; border-radius: 99px; transition: width 0.6s ease; }

.actions { display: flex; align-items: center; gap: 24px; }
.btn-primary { background: #0b5d57; color: #ffffff; border: none; border-radius: 12px; padding: 14px 28px; font-size: 20px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.btn-ghost { background: none; border: none; font-size: 20px; font-weight: 600; color: #1a2e2b; cursor: pointer; }


/* ── Responsive ────────────────────────────────────────────────────────────
   On mobile the action buttons stack vertically so each fills the full width
   rather than sitting side-by-side on a small screen. */
@media (max-width: 768px) {
  .navbar { max-width: 100%; margin: 0; padding: 16px 20px; box-sizing: border-box; width: 100%; }
  .logo { font-size: 20px; }
  .nav-links { gap: 20px; font-size: 20px; }
  .main { max-width: 100%; margin: 0; padding: 32px 20px; box-sizing: border-box; width: 100%; }
  .title { font-size: 28px; }
  .subtitle { font-size: 20px; }
  .actions { flex-direction: column; align-items: stretch; }
  .btn-primary { justify-content: center; }
}
</style>