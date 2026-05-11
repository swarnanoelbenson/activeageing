<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()

const showExerciseGrid  = ref(false)
const selectedExercise  = ref(null)

const allExercises = [
  { name: 'Shoulder Rolls',         emoji: '🔄', category: 'Flexibility', duration: '5 min',
    description: 'Gentle shoulder rolls to release tension and improve upper body mobility.',
    steps: [
      { title: 'Start Position',   image: '/Images/shoulder_rolls_1.jpeg',  desc: 'Sit upright on a chair with your back straight, arms relaxed at your sides.' },
      { title: 'Roll Forward',     image: '/Images/shoulder_rolls_2.jpeg',  desc: 'Slowly roll both shoulders forward in a smooth circular motion, keeping your neck relaxed.' },
      { title: 'Roll Backward',    image: '/Images/shoulder_rolls_3.jpeg',  desc: 'Reverse the motion, rolling your shoulders backward and squeezing your shoulder blades together.' },
    ]},
  { name: 'Seated Knee Extensions', emoji: '🦵', category: 'Mobility',   duration: '5 min',
    description: 'Seated knee extensions to strengthen the quadriceps and improve knee flexibility.',
    steps: [
      { title: 'Start Position',   image: '/Images/seated_knee_ext_1.jpeg', desc: 'Sit upright on a chair with your feet flat on the floor and hands resting on your thighs.' },
      { title: 'Extend Leg',       image: '/Images/seated_knee_ext_2.jpeg', desc: 'Slowly straighten one leg until it is parallel to the floor, hold for a moment.' },
      { title: 'Lower and Switch', image: '/Images/seated_knee_ext_3.jpeg', desc: 'Gently lower your foot back to the floor and repeat with the other leg.' },
    ]},
  { name: 'Seated Chest Stretch',  emoji: '🧘', category: 'Stretching',   duration: '8 min',
    description: 'Open up your chest and improve posture with this gentle seated stretch.',
    steps: [
      { title: 'Start Position', image: '/Images/seated_chest_stretch_1.jpeg', desc: 'Sit upright on a chair with your back straight and shoulders relaxed.' },
      { title: 'Open Chest',     image: '/Images/seated_chest_stretch_2.jpeg', desc: 'Slowly move your arms out to the sides, opening your chest and keeping your shoulders down.' },
      { title: 'Hold & Breathe', image: '/Images/seated_chest_stretch_3.jpeg', desc: 'Hold the position and take slow, deep breaths while keeping your chest open and repeat.' },
    ]},
  { name: 'Brisk Walking',         emoji: '🚶', category: 'Cardio',       duration: '15 min',
    description: 'A gentle increase in walking pace to build cardiovascular endurance.',
    steps: [
      { title: 'Start Slow',      image: '/Images/brisk_walking_1.jpeg',       desc: 'Begin with a comfortable walking pace, keeping your posture upright and relaxed.' },
      { title: 'Increase Pace',   image: '/Images/brisk_walking_2.jpeg',       desc: 'Gradually walk a little faster, swinging your arms naturally and taking steady steps.' },
      { title: 'Extend Duration', image: '/Images/brisk_walking_3.jpeg',       desc: 'Continue walking at a comfortable pace for a longer time, maintaining a steady rhythm.' },
    ]},
  { name: 'Arm Raises',            emoji: '🏋️', category: 'Strength',    duration: '8 min',
    description: 'Strengthen your shoulders and improve upper body mobility with controlled arm raises.',
    steps: [
      { title: 'Start Position', image: '/Images/arm_raises_1.jpeg',           desc: 'Stand or sit upright with your arms relaxed at your sides and shoulders down.' },
      { title: 'Raise Arms',     image: '/Images/arm_raises_2.jpeg',           desc: 'Slowly raise both arms out to the sides until they reach shoulder height, keeping them straight.' },
      { title: 'Lower Down',     image: '/Images/arm_raises_3.jpeg',           desc: 'Gently lower your arms back to your sides in a controlled movement and repeat.' },
    ]},
  { name: 'Sit-to-Stand',          emoji: '🪑', category: 'Strength',     duration: '10 min',
    description: 'Build leg strength and improve everyday functional movements.',
    steps: [
      { title: 'Start Position', image: '/Images/sit_to_stand_1.jpeg',         desc: 'Sit upright on a chair with your feet flat on the ground.' },
      { title: 'Stand Up',       image: '/Images/sit_to_stand_2.jpeg',         desc: 'Lean slightly forward and push through your feet to stand up without using your hands.' },
      { title: 'Sit Down',       image: '/Images/sit_to_stand_3.jpeg',         desc: 'Slowly lower yourself back onto the chair with control.' },
    ]},
  { name: 'Mini Squats',           emoji: '💪', category: 'Strength',     duration: '10 min',
    description: 'Gentle squats to strengthen your legs and improve stability.',
    steps: [
      { title: 'Start Position', image: '/Images/mini_squats_1.jpeg',          desc: 'Stand straight with your feet shoulder-width apart and arms stretched forward for balance.' },
      { title: 'Lower Down',     image: '/Images/mini_squats_2.jpeg',          desc: 'Slowly bend your knees and lower your body slightly, as if sitting on a chair.' },
      { title: 'Stand Up',       image: '/Images/mini_squats_3.jpeg',          desc: 'Push through your feet and gently return to the starting position.' },
    ]},
  { name: 'Hold and Balance',      emoji: '⚖️', category: 'Balance',      duration: '8 min',
    description: 'Improve your balance and coordination with single-leg holds.',
    steps: [
      { title: 'Start Position',   image: '/Images/hold_and_balance_1.jpeg',   desc: 'Stand straight next to a chair for support, keeping your body relaxed.' },
      { title: 'Lift and Hold',    image: '/Images/hold_and_balance_2.jpeg',   desc: 'Lift one leg slightly in front and hold the position, keeping your balance steady.' },
      { title: 'Lower and Switch', image: '/Images/hold_and_balance_3.jpeg',   desc: 'Gently lower your leg and repeat the same with the other leg.' },
    ]},
  { name: 'Standing Balance Hold', emoji: '🧍', category: 'Balance',      duration: '10 min',
    description: 'Advanced balance practice to build confidence and stability.',
    steps: [
      { title: 'Start Position',   image: '/Images/hold_and_balance_1.jpeg',   desc: 'Stand straight next to a chair for support, keeping your body relaxed.' },
      { title: 'Lift and Hold',    image: '/Images/hold_and_balance_2.jpeg',   desc: 'Lift one leg slightly in front and hold the position, keeping your balance steady.' },
      { title: 'Lower and Switch', image: '/Images/hold_and_balance_3.jpeg',   desc: 'Gently lower your leg and repeat the same with the other leg.' },
    ]},
]

function getStarted() {
  localStorage.removeItem('surveyAnswers')
  localStorage.removeItem('surveyResult')
  localStorage.removeItem('sessionCompleted')
  router.push('/survey')
}

function exploreFeatures() { router.push('/routesurvey') }
function goToSurvey()      { router.push('/survey') }
function goToEvents()      { router.push('/events') }
</script>

<template>
  <div class="root">
    <AppNavbar active="home" />

    <main class="main-content">

      <!-- ── HERO SECTION ── -->
      <section class="hero-section">
        <div class="hero-inner">
          <div class="hero-left">
            <div class="welcome-pill">Welcome</div>
            <h1 class="hero-title">
              Active Ageing,<br />
              Rediscovering
              Memories
            </h1>
            <p class="hero-desc">
              Staying connected and active can bring a wonderful boost to our wellbeing.
              More energy, brighter moods, and a stronger sense of belonging through
              simple everyday movement and community activities.
            </p>
            <button class="btn-primary" @click="getStarted">Get started →</button>
          </div>

          <div class="hero-right">
            <div class="hero-image-box">
              <img src="/Images/happy_couple.jpeg" alt="Happy elderly couple" class="hero-img" />
            </div>
          </div>
        </div>
      </section>

      <!-- ── STATS BAR ── -->
      <section class="stats-bar">
        <div class="stat-item">
          <span class="stat-num">100+</span>
          <span class="stat-label">Walking routes</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">50+</span>
          <span class="stat-label">Weekly events</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">10</span>
          <span class="stat-label">Guided exercises</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num orange">5 min</span>
          <span class="stat-label">Wellness Check-In</span>
        </div>
      </section>

      <!-- ── PLAN MY PATH SECTION ── -->
      <section class="plan-section">
        <div class="plan-card">
          <div class="plan-left">
            <div class="featured-pill">★ Featured</div>
            <h2 class="plan-title">Plan my path</h2>
            <p class="plan-desc">
              Design a walking route that suits your pace, time, and comfort.
              Walk solo, or turn it into a private event and invite friends along.
            </p>
            <ul class="plan-list">
              <li><span class="check-icon">✓</span> Choose your pace and walking time</li>
              <li><span class="check-icon">✓</span> Pick scenic parks or quiet streets</li>
              <li><span class="check-icon">✓</span> Keep it private or invite others to join</li>
            </ul>
            <button class="btn-primary" @click="exploreFeatures">Plan route →</button>
          </div>
          <div class="plan-right">
            <div class="map-preview">
              <svg viewBox="0 0 260 220" xmlns="http://www.w3.org/2000/svg" class="map-svg">
                <defs>
                  <filter id="mshadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.12"/>
                  </filter>
                </defs>

                <!-- Background -->
                <rect width="260" height="220" fill="#f2f6f4" rx="14"/>

                <!-- Decorative soft circles (like the screenshot) -->
                <circle cx="48" cy="52" r="30" fill="#ddeee8" opacity="0.7"/>
                <circle cx="192" cy="168" r="24" fill="#ddeee8" opacity="0.6"/>

                <!-- Curved dashed path from bottom-left to top-right -->
                <path d="M 36 178 C 60 155, 80 148, 100 130 C 120 112, 128 98, 152 80 C 168 68, 188 54, 210 36"
                  fill="none" stroke="#0b5d57" stroke-width="2.5"
                  stroke-dasharray="6 4" stroke-linecap="round" stroke-linejoin="round"/>

                <!-- START: filled dark circle + label -->
                <circle cx="36" cy="178" r="9" fill="#0b5d57"/>
                <text x="52" y="182" font-size="11" fill="#0b5d57" font-weight="700" font-family="Poppins,sans-serif">Start</text>

                <!-- Waypoint 1: Bench stop — hollow circle -->
                <circle cx="100" cy="130" r="5.5" fill="white" stroke="#0b5d57" stroke-width="2"/>
                <text x="110" y="134" font-size="9" fill="#888" font-family="Poppins,sans-serif">Bench stop</text>

                <!-- Waypoint 2: Park view — hollow circle -->
                <circle cx="152" cy="80" r="5.5" fill="white" stroke="#0b5d57" stroke-width="2"/>
                <text x="162" y="84" font-size="9" fill="#888" font-family="Poppins,sans-serif">Park view</text>

                <!-- END: orange rounded square with star -->
                <rect x="198" y="24" width="24" height="24" rx="6" fill="#c9541a"/>
                <text x="210" y="40" text-anchor="middle" font-size="13" fill="white" font-weight="700" font-family="Poppins,sans-serif">★</text>

                <!-- Route badge card -->
                <rect x="142" y="150" width="96" height="44" rx="10" fill="white" filter="url(#mshadow)"/>
                <text x="160" y="165" font-size="7.5" fill="#aaa" font-family="Poppins,sans-serif">YOUR ROUTE</text>
                <!-- small tick -->
                <circle cx="155" cy="179" r="6" fill="#e8f4f0"/>
                <text x="155" y="182" text-anchor="middle" font-size="7" fill="#0b5d57" font-weight="700" font-family="Poppins,sans-serif">✓</text>
                <text x="166" y="183" font-size="11" fill="#0b5d57" font-weight="700" font-family="Poppins,sans-serif">25 min · Easy</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- ── WELLNESS SNAPSHOT ── -->
      <section class="snap-section">
        <div class="snap-header">
          <div class="start-pill">Start here</div>
          <h2 class="snap-title">Wellness snapshot</h2>
          <p class="snap-sub">Answer a few questions and see where you stand compared<br />to the Australian benchmark for adults 65 and over.</p>
        </div>

        <div class="snap-body">
          <div class="snap-categories">
            <div class="cat-card cat-green">
              <div class="cat-icon green-icon">★</div>
              <div>
                <div class="cat-title">Thriving</div>
                <div class="cat-sub">Keep doing what you love</div>
              </div>
            </div>
            <div class="cat-card cat-teal">
              <div class="cat-icon teal-icon">↗</div>
              <div>
                <div class="cat-title">Building momentum</div>
                <div class="cat-sub">On a great upward path</div>
              </div>
            </div>
            <div class="cat-card cat-orange">
              <div class="cat-icon orange-icon">⏱</div>
              <div>
                <div class="cat-title cat-orange-text">Just getting started</div>
                <div class="cat-sub">Gentle first steps for you</div>
              </div>
            </div>
          </div>

          <div class="snap-how">
            <div class="how-label">How it works</div>
            <div class="how-steps">
              <div class="how-step">
                <div class="step-num">1</div>
                <div>
                  <div class="step-title">Quick questionnaire</div>
                  <div class="step-desc">Tell us about your activity, sleep, and social connection.</div>
                </div>
              </div>
              <div class="how-step">
                <div class="step-num">2</div>
                <div>
                  <div class="step-title">Get your category</div>
                  <div class="step-desc">Scored against the Australian benchmark for 65+.</div>
                </div>
              </div>
              <div class="how-step">
                <div class="step-num">3</div>
                <div>
                  <div class="step-title">Exercises made for you</div>
                  <div class="step-desc">Suggestions that match your starting point.</div>
                </div>
              </div>
            </div>
            <button class="btn-primary" @click="goToSurvey">Get my snapshot →</button>
          </div>
        </div>
      </section>

      <!-- ── STAY ACTIVE SECTION ── -->
      <section class="explore-section">
        <div class="explore-label-pill">More to explore</div>
        <h2 class="explore-title">Stay active, stay connected</h2>
        <div class="explore-cards">
          <div class="explore-card">
            <div class="explore-text">
              <h3>Explore events</h3>
              <p>Discover local walks, classes, and meetups happening in your community this week.</p>
              <button class="btn-primary" @click="goToEvents">Find events →</button>
            </div>
            <div class="explore-icon-circle green-circle">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Calendar icon -->
                <rect x="6" y="9" width="32" height="28" rx="4" stroke="#0b5d57" stroke-width="2.2" fill="none"/>
                <line x1="6" y1="17" x2="38" y2="17" stroke="#0b5d57" stroke-width="2"/>
                <line x1="14" y1="6" x2="14" y2="13" stroke="#0b5d57" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="30" y1="6" x2="30" y2="13" stroke="#0b5d57" stroke-width="2.2" stroke-linecap="round"/>
                <circle cx="15" cy="25" r="2" fill="#e07b39"/>
                <circle cx="22" cy="25" r="2" fill="#e07b39"/>
                <circle cx="29" cy="25" r="2" fill="#0b5d57"/>
                <circle cx="15" cy="32" r="2" fill="#0b5d57"/>
                <circle cx="22" cy="32" r="2" fill="#0b5d57"/>
              </svg>
            </div>
          </div>
          <div class="explore-card">
            <div class="explore-text">
              <h3>Browse exercises</h3>
              <p>All exercises in one place, from gentle stretches to guided strength routines.</p>
              <button class="btn-primary" @click="showExerciseGrid = true">View all →</button>
            </div>
            <div class="explore-icon-circle peach-circle">
              <img src="/Images/dumbell.jpeg" alt="Dumbbell" class="explore-icon-img" />
            </div>
          </div>
        </div>
      </section>

      <!-- ── CTA FOOTER BANNER ── -->
      <section class="cta-banner">
        <h2>Ready to start your journey?</h2>
        <p>Take the snapshot, plan a walk, invite a friend. All at your own pace.</p>
        <button class="btn-white" @click="exploreFeatures">Plan my route →</button>
      </section>

    </main>

    <!-- FOOTER -->
    <footer class="footer">
      <h3>ActiveAgeing</h3>

      <div class="links">
        <a>Privacy Policy</a>
        <a>Terms of Service</a>
      </div>

    </footer>

    <!-- Exercise grid overlay -->
    <Transition name="fade">
      <div v-if="showExerciseGrid" class="ex-overlay" @click.self="showExerciseGrid = false">
        <div class="ex-panel">
          <div class="ex-panel-header">
            <h2>All Exercises</h2>
            <button class="ex-close" @click="showExerciseGrid = false">✕</button>
          </div>
          <div class="ex-grid">
            <div v-for="ex in allExercises" :key="ex.name" class="ex-card">
              <div class="ex-card-icon">{{ ex.emoji }}</div>
              <div class="ex-card-body">
                <div class="ex-card-cat">{{ ex.category }}</div>
                <h4 class="ex-card-name">{{ ex.name }}</h4>
                <p class="ex-card-dur">{{ ex.duration }}</p>
              </div>
              <button class="ex-view-btn" @click="selectedExercise = ex">View</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Exercise preview popup -->
    <Transition name="fade">
      <div v-if="selectedExercise" class="ex-preview-overlay" @click.self="selectedExercise = null">
        <div class="ex-preview">
          <div class="ex-preview-header">
            <span class="ex-preview-emoji">{{ selectedExercise.emoji }}</span>
            <div class="ex-preview-title-group">
              <div class="ex-preview-cat">{{ selectedExercise.category }} · {{ selectedExercise.duration }}</div>
              <h3 class="ex-preview-name">{{ selectedExercise.name }}</h3>
            </div>
            <button class="ex-close" @click="selectedExercise = null">✕</button>
          </div>
          <p class="ex-preview-desc">{{ selectedExercise.description }}</p>
          <div class="ex-preview-steps">
            <div v-for="(step, i) in selectedExercise.steps" :key="i" class="ex-step">
              <img :src="step.image" :alt="step.title" class="ex-step-img" />
              <div class="ex-step-body">
                <div class="ex-step-title">
                  <div class="ex-step-num">{{ i + 1 }}</div>
                  <span>{{ step.title }}</span>
                </div>
                <p class="ex-step-text">{{ step.desc }}</p>
              </div>
            </div>
          </div>
          <button class="ex-preview-close-btn" @click="selectedExercise = null">Close</button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,600;1,700&family=Poppins:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.root {
  width: 100%;
  min-height: 100vh;
  background: #faf8f3;
  font-family: 'Poppins', sans-serif;
}

.main-content {
  padding-top: 15px; /* navbar height */
}

/* ── Shared Buttons ── */
.btn-primary {
  background: #0b5d57;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  padding: 13px 28px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  display: inline-block;
  margin-top: 4px;
}
.btn-primary:hover { background: #084a45; transform: translateY(-1px); }

.btn-outline-dark {
  background: transparent;
  color: #0b5d57;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  padding: 10px 22px;
  border-radius: 8px;
  border: 2px solid #0b5d57;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  margin-top: 16px;
  display: inline-block;
}
.btn-outline-dark:hover { background: #e0ede9; transform: translateY(-1px); }

.btn-white {
  background: white;
  color: #0b5d57;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  padding: 13px 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  transition: opacity 0.2s, transform 0.15s;
  display: inline-block;
}
.btn-white:hover { opacity: 0.9; transform: translateY(-1px); }

/* ── HERO ── */
.hero-section {
  background: #ffffff;
  padding: 130px 3vw 60px;
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 48px;
}

.hero-left { flex: 1; }

.welcome-pill {
  display: inline-block;
  background: #e0ede9;
  color: #0b5d57;
  font-size: 20px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 999px;
  margin-bottom: 16px;
}

.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(60px, 4.5vw, 30px);
  font-weight: 600;
  color: #0b5d57;
  line-height: 1.3;
  margin-bottom: 18px;
}

.hero-desc {
  font-size: 20px;
  line-height: 1.75;
  color: #5a6a66;
  max-width: 60ch;
  margin-bottom: 24px;
}

.hero-right { flex-shrink: 0; }

.hero-image-box {
  width: clamp(320px, 40vw, 520px);
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
}

.hero-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

/* ── STATS BAR ── */
.stats-bar {
  background: #ece9e2;
  padding: 24px 3vw;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;          
  padding: 0;
}

.stat-num {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 40px;
  font-weight: 800;
  color: #0b5d57;
  line-height: 1;
}

.stat-num.orange { color: #e07b39; }

.stat-label {
  font-size: 20px;
  color: #7a9490;
  margin-top: 4px;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #c8dcd7;
  flex-shrink: 0;
}

/* ── PLAN MY PATH ── */
.plan-section {
  padding: 48px 3vw;
  background: #faf8f3;
}

.plan-card {
  max-width: 1200px;
  margin: 0 auto;
  background: #f0f4f2;
  border-radius: 20px;
  padding: 48px 56px;
  display: flex;
  gap: 48px;
  align-items: center;
}

.plan-left { flex: 1; }

.featured-pill {
  display: inline-block;
  background: #e0ede9;
  color: #0b5d57;
  font-size: 20px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 999px;
  margin-bottom: 14px;
}

.plan-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(32px, 2.5vw, 50px);
  font-weight: 800;
  color: #0b5d57;
  margin-bottom: 14px;
}

.plan-desc {
  font-size: 20px;
  line-height: 1.7;
  color: #5a6a66;
  margin-bottom: 18px;
  max-width: 40ch;
}

.plan-list {
  list-style: none;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.plan-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  color: #3a5a55;
  font-weight: 500;
}

.check-icon {
  width: 22px;
  height: 22px;
  background: #0b5d57;
  color: white;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}

.plan-right { flex-shrink: 0; }

.map-preview {
  width: 400px;
  height: 400px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.map-svg { width: 100%; height: 100%; }

/* ── WELLNESS SNAPSHOT ── */
.snap-section {
  padding: 56px 3vw;
  background: #ffffff;
}

.snap-header {
  text-align: center;
  margin-bottom: 36px;
}

.start-pill {
  display: inline-block;
  background: #fde8d8;
  color: #c06030;
  font-size: 20px;
  font-weight: 600;
  padding: 5px 18px;
  border-radius: 999px;
  margin-bottom: 12px;
}

.snap-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(36px, 2.5vw, 50px);
  font-weight: 800;
  color: #0b5d57;
  margin-bottom: 12px;
}

.snap-sub {
  font-size: 20px;
  color: #5a6a66;
  line-height: 1.65;
}

.snap-body {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
  background: #f7faf9;
  border-radius: 20px;
  padding: 40px 56px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.05);
}

.snap-categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.cat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 12px;
  border-left: 4px solid transparent;
}
.cat-green  { background: #e8f4f0; border-left-color: #0b5d57; }
.cat-teal   { background: #e8f4f0; border-left-color: #2a9d8f; }
.cat-orange { background: #fdf0e6; border-left-color: #e07b39; }

.cat-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700;
  flex-shrink: 0; color: white;
}
.green-icon  { background: #0b5d57; }
.teal-icon   { background: #2a9d8f; }
.orange-icon { background: #e07b39; }

.cat-title { font-size: 20px; font-weight: 700; color: #0b5d57; }
.cat-orange-text { color: #c06030; }
.cat-sub { font-size: 20px; color: #7a9490; margin-top: 2px; }

.snap-how { flex: 1; }

.how-label {
  font-size: 20px;
  font-weight: 600;
  color: #9aafaa;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.how-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.how-step {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.step-num {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: #e0ede9;
  color: #0b5d57;
  font-size: 20px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}

.step-title { font-size: 20px; font-weight: 700; color: #0b5d57; margin-bottom: 2px; }
.step-desc  { font-size: 20px; color: #7a9490; line-height: 1.5; }

/* ── EXPLORE SECTION ── */
.explore-section {
  padding: 56px 3vw;
  background: #ffffff;
  text-align: center;
}

.explore-label-pill {
  display: inline-block;
  background: #e0ede9;
  color: #0b5d57;
  font-size: 20px;
  font-weight: 600;
  padding: 5px 18px;
  border-radius: 999px;
  margin-bottom: 14px;
}

.explore-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(32px, 2.5vw, 50px);
  font-weight: 800;
  font-style: normal;
  color: #0b5d57;
  margin-bottom: 32px;
}

.explore-cards {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.explore-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border: 1px solid #e8ecea;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  text-align: left;
}

.explore-text h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #0b5d57;
  margin-bottom: 10px;
}

.explore-text p {
  font-size: 20px;
  color: #5a6a66;
  line-height: 1.65;
  max-width: 26ch;
  margin-bottom: 0;
}

.explore-icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.green-circle { background: #e0ede9; }
.peach-circle { background: #fde8d8; }

.explore-icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

/* ── CTA BANNER ── */
.cta-banner {
  background: #0b5d57;
  color: white;
  text-align: center;
  padding: 60px 3vw;
}

.cta-banner h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(32px, 2.5vw, 50px);
  font-weight: 800;
  margin-bottom: 12px;
}

.cta-banner p {
  font-size: 20px;
  opacity: 0.85;
  line-height: 1.6;
}

/* ── FOOTER ── */
.site-footer {
  background: #0b5d57;
  color: rgba(255,255,255,0.75);
  padding: 32px 5vw;
  text-align: center;
}
.footer-inner { max-width: 900px; margin: 0 auto; }
.footer-brand { font-size: 20px; font-weight: 700; color: white; margin-bottom: 10px; }
.footer-links {
  display: flex; justify-content: center; gap: 24px;
  margin-bottom: 12px; flex-wrap: wrap;
}
.footer-links span {
  font-size: 20px; color: rgba(255,255,255,0.75);
  cursor: pointer; transition: color 0.2s;
}
.footer-links span:hover { color: white; }
.footer-copy { font-size: 20px; color: rgba(255,255,255,0.45); }

/* ── EXERCISE GRID OVERLAY ── */
.ex-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 500;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.ex-panel {
  background: #faf8f3;
  border-radius: 20px;
  width: 100%; max-width: 900px;
  max-height: 85vh;
  display: flex; flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
}
.ex-panel-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 28px; border-bottom: 1px solid #e8ecea;
  background: white; flex-shrink: 0;
}
.ex-panel-header h2 { margin: 0; font-size: 20px; color: #0b5d57; }
.ex-close {
  background: none; border: none; font-size: 20px;
  cursor: pointer; color: #888; line-height: 1; padding: 4px 8px;
  border-radius: 6px; transition: background 0.15s;
}
.ex-close:hover { background: #f0f0f0; color: #333; }
.ex-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 24px 28px;
  overflow-y: auto;
}
.ex-card {
  background: white; border-radius: 14px; padding: 18px 16px;
  display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
  border: 1px solid #e8ecea;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.ex-card-icon { font-size: 28px; }
.ex-card-body { flex: 1; }
.ex-card-cat  { font-size: 20px; font-weight: 600; color: #9aafaa; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
.ex-card-name { font-size: 20px; font-weight: 700; color: #0b5d57; margin: 0 0 4px; }
.ex-card-dur  { font-size: 20px; color: #888; margin: 0; }
.ex-view-btn {
  margin-top: 6px; background: #0b5d57; color: white;
  border: none; border-radius: 8px; padding: 8px 18px;
  font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.ex-view-btn:hover { background: #084a45; }

/* ── EXERCISE PREVIEW POPUP ── */
.ex-preview-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 600;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.ex-preview {
  background: white; border-radius: 20px;
  width: 100%; max-width: 560px;
  padding: 28px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.25);
  max-height: 88vh; overflow-y: auto;
}
.ex-preview-header {
  display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px;
}
.ex-preview-emoji { font-size: 36px; flex-shrink: 0; margin-top: 2px; }
.ex-preview-title-group { flex: 1; }
.ex-preview-cat  { font-size: 20px; font-weight: 600; color: #9aafaa; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
.ex-preview-name { font-size: 20px; font-weight: 700; color: #0b5d57; margin: 0; }
.ex-preview-header .ex-close { margin-left: auto; flex-shrink: 0; }
.ex-preview-desc { font-size: 20px; color: #5a6a66; line-height: 1.65; margin-bottom: 20px; }
.ex-preview-steps { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
.ex-step { display: flex; gap: 14px; align-items: flex-start; }
.ex-step-img {
  width: 100px; height: 80px; object-fit: cover;
  border-radius: 10px; flex-shrink: 0;
  background: #e0ede9;
}
.ex-step-body { flex: 1; }
.ex-step-title {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 5px;
  font-size: 20px; font-weight: 700; color: #0b5d57;
}
.ex-step-num {
  width: 24px; height: 24px; border-radius: 50%;
  background: #e0ede9; color: #0b5d57;
  font-size: 20px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ex-step-text { font-size: 20px; color: #5a6a66; line-height: 1.6; margin: 0; }
.ex-preview-close-btn {
  width: 100%; background: #0b5d57; color: white;
  border: none; border-radius: 10px; padding: 13px;
  font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.ex-preview-close-btn:hover { background: #084a45; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero-section { padding: 90px 5vw 24px; }
  .hero-inner { flex-direction: column; gap: 28px; }
  .hero-image-box { width: 100%; min-width: unset; }
  .hero-desc { max-width: 100%; }
  .plan-card { flex-direction: column; padding: 28px 24px; gap: 24px; }
  .map-preview { width: 100%; }
  .snap-section { padding: 36px 5vw; }
  .snap-body { flex-direction: column; padding: 24px; gap: 24px; }
  .explore-section { padding: 36px 5vw; }
  .explore-cards { grid-template-columns: 1fr; }
  .explore-card { flex-direction: column; align-items: flex-start; }
  .stats-bar { flex-wrap: wrap; gap: 16px; }
  .stat-divider { display: none; }
  .ex-grid { grid-template-columns: repeat(2, 1fr); }
  .ex-step { flex-direction: column; }
  .ex-step-img { width: 100%; height: 160px; }
}
@media (max-width: 480px) {
  .hero-title { font-size: 30px; }
  .explore-cards { grid-template-columns: 1fr; }
  .ex-grid { grid-template-columns: 1fr; }
  .stats-bar { padding: 16px 5vw; }
  .stat-item { padding: 0 16px; }
}
</style>