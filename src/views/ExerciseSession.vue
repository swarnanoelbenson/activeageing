<template>
  <div class="page">
    <nav class="navbar">
      <div class="logo" @click="router.push('/')">ActiveAgeing</div>
      <div class="nav-links">
        <a class="nav-link" @click="router.push('/')">Home</a>
        <a class="nav-link active">Assessment</a>
        <!-- <a class="nav-link" @click="router.push('/help')">Help</a> -->
      </div>
    </nav>

    <div class="progress-wrap">
      <div class="progress-label">
        <span class="progress-dot"></span>
        <span class="progress-text">SESSION PROGRESS</span>
      </div>
      <span class="progress-pct">{{ progressPercent }}%</span>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </div>

    <main class="main">
      <div class="card" :class="{ visible }">

        <div class="card-left">
          <div class="illustration">
            <svg viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="figure-svg">
              <line x1="75" y1="170" x2="65" y2="220" stroke="#1a5c52" stroke-width="7" stroke-linecap="round"/>
              <line x1="145" y1="170" x2="155" y2="220" stroke="#1a5c52" stroke-width="7" stroke-linecap="round"/>
              <line x1="75" y1="140" x2="65" y2="190" stroke="#1a5c52" stroke-width="7" stroke-linecap="round"/>
              <line x1="145" y1="140" x2="155" y2="190" stroke="#1a5c52" stroke-width="7" stroke-linecap="round"/>
              <rect x="62" y="162" width="96" height="10" rx="4" fill="#1a5c52"/>
              <rect x="62" y="115" width="10" height="55" rx="4" fill="#1a5c52"/>
              <rect x="148" y="115" width="10" height="55" rx="4" fill="#1a5c52"/>
              <rect x="62" y="115" width="96" height="10" rx="4" fill="#1a5c52"/>
              <line x1="110" y1="115" x2="110" y2="162" stroke="#1a5c52" stroke-width="7" stroke-linecap="round"/>
              <circle cx="110" cy="100" r="16" fill="#2a7a6e" opacity="0.25"/>
              <circle cx="110" cy="100" r="11" fill="#1a5c52"/>
              <line x1="110" y1="128" x2="60" y2="88" stroke="#1a5c52" stroke-width="7" stroke-linecap="round"/>
              <line x1="110" y1="128" x2="160" y2="88" stroke="#1a5c52" stroke-width="7" stroke-linecap="round"/>
              <line x1="90" y1="162" x2="80" y2="192" stroke="#1a5c52" stroke-width="7" stroke-linecap="round"/>
              <line x1="130" y1="162" x2="140" y2="192" stroke="#1a5c52" stroke-width="7" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="encouragement">You're doing great!</div>
        </div>

        <div class="card-right">
          <h1 class="exercise-title">{{ currentExercise.title }}</h1>

          <div class="tags">
            <span class="tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ currentExercise.duration }}
            </span>
            <span class="tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
              {{ currentExercise.reps }}
            </span>
          </div>

          <div class="instructions-label">
            <span class="label-bar"></span>
            Step-by-Step Instructions
          </div>

          <ol class="steps">
            <li v-for="(step, i) in currentExercise.steps" :key="i" class="step-item">
              <span class="step-num">{{ i + 1 }}</span>
              <span class="step-text">{{ step }}</span>
            </li>
          </ol>

          <div class="actions">
            <button class="btn-primary" @click="nextExercise">
              Next Exercise →
            </button>
            <button class="btn-secondary" @click="finishSession">
              Finish Session
            </button>
          </div>
        </div>

      </div>
    </main>

    <footer class="footer">
      <div class="footer-logo">ActiveAgeing</div>
      <div class="footer-links">
        <a @click="router.push('/privacy')">Privacy Policy</a>
        <a @click="router.push('/terms')">Terms of Service</a>
        <a @click="router.push('/contact')">Contact Support</a>
      </div>
      <p class="footer-copy">© 2024 ActiveAgeing Australia. Your journey to wellness, clarified.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)
const currentIndex = ref(0)

const exercises = [
  {
    title: 'Gentle Chair Yoga',
    duration: '10 minutes',
    reps: '15 reps',
    steps: [
      'Sit tall at the edge of your chair with feet flat on the floor, hip-width apart.',
      'Inhale deeply and slowly raise your arms toward the ceiling, keeping shoulders relaxed.',
      'Exhale as you gently lean to your right, keeping both sit-bones grounded on the chair.',
    ]
  },
  {
    title: 'Seated Leg Raises',
    duration: '8 minutes',
    reps: '12 reps',
    steps: [
      'Sit upright in your chair with your back straight and feet flat on the floor.',
      'Slowly raise your right leg until it is parallel to the floor, hold for 2 seconds.',
      'Lower your leg back down and repeat on the left side for one complete rep.',
    ]
  },
  {
    title: 'Shoulder Rolls',
    duration: '5 minutes',
    reps: '10 reps',
    steps: [
      'Sit comfortably with your arms relaxed at your sides.',
      'Slowly roll both shoulders forward in a circular motion, completing 5 rotations.',
      'Reverse direction and roll shoulders backward 5 times to complete the set.',
    ]
  },
]

const currentExercise = ref(exercises[0])
const progressPercent = ref(0)

function updateProgress() {
  progressPercent.value = Math.round(((currentIndex.value) / exercises.length) * 100) + 20
}

function nextExercise() {
  if (currentIndex.value < exercises.length - 1) {
    currentIndex.value++
    currentExercise.value = exercises[currentIndex.value]
    updateProgress()
  } else {
    router.push('/celebration')
  }
}

function finishSession() {
  router.push({ path: '/break', query: { progress: progressPercent.value } })
}

onMounted(() => {
  setTimeout(() => { visible.value = true }, 80)
  updateProgress()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.page {
  min-height: 100vh;
  background: #f4f1eb;
  font-family: 'Poppins', 'Arial', sans-serif;
  color: #1a2e2b;
  display: flex;
  flex-direction: column;
}

/* NAV — matches Results */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px 40px;
}
.logo { font-weight: 700; font-size: 20px; color: #0b5d57; cursor: pointer; }
.nav-links { display: flex; gap: 32px; font-size: 16px; font-weight: 500; }
.nav-link { color: #0b5d57; text-decoration: none; cursor: pointer; }
.nav-link.active { text-decoration: underline; text-underline-offset: 4px; }

/* PROGRESS */
.progress-wrap {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 40px 20px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;
  align-items: center;
  gap: 0 12px;
}
.progress-label { display: flex; align-items: center; gap: 7px; grid-column: 1; grid-row: 1; }
.progress-dot { width: 8px; height: 8px; border-radius: 50%; background: #0b5d57; }
.progress-text { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; color: #5a6b67; text-transform: uppercase; }
.progress-pct { grid-column: 3; grid-row: 1; font-size: 13px; font-weight: 600; color: #0b5d57; }
.progress-track { grid-column: 1 / 4; grid-row: 2; height: 8px; background: #d5cfc4; border-radius: 99px; margin-top: 8px; overflow: hidden; }
.progress-fill { height: 100%; background: #0b5d57; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }

/* MAIN — matches Results padding */
.main {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 40px 40px 80px;
  flex: 1;
}

/* CARD — outer uses ede9e1 like Results card-light */
.card {
  background: #ede9e1;
  border-radius: 20px;
  display: flex;
  overflow: hidden;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.card.visible { opacity: 1; transform: translateY(0); }

/* LEFT panel — white like Results card-white */
.card-left {
  background: #ffffff;
  width: 38%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  gap: 28px;
}
.figure-svg { width: 200px; height: 220px; }
.encouragement {
  background: #0b5d57;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 10px;
}

/* RIGHT panel — matches Results card-light */
.card-right {
  flex: 1;
  padding: 44px;
  display: flex;
  flex-direction: column;
  text-align: left;
}

/* Exercise title — matches Results .momentum-title style */
.exercise-title {
  font-size: 32px;
  font-weight: 700;
  color: #0f3d35;
  margin: 0 0 20px;
  line-height: 1.2;
}

/* Tags */
.tags { display: flex; gap: 10px; margin-bottom: 28px; }
.tag {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid #c8c2b8;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 13px;
  color: #5a6b67;
}

/* Instructions */
.instructions-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #0f3d35;
  margin-bottom: 20px;
}
.label-bar { width: 4px; height: 16px; background: #0b5d57; border-radius: 2px; }

/* Steps — matches Results step desc style */
.steps { list-style: none; padding: 0; margin: 0 0 32px; display: flex; flex-direction: column; gap: 16px; }
.step-item { display: flex; align-items: flex-start; gap: 14px; }
.step-num {
  min-width: 28px; height: 28px;
  border-radius: 50%;
  background: #0b5d57;
  color: #ffffff;
  font-size: 13px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.step-text { font-size: 14px; line-height: 1.65; color: #5a6b67; }

/* Buttons — match Results step cards */
.actions { display: flex; flex-direction: column; gap: 12px; margin-top: auto; }
.btn-primary {
  background: #1a5c52;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: #0f3d35; }
.btn-secondary {
  background: #ffffff;
  color: #1a2e2b;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-secondary:hover { background: #f0ede6; }

/* FOOTER — matches Results */
.footer {
  border-top: 1px solid #ddd;
  text-align: center;
  padding: 32px 48px 24px;
}
.footer-logo { font-size: 16px; font-weight: 700; color: #0b5d57; margin-bottom: 12px; }
.footer-links { display: flex; justify-content: center; gap: 24px; margin-bottom: 10px; }
.footer-links a { font-size: 13px; color: #555; font-weight: 500; cursor: pointer; text-decoration: none; }
.footer-links a:hover { color: #0b5d57; }
.footer-copy { font-size: 12px; color: #888; }

/* RESPONSIVE */
@media (max-width: 900px) {
  .card { flex-direction: column; }
  .card-left { width: 100%; padding: 32px 24px; }
  .card-right { padding: 32px 24px; }
}

@media (max-width: 768px) {
  .navbar { padding: 16px 20px; }
  .logo { font-size: 18px; }
  .nav-links { gap: 10px; font-size: 14px; }

  .progress-wrap { padding: 0 20px 16px; }
  .main { padding: 24px 20px 48px; }

  .card { width: 100%; box-sizing: border-box; }
  .card-left { padding: 24px 20px; }
  .card-right { padding: 24px 20px; }

  .exercise-title { font-size: 24px; }
  .figure-svg { width: 140px; height: 160px; }
  .btn-primary, .btn-secondary { padding: 14px; }

  .footer { padding: 24px 20px; }
  .footer-links { flex-wrap: wrap; gap: 12px; }
}
</style>