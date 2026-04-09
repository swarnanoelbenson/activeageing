<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const total = 5

const questions = [
  {
    text: 'How often do you currently do physical activity or exercise?',
    subtitle: 'We want to ensure your journey is safe and comfortable.',
    options: [
      { label: 'Every day',           desc: 'I exercise or stay active daily.',           icon: '🏃' },
      { label: 'A few times a week',  desc: 'I am active several times per week.',        icon: '🚶' },
      { label: 'Once a week',         desc: 'I try to stay active at least weekly.',      icon: '🧘' },
      { label: 'Rarely or never',     desc: 'I have not been active recently.',           icon: '🛋️' }
    ]
  },
  {
    text: 'How long are you usually active in one session?',
    subtitle: 'We want to ensure your journey is safe and comfortable.',
    options: [
      { label: 'Less than 15 minutes', desc: 'Short bursts work best for me.',          icon: '⏱️' },
      { label: '15 to 30 minutes',     desc: 'I can manage a brief session.',           icon: '🕒' },
      { label: '30 to 60 minutes',     desc: 'I enjoy a moderate workout length.',      icon: '🕑' },
      { label: 'More than 60 minutes', desc: 'I love longer activity sessions.',        icon: '🏅' }
    ]
  },
  {
    text: 'On a typical day, how much time do you spend sitting or being inactive?',
    subtitle: 'We want to ensure your journey is safe and comfortable.',
    options: [
      { label: 'Very little',      desc: 'I am mostly on my feet throughout the day.',            icon: '🏃' },
      { label: 'Some of the day',  desc: 'I sit for part of the day but move regularly.',         icon: '🪑' },
      { label: 'A lot of the day', desc: 'I spend most of my time sitting.',                      icon: '💺' },
      { label: 'Most of the day',  desc: 'I am seated or inactive for almost all of the day.',   icon: '🛋️' }
    ]
  },
  {
    text: 'On most nights, how many hours do you sleep?',
    subtitle: 'We want to ensure your journey is safe and comfortable.',
    options: [
      { label: 'Less than 6 hours',       desc: 'I often get very little sleep.',              icon: '😫' },
      { label: '6 to less than 7 hours',  desc: 'I get a bit under the recommended amount.',   icon: '😴' },
      { label: '7 to 8 hours',            desc: 'I get a healthy amount of sleep.',            icon: '🌙' },
      { label: 'More than 8 hours',       desc: 'I tend to sleep longer than most.',           icon: '💤' }
    ]
  },
  {
    text: 'How rested do you usually feel when you wake up?',
    subtitle: 'We want to ensure your journey is safe and comfortable.',
    options: [
      { label: 'Very rested',    desc: 'I wake up feeling refreshed and ready to go.',    icon: '⚡' },
      { label: 'Fairly rested',  desc: 'I feel reasonably refreshed most mornings.',      icon: '🔋' },
      { label: 'A little tired', desc: 'I often wake feeling a bit groggy.',              icon: '😪' },
      { label: 'Very tired',     desc: 'I rarely feel rested when I wake up.',            icon: '😩' }
    ]
  }
]

const step    = ref(1)
const answers = ref(Array(total).fill(null))

const isFinalStep    = computed(() => step.value === total)
const progressPercent = computed(() => (step.value / total) * 100)
const currentQuestion = computed(() => questions[step.value - 1])
const showBack        = computed(() => step.value > 1)
const showNext        = computed(() => answers.value[step.value - 1] !== null && step.value < total)
const showSubmit      = computed(() => step.value === total && answers.value[step.value - 1] !== null)

function selectOption(option) {
  answers.value[step.value - 1] = option.label
  if (step.value < total) {
    setTimeout(() => { step.value++ })
  } else {
    setTimeout(() => { submitSurvey() })
  }
}

function goNext() {
  if (step.value < total) step.value++
}

function goBack() {
  if (step.value === 1) {
    router.push({ name: 'Home' })
  } else {
    step.value--
  }
}

async function submitSurvey() {
  if (!answers.value[step.value - 1]) return

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answers.value })
    })

    const data = await res.json()
    localStorage.setItem('surveyAnswers', JSON.stringify(answers.value))
    localStorage.setItem('surveyResult', JSON.stringify(data))

    router.push({ name: 'Results' })
  } catch (err) {
    console.error('Submit failed:', err)
    alert('Something went wrong: ' + err.message)
  }
}
</script>

<template>
  <div class="page-wrapper">
    <!-- Navbar -->
    <header class="navbar">
      <div class="logo" @click="router.push('/')">ActiveAgeing</div>
      <nav>
        <a @click="router.push('/')">Home</a>
        <a @click="router.push('/help')">Help</a>
      </nav>
    </header>

    <!-- Main content -->
    <main class="survey-container">
      <!-- Progress -->
      <div class="progress-section">
        <div class="progress-meta">
          <div>
            <span v-if="isFinalStep" class="final-label">FINAL STEP</span>
            <span v-else class="step-label">STEP {{ step }} OF {{ total }}</span>
            <div v-if="isFinalStep" class="step-sub">Step {{ step }} of {{ total }}</div>
          </div>
          <span class="progress-right">{{ isFinalStep ? '100% Complete' : 'Vitality Assessment' }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <!-- Question -->
      <h1 class="question-title">{{ currentQuestion.text }}</h1>
      <p class="question-subtitle">{{ currentQuestion.subtitle }}</p>

      <!-- Options grid -->
      <div class="options-grid">
        <div
          v-for="option in currentQuestion.options"
          :key="option.label"
          class="option-card"
          :class="{ selected: answers[step - 1] === option.label }"
          @click="selectOption(option)"
        >
          <div class="option-icon">{{ option.icon }}</div>
          <div class="option-text">
            <strong>{{ option.label }}</strong>
            <p>{{ option.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="btn-row">
        <button v-if="showBack" class="btn-back" @click="goBack">← BACK</button>
        <div v-else></div>
        <button v-if="showSubmit" class="btn-submit" @click="submitSurvey">Submit My Assessment →</button>
        <button v-else-if="showNext" class="btn-next" @click="goNext">NEXT →</button>
      </div>
    </main>

    <!-- Footer -->
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.page-wrapper {
  font-family: 'Poppins', sans-serif;
  background: #f0eeea;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Navbar ── */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 48px;
  background: #f0eeea;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: #0b5d57;
  cursor: pointer;
}

nav a {
  margin-left: 28px;
  text-decoration: none;
  color: #0b5d57;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

nav a:hover { color: #084a45; }

nav a.active {
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* ── Main ── */
.survey-container {
  flex: 1;
  max-width: 860px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 48px 48px;
}

/* ── Progress ── */
.progress-section { margin-bottom: 32px; }

.progress-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.final-label {
  font-size: 11px;
  font-weight: 700;
  color: #c14f4f;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: block;
}

.step-label {
  font-size: 12px;
  font-weight: 600;
  color: #0b5d57;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.step-sub {
  font-size: 15px;
  font-weight: 700;
  color: #111;
  margin-top: 2px;
}

.progress-right {
  font-size: 13px;
  color: #555;
  font-weight: 500;
}

.progress-bar {
  height: 7px;
  background: #d9d5cf;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #0b5d57;
  border-radius: 999px;
  transition: width 0.4s ease;
}

/* ── Question ── */
.question-title {
  font-size: 32px;
  font-weight: 700;
  color: #0b5d57;
  margin-bottom: 10px;
  line-height: 1.2;
}

.question-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 28px;
  line-height: 1.6;
}

/* ── Options ── */
.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.option-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: #e8e4de;
  border: 2px solid transparent;
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

.option-card:hover { border-color: #0b5d57; background: #dff0ee; }

.option-card.selected {
  border-color: #0b5d57;
  background: #dff0ee;
  box-shadow: 0 0 0 3px rgba(11, 93, 87, 0.12);
}

.option-icon {
  font-size: 22px;
  flex-shrink: 0;
  background: #f0eeea;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-text strong {
  font-size: 14px;
  font-weight: 600;
  color: #111;
  display: block;
  margin-bottom: 4px;
}

.option-text p { font-size: 12px; color: #555; line-height: 1.4; }

/* ── Buttons ── */
.btn-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 36px;
}

.btn-back {
  padding: 14px 32px;
  border: 2px solid #c14f4f;
  border-radius: 10px;
  background: transparent;
  color: #c14f4f;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.btn-back:hover { background: #c14f4f; color: #fff; }

.btn-next {
  padding: 14px 40px;
  background: #0b5d57;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-next:hover { background: #074a46; }

.btn-submit {
  padding: 14px 40px;
  background: #0b5d57;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover { background: #074a46; }

/* ── Footer ── */
.footer {
  background: #f0eeea;
  border-top: 1px solid #ddd;
  text-align: center;
  padding: 32px 48px 24px;
}

.footer-logo { font-size: 16px; font-weight: 700; color: #0b5d57; margin-bottom: 12px; }

.footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 10px;
}

.footer-links a {
  text-decoration: none;
  font-size: 13px;
  color: #555;
  font-weight: 500;
  cursor: pointer;
}

.footer-links a:hover { color: #0b5d57; }
.footer-copy { font-size: 12px; color: #888; }

/* ── Responsive ── */
@media (max-width: 600px) {
  .options-grid { grid-template-columns: 1fr; }
  .survey-container { padding: 16px 20px 40px; }
  .navbar { padding: 16px 20px; }
  .question-title { font-size: 24px; }
  .btn-row { flex-direction: column-reverse; gap: 12px; }
  .btn-back, .btn-next, .btn-submit { width: 100%; text-align: center; }
}
</style>
