<template>
  <div class="page">
    <AppNavbar />

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

    <!-- Exercise session -->
    <main v-if="!sessionDone" class="main">
      <div class="card" :class="{ visible }">

        <!-- Row 1: Title -->
        <div class="card-header">
          <h1 class="exercise-title">{{ currentExercise.exercise_name }}</h1>
          <div class="tags">
            <span class="tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ currentExercise.duration_minutes }} min
            </span>
          </div>
        </div>

        <!-- Row 2: 3-step image grid -->
        <div class="steps-grid">
          <div class="step-card" v-for="(step, i) in currentSteps" :key="i">
            <div class="step-subtitle">{{ step.subtitle }}</div>
            <img :src="step.image" :alt="step.subtitle" class="step-image" />
            <p class="step-desc">{{ step.description }}</p>
          </div>
        </div>

        <!-- Row 3: Actions -->
        <div class="card-footer">
          <button class="btn-secondary" :disabled="currentIndex === 0" @click="prevExercise">
            ← Previous Exercise
          </button>
          <button class="btn-primary" @click="nextExercise">
            {{ isLastExercise ? 'Finish Session →' : 'Next Exercise →' }}
          </button>
          <button class="btn-pause" @click="showPauseModal = true">⏸ Pause</button>
        </div>

      </div>
    </main>

    <!-- Celebration screen -->
    <main v-else class="main">
      <div class="celebration" :class="{ visible }">

        <!-- 1 exercise completed -->
        <template v-if="exercisesCompleted === 1">
          <div class="cel-emoji">💪</div>
          <h1 class="cel-title">Back to your 40's!</h1>
          <p class="cel-subtitle">1 of 3 exercises done — every rep counts!</p>
          <div class="cel-quote">
            "Even one step forward is still forward. You showed up today —
            that alone puts you ahead of most people half your age.
            Come back tomorrow and claim the rest. We'll be waiting. 💪"
          </div>
        </template>

        <!-- 2 exercises completed -->
        <template v-else-if="exercisesCompleted === 2">
          <div class="cel-emoji">🔥</div>
          <h1 class="cel-title">Back to your 30's!</h1>
          <p class="cel-subtitle">2 of 3 exercises done — every rep counts!</p>
          <div class="cel-quote">
            "Even one step forward is still forward. You showed up today —
            that alone puts you ahead of most people half your age.
            Come back tomorrow and claim the rest. We'll be waiting. 💪"
          </div>
        </template>

        <!-- All 3 exercises completed -->
        <template v-else>
          <div class="cel-emoji">🎉</div>
          <h1 class="cel-title">You Actually Did It!</h1>
          <div class="cel-age-banner">Back to 21 years old!</div>
          <p class="cel-subtitle">Full session complete — your body is officially younger than when you started.</p>
        </template>

        <div class="cel-stats">
          <div class="cel-stat">
            <span class="cel-stat-num">+{{ pointsEarned }}</span>
            <span class="cel-stat-label">points earned</span>
          </div>
          <div class="cel-stat">
            <span class="cel-stat-num">+{{ pctBoost }}%</span>
            <span class="cel-stat-label">activity boost</span>
          </div>
          <div class="cel-stat">
            <span class="cel-stat-num">+{{ categoryScoreBoost }}</span>
            <span class="cel-stat-label">category score</span>
          </div>
        </div>

        <button class="btn-celebrate" @click="goToResults">
          ← Back to Wellness Snapshot
        </button>
      </div>
    </main>

    <!-- Pause modal -->
    <div v-if="showPauseModal" class="modal-overlay" @click.self="showPauseModal = false">
      <div class="modal">
        <div class="modal-emoji">😌</div>
        <h2 class="modal-title">Take a breather!</h2>
        <p class="modal-text">
          Rest is part of every good plan — even champions pause.
          Ready to jump back in, or are you calling today a win?
        </p>
        <div class="modal-actions">
          <button class="modal-btn-secondary" @click="showPauseModal = false">Back</button>
          <button class="modal-btn-primary" @click="finishSession">Finish Session</button>
        </div>
      </div>
    </div>

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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()
const visible = ref(false)
const currentIndex = ref(0)
const exercises = ref([])
const exercisesCompleted = ref(0)
const sessionDone = ref(false)
const showPauseModal = ref(false)

const EXERCISE_CONTENT = {
  'neck rotations': [
    { subtitle: 'Start Position', image: '/Images/neck_rotation_1.jpeg', description: 'Sit upright on a chair with your back straight and shoulders relaxed.' },
    { subtitle: 'Turn Right',     image: '/Images/neck_rotation_2.jpeg', description: 'Slowly turn your head to the right as far as comfortable, keeping your shoulders still.' },
    { subtitle: 'Turn Left',      image: '/Images/neck_rotation_3.jpeg', description: 'Gently turn your head to the left side, moving slowly and staying relaxed.' },
  ],
  'ankle rotations': [
    { subtitle: 'Start Position',       image: '/Images/ankle_rotation_1.jpeg', description: 'Sit upright on a chair and gently lift one foot slightly off the ground.' },
    { subtitle: 'Rotate Clockwise',     image: '/Images/ankle_rotation_2.jpeg', description: 'Slowly rotate your ankle in a circular motion in one direction.' },
    { subtitle: 'Rotate Anti-Clockwise',image: '/Images/ankle_rotation_3.jpeg', description: 'Change direction and rotate your ankle the other way, keeping movements smooth.' },
  ],
  'seated chest stretch': [
    { subtitle: 'Start Position', image: '/Images/seated_chest_stretch_1.jpeg', description: 'Sit upright on a chair with your back straight and shoulders relaxed.' },
    { subtitle: 'Open Chest',     image: '/Images/seated_chest_stretch_2.jpeg', description: 'Slowly move your arms out to the sides, opening your chest and keeping your shoulders down.' },
    { subtitle: 'Hold & Breathe', image: '/Images/seated_chest_stretch_3.jpeg', description: 'Hold the position and take slow, deep breaths while keeping your chest open and repeat.' },
  ],
  'brisk walking': [
    { subtitle: 'Start Slow',       image: '/Images/brisk_walking_1.jpeg', description: 'Begin with a comfortable walking pace, keeping your posture upright and relaxed.' },
    { subtitle: 'Increase Pace',    image: '/Images/brisk_walking_2.jpeg', description: 'Gradually walk a little faster, swinging your arms naturally and taking steady steps.' },
    { subtitle: 'Extend Duration',  image: '/Images/brisk_walking_3.jpeg', description: 'Continue walking for a longer time at a comfortable pace, maintaining a steady rhythm.' },
  ],
  'calf raises': [
    { subtitle: 'Start Position', image: '/Images/calf_raises_1.jpeg', description: 'Stand straight behind a chair, holding it lightly for support.' },
    { subtitle: 'Raise Heels',    image: '/Images/calf_raises_2.jpeg', description: 'Slowly lift your heels off the ground, rising onto your toes.' },
    { subtitle: 'Lower Down',     image: '/Images/calf_raises_3.jpeg', description: 'Gently lower your heels back to the ground in a controlled movement.' },
  ],
  'sit-to-stand': [
    { subtitle: 'Start Position', image: '/Images/sit_to_stand_1.jpeg', description: 'Sit upright on a chair with your feet flat on the ground.' },
    { subtitle: 'Stand Up',       image: '/Images/sit_to_stand_2.jpeg', description: 'Lean slightly forward and push through your feet to stand up without using your hands.' },
    { subtitle: 'Sit Down',       image: '/Images/sit_to_stand_3.jpeg', description: 'Slowly lower yourself back onto the chair with control.' },
  ],
  'mini squats': [
    { subtitle: 'Start Position', image: '/Images/mini_squats_1.jpeg', description: 'Stand straight with your feet shoulder-width apart and arms stretched forward for balance.' },
    { subtitle: 'Lower Down',     image: '/Images/mini_squats_2.jpeg', description: 'Slowly bend your knees and lower your body slightly, as if sitting on a chair. Keep your back straight.' },
    { subtitle: 'Stand Up',       image: '/Images/mini_squats_3.jpeg', description: 'Push through your feet and gently return to the starting position.' },
  ],
  'hold and balance': [
    { subtitle: 'Start Position',  image: '/Images/hold_and_balance_1.jpeg', description: 'Stand straight next to a chair for support, keeping your body relaxed.' },
    { subtitle: 'Lift and Hold',   image: '/Images/hold_and_balance_2.jpeg', description: 'Lift one leg slightly in front and hold the position, keeping your balance steady.' },
    { subtitle: 'Lower and Switch',image: '/Images/hold_and_balance_3.jpeg', description: 'Gently lower your leg and repeat the same with the other leg.' },
  ],
  'standing balance hold': [
    { subtitle: 'Start Position',  image: '/Images/hold_and_balance_1.jpeg', description: 'Stand straight next to a chair for support, keeping your body relaxed.' },
    { subtitle: 'Lift and Hold',   image: '/Images/hold_and_balance_2.jpeg', description: 'Lift one leg slightly in front and hold the position, keeping your balance steady.' },
    { subtitle: 'Lower and Switch',image: '/Images/hold_and_balance_3.jpeg', description: 'Gently lower your leg and repeat the same with the other leg.' },
  ],
}

const DEFAULT_STEPS = [
  { subtitle: 'Step 1', image: '', description: 'Follow the exercise as demonstrated.' },
  { subtitle: 'Step 2', image: '', description: 'Maintain good posture throughout.' },
  { subtitle: 'Step 3', image: '', description: 'Repeat at a comfortable pace.' },
]

const currentExercise = computed(() => exercises.value[currentIndex.value] ?? {})

const currentSteps = computed(() => {
  const name = (currentExercise.value.exercise_name ?? '').toLowerCase().trim()
  return EXERCISE_CONTENT[name] ?? DEFAULT_STEPS
})
const isLastExercise  = computed(() => currentIndex.value === exercises.value.length - 1)
const progressPercent = computed(() =>
  exercises.value.length === 0 ? 0
  : Math.round(((currentIndex.value + 1) / exercises.value.length) * 100)
)

// Per-exercise scoring: +40 pts, +2%, +0.4 category score each
const pointsEarned       = computed(() => exercisesCompleted.value * 40)
const pctBoost           = computed(() => exercisesCompleted.value * 2)
const categoryScoreBoost = computed(() => (exercisesCompleted.value * 0.4).toFixed(1))


function prevExercise() {
  if (currentIndex.value > 0) {
    exercisesCompleted.value = Math.max(0, exercisesCompleted.value - 1)
    currentIndex.value--
  }
}

function nextExercise() {
  // Count this exercise as completed before advancing
  exercisesCompleted.value++
  if (!isLastExercise.value) {
    currentIndex.value++
  } else {
    finishSession()
  }
}

function finishSession() {
  showPauseModal.value = false
  const n = exercisesCompleted.value
  // Write boosts back to localStorage
  const stored = localStorage.getItem('surveyResult')
  if (stored) {
    const result = JSON.parse(stored)
    result.chartPercent  = Math.min(100, (result.chartPercent  ?? 75) + n * 2)
    result.categoryScore = Math.round(((result.categoryScore ?? 0) + n * 0.4) * 10) / 10
    result.points        = (result.points ?? 0) + n * 40
    localStorage.setItem('surveyResult', JSON.stringify(result))
  }
  localStorage.setItem('sessionCompleted', String(n * 40))   // store actual points for Results badge
  sessionDone.value = true
  visible.value = false
  setTimeout(() => { visible.value = true }, 80)
}

function goToResults() {
  router.push('/results')
}

onMounted(() => {
  setTimeout(() => { visible.value = true }, 80)

  const stored = localStorage.getItem('surveyResult')
  if (stored) {
    const result = JSON.parse(stored)
    if (result.exercises && result.exercises.length > 0) {
      exercises.value = result.exercises.slice(0, 3)
      return
    }
  }

  // Fallback if no survey result in localStorage
  exercises.value = [
    { exercise_name: 'Neck Rotations',       duration_minutes: 5 },
    { exercise_name: 'Seated Chest Stretch', duration_minutes: 8 },
    { exercise_name: 'Ankle Rotations',      duration_minutes: 5 },
  ]
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
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
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

/* CARD — vertical stack of 3 rows */
.card {
  background: #ede9e1;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.card.visible { opacity: 1; transform: translateY(0); }

/* Row 1: Title + tag */
.card-header {
  background: #ede9e1;
  padding: 32px 40px 24px;
  border-bottom: 1px solid #e0dbd2;
  display: flex;
  align-items: baseline;
  gap: 20px;
  flex-wrap: wrap;
}

.exercise-title {
  font-size: 32px;
  font-weight: 700;
  color: #0f3d35;
  margin: 0;
  line-height: 1.2;
}

.tags { display: flex; gap: 10px; }
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

/* Row 2: GIF left, instructions right */
.card-body {
  display: flex;
  gap: 0;
  flex: 1;
}

.card-gif {
  width: 42%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 24px;
  gap: 16px;
  border-right: 1px solid #e0dbd2;
}

.figure-svg { width: 200px; height: 220px; }

.exercise-gif {
  width: 100%;
  max-height: 340px;
  border-radius: 12px;
  object-fit: cover;
  object-position: top;
  display: block;
}

.encouragement {
  background: #0b5d57;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 10px;
}

.card-instructions {
  flex: 1;
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
}

/* Instructions */
.instructions-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #0f3d35;
  margin-bottom: 16px;
}
.label-bar { width: 4px; height: 16px; background: #0b5d57; border-radius: 2px; }

.instructions-text {
  font-size: 15px;
  line-height: 1.7;
  color: #5a6b67;
  margin: 0 0 16px;
}
.notes-text {
  font-size: 13px;
  color: #0b5d57;
  background: #e8f4f3;
  border-radius: 8px;
  padding: 10px 14px;
  margin: 0;
  line-height: 1.5;
}

/* Row 2: 3-step image grid */
.steps-grid {
  display: flex;
  gap: 20px;
  padding: 28px 40px;
}

.step-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.step-subtitle {
  background: #1a5c52;
  color: #ffffff;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  padding: 14px 12px;
}

.step-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}

.step-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #4a4a4a;
  text-align: left;
  padding: 14px 16px;
  margin: 0;
}

/* Row 3: Actions */
.card-footer {
  padding: 24px 40px;
  border-top: 1px solid #e0dbd2;
  display: flex;
  gap: 16px;
  background: #ede9e1;
}

.btn-primary {
  flex: 1;
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
  padding: 16px 24px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-secondary:hover { background: #f0ede6; }
.btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-secondary:disabled:hover { background: #ffffff; }

/* Pause button */
.btn-pause {
  background: #f4f1eb;
  color: #1a2e2b;
  border: 1.5px solid #c8c2b8;
  border-radius: 12px;
  padding: 16px 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.btn-pause:hover { background: #e8e2d8; }

/* CELEBRATION SCREEN */
.celebration {
  background: #ffffff;
  border-radius: 20px;
  padding: 64px 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.celebration.visible { opacity: 1; transform: translateY(0); }
.cel-emoji { font-size: 56px; line-height: 1; }
.cel-title {
  font-size: 40px;
  font-weight: 700;
  color: #0f3d35;
  margin: 0;
}
.cel-subtitle {
  font-size: 18px;
  color: #5a6b67;
  margin: 0;
}
.cel-quote {
  max-width: 580px;
  font-size: 16px;
  line-height: 1.8;
  color: #4a4a4a;
  background: #f4f1eb;
  border-radius: 16px;
  padding: 24px 32px;
  font-style: italic;
}
.cel-stats {
  display: flex;
  gap: 32px;
}
.cel-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.cel-stat-num {
  font-size: 32px;
  font-weight: 700;
  color: #1a8a40;
}
.cel-stat-label {
  font-size: 13px;
  color: #5a6b67;
  font-weight: 500;
}
.btn-celebrate {
  background: #0b5d57;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 18px 40px;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;
}
.btn-celebrate:hover { background: #0f3d35; }

/* PAUSE MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #ffffff;
  border-radius: 20px;
  padding: 48px 40px;
  max-width: 440px;
  width: 90%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-emoji { font-size: 40px; }
.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f3d35;
  margin: 0;
}
.modal-text {
  font-size: 15px;
  line-height: 1.7;
  color: #5a6b67;
  margin: 0;
}
.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
.modal-btn-primary {
  flex: 1;
  background: #1a5c52;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-btn-primary:hover { background: #0f3d35; }
.modal-btn-secondary {
  flex: 1;
  background: #f4f1eb;
  color: #1a2e2b;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-btn-secondary:hover { background: #e8e2d8; }

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
@media (max-width: 768px) {
  .navbar {
    max-width: 100%;
    margin: 0;
    padding: 16px 20px;
    box-sizing: border-box;
    width: 100%;
  }
  .logo { font-size: 18px; }
  .nav-links { gap: 16px; font-size: 14px; }

  .progress-wrap {
    max-width: 100%;
    margin: 0;
    padding: 0 20px 16px;
    box-sizing: border-box;
    width: 100%;
  }

  .main {
    max-width: 100%;
    margin: 0;
    padding: 24px 20px 48px;
    box-sizing: border-box;
    width: 100%;
  }

  .card-header { padding: 24px 20px 16px; }
  .exercise-title { font-size: 24px; }

  .steps-grid { flex-direction: column; padding: 20px; gap: 16px; }
  .step-subtitle { font-size: 14px; }
  .card-body { flex-direction: column; }
  .card-gif { width: 100%; border-right: none; border-bottom: 1px solid #e0dbd2; padding: 20px; }
  .figure-svg { width: 140px; height: 160px; }
  .card-instructions { padding: 20px; }

  .card-footer { flex-direction: column; padding: 20px; gap: 10px; }
  .btn-primary, .btn-secondary { padding: 14px; }

  .footer { padding: 24px 20px; }
  .footer-links { flex-wrap: wrap; gap: 12px; }
}
</style>