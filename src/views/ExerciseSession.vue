<template>
  <div class="page">
    <AppNavbar />

    <!--
      SESSION PROGRESS BAR
      A thin strip directly below the navbar that shows how far through the
      full session the user is as a percentage. It updates each time they move
      to the next exercise so they always know how close they are to finishing.
    -->
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

    <!--
      ACTIVE EXERCISE CARD
      The main working area of the session. It shows one exercise at a time
      and has three rows inside it:
        Row 1 — the exercise name, a countdown timer, the "Did You Know?" trivia
                 button, and a toggle to switch between step guide and interactive mode.
        Row 2 — either a photo-based step guide (default) or the live webcam
                 pose-estimation view (interactive mode).
        Row 3 — Previous / Next / Pause buttons to navigate through the session.
    -->
    <main v-if="!sessionDone" class="main">
      <div class="card" :class="{ visible }">

        <!-- Row 1: Title -->
        <div class="card-header">
          <h1 class="exercise-title">{{ currentExercise.exercise_name }}</h1>
          <div class="tags">
            <span class="tag" :class="{ 'tag-warning': timerSeconds <= 30 && timerSeconds > 0, 'tag-done': timerSeconds === 0 }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ timerDisplay }}
            </span>
            <!-- Did You Know Button -->
            <button class="dyk-btn" @click="openDidYouKnow">💡 Did You Know?</button>
          </div>
          <button class="btn-interactive-toggle" @click="showInteractive = !showInteractive">
            {{ showInteractive ? 'Alternative Mode' : 'Interactive Mode' }}
          </button>
        </div>

        <!-- Row 2: Step guide OR pose estimation -->
        <div v-if="!showInteractive" class="steps-grid">
          <div class="step-card" v-for="(step, i) in currentSteps" :key="i">
            <div class="step-subtitle">{{ step.subtitle }}</div>
            <img :src="step.image" :alt="step.subtitle" class="step-image" />
            <p class="step-desc">{{ step.description }}</p>
          </div>
        </div>
        <ExerciseSessionModal
          v-else-if="sessionExercise"
          :exercise="sessionExercise"
          inline
        />

        <!-- Row 3: Actions -->
        <div class="card-footer">
          <button class="btn-secondary" :disabled="currentIndex === 0" @click="prevExercise">
            ← Previous Exercise
          </button>
          <button class="btn-primary" @click="nextExercise">
            {{ isLastExercise ? 'Finish Session →' : 'Next Exercise →' }}
          </button>
          <button class="btn-pause" @click="pauseSession">⏸ Pause</button>
        </div>

      </div>
    </main>

    <!--
      END-OF-SESSION SCREEN
      Replaces the exercise card once the session is finished. The message and
      emoji change depending on how many exercises were actually completed —
      from a gentle nudge if none were done, right up to a full celebration if
      all exercises were finished.
    -->
    <main v-else class="main">
      <div class="celebration" :class="{ visible }">

        <template v-if="exercisesCompleted === 0">
          <div class="cel-emoji">🌱</div>
          <h1 class="cel-title">Ready when you are!</h1>
          <p class="cel-subtitle">You haven't completed any exercises yet &#8208; give it a go!</p>
          <div class="cel-actions-try">
            <button class="btn-celebrate" @click="goToResults">← Back to Check-In</button>
            <button class="btn-try-again" @click="tryAgain">Try Again →</button>
          </div>
        </template>

        <template v-else-if="exercisesCompleted === 1">
          <div class="cel-emoji">💪</div>
          <h1 class="cel-title">Small Steps At A Time!</h1>
          <p class="cel-subtitle">1 of 3 exercises done &#8208; every rep counts!</p>
        </template>

        <template v-else-if="exercisesCompleted === 2">
          <div class="cel-emoji">🔥</div>
          <h1 class="cel-title">Halfway There!</h1>
          <p class="cel-subtitle">2 of 3 exercises done &#8208; every rep counts!</p>
        </template>

        <template v-else>
          <div class="cel-emoji">🎉</div>
          <h1 class="cel-title">You Actually Did It!</h1>
          <p class="cel-subtitle">Full session complete &#8208; your body is officially younger than when you started.</p>
        </template>

        <template v-if="exercisesCompleted > 0">
          <button class="btn-celebrate" @click="goToResults">
            ← Back to My Snapshot
          </button>
        </template>
      </div>
    </main>

    <!--
      PAUSE MODAL
      Appears when the user hits the Pause button mid-session. The timer stops
      and the user gets two options — resume where they left off, or end the
      session early and go straight to the results page.
    -->
    <!-- Pause modal -->
    <div v-if="showPauseModal" class="modal-overlay" @click.self="showPauseModal = false">
      <div class="modal">
        <div class="modal-emoji">😌</div>
        <h2 class="modal-title">Take a breather!</h2>
        <p class="modal-text">
          Rest is part of every good plan &#8208; even champions pause.
          Ready to jump back in, or are you calling today a win?
        </p>
        <div class="modal-actions">
          <button class="modal-btn-secondary" @click="showPauseModal = false; resumeTimer()">Resume</button>
          <button class="modal-btn-primary" @click="finishSession">Finish Session</button>
        </div>
      </div>
    </div>

    <!--
      DID YOU KNOW MODAL
      A full-screen pop-up that surfaces a science-backed fact related to the
      current exercise. It shows an icon, the fact itself, and a source link
      so users can read more if they're curious. Closing it returns them to
      exactly where they were in the session.
    -->
    <!-- Did You Know modal -->
    <Teleport to="body">
      <div v-if="showDidYouKnow" class="dyk-overlay" @click.self="closeDidYouKnow">
        <div class="dyk-modal" role="dialog" aria-modal="true" aria-label="Did You Know?">

          <button class="dyk-close" @click="closeDidYouKnow" aria-label="Close">✕</button>

          <div class="dyk-header">
            <h2 class="dyk-title">Did You Know?</h2>
            <p class="dyk-subtitle">{{ currentExercise.exercise_name }}</p>
          </div>

          <div class="dyk-card">
            <div class="dyk-icon-wrap">
              <span class="dyk-icon">{{ currentFact.icon }}</span>
            </div>
            <p class="dyk-fact">{{ currentFact.fact }}</p>
          </div>

          <div class="dyk-source-box">
            <span class="dyk-source-label">SOURCE:</span>
            <a :href="currentFact.sourceUrl" target="_blank" rel="noopener" class="dyk-source-link">
              📖 {{ currentFact.source }} ↗
            </a>
          </div>

          <button class="dyk-back-btn" @click="closeDidYouKnow">Back to Exercise</button>

        </div>
      </div>
    </Teleport>

    <AppFooter />
  </div>

  <!--
    GUIDED PAGE TOUR
    A spotlight overlay that walks first-time users through the main controls —
    the progress bar, the exercise card, and the navigation buttons. It starts
    automatically once the exercises have loaded and is only shown once,
    tracked by a flag saved in localStorage.
  -->
  <!-- Page Tour -->
  <Teleport to="body">
    <div v-if="tourActive" class="tour-overlay">
      <div class="tour-spotlight" :style="spotlightStyle"></div>
      <div class="tour-tooltip" :style="tooltipStyle">
        <div class="tour-step-num">{{ tourStep + 1 }} / {{ TOUR_STEPS.length }}</div>
        <h3 class="tour-title">{{ TOUR_STEPS[tourStep].title }}</h3>
        <p class="tour-desc">{{ TOUR_STEPS[tourStep].desc }}</p>
        <div class="tour-actions">
          <button class="tour-skip" @click="endTour">Skip tour</button>
          <button class="tour-next" @click="nextTourStep">
            {{ tourStep < TOUR_STEPS.length - 1 ? 'Next →' : 'Get Started!' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import ExerciseSessionModal from '../components/ExerciseSessionModal.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const visible = ref(false)   // drives the fade-in CSS transition on the card
const currentIndex = ref(0)
const exercises = ref([])
const exercisesCompleted = ref(0)  // increments each time the user hits Next
const sessionDone = ref(false)
const showPauseModal   = ref(false)
const showInteractive  = ref(false)  // toggles between step-guide and webcam mode

const timerSeconds = ref(0)
let timerInterval = null

// ── Did You Know ───────────────────────────────────────────────────────────
// Science-backed facts keyed by normalised exercise name (lowercase + trim).
// Each fact includes a source URL so users can read the primary research.
// The DEFAULT_FACT at the bottom catches any exercise not yet listed here.
const showDidYouKnow = ref(false)

const EXERCISE_FACTS = {
  'sit-to-stand': {
    icon: '🪑',
    category: 'MOBILITY INSIGHT',
    fact: 'Regular sit-to-stand practice can help older adults improve mobility and maintain independence in daily activities.',
    desc: 'This simple movement trains the exact muscles used in everyday actions — getting up from a chair, out of a car, or off the floor.',
    source: 'PubMed – Sit-to-stand activity to improve mobility in older people',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/32500976/',
  },
  'standing balance hold': {
    icon: '⚖️',
    category: 'FALL PREVENTION FACT',
    fact: 'Balance exercises can reduce the risk of falls in older adults by nearly 40%.',
    desc: 'Regular balance training strengthens the stabilising muscles and improves your body\'s ability to react quickly to unexpected shifts.',
    source: 'PubMed – Exercise for preventing falls in older people living in the community',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/27707740/',
  },
  'hold and balance': {
    icon: '⚖️',
    category: 'FALL PREVENTION FACT',
    fact: 'Balance exercises can reduce the risk of falls in older adults by nearly 40%.',
    desc: 'Regular balance training strengthens the stabilising muscles and improves your body\'s ability to react quickly to unexpected shifts.',
    source: 'PubMed – Exercise for preventing falls in older people living in the community',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/27707740/',
  },
  'ankle rotations': {
    icon: '🦶',
    category: 'BALANCE & SAFETY FACT',
    fact: 'Healthy ankle movement helps support balance and may lower fall risk as we age.',
    desc: 'Ankle strength and flexibility are key foundations of stable movement — keeping them mobile helps the whole body stay steady.',
    source: 'PMC – The role of ankle strength and mobility in balance and fall risk',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3604218/',
  },
  'brisk walking': {
    icon: '🚶',
    category: 'LONGEVITY INSIGHT',
    fact: 'Older adults who maintain a brisk walking pace tend to have better long-term health and lower mortality risk.',
    desc: 'Walking pace is one of the strongest predictors of healthy ageing — even modest increases in speed make a meaningful difference.',
    source: 'PubMed – Walking cadence and health outcomes in older adults',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/24934147/',
  },
  'mini squats': {
    icon: '🦵',
    category: 'STRENGTH INSIGHT',
    fact: 'Mini squats help build leg strength, making everyday activities like walking and getting up from a chair feel easier.',
    desc: 'Strong legs are the foundation of independent movement. Even shallow squats activate the quads, glutes and core effectively.',
    source: 'Nature Scientific Reports – Squat training in older adults',
    sourceUrl: 'https://www.nature.com/articles/s41598-021-86030-7',
  },
  'neck rotations': {
    icon: '🔄',
    category: 'SAFETY & AWARENESS FACT',
    fact: 'Being able to comfortably turn your head helps with everyday safety — from checking traffic while walking to maintaining balance and preventing falls.',
    desc: 'Cervical mobility is often overlooked, but it plays a key role in spatial awareness and postural stability as we age.',
    source: 'European Geriatric Medicine – Cervical mobility and fall risk among older adults',
    sourceUrl: 'https://link.springer.com/article/10.1007/s41999-023-00785-y',
  },
  'seated chest stretch': {
    icon: '🫁',
    category: 'POSTURE & COMFORT FACT',
    fact: 'Spending long periods sitting can make the chest and shoulders feel tight. Gentle chest stretches help keep the upper body feeling open and mobile.',
    desc: 'Opening the chest counteracts the forward rounding that builds up from prolonged sitting, helping you breathe more freely and stand taller.',
    source: 'NHS – Sitting exercises for older adults',
    sourceUrl: 'https://www.nhs.uk/live-well/exercise/sitting-exercises/',
  },
  'calf raises': {
    icon: '💪',
    category: 'STRENGTH & STABILITY FACT',
    fact: 'Strong calf muscles help with walking, climbing stairs, and staying steady on your feet.',
    desc: 'The calves act as a secondary pump for circulation and play a vital role in propulsion and balance during every step you take.',
    source: 'PMC – Calf muscle strength and function in older adults',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5117878/',
  },
  'seated forward lean': {
    icon: '🧘',
    category: 'FLEXIBILITY INSIGHT',
    fact: 'Gentle forward bending helps maintain spinal flexibility and can ease lower back tension that builds up from prolonged sitting.',
    desc: 'A controlled forward lean stretches the back muscles and hamstrings while encouraging mindful, slow movement.',
    source: 'NHS – Sitting exercises for older adults',
    sourceUrl: 'https://www.nhs.uk/live-well/exercise/sitting-exercises/',
  },
  'seated knee extensions': {
    icon: '🦵',
    category: 'JOINT STRENGTH INSIGHT',
    fact: 'Strengthening the muscles around the knee supports joint health and helps reduce the risk of knee pain and instability.',
    desc: 'Knee extensions build the quadriceps — the muscles most responsible for stable, confident walking and stair climbing.',
    source: 'PubMed – Sit-to-stand activity to improve mobility in older people',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/32500976/',
  },
  'arm raises': {
    icon: '🙌',
    category: 'SHOULDER HEALTH FACT',
    fact: 'Shoulder mobility exercises help maintain the range of motion needed for everyday tasks like reaching shelves and dressing.',
    desc: 'Keeping the shoulders strong and mobile reduces stiffness and supports good posture, which benefits balance and breathing.',
    source: 'NHS – Sitting exercises for older adults',
    sourceUrl: 'https://www.nhs.uk/live-well/exercise/sitting-exercises/',
  },
}

const DEFAULT_FACT = {
  icon: '❤️',
  category: 'HEALTH INSIGHT',
  fact: 'Regular gentle exercise helps older adults maintain strength, balance, and independence.',
  desc: 'Even short bouts of movement each day contribute to better mobility, mood, and long-term wellbeing.',
  source: 'NHS – Exercise as we get older',
  sourceUrl: 'https://www.nhs.uk/live-well/exercise/',
}

const currentFact = computed(() => {
  const name = (currentExercise.value.exercise_name ?? '').toLowerCase().trim()
  return EXERCISE_FACTS[name] ?? DEFAULT_FACT
})

function openDidYouKnow() {
  showDidYouKnow.value = true
  document.body.style.overflow = 'hidden'
}

function closeDidYouKnow() {
  showDidYouKnow.value = false
  document.body.style.overflow = ''
}
// ─────────────────────────────────────────────────────────

// ── Timer ──────────────────────────────────────────────────────────────────
// The timer counts down from the exercise's duration_minutes on each new
// exercise. Pausing clears the interval; resumeTimer guards against double-
// starting if called while the interval is already running.
function startTimer() {
  clearInterval(timerInterval)
  const mins = currentExercise.value?.duration_minutes ?? 5
  timerSeconds.value = mins * 60
  timerInterval = setInterval(() => {
    if (timerSeconds.value > 0) timerSeconds.value--
  }, 1000)
}

function pauseSession() {
  clearInterval(timerInterval)
  timerInterval = null
  showPauseModal.value = true
}

function resumeTimer() {
  if (timerInterval) return  // already ticking — don't create a second interval
  timerInterval = setInterval(() => {
    if (timerSeconds.value > 0) timerSeconds.value--
  }, 1000)
}

const timerDisplay = computed(() => {
  const m = Math.floor(timerSeconds.value / 60)
  const s = timerSeconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

// ── Step photos ────────────────────────────────────────────────────────────
// Keyed by lowercase exercise name. Each entry has 3 steps that match the
// three-column step-card layout shown in the session card. DEFAULT_STEPS is
// the fallback for any exercise not in this map.
const EXERCISE_CONTENT = {
  'seated forward lean': [
    { subtitle: 'Start Position', image: '/Images/seated_forward_lean_1.jpeg', description: 'Sit upright near the front of the chair with both feet flat on the floor.' },
    { subtitle: 'Lean Forward',   image: '/Images/seated_forward_lean_2.jpeg', description: 'Slowly bend forward from your hips and reach toward your feet while keeping movements comfortable.' },
    { subtitle: 'Return to Start', image: '/Images/seated_forward_lean_3.jpeg', description: 'Gently sit back upright and relax before repeating.' },
  ],
  'seated knee extensions': [
    { subtitle: 'Start Position',  image: '/Images/seated_knee_extension_1.jpeg', description: 'Sit upright with both feet flat on the floor and your hands resting comfortably on your lap.' },
    { subtitle: 'Lift and Extend', image: '/Images/seated_knee_extension_2.jpeg', description: 'Slowly raise one leg forward while keeping your back straight and arms steady.' },
    { subtitle: 'Lower and Repeat', image: '/Images/seated_knee_extension_3.jpeg', description: 'Gently lower your leg back down and repeat on the other side.' },
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
  'arm raises': [
    { subtitle: 'Start Position', image: '/Images/arm_raises_1.jpeg', description: 'Sit upright in the chair with your feet flat and arms relaxed by your sides.' },
    { subtitle: 'Raise Arms',     image: '/Images/arm_raises_2.jpeg', description: 'Slowly lift both arms upward in a controlled motion until comfortable.' },
    { subtitle: 'Lower Arms',     image: '/Images/arm_raises_3.jpeg', description: 'Gently lower your arms back down to the starting position.' },
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

const sessionExercise = computed(() => {
  const ex = currentExercise.value
  if (!ex.exercise_name) return null
  return {
    name:            ex.exercise_name,
    durationMinutes: ex.duration_minutes ?? 5,
    steps:           currentSteps.value.map(s => ({ title: s.subtitle, image: s.image, desc: s.description })),
  }
})
const isLastExercise  = computed(() => currentIndex.value === exercises.value.length - 1)
const progressPercent = computed(() => {
  if (sessionDone.value && exercisesCompleted.value === exercises.value.length) return 100
  if (exercises.value.length === 0) return 0
  return Math.round((currentIndex.value / exercises.value.length) * 100)
})

function prevExercise() {
  if (currentIndex.value > 0) {
    exercisesCompleted.value = Math.max(0, exercisesCompleted.value - 1)
    currentIndex.value--
  }
}

function nextExercise() {
  exercisesCompleted.value++
  if (!isLastExercise.value) {
    currentIndex.value++
  } else {
    finishSession()
  }
}

// Bumps the chartPercent stored in localStorage by 2% per completed exercise
// (capped at 100) so the Results page reflects this session's contribution.
// visible is toggled off then on with a short delay to re-trigger the
// fade-in transition on the end-of-session celebration card.
function finishSession() {
  showPauseModal.value = false
  const n = exercisesCompleted.value
  const stored = localStorage.getItem('surveyResult')
  if (stored) {
    const result = JSON.parse(stored)
    result.chartPercent = Math.min(100, (result.chartPercent ?? 75) + n * 2)
    localStorage.setItem('surveyResult', JSON.stringify(result))
  }
  sessionDone.value = true
  visible.value = false
  setTimeout(() => { visible.value = true }, 80)
}

function tryAgain() {
  currentIndex.value = 0
  exercisesCompleted.value = 0
  sessionDone.value = false
  visible.value = false
  setTimeout(() => { visible.value = true }, 80)
}

function goToResults() {
  router.push('/results')
}

watch(currentIndex, () => {
  showInteractive.value = false
  startTimer()
})

onBeforeUnmount(() => {
  clearInterval(timerInterval)
  window.removeEventListener('resize', measureTourRect)
  window.removeEventListener('scroll', measureTourRect)
})

// ── Page Tour ─────────────────────────────────────────────
const TOUR_STEPS = [
  { selector: '.steps-grid',           position: 'bottom', title: 'Step-by-Step Guide',    desc: 'Each exercise comes with 3 illustrated steps. Follow along at your own pace.' },
  { selector: '.tag',                  position: 'bottom', title: 'Exercise Timer',         desc: 'This counts down your exercise time. Try to keep moving until it reaches zero!' },
  { selector: '.dyk-btn',             position: 'bottom', title: 'Did You Know?',           desc: 'Tap this for a science-backed health fact about the current exercise.' },
  { selector: '.btn-interactive-toggle', position: 'bottom', title: 'Interactive Mode',    desc: 'Switch to live pose estimation — your camera will automatically count your reps as you move!' },
  { selector: '.card-footer',          position: 'top',    title: 'Session Controls',       desc: 'Move to the next or previous exercise, or pause the session whenever you need a break.' },
]

const tourActive  = ref(false)
const tourStep    = ref(0)
const tourRect    = ref(null)

const TOOLTIP_H = 210  // estimated tooltip height in px

const spotlightStyle = computed(() => {
  if (!tourRect.value) return {}
  const pad = 10
  return {
    left:   `${tourRect.value.left   - pad}px`,
    top:    `${tourRect.value.top    - pad}px`,
    width:  `${tourRect.value.width  + pad * 2}px`,
    height: `${tourRect.value.height + pad * 2}px`,
  }
})

const tooltipStyle = computed(() => {
  if (!tourRect.value) return {}
  const step  = TOUR_STEPS[tourStep.value]
  const pad   = 10
  const gap   = 14
  const vw    = window.innerWidth
  const vh    = window.innerHeight
  const w     = Math.min(320, vw - 32)

  // Horizontal: centre on the target, then clamp inside viewport
  let left = tourRect.value.left + tourRect.value.width / 2 - w / 2
  left = Math.max(16, Math.min(left, vw - w - 16))

  // Vertical: prefer the declared position, flip if not enough room, then clamp
  const spaceBelow = vh - tourRect.value.bottom - pad - gap
  const spaceAbove = tourRect.value.top - pad - gap

  let top
  if (step.position === 'bottom' && spaceBelow >= TOOLTIP_H) {
    top = tourRect.value.bottom + pad + gap
  } else if (spaceAbove >= TOOLTIP_H) {
    top = tourRect.value.top - pad - gap - TOOLTIP_H
  } else {
    // Not enough room either way — pick whichever side has more space
    top = spaceBelow >= spaceAbove
      ? tourRect.value.bottom + pad + gap
      : tourRect.value.top - pad - gap - TOOLTIP_H
  }

  // Final clamp so the tooltip never leaves the viewport
  top = Math.max(8, Math.min(top, vh - TOOLTIP_H - 8))

  return { top: `${top}px`, left: `${left}px`, width: `${w}px` }
})

function measureTourRect() {
  const step = TOUR_STEPS[tourStep.value]
  if (!step) return
  const el = document.querySelector(step.selector)
  if (el) tourRect.value = el.getBoundingClientRect()
}

function updateTourRect() {
  const step = TOUR_STEPS[tourStep.value]
  if (!step) return
  const el = document.querySelector(step.selector)
  if (!el) return
  el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  setTimeout(measureTourRect, 320)
}

function startTour() {
  tourStep.value   = 0
  tourActive.value = true
  nextTick(updateTourRect)
}

function nextTourStep() {
  if (tourStep.value < TOUR_STEPS.length - 1) {
    tourStep.value++
    nextTick(updateTourRect)
  } else {
    endTour()
  }
}

function endTour() {
  tourActive.value = false
  localStorage.setItem('exerciseTourSeen', '1')
}

onMounted(() => {
  setTimeout(() => { visible.value = true }, 80)
  window.addEventListener('resize', measureTourRect)
  window.addEventListener('scroll', measureTourRect, { passive: true })

  // Priority 1: AllExercisesPage wrote a custom selection to 'customExercises'
  // when the user hit "Start session". Read it and remove it immediately so
  // refreshing the page falls through to the survey exercises instead.
  const customEx = localStorage.getItem('customExercises')
  if (customEx) {
    exercises.value = JSON.parse(customEx)
    localStorage.removeItem('customExercises')
    startTimer()
    if (!localStorage.getItem('exerciseTourSeen')) setTimeout(startTour, 600)
    return
  }

  // Priority 2: the survey result includes recommended exercises — use the
  // first three so the session isn't longer than three exercises.
  const stored = localStorage.getItem('surveyResult')
  if (stored) {
    const result = JSON.parse(stored)
    if (result.exercises && result.exercises.length > 0) {
      exercises.value = result.exercises.slice(0, 3)
      startTimer()
      if (!localStorage.getItem('exerciseTourSeen')) setTimeout(startTour, 600)
      return
    }
  }

  // Fallback: show three safe exercises so the page is never empty.
  exercises.value = [
    { exercise_name: 'Seated Forward Lean',  duration_minutes: 5 },
    { exercise_name: 'Seated Chest Stretch', duration_minutes: 8 },
    { exercise_name: 'Seated Knee Extensions', duration_minutes: 5 },
  ]
  startTimer()

  if (!localStorage.getItem('exerciseTourSeen')) {
    setTimeout(startTour, 600)
  }
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
.nav-links { display: flex; gap: 32px; font-size: 20px; font-weight: 500; }
.nav-link { color: #0b5d57; text-decoration: none; cursor: pointer; }
.nav-link.active { text-decoration: underline; text-underline-offset: 4px; }

/* ── Progress bar ──────────────────────────────────────────────────────────
   Uses a two-row CSS grid so the label and percentage sit on row 1 and the
   track fills row 2 spanning all three columns. */
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
.progress-text { font-size: 20px; font-weight: 600; letter-spacing: 0.1em; color: #5a6b67; text-transform: uppercase; }
.progress-pct { grid-column: 3; grid-row: 1; font-size: 20px; font-weight: 600; color: #0b5d57; }
.progress-track { grid-column: 1 / 4; grid-row: 2; height: 8px; background: #d5cfc4; border-radius: 99px; margin-top: 8px; overflow: hidden; }
.progress-fill { height: 100%; background: #0b5d57; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }

.main {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 40px 40px 80px;
  flex: 1;
}

/* ── Exercise card ─────────────────────────────────────────────────────────
   Starts invisible (opacity: 0, translateY) and fades in when `.visible` is
   applied after an 80ms delay — giving the browser time to paint before the
   transition starts so it doesn't appear to flash. */
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

.tags { display: flex; gap: 12px; align-items: center; }
.tag {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid #000000;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 20px;
  color: #000000;
  transition: border-color 0.3s, color 0.3s;
  font-variant-numeric: tabular-nums;
}
.tag.tag-warning { border-color: #c14f4f; color: #c14f4f; }
.tag.tag-done { border-color: #0b5d57; color: #0b5d57; }

/* Did You Know button */
.dyk-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0b5d57;
  color: white;
  border: 1.5px solid #0b5d57;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.dyk-btn:hover { background: #0f3d35; border-color: #0f3d35; }

.btn-interactive-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0b5d57;
  color: white;
  border: 1.5px solid #0b5d57;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  margin-left: auto;
}
.btn-interactive-toggle:hover { background: #0f3d35; border-color: #0f3d35; }

/* Interactive Mode button */
.btn-interactive {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  background: #0b5d57;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.btn-interactive:hover { background: #0f3d35; }
.btn-interactive-exit { background: #7a3a2a; }
.btn-interactive-exit:hover { background: #5a2a1a; }

.card-body { display: flex; gap: 0; flex: 1; }
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
.exercise-gif { width: 100%; max-height: 340px; border-radius: 12px; object-fit: cover; object-position: top; display: block; }
.encouragement { background: #0b5d57; color: #ffffff; font-size: 20px; font-weight: 600; padding: 10px 24px; border-radius: 10px; }
.card-instructions { flex: 1; padding: 32px 36px; display: flex; flex-direction: column; }
.instructions-label { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 600; color: #0f3d35; margin-bottom: 16px; }
.label-bar { width: 4px; height: 16px; background: #0b5d57; border-radius: 2px; }
.instructions-text { font-size: 20px; line-height: 1.7; color: #5a6b67; margin: 0 0 16px; }
.notes-text { font-size: 20px; color: #0b5d57; background: #e8f4f3; border-radius: 8px; padding: 10px 14px; margin: 0; line-height: 1.5; }

.steps-grid { display: flex; gap: 20px; padding: 28px 40px; }
.step-card { flex: 1; display: flex; flex-direction: column; border-radius: 14px; overflow: hidden; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.step-subtitle { background: #1a5c52; color: #ffffff; font-weight: 700; font-size: 20px; text-align: center; padding: 14px 12px; }
.step-image { width: 100%; aspect-ratio: 4 / 3; object-fit: contain; background: #ffffff; display: block; }
.step-desc { font-size: 20px; line-height: 1.6; color: #4a4a4a; text-align: left; padding: 14px 16px; margin: 0; }

.card-footer { padding: 24px 40px; border-top: 1px solid #e0dbd2; display: flex; gap: 16px; background: #ede9e1; }

.btn-primary { flex: 1; background: #1a5c52; color: #ffffff; border: none; border-radius: 12px; padding: 16px; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover { background: #0f3d35; }
.btn-secondary { background: #ffffff; color: #1a2e2b; border: none; border-radius: 12px; padding: 16px 24px; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-secondary:hover { background: #f0ede6; }
.btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-secondary:disabled:hover { background: #ffffff; }
.btn-pause { background: #f4f1eb; color: #1a2e2b; border: 1.5px solid #c8c2b8; border-radius: 12px; padding: 16px 20px; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
.btn-pause:hover { background: #e8e2d8; }

.celebration { background: #ffffff; border-radius: 20px; padding: 64px 48px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 24px; opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.celebration.visible { opacity: 1; transform: translateY(0); }
.cel-emoji { font-size: 56px; line-height: 1; }
.cel-title { font-size: 40px; font-weight: 700; color: #0f3d35; margin: 0; }
.cel-subtitle { font-size: 20px; color: #5a6b67; margin: 0; }
.cel-quote { max-width: 580px; font-size: 20px; line-height: 1.8; color: #4a4a4a; background: #f4f1eb; border-radius: 16px; padding: 24px 32px; font-style: italic; }
.cel-stats { display: flex; gap: 32px; }
.cel-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.cel-stat-num { font-size: 32px; font-weight: 700; color: #1a8a40; }
.cel-stat-label { font-size: 20px; color: #5a6b67; font-weight: 500; }
.cel-actions-try { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
.btn-try-again { background: #b45309; color: #ffffff; border: none; border-radius: 12px; padding: 18px 40px; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-top: 8px; }
.btn-try-again:hover { background: #92400e; }
.btn-celebrate { background: #0b5d57; color: #ffffff; border: none; border-radius: 12px; padding: 18px 40px; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-top: 8px; }
.btn-celebrate:hover { background: #0f3d35; }

/* ── Pause modal ───────────────────────────────────────────────────────────
   z-index: 100 is low enough that the DYK modal (200) can layer above it if
   both were somehow open — in practice only one can be open at a time. */
.modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.45); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: #ffffff; border-radius: 20px; padding: 48px 40px; max-width: 440px; width: 90%; text-align: center; display: flex; flex-direction: column; gap: 16px; }
.modal-emoji { font-size: 40px; }
.modal-title { font-size: 24px; font-weight: 700; color: #0f3d35; margin: 0; }
.modal-text { font-size: 20px; line-height: 1.7; color: #5a6b67; margin: 0; }
.modal-actions { display: flex; gap: 12px; margin-top: 8px; }
.modal-btn-primary { flex: 1; background: #1a5c52; color: #fff; border: none; border-radius: 10px; padding: 14px; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.modal-btn-primary:hover { background: #0f3d35; }
.modal-btn-secondary { flex: 1; background: #f4f1eb; color: #1a2e2b; border: none; border-radius: 10px; padding: 14px; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.modal-btn-secondary:hover { background: #e8e2d8; }

/* ── Did You Know modal ────────────────────────────────────────────────────
   z-index: 200 sits above the pause modal (100) and the regular page content.
   backdrop-filter: blur applied on a second rule below (duplicate selector
   was intentional — see the .dyk-overlay duplication in the template). */
.dyk-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.dyk-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  backdrop-filter: blur(6px);          
  -webkit-backdrop-filter: blur(6px);  
}

.dyk-modal {
  background: #f5f0e8;
  border-radius: 24px;
  padding: 36px 32px 28px;
  max-width: 620px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  animation: dyk-pop 0.25s ease;
  box-sizing: border-box;
}

@keyframes dyk-pop {
  from { transform: scale(0.92); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}

.dyk-close { position: absolute; top: 16px; right: 20px; background: none; border: none; font-size: 20px; color: #888; cursor: pointer; line-height: 1; padding: 4px; }
.dyk-close:hover { color: #333; }

.dyk-header { text-align: center; margin-bottom: 20px; }
.dyk-title { font-size: 30px; font-weight: 700; color: #0b5d57; margin: 0 0 4px; }
.dyk-subtitle { font-size: 20px; color: #6b7280; margin: 0; font-weight: 500; }

.dyk-card { background: white; border-radius: 18px; padding: 24px 22px; margin-bottom: 16px; }

.dyk-icon-wrap { width: 64px; height: 64px; background: #fce8e0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 16px; }

.dyk-fact { font-size: 28px; font-weight: 700; color: #1a1a1a; line-height: 1.45; margin: 0 0 14px; }

.dyk-category-badge { display: inline-block; background: #fde8d8; color: #7c3d1a; font-size: 14px; font-weight: 700; letter-spacing: 0.06em; padding: 5px 14px; border-radius: 20px; margin-bottom: 14px; }

.dyk-fact-desc { font-size: 20px; color: #555; line-height: 1.6; margin: 0; }

.dyk-source-box { background: #dff0ee; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
.dyk-source-label { font-size: 14px; font-weight: 700; color: #0b5d57; letter-spacing: 0.06em; white-space: nowrap; }
.dyk-source-link { font-size: 20px; color: #0b5d57; font-weight: 500; text-decoration: underline; text-underline-offset: 3px; word-break: break-word; }
.dyk-source-link:hover { color: #084a45; }

.dyk-back-btn { display: block; width: 100%; padding: 14px; background: #0b5d57; color: white; border: none; border-radius: 12px; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600; cursor: pointer; transition: background 0.2s; text-align: center; box-sizing: border-box; }
.dyk-back-btn:hover { background: #084a45; }

/* FOOTER */

/* RESPONSIVE */
@media (max-width: 768px) {
  .navbar { max-width: 100%; margin: 0; padding: 16px 20px; box-sizing: border-box; width: 100%; }
  .logo { font-size: 20px; }
  .nav-links { gap: 16px; font-size: 20px; }
  .progress-wrap { max-width: 100%; margin: 0; padding: 0 20px 16px; box-sizing: border-box; width: 100%; }
  .main { max-width: 100%; margin: 0; padding: 24px 20px 48px; box-sizing: border-box; width: 100%; }
  .card-header { padding: 24px 20px 16px; }
  .exercise-title { font-size: 24px; }
  .steps-grid { flex-direction: column; padding: 20px; gap: 16px; }
  .btn-interactive { font-size: 20px; padding: 8px 12px; }
  .dyk-btn, .btn-interactive-toggle { font-size: 20px; padding: 8px 12px; }
  .step-subtitle { font-size: 20px; }
  .card-body { flex-direction: column; }
  .card-gif { width: 100%; border-right: none; border-bottom: 1px solid #e0dbd2; padding: 20px; }
  .figure-svg { width: 140px; height: 160px; }
  .card-instructions { padding: 20px; }
  .card-footer { flex-direction: column; padding: 20px; gap: 10px; }
  .btn-primary, .btn-secondary { padding: 14px; width: 100%; }
  .dyk-modal { padding: 28px 20px 22px; }
  .dyk-title { font-size: 26px; }
  .dyk-fact { font-size: 20px; }
}

@media (max-width: 480px) {
  .main { padding: 20px 14px 40px; }
  .card-header { padding: 20px 16px 14px; }
  .card-instructions { padding: 16px; }
  .card-gif { padding: 16px; }
  .step-cards { gap: 8px; padding: 0 16px 16px; }
}

/* ── Page Tour ─────────────────────────────────────────────────────────────
   z-index: 9000/9001/9002 puts the tour above everything including the DYK
   modal (200). pointer-events: none on the overlay itself means the user
   can still scroll to see the highlighted element before the tooltip appears. */
.tour-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  pointer-events: none;
}
.tour-spotlight {
  position: fixed;
  border-radius: 10px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.62);
  pointer-events: none;
  transition: left 0.3s ease, top 0.3s ease, width 0.3s ease, height 0.3s ease;
  z-index: 9001;
}
.tour-tooltip {
  position: fixed;
  background: #ffffff;
  border-radius: 14px;
  padding: 20px 22px 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.22);
  z-index: 9002;
  pointer-events: all;
  transition: left 0.3s ease, top 0.3s ease;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  box-sizing: border-box;
}
.tour-step-num {
  font-size: 14px;
  font-weight: 700;
  color: #0b5d57;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}
.tour-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f3d35;
  margin: 0 0 8px;
}
.tour-desc {
  font-size: 20px;
  color: #444;
  line-height: 1.55;
  margin: 0 0 16px;
}
.tour-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.tour-skip {
  background: none;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  color: #888;
  cursor: pointer;
  padding: 0;
}
.tour-skip:hover { color: #333; }
.tour-next {
  background: #0b5d57;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 9px 18px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
}
.tour-next:hover { background: #0f3d35; }
</style>