<template>
  <div class="page">
    <!-- NAV -->
    <nav class="nav">
      <span class="logo" style="cursor:pointer" @click="router.push('/')">ActiveAgeing</span>
      <div class="nav-links">
        <a class="nav-link" style="cursor:pointer" @click="router.push('/')">Home</a>
        <a class="nav-link active">Assessment</a>
        <!-- <a class="nav-link" style="cursor:pointer" @click="router.push('/help')">Help</a> -->
      </div>
    </nav>

    <!-- MAIN -->
    <main class="main">

      <!-- HEADER -->
      <div class="header" :class="{ visible }">
        <h1 class="title">
          Your Wellness<br />Snapshot Results
        </h1>
        <p class="subtitle">
          You're establishing a wonderful foundation. With a few intentional shifts,
          you're perfectly positioned to reach your peak vitality.
        </p>
      </div>

      <!-- RANDOM FACT -->
      <div v-if="randomFact" class="fact-box" :class="{ visible }" style="transition-delay: 80ms;">
        <span class="fact-icon">💡</span>
        <p class="fact-text">{{ randomFact }}</p>
      </div>

      <!-- TWO COLUMN GRID -->
      <div class="grid" :class="{ visible }" style="transition-delay: 150ms;">

        <!-- LEFT: Activity Comparison -->
        <div class="card card-light">
          <h3 class="card-title">Activity Comparison</h3>
          <p class="card-desc">Your current movement relative to the Australian 65+ benchmark.</p>

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

          <!-- Steady Progress -->
          <div class="card card-white">
            <div class="progress-icon">📈</div>
            <h3 class="progress-title">Steady Progress</h3>
            <p class="progress-desc">
              You are currently exceeding the national average for daily steps by 15%.
              This consistency is the key to maintaining joint health and metabolic balance.
            </p>
          </div>

        </div>
      </div>

      <!-- YOUR NEXT STEPS -->
      <div class="next-steps" :class="{ visible }" style="transition-delay: 300ms;">
        <h2 class="section-title">Your Next Steps</h2>
        <div class="steps-grid">

          <div class="step step-dark"
            @click="router.push('/exercise')"
            @mouseenter="e => e.currentTarget.classList.add('hovered')"
            @mouseleave="e => e.currentTarget.classList.remove('hovered')"
          >
            <div class="step-left">
              <div class="step-icon step-icon-light">✦</div>
              <div>
                <div class="step-name">Guided Exercise Session</div>
                <div class="step-desc">Tailored specifically to your current<br />momentum and mobility needs.</div>
              </div>
            </div>
            <span class="step-arrow">→</span>
          </div>

          <div class="step step-light"
            @click="router.push('/events')"
            @mouseenter="e => e.currentTarget.classList.add('hovered')"
            @mouseleave="e => e.currentTarget.classList.remove('hovered')"
          >
            <div class="step-left">
              <div class="step-icon step-icon-teal">📅</div>
              <div>
                <div class="step-name step-name-dark">Explore Local Events</div>
                <div class="step-desc step-desc-dark">Connect with others through community<br />walking groups and hobbies.</div>
              </div>
            </div>
            <span class="step-arrow step-arrow-dark">→</span>
          </div>

        </div>
      </div>

      <!-- YOUR ASSESSMENT ANSWERS -->
      <div v-if="surveyAnswers" class="next-steps" :class="{ visible }" style="transition-delay: 450ms; margin-top: 40px;">
        <h2 class="section-title">Your Assessment Answers</h2>
        <div class="answers-grid">
          <div v-for="(answer, i) in surveyAnswers" :key="i" class="answer-card">
            <div class="answer-label">Q{{ i + 1 }}</div>
            <div class="answer-value">{{ answer }}</div>
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
        <a style="cursor:pointer" @click="router.push('/contact')">Contact Support</a>
      </div>
      <p class="footer-copy">© 2024 ActiveAgeing Australia. Your journey to wellness, clarified.</p>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const facts = [
  '"Every step counts!" — Telling us your routine helps us build a plan that fits your life, not someone else\'s.',
  '"You\'re not alone!" — Understanding your activity helps us recommend exercises that are safe and right for you.',
  '"Progress, not perfection!" — Knowing your stamina ensures we set goals that challenge without overwhelming.',
  '"You\'re doing great!" — This helps us curate exercises that honour your body\'s current needs.',
  '"Keep going!" — Your energy profile helps us schedule activity at the right intensity for you.',
]

const visible = ref(false)
const chartReady = ref(false)
const surveyAnswers = ref(null)
const surveyResult = ref(null)
const randomFact = ref('')

const radius = 80
const stroke = 12
const normalizedRadius = radius - stroke / 2
const circumference = normalizedRadius * 2 * Math.PI

const chartPercent = computed(() => surveyResult.value?.chartPercent ?? 75)
const momentumLabel = computed(() => surveyResult.value?.category?.label ?? 'Building Momentum')
const momentumDesc = computed(() => surveyResult.value?.category?.momentum_desc ?? 'You\'re on the right path! Your consistent activity level is laying the groundwork for improved long-term mobility and energy.')

const catColorMap = { 1: '#e53e3e', 2: '#e8824a', 3: '#d4a017', 4: '#1a5c52' }
const catColor = computed(() => catColorMap[surveyResult.value?.catId] ?? '#1a5c52')

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
  font-size: clamp(36px, 6vw, 52px);
  font-weight: 700;
  color: #0f3d35;
  line-height: 1.1;
  margin-bottom: 16px;
}
.subtitle {
  font-size: 20px;
  color: #5a6b67;
  line-height: 1.65;
  max-width: 820px;
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
.card-light { background: #ede9e1; }
.card-dark {
  background: #1a5c52;
  position: relative;
  overflow: hidden;
  text-align: left;
}
.card-dark::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 5px;
  background: #e8824a;
  border-radius: 20px 0 0 20px;
}
.card-white {
  background: #ffffff;
  text-align: left;
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
.status-icon { font-size: 18px; }
.status-label {
  font-size: 15px;
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
  font-size: 15px;
  color: rgba(255,255,255,0.75);
  line-height: 1.6;
}

/* STEADY PROGRESS */
.progress-icon {
  width: 42px; height: 42px;
  border-radius: 50%;
  background: #fde8da;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 14px;
}
.progress-title {
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #0f3d35;
}
.progress-desc {
  font-size: 15px;
  color: #5a6b67;
  line-height: 1.65;
}

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

/* ANSWERS GRID */
.answers-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.answer-card {
  background: #ede9e1;
  border-radius: 14px;
  padding: 16px 20px;
}
.answer-label {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #0b5d57;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.answer-value {
  font-size: 15px;
  font-weight: 500;
  color: #1a2e2b;
}
</style>