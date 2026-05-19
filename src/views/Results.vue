<template>
  <div class="page">
    <!-- NAV -->
    <AppNavbar active="snapshot" />

    <!-- MAIN -->
    <main class="main">

      <!--
        PAGE HEADER
        Title and encouraging subtitle shown at the top of the results. Fades
        in on mount via the `visible` class so the page feels like it's
        revealing itself rather than just loading.
      -->
      <div class="header" :class="{ visible }">
        <h1 class="title">
          Your Wellness<br />Snapshot Results
        </h1>
        <p class="subtitle">
          Small, consistent steps can help you feel more energetic, 
          stronger, and more like your best self each day.
        </p>
      </div>

      <!-- RANDOM FACT -->
      <!-- <div v-if="randomFact" class="fact-box" :class="{ visible }" style="transition-delay: 80ms;">
        <span class="fact-icon">💡</span>
        <p class="fact-text">{{ randomFact }}</p>
      </div> -->

      <!--
        EMPTY STATE — NO SURVEY RESULT YET
        Shown when the user arrives on this page without having completed the
        check-in survey. Rather than just saying "no data", it walks them
        through the three steps of the process and gives them a clear CTA to
        start. This is the most common entry path for first-time visitors.
      -->
      <div v-if="!surveyResult" class="checkin-empty" :class="{ visible }" style="transition-delay: 150ms;">
        <div class="checkin-empty-icon">📋</div>
        <h2 class="checkin-empty-title">No snapshot yet</h2>
        <p class="checkin-empty-desc">
          Take a quick 5-minute check-in to see how you're tracking against the Australian benchmark
          for adults 65 and over. You'll get a personalised wellness category and exercise suggestions.
        </p>
        <div class="checkin-empty-steps">
          <div class="checkin-step">
            <div class="checkin-step-num">1</div>
            <span>Answer a few questions about your activity, sleep, and wellbeing</span>
          </div>
          <div class="checkin-step">
            <div class="checkin-step-num">2</div>
            <span>Get your wellness category scored against the 65+ benchmark</span>
          </div>
          <div class="checkin-step">
            <div class="checkin-step-num">3</div>
            <span>See personalised exercises and events matched to your level</span>
          </div>
        </div>
        <button class="btn-checkin" @click="router.push('/survey')">Start Check-in →</button>
      </div>

      <!--
        TWO-COLUMN RESULTS GRID — shown once a survey result exists
        Left column: the circular activity chart comparing the user's score to
        the Australian 65+ benchmark. Right column: their wellness category
        card (colour-coded by result) plus three action buttons — exercise
        session, events, and walking route — so users have an immediate next
        step without needing to navigate anywhere.
      -->
      <div v-else class="grid" :class="{ visible }" style="transition-delay: 150ms;">

        <!-- LEFT: Activity Comparison -->
        <div class="card card-light">
          <h3 class="card-title">Activity Comparison</h3>
          <p class="card-desc">
            Your current movement compared to the uplifting activity levels enjoyed by many Australians aged 65 and over.

          </p>

          <!-- Session completed badge -->
          <div v-if="sessionJustCompleted" class="points-badge">+{{ sessionPointsEarned }} points</div>

          <!-- Circle Chart -->
          <div class="chart-wrap">
            <svg height="200" width="200" class="chart-svg">
              <circle stroke="#d5cfc4" fill="transparent" stroke-width="12"
                :r="normalizedRadius" cx="100" cy="100" />
              <circle stroke="#e8824a" fill="transparent" stroke-width="2"
                stroke-dasharray="4 4" :r="normalizedRadius - 18" cx="100" cy="100" />
              <circle
                :stroke="catColor" fill="transparent" stroke-width="12"
                stroke-linecap="round"
                :stroke-dasharray="`${circumference} ${circumference}`"
                :stroke-dashoffset="offset"
                :r="normalizedRadius" cx="100" cy="100"
                class="progress-arc"
              />
            </svg>
            <div class="chart-label">
              <span class="chart-percent">{{ chartReady ? chartPercent + '%' : '0%' }}</span>
              <span class="chart-sub">Active</span>
            </div>
          </div>

          <!-- Legend -->
          <div class="legend">
            <span class="legend-item">
              <span class="dot" :style="{ background: catColor }"></span>Your Level
            </span>
            <span class="legend-item">
              <span class="dot dot-orange"></span>AU Benchmark (65+)
            </span>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="right-col">

          <!-- Building Momentum -->
          <div class="card card-dark" :style="{ background: catColor }">
            <div class="status-row">
              <span class="status-icon">🚀</span>
              <span class="status-label">Current Status</span>
            </div>
            <h2 class="momentum-title">{{ momentumLabel }}</h2>
            <p class="momentum-desc">{{ momentumDesc }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="card card-white action-card">
            <div class="action-btn action-btn-dark" @click="showExerciseModal = true">
              <span class="action-btn-icon">✦</span>
              <span class="action-btn-label">Guided Exercise Session</span>
              <span class="action-btn-arrow">→</span>
            </div>
            <div class="action-btn action-btn-light" @click="router.push('/events?tab=personalized')">
              <span class="action-btn-icon">📅</span>
              <span class="action-btn-label action-btn-label-dark">Explore Events</span>
              <span class="action-btn-arrow action-btn-arrow-dark">→</span>
            </div>
            <div class="action-btn action-btn-light" @click="router.push('/routesurvey')">
              <span class="action-btn-icon">🗺️</span>
              <span class="action-btn-label action-btn-label-dark">Plan a Walk</span>
              <span class="action-btn-arrow action-btn-arrow-dark">→</span>
            </div>
          </div>

        </div>
      </div>

      <!--
        YOUR ASSESSMENT ANSWERS SUMMARY
        Shown below the results grid as a gentle recap of what the user
        answered. Displayed as small pill-shaped chips — one per question —
        so users can quickly verify their answers without re-reading a wall
        of text. Hidden entirely if there are no saved answers.
      -->
      <div v-if="surveyResult && answeredSummary.length > 0" class="next-steps" :class="{ visible }" style="transition-delay: 450ms; margin-top: 40px;">
        <h2 class="section-title">Your Assessment Answers</h2>
        <div class="answers-summary">
          <div v-for="item in answeredSummary" :key="item.q" class="summary-item">
            <div class="summary-top"><span class="summary-q">{{ item.q }}</span> <span class="summary-label">{{ item.label }}</span></div>
            <span class="summary-answer">{{ item.answer }}</span>
          </div>
        </div>
      </div>

    </main>

    <!--
      EXERCISE SESSION START MODAL
      Appears when the user clicks "Guided Exercise Session" from the action
      buttons. Acts as a heads-up so they can get into position before the
      session begins — tells them it's a follow-along session and asks them
      to find a comfortable space. Clicking outside or the button both
      navigate to /exercise.
    -->
    <div v-if="showExerciseModal" class="modal-overlay" @click.self="showExerciseModal = false">
      <div class="exercise-modal">
        <div class="exercise-modal-play" @click="showExerciseModal = false; router.push('/exercise')">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <polygon points="12,8 30,18 12,28" fill="#ffffff"/>
          </svg>
        </div>
        <h2 class="exercise-modal-title">This is a follow-along session</h2>
        <p class="exercise-modal-desc">Please find a comfortable space and prepare to move with the instructions.</p>
        <button class="exercise-modal-btn" @click="showExerciseModal = false; router.push('/exercise')">
          I'm Ready, Let's Start →
        </button>
      </div>
    </div>

    <AppFooter />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const showExerciseModal = ref(false)

// ── Motivational facts (unused) ──
// These were shown in a fact-box that is currently commented out in the
// template. Kept here in case the feature is reinstated.
const facts = [
  '"Every step counts!" - Telling us your routine helps us build a plan that fits your life, not someone else\'s.',
  '"You\'re not alone!" - Understanding your activity helps us recommend exercises that are safe and right for you.',
  '"Progress, not perfection!" - Knowing your stamina ensures we set goals that challenge without overwhelming.',
  '"You\'re doing great!" - This helps us curate exercises that honour your body\'s current needs.',
  '"Keep going!" - Your energy profile helps us schedule activity at the right intensity for you.',
]

// Maps raw answer index → human-readable question label for the summary row
const questionLabels = ['Physical Activity', 'Active Sessions', 'Inactive During Day', 'Sleep', 'How You Feel on Waking']

// ── Animation gates ──
// `visible` triggers the CSS translateY fade-in on mount (80ms delay so the
// browser has painted before the transition starts).
// `chartReady` is set 400ms later so the SVG arc animates after the card
// is already visible, drawing attention to the percentage change.
const visible = ref(false)
const chartReady = ref(false)
const surveyAnswers = ref(null)
const surveyResult = ref(null)
const randomFact = ref('')

// `sessionCompleted` is written by ExerciseSession when a session finishes,
// then read-and-removed here so the badge only shows once per completion.
const sessionJustCompleted = ref(false)
const sessionPointsEarned = ref(0)

const answeredSummary = computed(() =>
  (surveyAnswers.value ?? []).map((ans, i) => ({
    q: `Q${i + 1}.`,
    label: questionLabels[i],
    answer: ans,
  }))
)

// ── SVG circle chart geometry ──
// Fixed radius/stroke constants so the SVG viewBox dimensions (200×200) can
// be set in the template without any reactive recalculation.
const radius = 80
const stroke = 12
const normalizedRadius = radius - stroke / 2
const circumference = normalizedRadius * 2 * Math.PI

const chartPercent = computed(() => surveyResult.value?.chartPercent ?? 75)

// ── Category display maps ──
// Keyed by `categoryName` string from the backend response.
// Three separate maps (label / desc / color) so each concern can be
// extended independently without touching the others.
const categoryLabelMap = {
  'Just Getting Started': 'Just Getting Started',
  'Building Momentum':    'Building Momentum',
  'Thriving':             'Thriving',
}
const categoryDescMap = {
  'Just Getting Started': 'Every journey starts with a single step. Small, consistent movements will build your strength and confidence over time.',
  'Building Momentum':    'You\'re on the right path! Your consistent activity level is laying the groundwork for improved long-term mobility and energy.',
  'Thriving':             'Excellent work! Your active lifestyle is a powerful foundation for sustained health and vitality.',
}
const catColorMap = {
  'Just Getting Started': '#e53e3e',
  'Building Momentum':    '#e8824a',
  'Thriving':             '#1a5c52',
}

// Fallback chain: prefer new `categoryName` field → legacy `category.label`
// → hardcoded default, so old-format cached results still render correctly.
const momentumLabel = computed(() => categoryLabelMap[surveyResult.value?.categoryName] ?? surveyResult.value?.category?.label ?? 'Building Momentum')
const momentumDesc  = computed(() => categoryDescMap[surveyResult.value?.categoryName]  ?? surveyResult.value?.category?.description ?? 'You\'re on the right path!')
const catColor      = computed(() => catColorMap[surveyResult.value?.categoryName] ?? '#1a5c52')

// `offset` drives stroke-dashoffset on the SVG arc; guarded by `chartReady`
// so the arc starts at 0% and animates to the real value rather than jumping.
const offset = computed(() => {
  return circumference - (chartReady.value ? chartPercent.value / 100 : 0) * circumference
})

onMounted(() => {
  // Staggered delays: card fade-in at 80ms, arc animation at 400ms so the
  // chart draws attention after the layout has settled.
  setTimeout(() => { visible.value = true }, 80)
  setTimeout(() => { chartReady.value = true }, 400)

  const cached = localStorage.getItem('surveyAnswers')
  if (cached) surveyAnswers.value = JSON.parse(cached)

  const result = localStorage.getItem('surveyResult')
  if (result) surveyResult.value = JSON.parse(result)

  // Read-once pattern: remove the key immediately so the points badge only
  // appears on the first visit after a session, not on every subsequent load.
  const pts = localStorage.getItem('sessionCompleted')
  if (pts) {
    sessionJustCompleted.value = true
    sessionPointsEarned.value = parseInt(pts) || 0
    localStorage.removeItem('sessionCompleted')
  }

  randomFact.value = facts[Math.floor(Math.random() * facts.length)]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.page {
  min-height: 100vh;
  background: #f4f1eb;
  font-family: 'Poppins', 'Arial', sans-serif;
  color: #1a2e2b;
}

/* ── Main ──────── calc(var(--navbar-h)) clears the fixed navbar; 80px
   bottom padding gives AppFooter breathing room. */
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: calc(var(--navbar-h, 70px) + 16px) 40px 80px;
}

/* ── Fact box ──────── currently commented out in the template; styles
   kept so reinserting the element requires no CSS changes. */
.fact-box {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #e8f4f3;
  border-left: 4px solid #0b5d57;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fact-box.visible { opacity: 1; transform: translateY(0); }
.fact-icon { font-size: 20px; flex-shrink: 0; }
.fact-text { font-size: 20px; color: #1a5c52; font-style: italic; line-height: 1.5; margin: 0; }

/* ── Header ──────── starts invisible (opacity 0, translateY 18px) and
   transitions to visible on mount via the `visible` class, giving the
   page a gentle reveal rather than an abrupt load. */
.header {
  margin-bottom: 36px;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.header.visible {
  opacity: 1;
  transform: translateY(0);
}
.title {
  font-size: clamp(24px, 4vw, 38px);
  font-weight: 700;
  color: #0f3d35;
  line-height: 1.1;
  margin-bottom: 16px;
}
.subtitle {
  font-size: 20px;
  color: #5a6b67;
  line-height: 1.65;
  max-width: 80%;
}

/* ── Results grid ──────── two-column layout: activity chart left,
   category + action buttons right; same fade-in transition as the header
   but with a 150ms delay so cards appear after the title. */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.grid.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Cards ──────── three variants: light (activity chart bg), dark (dynamic
   category colour from catColor computed), white (action buttons). Hover
   transitions are disabled on cards that aren't interactive. */
.card {
  border-radius: 20px;
  padding: 28px 24px;
}
.card-light { background: #ede9e1; cursor: default; }
.card-light:hover, .card-dark:hover { transform: none; box-shadow: none; }
.card-dark {
  background: #1a5c52;
  position: relative;
  overflow: visible;
  text-align: left;
  flex: 1;
  padding: 24px;
}
.card-dark::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 5px;
  border-radius: 20px 0 0 20px;
}
.card-white {
  background: #ffffff;
  text-align: left;
  flex: 2;
}
.card-title {
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 6px;
}
.card-desc {
  font-size: 20px;
  color: #5a6b67;
  margin-bottom: 28px;
  line-height: 1.5;
}

/* ── Empty state ──────── shown when no survey result exists in localStorage;
   walks the user through the three-step process so they know what to
   expect before clicking Start — reduces bounce from uncertainty. */
.checkin-empty {
  max-width: 560px;
  margin: 0 auto 48px;
  background: #f9f7f3;
  border-radius: 24px;
  padding: 48px 40px;
  text-align: center;
  border: 1.5px solid #e4dfd5;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.checkin-empty.visible { opacity: 1; transform: translateY(0); }

.checkin-empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
}
.checkin-empty-title {
  font-size: 26px;
  font-weight: 700;
  color: #0f3d35;
  margin-bottom: 14px;
}
.checkin-empty-desc {
  font-size: 20px;
  color: #5a6b67;
  line-height: 1.7;
  margin-bottom: 28px;
}
.checkin-empty-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
  margin-bottom: 32px;
}
.checkin-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 20px;
  color: #3a5a55;
  font-weight: 500;
  line-height: 1.5;
}
.checkin-step-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #e0ede9;
  color: #0b5d57;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.btn-checkin {
  background: #0b5d57;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 15px 36px;
  font-family: inherit;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-checkin:hover { background: #0f3d35; transform: translateY(-1px); }

/* ── Session points badge ──────── appears only after completing an exercise
   session; pop-in keyframe uses spring cubic-bezier so it bounces in
   rather than linearly fading, making the reward feel more satisfying. */
.points-badge {
  display: inline-block;
  background: #e6f9ec;
  color: #1a8a40;
  font-size: 20px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 20px;
  border: 1.5px solid #a8dbb8;
  margin-bottom: 16px;
  animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes pop-in {
  from { transform: scale(0.6); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

/* ── SVG circle chart ──────── rotated -90deg so the arc starts at 12 o'clock.
   The inner dashed circle represents the AU 65+ benchmark for visual
   comparison. stroke-dashoffset animates via a 1.4s ease transition triggered
   when `chartReady` flips true (400ms after mount). */
.chart-wrap {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}
.chart-svg { transform: rotate(-90deg); }
.progress-arc {
  transition: stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.chart-label {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.chart-percent {
  display: block;
  font-size: 36px;
  font-weight: 700;
  color: #0f3d35;
  line-height: 1;
}
.chart-sub {
  display: block;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #5a6b67;
  text-transform: uppercase;
  margin-top: 4px;
}

/* ── Legend ──────── two items: user's level (solid, colour = catColor) and
   the AU benchmark ring (dashed orange border, no fill). */
.legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
  font-size: 20px;
  color: #5a6b67;
  font-weight: 500;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 20px; height: 20px;
  border-radius: 50%;
  display: inline-block;
}
.dot-teal { background: #1a5c52; }
.dot-orange { border: 1px dashed #e8824a; background: transparent; }

/* ── Right column ──────── flex-column so the dark category card and the
   white action card stack with equal gap; each card uses flex: 1/2
   to give more visual weight to the action buttons. */
.right-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Momentum status card ──────── background colour comes from catColor
   (red / orange / teal depending on category) so the card changes
   personality based on the user's result. */
.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.status-icon { font-size: 20px; }
.status-label {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
}
.momentum-title {
  font-size: 25px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.15;
}
.momentum-desc {
  font-size: 20px;
  color: rgba(255,255,255,0.75);
  line-height: 1.6;
}

/* ── Action card ──────── three action rows (exercise, events, walk); the
   first is dark teal (primary action) and the other two are light (secondary).
   Hover lifts each row to signal they're clickable. */
.action-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  border-radius: 14px;
  padding: 20px 22px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex: 1;
}
.action-btn:hover { transform: translateY(-2px); }
.action-btn-dark {
  background: #1a5c52;
  box-shadow: 0 4px 12px rgba(26,92,82,0.15);
}
.action-btn-dark:hover { box-shadow: 0 8px 24px rgba(26,92,82,0.25); }
.action-btn-light {
  background: #ede9e1;
}
.action-btn-light:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.action-btn-icon {
  font-size: 20px;
  flex-shrink: 0;
}
.action-btn-label {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  flex: 1;
}
.action-btn-label-dark { color: #0f3d35; }
.action-btn-arrow {
  font-size: 28px;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  flex-shrink: 0;
}
.action-btn-arrow-dark { color: #1a5c52; font-weight: 700; }

/* ── Answers summary ──────── shown below the results grid as a recap of
   what the user answered; pill chips are compact so five answers fit in
   a wrapping flex row without excessive vertical space. */
.next-steps {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.next-steps.visible {
  opacity: 1;
  transform: translateY(0);
}
.section-title {
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #0f3d35;
}
.steps-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.step {
  border-radius: 16px;
  padding: 22px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.step.hovered { transform: translateY(-2px); }
.step-dark { background: #1a5c52; }
.step-dark.hovered { box-shadow: 0 8px 24px rgba(26,92,82,0.25); }
.step-light { background: #ede9e1; }
.step-light.hovered { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.step-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.step-icon {
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.step-icon-light { background: rgba(255,255,255,0.12); }
.step-icon-teal  { background: rgba(26,92,82,0.1); }
.step-name {
  font-weight: 700;
  color: #ffffff;
  font-size: 25px;
  margin-bottom: 4px;
}
.step-name-dark { color: #0f3d35; }
.step-desc {
  font-size: 20px;
  color: rgba(255,255,255,0.65);
  line-height: 1.5;
}
.step-desc-dark { color: #5a6b67; }
.step-arrow {
  color: rgba(255,255,255,0.7);
  font-size: 25px;
}
.step-arrow-dark { color: #5a6b67; opacity: 0.6; }


/* ANSWERS SUMMARY */
.answers-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #e8f4f3;
  border-radius: 10px;
  padding: 12px 18px;
  font-size: 20px;
}
.summary-top { display: flex; align-items: center; gap: 4px; }
.summary-q { font-weight: 700; color: #0b5d57; }
.summary-label { color: #5a6b67; }
.summary-answer { font-weight: 600; color: #0f3d35; }

/* ── Exercise session modal ──────── z-index: 200 sits above all page
   content but below any tour overlay that might be active; the play
   button doubles as the close + navigate trigger. */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.exercise-modal {
  background: #ffffff;
  border-radius: 24px;
  padding: 52px 44px;
  max-width: 440px;
  width: 90%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.exercise-modal-play {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #0b5d57;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.exercise-modal-play:hover { background: #0f3d35; transform: scale(1.06); }
.exercise-modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f3d35;
  margin: 0;
  line-height: 1.25;
}
.exercise-modal-desc {
  font-size: 20px;
  color: #5a6b67;
  line-height: 1.65;
  margin: 0;
}
.exercise-modal-btn {
  background: #0b5d57;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 16px 36px;
  font-family: inherit;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  margin-top: 4px;
}
.exercise-modal-btn:hover { background: #0f3d35; transform: translateY(-1px); }

/* ── Mobile ──────── two-column grid collapses to single column; all cards
   take full width with box-sizing: border-box to prevent overflow. */
@media (max-width: 768px) {
  .page { overflow-x: hidden; width: 100%; }
  .nav { max-width: 100%; margin: 0; padding: 16px 20px; }
  .nav-links { gap: 20px; font-size: 20px; }
  .logo { font-size: 20px; }

  .main { max-width: 100%; margin: 0; padding: calc(var(--navbar-h, 60px) + 16px) 20px 48px; }

  .title { font-size: 25px; }
  .subtitle { font-size: 20px; }

  .grid {
    grid-template-columns: 1fr;
  }

  .card-light,
  .card-dark,
  .card-white {
    width: 100%;
    box-sizing: border-box;
  }

  .right-col {
    width: 100%;
    gap: 16px;
  }

  .steps-grid { grid-template-columns: 1fr; }

  .step {
    width: 100%;
    box-sizing: border-box;
  }

  .checkin-empty { padding: 32px 20px; }
  .checkin-empty-title { font-size: 22px; }
}
</style>