<template>
  <div class="page">
    <!-- NAV -->
    <AppNavbar active="wellness" />

    <!-- MAIN -->
    <main class="main">

      <!-- HEADER -->
      <div class="header" :class="{ visible }">
        <h1 class="title">
          Your Wellness<br />Snapshot Results
        </h1>
        <p class="subtitle">
          You can feel back like you were 21 years old with a
          few uplifting shifts that will make you stronger, steadier, 
          and wonderfully capable in your everyday life.
        </p>
      </div>

      <!-- RANDOM FACT -->
      <!-- <div v-if="randomFact" class="fact-box" :class="{ visible }" style="transition-delay: 80ms;">
        <span class="fact-icon">💡</span>
        <p class="fact-text">{{ randomFact }}</p>
      </div> -->

      <!-- EMPTY STATE — no survey result -->
      <div v-if="!surveyResult" class="grid" :class="{ visible }" style="transition-delay: 150ms;">
        <div class="card card-light empty-card">
          <div class="empty-icon">📊</div>
          <p class="empty-label">Activity Comparison</p>
          <p class="empty-hint">Complete the survey to see your results here.</p>
        </div>
        <div class="right-col">
          <div class="card card-light empty-card">
            <div class="empty-icon">🚀</div>
            <p class="empty-label">Current Status</p>
            <p class="empty-hint">Your wellness category will appear after the survey.</p>
          </div>
          <div class="card card-light empty-card">
            <div class="empty-icon">✦</div>
            <p class="empty-label">Your Actions</p>
            <p class="empty-hint">Personalised exercise and event recommendations await.</p>
          </div>
        </div>
      </div>
      <div v-if="!surveyResult" class="empty-cta" :class="{ visible }" style="transition-delay: 250ms;">
        <button class="btn-home" @click="router.push('/survey')">Get Started →</button>
      </div>

      <!-- TWO COLUMN GRID — has survey result -->
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
            <div class="action-btn action-btn-dark" @click="router.push('/exercise')">
              <span class="action-btn-icon">✦</span>
              <span class="action-btn-label">Guided Exercise Session</span>
              <span class="action-btn-arrow">→</span>
            </div>
            <div class="action-btn action-btn-light" @click="router.push('/events')">
              <span class="action-btn-icon">📅</span>
              <span class="action-btn-label action-btn-label-dark">Explore Events</span>
              <span class="action-btn-arrow action-btn-arrow-dark">→</span>
            </div>
          </div>

        </div>
      </div>

      <!-- YOUR ASSESSMENT ANSWERS -->
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

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-logo">ActiveAgeing</div>
      <div class="footer-links">
        <a style="cursor:pointer" @click="router.push('/privacy')">Privacy Policy</a>
        <a style="cursor:pointer" @click="router.push('/terms')">Terms of Service</a>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()

const facts = [
  '"Every step counts!" - Telling us your routine helps us build a plan that fits your life, not someone else\'s.',
  '"You\'re not alone!" - Understanding your activity helps us recommend exercises that are safe and right for you.',
  '"Progress, not perfection!" - Knowing your stamina ensures we set goals that challenge without overwhelming.',
  '"You\'re doing great!" - This helps us curate exercises that honour your body\'s current needs.',
  '"Keep going!" - Your energy profile helps us schedule activity at the right intensity for you.',
]

const questionLabels = ['Physical Activity', 'Active Sessions', 'Inactive During Day', 'Sleep', 'How You Feel on Waking']

const visible = ref(false)
const chartReady = ref(false)
const surveyAnswers = ref(null)
const surveyResult = ref(null)
const randomFact = ref('')
const sessionJustCompleted = ref(false)
const sessionPointsEarned = ref(0)

const answeredSummary = computed(() =>
  (surveyAnswers.value ?? []).map((ans, i) => ({
    q: `Q${i + 1}.`,
    label: questionLabels[i],
    answer: ans,
  }))
)

const radius = 80
const stroke = 12
const normalizedRadius = radius - stroke / 2
const circumference = normalizedRadius * 2 * Math.PI

const chartPercent = computed(() => surveyResult.value?.chartPercent ?? 75)

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

const momentumLabel = computed(() => categoryLabelMap[surveyResult.value?.categoryName] ?? surveyResult.value?.category?.label ?? 'Building Momentum')
const momentumDesc  = computed(() => categoryDescMap[surveyResult.value?.categoryName]  ?? surveyResult.value?.category?.description ?? 'You\'re on the right path!')
const catColor      = computed(() => catColorMap[surveyResult.value?.categoryName] ?? '#1a5c52')

const offset = computed(() => {
  return circumference - (chartReady.value ? chartPercent.value / 100 : 0) * circumference
})

onMounted(() => {
  setTimeout(() => { visible.value = true }, 80)
  setTimeout(() => { chartReady.value = true }, 400)

  const cached = localStorage.getItem('surveyAnswers')
  if (cached) surveyAnswers.value = JSON.parse(cached)

  const result = localStorage.getItem('surveyResult')
  if (result) surveyResult.value = JSON.parse(result)

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

/* NAV */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 40px;
}
.logo {
  font-weight: 700;
  font-size: 20px;
  color: #0b5d57;
}
.nav-links {
  display: flex;
  gap: 32px;
  font-size: 16px;
  font-weight: 500;
}
.nav-link {
  color: #0b5d57;
  text-decoration: none;
  cursor: pointer;
}
.nav-link.active {
  color: #0b5d57;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* MAIN */
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 40px 80px;
}

/* FACT BOX */
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
.fact-text { font-size: 14px; color: #1a5c52; font-style: italic; line-height: 1.5; margin: 0; }

/* HEADER */
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
  font-size: clamp(30px, 6vw, 25px);
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

/* GRID */
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

/* CARDS */
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

/* EMPTY STATE */
.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 24px;
  gap: 10px;
  min-height: 180px;
  border: 2px dashed #d5cfc4;
  background: #f9f7f3;
}
.empty-icon { font-size: 32px; opacity: 0.4; }
.empty-label { font-size: 15px; font-weight: 600; color: #a0998e; margin: 0; }
.empty-hint  { font-size: 13px; color: #b8b0a5; margin: 0; line-height: 1.5; }

.empty-cta {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.empty-cta.visible { opacity: 1; transform: translateY(0); }

.btn-home {
  background: #0b5d57;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 32px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-home:hover { background: #0f3d35; }

/* Session points badge */
.points-badge {
  display: inline-block;
  background: #e6f9ec;
  color: #1a8a40;
  font-size: 15px;
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

/* CHART */
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
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #5a6b67;
  text-transform: uppercase;
  margin-top: 4px;
}

/* LEGEND */
.legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
  font-size: 12px;
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

/* RIGHT COLUMN */
.right-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* BUILDING MOMENTUM */
.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.status-icon { font-size: 14px; }
.status-label {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
}
.momentum-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.15;
}
.momentum-desc {
  font-size: 15px;
  color: rgba(255,255,255,0.75);
  line-height: 1.6;
}

/* ACTION CARD */
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
  font-size: 17px;
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

/* NEXT STEPS */
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
  font-size: 18px;
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
  font-size: 15px;
  color: rgba(255,255,255,0.65);
  line-height: 1.5;
}
.step-desc-dark { color: #5a6b67; }
.step-arrow {
  color: rgba(255,255,255,0.7);
  font-size: 25px;
}
.step-arrow-dark { color: #5a6b67; opacity: 0.6; }

/* FOOTER */
.footer {
  border-top: 1px solid #ddd;
  text-align: center;
  padding: 32px 48px 24px;
}
.footer-logo {
  font-size: 15px;
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
  font-size: 15px;
  color: #555;
  font-weight: 500;
}
.footer-links a:hover { color: #0b5d57; }
.footer-copy {
  font-size: 12px;
  color: #888;
}

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
  font-size: 15px;
}
.summary-top { display: flex; align-items: center; gap: 4px; }
.summary-q { font-weight: 700; color: #0b5d57; }
.summary-label { color: #5a6b67; }
.summary-answer { font-weight: 600; color: #0f3d35; }

/* MOBILE */
@media (max-width: 768px) {
  .page { overflow-x: hidden; width: 100%; }
  .nav { max-width: 100%; margin: 0; padding: 16px 20px; }
  .nav-links { gap: 20px; font-size: 14px; }
  .logo { font-size: 18px; }

  .main { max-width: 100%; margin: 0; padding: 24px 20px 48px; }

  .title { font-size: 25px; }
  .subtitle { font-size: 14px; }

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

  .footer { padding: 24px 20px; }
  .footer-links { flex-wrap: wrap; gap: 12px; justify-content: center; }
}
</style>