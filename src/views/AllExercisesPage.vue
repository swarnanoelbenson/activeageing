<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()

// ── Exercise library ──────────────────────────────────────────────────────────
// Every exercise is defined here as a static list — no backend fetch needed.
// Each entry has the card-level data (name, emoji, category, duration) plus a
// `steps` array used by both the detail modal AND the interactive session modal.
// Images live in /public/Images/ and are referenced by relative path.
const allExercises = [
  { name: 'Seated Forward Lean',    emoji: '🪑', category: 'Flexibility', duration: '5 min',
    description: 'A gentle seated forward lean to improve flexibility and stretch the lower back.',
    steps: [
      { title: 'Start Position',  image: '/Images/seated_forward_lean_1.jpeg', desc: 'Sit upright near the front of the chair with both feet flat on the floor.' },
      { title: 'Lean Forward',    image: '/Images/seated_forward_lean_2.jpeg', desc: 'Slowly bend forward from your hips and reach toward your feet while keeping movements comfortable.' },
      { title: 'Return to Start', image: '/Images/seated_forward_lean_3.jpeg', desc: 'Gently sit back upright and relax before repeating.' },
    ]},
  { name: 'Seated Knee Extensions', emoji: '🦵', category: 'Mobility', duration: '5 min',
    description: 'Seated knee extensions to strengthen the quadriceps and improve knee flexibility.',
    steps: [
      { title: 'Start Position',   image: '/Images/seated_knee_extension_1.jpeg', desc: 'Sit upright with both feet flat on the floor and your hands resting comfortably on your lap.' },
      { title: 'Lift and Extend',  image: '/Images/seated_knee_extension_2.jpeg', desc: 'Slowly raise one leg forward while keeping your back straight and arms steady.' },
      { title: 'Lower and Repeat', image: '/Images/seated_knee_extension_3.jpeg', desc: 'Gently lower your leg back down and repeat on the other side.' },
    ]},
  { name: 'Seated Chest Stretch',   emoji: '🧘', category: 'Stretching', duration: '8 min',
    description: 'Open up your chest and improve posture with this gentle seated stretch.',
    steps: [
      { title: 'Start Position', image: '/Images/seated_chest_stretch_1.jpeg', desc: 'Sit upright on a chair with your back straight and shoulders relaxed.' },
      { title: 'Open Chest',     image: '/Images/seated_chest_stretch_2.jpeg', desc: 'Slowly move your arms out to the sides, opening your chest and keeping your shoulders down.' },
      { title: 'Hold & Breathe', image: '/Images/seated_chest_stretch_3.jpeg', desc: 'Hold the position and take slow, deep breaths while keeping your chest open and repeat.' },
    ]},
  { name: 'Brisk Walking',          emoji: '🚶', category: 'Cardio', duration: '15 min',
    description: 'A gentle increase in walking pace to build cardiovascular endurance.',
    steps: [
      { title: 'Start Slow',      image: '/Images/brisk_walking_1.jpeg', desc: 'Begin with a comfortable walking pace, keeping your posture upright and relaxed.' },
      { title: 'Increase Pace',   image: '/Images/brisk_walking_2.jpeg', desc: 'Gradually walk a little faster, swinging your arms naturally and taking steady steps.' },
      { title: 'Extend Duration', image: '/Images/brisk_walking_3.jpeg', desc: 'Continue walking at a comfortable pace for a longer time, maintaining a steady rhythm.' },
    ]},
  { name: 'Arm Raises',             emoji: '🏋️', category: 'Strength', duration: '8 min',
    description: 'Strengthen your shoulders and improve upper body mobility with controlled arm raises.',
    steps: [
      { title: 'Start Position', image: '/Images/arm_raises_1.jpeg', desc: 'Sit upright in the chair with your feet flat and arms relaxed by your sides.' },
      { title: 'Raise Arms',     image: '/Images/arm_raises_2.jpeg', desc: 'Slowly lift both arms upward in a controlled motion until comfortable.' },
      { title: 'Lower Arms',     image: '/Images/arm_raises_3.jpeg', desc: 'Gently lower your arms back down to the starting position.' },
    ]},
  { name: 'Sit-to-Stand',           emoji: '🪑', category: 'Strength', duration: '10 min',
    description: 'Build leg strength and improve everyday functional movements.',
    steps: [
      { title: 'Start Position', image: '/Images/sit_to_stand_1.jpeg', desc: 'Sit upright on a chair with your feet flat on the ground.' },
      { title: 'Stand Up',       image: '/Images/sit_to_stand_2.jpeg', desc: 'Lean slightly forward and push through your feet to stand up without using your hands.' },
      { title: 'Sit Down',       image: '/Images/sit_to_stand_3.jpeg', desc: 'Slowly lower yourself back onto the chair with control.' },
    ]},
  { name: 'Mini Squats',            emoji: '💪', category: 'Strength', duration: '10 min',
    description: 'Gentle squats to strengthen your legs and improve stability.',
    steps: [
      { title: 'Start Position', image: '/Images/mini_squats_1.jpeg', desc: 'Stand straight with your feet shoulder-width apart and arms stretched forward for balance.' },
      { title: 'Lower Down',     image: '/Images/mini_squats_2.jpeg', desc: 'Slowly bend your knees and lower your body slightly, as if sitting on a chair.' },
      { title: 'Stand Up',       image: '/Images/mini_squats_3.jpeg', desc: 'Push through your feet and gently return to the starting position.' },
    ]},
  { name: 'Hold and Balance',       emoji: '⚖️', category: 'Balance', duration: '8 min',
    description: 'Improve your balance and coordination with single-leg holds.',
    steps: [
      { title: 'Start Position',   image: '/Images/hold_and_balance_1.jpeg', desc: 'Stand straight next to a chair for support, keeping your body relaxed.' },
      { title: 'Lift and Hold',    image: '/Images/hold_and_balance_2.jpeg', desc: 'Lift one leg slightly in front and hold the position, keeping your balance steady.' },
      { title: 'Lower and Switch', image: '/Images/hold_and_balance_3.jpeg', desc: 'Gently lower your leg and repeat the same with the other leg.' },
    ]},
  { name: 'Standing Balance Hold',  emoji: '🧍', category: 'Balance', duration: '10 min',
    description: 'Advanced balance practice to build confidence and stability.',
    steps: [
      { title: 'Start Position',   image: '/Images/hold_and_balance_1.jpeg', desc: 'Stand straight next to a chair for support, keeping your body relaxed.' },
      { title: 'Lift and Hold',    image: '/Images/hold_and_balance_2.jpeg', desc: 'Lift one leg slightly in front and hold the position, keeping your balance steady.' },
      { title: 'Lower and Switch', image: '/Images/hold_and_balance_3.jpeg', desc: 'Gently lower your leg and repeat the same with the other leg.' },
    ]},
]

// Derive the category filter options dynamically from the exercise list so
// adding a new exercise with a new category auto-appears in the filter bar.
const ALL_CATS = ['All', ...new Set(allExercises.map(e => e.category))]

// ── Reactive state ────────────────────────────────────────────────────────────
const selectedCategory = ref('All')      // currently active filter pill
const selectedNames    = ref(new Set())  // Set of exercise names queued for the session
const viewing          = ref(null)       // the exercise object whose detail modal is open (null = closed)

// Returns the full list when 'All' is selected, otherwise filters by category.
const filteredExercises = computed(() =>
  selectedCategory.value === 'All'
    ? allExercises
    : allExercises.filter(e => e.category === selectedCategory.value)
)

// ── Selection helpers ─────────────────────────────────────────────────────────

// We replace the Set with a new one each time so Vue's reactivity system
// detects the change — mutating the existing Set in place would not trigger
// re-renders because Vue can't observe Set mutations directly.
function toggleSelect(name) {
  const s = new Set(selectedNames.value)
  s.has(name) ? s.delete(name) : s.add(name)
  selectedNames.value = s
}

function clearSelection() { selectedNames.value = new Set() }

// Saves the queued exercises to localStorage so ExerciseSession.vue can read
// them on mount. The order matches the order they appear in allExercises,
// not the order the user clicked them — keeping the session flow predictable.
function startSession() {
  const selected = allExercises
    .filter(e => selectedNames.value.has(e.name))
    .map(e => ({ exercise_name: e.name, duration_minutes: parseInt(e.duration) || 5 }))
  localStorage.setItem('customExercises', JSON.stringify(selected))
  router.push('/exercise')
}

// Plays a single exercise directly from the detail modal without touching the
// user's existing checkbox selection. Closes the modal first to avoid a flash.
function playSingle(ex) {
  viewing.value = null
  localStorage.setItem('customExercises', JSON.stringify([
    { exercise_name: ex.name, duration_minutes: parseInt(ex.duration) || 5 }
  ]))
  router.push('/exercise')
}
</script>

<template>
  <div class="page">
    <AppNavbar active="exercises" />

    <div class="container">


      <!--
        PAGE HEADER
        A simple headline and one-line description at the top of the page that
        sets the expectation — this is the full library and users can hand-pick
        exercises to build their own session.
      -->
      <section class="hero">
        <h1>All <span>Exercises</span></h1>
        <p class="hero-sub">Browse our full library. Tick any exercises and start a personalised session.</p>
      </section>

      <!--
        CATEGORY FILTER BAR
        A row of pill buttons — All, Flexibility, Mobility, Strength, etc. —
        that narrows the exercise grid to one category at a time. Selecting a
        category immediately hides anything that doesn't match, so users aren't
        overwhelmed by the full list if they already know what type of exercise
        they want.
      -->
      <div class="cat-filter">
        <button
          v-for="cat in ALL_CATS"
          :key="cat"
          class="cat-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!--
        EXERCISE GRID
        Each card shows an emoji, category tag, exercise name, and duration.
        Users can tick the checkbox on any card to add it to their session, or
        click "View →" to open the detail modal first. Cards turn green when
        selected so it's easy to see what's already in the queue.
      -->
      <div class="ex-grid">
        <div
          v-for="ex in filteredExercises"
          :key="ex.name"
          class="ex-card"
          :class="{ selected: selectedNames.has(ex.name) }"
        >
          <label class="ex-check-wrap">
            <input
              type="checkbox"
              class="ex-checkbox"
              :checked="selectedNames.has(ex.name)"
              @change="toggleSelect(ex.name)"
            />
          </label>
          <div class="ex-emoji">{{ ex.emoji }}</div>
          <div class="ex-body">
            <div class="ex-cat-tag">{{ ex.category }}</div>
            <h3 class="ex-name">{{ ex.name }}</h3>
            <div class="ex-dur">⏱ {{ ex.duration }}</div>
          </div>
          <button class="ex-view-btn" @click="viewing = ex">View →</button>
        </div>
      </div>
    </div>

    <!--
      EXERCISE DETAIL MODAL
      Opens when the user clicks "View →" on any exercise card. Shows the full
      description, a photo for each step with instructions, and two action
      buttons at the bottom — one to add (or remove) the exercise from the
      current session queue, and one to simply close the modal and go back.
    -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="viewing" class="modal-overlay" @click.self="viewing = null">
          <div class="modal">
            <div class="modal-header">
              <span class="modal-emoji">{{ viewing.emoji }}</span>
              <div class="modal-title-group">
                <div class="modal-cat">{{ viewing.category }} · {{ viewing.duration }}</div>
                <h2 class="modal-name">{{ viewing.name }}</h2>
              </div>
              <button class="modal-play-btn" @click="playSingle(viewing)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg>
                Play
              </button>
              <button class="modal-close" @click="viewing = null">✕</button>
            </div>
            <p class="modal-desc">{{ viewing.description }}</p>
            <div class="modal-steps">
              <div v-for="(step, i) in viewing.steps" :key="i" class="modal-step">
                <img :src="step.image" :alt="step.title" class="step-img" />
                <div class="step-body">
                  <div class="step-label">
                    <span class="step-num">{{ i + 1 }}</span>
                    <span class="step-title">{{ step.title }}</span>
                  </div>
                  <p class="step-desc">{{ step.desc }}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="modal-add-btn" @click="toggleSelect(viewing.name); viewing = null">
                {{ selectedNames.has(viewing.name) ? '✓ Added to session' : '+ Add to session' }}
              </button>
              <button class="modal-close-btn" @click="viewing = null">Close</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!--
      SELECTION BAR
      A sticky bar that slides up from the bottom of the screen the moment a
      user ticks their first exercise. It shows a live count of how many
      exercises are queued, a "Clear" button to start over, and the "Start
      Session" button that saves the selection and takes the user straight
      into their custom exercise session.
    -->
    <Transition name="slide-bar">
      <div v-if="selectedNames.size > 0" class="selection-bar">
        <span class="sel-count">{{ selectedNames.size }} exercise{{ selectedNames.size !== 1 ? 's' : '' }} selected</span>
        <button class="sel-clear" @click="clearSelection">Clear</button>
        <button class="sel-start" @click="startSession">Start Session →</button>
      </div>
    </Transition>

    <AppFooter />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

:global(body) { margin: 0; font-family: 'Poppins', sans-serif; background: #f6f6f6; }

.page { min-height: 100vh; display: flex; flex-direction: column; background: #f6f6f6; }

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  padding-top: var(--navbar-h, 70px);
  box-sizing: border-box;
  flex: 1;
}

/* ── Hero ────────────────────────────────────────────────────────────────────
   Simple headline + subtitle. The word "Exercises" inside the <span> is
   styled amber (#b45309) to visually break up the title without a second
   line, giving it a bit of brand warmth against the teal heading. */
.hero { margin-top: 28px; margin-bottom: 28px; }
.hero h1 { font-size: 38px; font-weight: 700; color: #0b5d57; margin: 0 0 10px; }
.hero h1 span { color: #b45309; }
.hero-sub { font-size: 20px; color: #555; margin: 0; line-height: 1.6; }

/* ── Category filter ─────────────────────────────────────────────────────────
   Pill buttons that wrap onto a second line on narrow screens. The active
   pill swaps to a teal fill so it's clearly distinct from the outlined
   inactive pills without needing a tick or icon. */
.cat-filter { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }
.cat-btn {
  padding: 8px 20px;
  border-radius: 999px;
  border: 2px solid #0b5d57;
  background: white;
  color: #0b5d57;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s;
}
.cat-btn:hover { background: #e8f4f3; }
.cat-btn.active { background: #0b5d57; color: white; }

/* ── Exercise grid ───────────────────────────────────────────────────────────
   Three-column grid on desktop, dropping to two on tablet and one on mobile.
   padding-bottom: 100px reserves space for the sticky selection bar so the
   last row of cards is never hidden behind it when exercises are selected. */
.ex-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  padding-bottom: 100px;
}

.ex-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  border: 2px solid transparent;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  position: relative;
}
.ex-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.10); }
.ex-card.selected { border-color: #0b5d57; background: #f0f9f8; }

.ex-check-wrap {
  position: absolute;
  top: 14px;
  left: 14px;
  cursor: pointer;
}
.ex-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #0b5d57;
  cursor: pointer;
}

.ex-emoji { font-size: 40px; margin-top: 4px; }

.ex-body { text-align: center; }
.ex-cat-tag {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9aafaa;
  margin-bottom: 4px;
}
.ex-name { font-size: 20px; font-weight: 700; color: #0b5d57; margin: 0 0 6px; }
.ex-dur { font-size: 16px; color: #888; }

.ex-view-btn {
  margin-top: 4px;
  padding: 9px 22px;
  background: #0b5d57;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}
.ex-view-btn:hover { background: #084a45; }

/* ── Exercise detail modal ───────────────────────────────────────────────────
   Standard centred overlay. max-height: 90vh + overflow-y: auto lets the
   modal scroll internally on short screens without the backdrop shifting.
   The step images use a fixed height (70px) so cards stay uniform even if
   image aspect ratios differ. */
.modal-overlay {
  position: fixed; inset: 0; z-index: 800;
  background: rgba(0,0,0,0.48);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
}
.modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.22);
}
.modal-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}
.modal-emoji { font-size: 36px; flex-shrink: 0; }
.modal-title-group { flex: 1; min-width: 0; }
.modal-cat { font-size: 14px; font-weight: 600; color: #9aafaa; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
.modal-name { font-size: 20px; font-weight: 700; color: #0b5d57; margin: 0; }
.modal-play-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 18px;
  background: #0b5d57; color: white;
  border: none; border-radius: 8px;
  font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600;
  cursor: pointer; transition: background 0.2s; flex-shrink: 0;
}
.modal-play-btn:hover { background: #084a45; }
.modal-close {
  background: none; border: none; font-size: 20px;
  cursor: pointer; color: #888; padding: 4px 8px;
  border-radius: 6px; flex-shrink: 0;
}
.modal-close:hover { background: #f0f0f0; }
.modal-desc { font-size: 20px; color: #555; line-height: 1.6; margin: 0 0 20px; }

.modal-steps { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
.modal-step {
  display: flex; gap: 14px; align-items: flex-start;
  background: #f9f7f3; border-radius: 12px; padding: 14px;
}
.step-img {
  width: 90px; height: 70px;
  object-fit: cover; border-radius: 8px; flex-shrink: 0;
}
.step-body { flex: 1; }
.step-label { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.step-num {
  width: 22px; height: 22px; border-radius: 50%;
  background: #0b5d57; color: white;
  font-size: 14px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.step-title { font-size: 20px; font-weight: 700; color: #0b5d57; }
.step-desc { font-size: 18px; color: #555; line-height: 1.5; margin: 0; }

.modal-footer { display: flex; gap: 10px; }
.modal-add-btn {
  flex: 1; padding: 12px;
  background: #e8f4f3; color: #0b5d57;
  border: 2px solid #0b5d57; border-radius: 10px;
  font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.modal-add-btn:hover { background: #d0ece9; }
.modal-close-btn {
  flex: 1; padding: 12px;
  background: #0b5d57; color: white;
  border: none; border-radius: 10px;
  font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.modal-close-btn:hover { background: #084a45; }

/* ── Selection bar ───────────────────────────────────────────────────────────
   Sticky teal strip fixed to the bottom of the viewport. z-index: 700 sits
   below the modal (z-index: 800) so the modal can still open on top.
   The bar slides up with a springy cubic-bezier so it feels like it's
   snapping into place rather than just appearing. */
.selection-bar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: #0b5d57;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 40px;
  z-index: 700;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.18);
  flex-wrap: wrap;
}
.sel-count { font-size: 20px; font-weight: 600; flex: 1; }
.sel-clear {
  padding: 10px 20px;
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.3);
  border-radius: 8px; color: white;
  font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 500;
  cursor: pointer; transition: background 0.2s;
}
.sel-clear:hover { background: rgba(255,255,255,0.25); }
.sel-start {
  padding: 10px 24px;
  background: white; color: #0b5d57;
  border: none; border-radius: 8px;
  font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700;
  cursor: pointer; transition: background 0.2s, transform 0.15s;
}
.sel-start:hover { background: #e8f4f3; transform: translateY(-1px); }

/* ── Transitions ─────────────────────────────────────────────────────────────
   `fade` is used by the detail modal overlay — a simple opacity crossfade.
   `slide-bar` is used by the selection bar — enters with an overshoot spring
   (cubic-bezier 0.34,1.56) and leaves with a plain ease so the dismissal
   feels quick and clean rather than bouncing back out. */
.fade-enter-active, .fade-leave-active { transition: opacity 0.22s; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
.slide-bar-enter-active { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.slide-bar-leave-active { transition: transform 0.22s ease; }
.slide-bar-enter-from, .slide-bar-leave-to { transform: translateY(100%); }


/* ── Responsive ──────────────────────────────────────────────────────────────
   768px (tablet): grid drops to 2 columns, side padding tightens.
   480px (phone): grid goes single column so cards aren't too squished;
   modal steps stack vertically with a taller image so the reference photo
   is actually readable on a small screen. */
@media (max-width: 768px) {
  .container { padding: 0 20px; padding-top: var(--navbar-h, 60px); }
  .ex-grid { grid-template-columns: repeat(2, 1fr); }
  .hero h1 { font-size: 28px; }
  .selection-bar { padding: 14px 20px; }
}
@media (max-width: 480px) {
  .ex-grid { grid-template-columns: 1fr; }
  .hero h1 { font-size: 24px; }
  .modal-step { flex-direction: column; }
  .step-img { width: 100%; height: 160px; }
}
</style>
