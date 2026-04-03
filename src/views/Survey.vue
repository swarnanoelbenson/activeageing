<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const step = ref(1)
const total = 6

const questions = [
  {
    text: 'How often do you currently exercise or do physical activity?',
    subtitle: 'We want to ensure your journey is safe and comfortable.',
    options: [
      { label: 'Every day', desc: 'I exercise or stay active daily.', icon: '🏃' },
      { label: 'A few times a week', desc: 'I am active several times per week.', icon: '🚶' },
      { label: 'Once a week', desc: 'I try to stay active at least weekly.', icon: '🧘' },
      { label: 'Rarely or never', desc: 'I have not been active recently.', icon: '🛋️' }
    ],
    motivation: '"Every step counts!"\nTelling us your routine helps us build a plan that fits your life — not someone else\'s.'
  },
  {
    text: 'How would you describe your mobility?',
    subtitle: 'We want to ensure your journey is safe and comfortable.',
    options: [
      { label: 'I move freely without assistance', desc: 'No limitations on my movement.', icon: '🚶' },
      { label: 'I have some limitations but manage well', desc: 'Minor restrictions, but I cope fine.', icon: '🦶' },
      { label: 'I need support or aids to move around', desc: 'I use assistance for mobility.', icon: '🦯' },
      { label: 'N/A', desc: 'This does not apply to me.', icon: '—' }
    ],
    motivation: '"You\'re not alone!"\nUnderstanding your mobility helps us recommend exercises that are safe, effective, and right for you.'
  },
  {
    text: 'How long can you comfortably stay active in one session?',
    subtitle: 'We want to ensure your journey is safe and comfortable.',
    options: [
      { label: 'Less than 15 minutes', desc: 'Short bursts work best for me.', icon: '⏱️' },
      { label: '15 to 30 minutes', desc: 'I can manage a brief session.', icon: '🕒' },
      { label: '30 to 60 minutes', desc: 'I enjoy a moderate workout length.', icon: '🕑' },
      { label: 'More than 60 minutes', desc: 'I love longer activity sessions.', icon: '🏅' }
    ],
    motivation: '"Progress, not perfection!"\nKnowing your stamina ensures we set goals that challenge you without overwhelming you.'
  },
  {
    text: 'Do you currently experience any of the following?',
    subtitle: 'We want to ensure your journey is safe and comfortable. Tell us about any areas where you might need extra support.',
    options: [
      { label: 'None', desc: 'I feel great and ready to move with full energy.', icon: '😊' },
      { label: 'Joint Pain or stiffness', desc: 'I experience occasional or regular stiffness or aching.', icon: '🦴' },
      { label: 'Breathlessness during light activity', desc: 'I find myself short of breath during light activities.', icon: '💨' },
      { label: 'Balance issues', desc: 'I sometimes feel unsteady or need to hold onto things.', icon: '🧍' }
    ],
    motivation: '"You\'re doing great!"\nThis helps us curate exercises that honor your body\'s current needs. We\'re here to support you every step of the way.'
  },
  {
    text: 'How would you describe your energy levels on a typical day?',
    subtitle: 'We want to ensure your journey is safe and comfortable.',
    options: [
      { label: 'I feel energetic and active', desc: 'I have plenty of energy throughout the day.', icon: '⚡' },
      { label: 'I have moderate energy but tire easily', desc: 'I manage but fatigue sets in quickly.', icon: '🔋' },
      { label: 'I feel tired most of the time', desc: 'Low energy is a daily challenge for me.', icon: '😴' },
      { label: 'N/A', desc: 'This does not apply to me.', icon: '—' }
    ],
    motivation: '"Keep going!"\nYour energy profile helps us schedule activity at the right times and intensity for you.'
  },
  {
    text: 'How often do you leave your home for social or physical activities?',
    subtitle: 'We want to ensure your journey is safe and comfortable. ',
    options: [
      { label: 'Daily', desc: 'I go out every day for social or physical activities.', icon: '🌞' },
      { label: 'A few times a week', desc: 'I head out several times a week.', icon: '🚶' },
      { label: 'Once a week or less', desc: 'I go out about once a week or less often.', icon: '📅' },
      { label: 'Rarely or never', desc: 'I mostly stay at home.', icon: '🏠' }
    ],
    motivation: null
  }
]

const answers = ref(Array(total).fill(null))

const isFinalStep = computed(() => step.value === total)

const progressPercent = computed(() => (step.value / total) * 100)

const currentQuestion = computed(() => questions[step.value - 1])

function selectOption(option) {
  answers.value[step.value - 1] = option.label
}

function goNext() {
  if (!answers.value[step.value - 1]) return
  if (step.value < total) {
    step.value++
  }
}

function goBack() {
  if (step.value === 1) {
    router.push({ name: 'Home' })
  } else {
    step.value--
  }
}

function submitSurvey() {
  if (!answers.value[step.value - 1]) return
  router.push({ name: 'Results' })
}
</script>

<template>
  <div class="page-wrapper">
    <!-- Navbar -->
    <header class="navbar">
      <div class="logo">ActiveAgeing</div>
      <nav>
        <a href="#">Home</a>
        <a href="#">Help</a>
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

      <!-- Motivation box (steps 1–5 only) -->
      <div v-if="!isFinalStep && currentQuestion.motivation" class="motivation-box">
        <div class="motivation-icon">👍</div>
        <div class="motivation-text">
          <strong>{{ currentQuestion.motivation.split('\n')[0] }}</strong>
          <p>{{ currentQuestion.motivation.split('\n')[1] }}</p>
        </div>
      </div>

      <!-- Buttons: steps 1–5 -->
      <div v-if="!isFinalStep" class="btn-row">
        <button class="btn-back" @click="goBack">← BACK</button>
        <button class="btn-next" @click="goNext">NEXT →</button>
      </div>

      <!-- Buttons: final step 6 -->
      <div v-else class="btn-col">
        <button class="btn-submit" @click="submitSurvey">Submit My Assessment →</button>
        <button class="btn-back-outline" @click="goBack">← BACK</button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-logo">ActiveAgeing</div>
      <div class="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Contact Support</a>
      </div>
      <p class="footer-copy">© 2024 ActiveAgeing Australia. Your journey to wellness, clarified.</p>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

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
  font-size: 18px;
  font-weight: 700;
  color: #0b5d57;
}

nav a {
  margin-left: 28px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

nav a:hover {
  color: #0b5d57;
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
.progress-section {
  margin-bottom: 32px;
}

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

.option-card:hover {
  border-color: #0b5d57;
  background: #dff0ee;
}

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

.option-text p {
  font-size: 12px;
  color: #555;
  line-height: 1.4;
}

/* ── Motivation box ── */
.motivation-box {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 28px;
  background: #fde8e8;
  border-radius: 14px;
  padding: 20px 24px;
}

.motivation-icon {
  font-size: 26px;
  background: #fff;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.motivation-text strong {
  font-size: 14px;
  font-weight: 600;
  color: #7a1c1c;
  display: block;
  margin-bottom: 4px;
}

.motivation-text p {
  font-size: 13px;
  color: #8b3333;
  line-height: 1.5;
}

/* ── Buttons: steps 1–5 ── */
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

.btn-back:hover {
  background: #c14f4f;
  color: #fff;
}

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

.btn-next:hover {
  background: #074a46;
}

/* ── Buttons: final step 6 ── */
.btn-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 36px;
}

.btn-submit {
  width: 100%;
  max-width: 480px;
  padding: 18px 32px;
  background: #0b5d57;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover {
  background: #074a46;
}

.btn-back-outline {
  width: 100%;
  max-width: 480px;
  padding: 16px 32px;
  background: transparent;
  border: 2px solid #c14f4f;
  border-radius: 12px;
  color: #c14f4f;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.btn-back-outline:hover {
  background: #c14f4f;
  color: #fff;
}

/* ── Footer ── */
.footer {
  background: #f0eeea;
  border-top: 1px solid #ddd;
  text-align: center;
  padding: 32px 48px 24px;
}

.footer-logo {
  font-size: 16px;
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
  font-size: 13px;
  color: #555;
  font-weight: 500;
}

.footer-links a:hover {
  color: #0b5d57;
}

.footer-copy {
  font-size: 12px;
  color: #888;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .options-grid {
    grid-template-columns: 1fr;
  }

  .survey-container {
    padding: 16px 20px 40px;
  }

  .navbar {
    padding: 16px 20px;
  }

  .question-title {
    font-size: 24px;
  }

  .btn-row {
    flex-direction: column-reverse;
    gap: 12px;
  }

  .btn-back,
  .btn-next {
    width: 100%;
    text-align: center;
  }
}
</style>