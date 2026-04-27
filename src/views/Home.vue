<script setup>
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()

function getStarted() {
  localStorage.removeItem('surveyAnswers')
  localStorage.removeItem('surveyResult')
  localStorage.removeItem('sessionCompleted')
  router.push('/snapshot')
}

function exploreFeatures() {
  router.push('/routesurvey')
}

function goToSurvey() {
  router.push('/survey')
}

function goToEvents() {
  router.push('/events')
}

function goToExercises() {
  router.push('/exercise')
}
</script>

<template>
  <div class="root">
    <AppNavbar active="home" />

    <main class="main-content">

      <!-- ── HERO SECTION ── -->
      <section class="hero-section">
        <div class="hero-inner">
          <div class="hero-left">
            <div class="welcome-pill">Welcome back</div>
            <h1 class="hero-title">
              Active Ageing,<br />
              Rediscovering<br />
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
              <span class="hero-image-placeholder">[ Hero image: elderly couple laughing ]</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── STATS BAR ── -->
      <section class="stats-bar">
        <div class="stat-item">
          <span class="stat-num">150+</span>
          <span class="stat-label">Walking routes</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">50+</span>
          <span class="stat-label">Weekly events</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">30+</span>
          <span class="stat-label">Guided exercises</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num orange">100%</span>
          <span class="stat-label">Private, no data stored</span>
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
              <button class="btn-primary" @click="goToExercises">View all →</button>
            </div>
            <div class="explore-icon-circle peach-circle">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Dumbbell icon -->
                <rect x="3" y="18" width="8" height="8" rx="2.5" stroke="#0b5d57" stroke-width="2" fill="none"/>
                <rect x="33" y="18" width="8" height="8" rx="2.5" stroke="#0b5d57" stroke-width="2" fill="none"/>
                <rect x="6" y="20" width="5" height="4" rx="1" fill="#0b5d57"/>
                <rect x="33" y="20" width="5" height="4" rx="1" fill="#0b5d57"/>
                <line x1="11" y1="22" x2="33" y2="22" stroke="#0b5d57" stroke-width="2.5" stroke-linecap="round"/>
                <rect x="14" y="17" width="5" height="10" rx="2" stroke="#0b5d57" stroke-width="2" fill="none"/>
                <rect x="25" y="17" width="5" height="10" rx="2" stroke="#0b5d57" stroke-width="2" fill="none"/>
              </svg>
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
  padding-top: 64px; /* navbar height */
}

/* ── Shared Buttons ── */
.btn-primary {
  background: #0b5d57;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
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
  font-size: 14px;
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
  font-size: 15px;
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
  background: #faf8f3;
  padding: 48px 5vw 40px;
}

.hero-inner {
  max-width: 1000px;
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
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 999px;
  margin-bottom: 16px;
}

.hero-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(28px, 3.5vw, 46px);
  font-weight: 800;
  color: #0b5d57;
  line-height: 1.15;
  margin-bottom: 18px;
}

.hero-desc {
  font-size: 14px;
  line-height: 1.75;
  color: #5a6a66;
  max-width: 44ch;
  margin-bottom: 24px;
}

.hero-right { flex-shrink: 0; }

.hero-image-box {
  width: clamp(200px, 30vw, 340px);
  height: clamp(160px, 22vw, 240px);
  background: #0b5d57;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.hero-image-placeholder {
  color: rgba(255,255,255,0.7);
  font-size: 13px;
  text-align: center;
  line-height: 1.5;
}

/* ── STATS BAR ── */
.stats-bar {
  background: #ece9e2;
  padding: 24px 5vw;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 40px;
}

.stat-num {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 26px;
  font-weight: 800;
  color: #0b5d57;
  line-height: 1;
}

.stat-num.orange { color: #e07b39; }

.stat-label {
  font-size: 13px;
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
  padding: 48px 5vw;
  background: #faf8f3;
}

.plan-card {
  max-width: 900px;
  margin: 0 auto;
  background: #f0f4f2;
  border-radius: 20px;
  padding: 40px 48px;
  display: flex;
  gap: 48px;
  align-items: center;
}

.plan-left { flex: 1; }

.featured-pill {
  display: inline-block;
  background: #e0ede9;
  color: #0b5d57;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 999px;
  margin-bottom: 14px;
}

.plan-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(22px, 2.5vw, 32px);
  font-weight: 800;
  color: #0b5d57;
  margin-bottom: 14px;
}

.plan-desc {
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.plan-right { flex-shrink: 0; }

.map-preview {
  width: 260px;
  height: 220px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.map-svg { width: 100%; height: 100%; }

/* ── WELLNESS SNAPSHOT ── */
.snap-section {
  padding: 56px 5vw;
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
  font-size: 12px;
  font-weight: 600;
  padding: 5px 18px;
  border-radius: 999px;
  margin-bottom: 12px;
}

.snap-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(24px, 2.5vw, 36px);
  font-weight: 800;
  color: #0b5d57;
  margin-bottom: 12px;
}

.snap-sub {
  font-size: 14px;
  color: #5a6a66;
  line-height: 1.65;
}

.snap-body {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
  background: #f7faf9;
  border-radius: 20px;
  padding: 36px 40px;
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
  font-size: 16px; font-weight: 700;
  flex-shrink: 0; color: white;
}
.green-icon  { background: #0b5d57; }
.teal-icon   { background: #2a9d8f; }
.orange-icon { background: #e07b39; }

.cat-title { font-size: 14px; font-weight: 700; color: #0b5d57; }
.cat-orange-text { color: #c06030; }
.cat-sub { font-size: 12px; color: #7a9490; margin-top: 2px; }

.snap-how { flex: 1; }

.how-label {
  font-size: 11px;
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
  font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}

.step-title { font-size: 14px; font-weight: 700; color: #0b5d57; margin-bottom: 2px; }
.step-desc  { font-size: 12px; color: #7a9490; line-height: 1.5; }

/* ── EXPLORE SECTION ── */
.explore-section {
  padding: 56px 5vw;
  background: #ffffff;
  text-align: center;
}

.explore-label-pill {
  display: inline-block;
  background: #e0ede9;
  color: #0b5d57;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 18px;
  border-radius: 999px;
  margin-bottom: 14px;
}

.explore-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(22px, 2.5vw, 32px);
  font-weight: 800;
  font-style: normal;
  color: #0b5d57;
  margin-bottom: 32px;
}

.explore-cards {
  max-width: 860px;
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
  font-size: 17px;
  font-weight: 700;
  color: #0b5d57;
  margin-bottom: 10px;
}

.explore-text p {
  font-size: 13px;
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

/* ── CTA BANNER ── */
.cta-banner {
  background: #0b5d57;
  color: white;
  text-align: center;
  padding: 60px 5vw;
}

.cta-banner h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(22px, 2.5vw, 34px);
  font-weight: 800;
  margin-bottom: 12px;
}

.cta-banner p {
  font-size: 15px;
  opacity: 0.85;
  line-height: 1.6;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero-inner { flex-direction: column; }
  .hero-image-box { width: 100%; height: 180px; }
  .plan-card { flex-direction: column; padding: 28px 24px; }
  .map-preview { width: 100%; }
  .snap-body { flex-direction: column; padding: 24px; }
  .explore-cards { grid-template-columns: 1fr; }
  .stats-bar { flex-wrap: wrap; gap: 16px; }
  .stat-divider { display: none; }
}
</style>