<script setup>
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()

function getSnapshot() {
  localStorage.removeItem('surveyAnswers')
  localStorage.removeItem('surveyResult')
  localStorage.removeItem('sessionCompleted')
  router.push('/survey')
}
</script>

<template>
  <div class="page-wrapper">
    <AppNavbar active="checkin" />

    <div class="snap-page">
      <!-- Header -->
      <div class="snap-header">
        <div class="start-pill">Start here</div>
        <h1>Wellness snapshot</h1>
        <p class="snap-sub">
          Answer a few questions and see where you stand compared<br />
          to the Australian benchmark for adults 65 and over.
        </p>
      </div>

      <!-- Card body -->
      <div class="snap-card">
        <!-- Left: Category cards -->
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

        <!-- Right: How it works -->
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

          <button class="snap-btn" @click="getSnapshot">Get my snapshot →</button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <h3>ActiveAgeing</h3>
      <div class="links">
        <a @click="router.push('/privacy')" style="cursor:pointer">Privacy Policy</a>
        <a @click="router.push('/terms')" style="cursor:pointer">Terms of Service</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }

.page-wrapper {
  min-height: 100vh;
  background: #faf8f3;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
}

.snap-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px 60px;
}

/* Header */
.snap-header { text-align: center; margin-bottom: 40px; }

.start-pill {
  display: inline-block;
  background: #fde8d8;
  color: #c06030;
  font-size: 20px;
  font-weight: 600;
  padding: 6px 20px;
  border-radius: 999px;
  margin-bottom: 16px;
}

.snap-header h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 42px;
  font-weight: 800;
  color: #0b5d57;
  margin: 0 0 14px;
  letter-spacing: -0.3px;
}

.snap-sub {
  font-size: 20px;
  color: #5a6a66;
  line-height: 1.65;
  margin: 0;
}

/* Main card */
.snap-card {
  display: flex;
  gap: 60px;
  align-items: flex-start;
  background: #ffffff;
  border-radius: 24px;
  padding: 48px 52px;
  box-shadow: 0 2px 24px rgba(0,0,0,0.06);
  max-width: 860px;
  width: 100%;
}

/* Category cards */
.snap-categories { display: flex; flex-direction: column; gap: 12px; flex: 1; }

.cat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 14px;
  border-left: 4px solid transparent;
}
.cat-green  { background: #e8f4f0; border-left-color: #0b5d57; }
.cat-teal   { background: #e8f4f0; border-left-color: #2a9d8f; }
.cat-orange { background: #fdf0e6; border-left-color: #e07b39; }

.cat-icon {
  width: 42px; height: 42px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
  color: white;
}
.green-icon  { background: #0b5d57; }
.teal-icon   { background: #2a9d8f; }
.orange-icon { background: #e07b39; }

.cat-title { font-size: 20px; font-weight: 700; color: #0b5d57; }
.cat-orange-text { color: #c06030; }
.cat-sub   { font-size: 20px; color: #7a9490; margin-top: 3px; }

/* How it works */
.snap-how { flex: 1; }

.how-label {
  font-size: 20px;
  font-weight: 600;
  color: #9aafaa;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.how-steps { display: flex; flex-direction: column; gap: 22px; margin-bottom: 36px; }

.how-step { display: flex; gap: 16px; align-items: flex-start; }

.step-num {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: #e0ede9;
  color: #0b5d57;
  font-size: 20px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.step-title { font-size: 20px; font-weight: 700; color: #0b5d57; margin-bottom: 3px; }
.step-desc  { font-size: 20px; color: #7a9490; line-height: 1.5; }

.snap-btn {
  background: #0b5d57;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.snap-btn:hover { background: #084a45; transform: translateY(-2px); }

/* Footer */
.footer { text-align: center; padding: 36px 0; font-size: 20px; color: #777; background: #faf8f3; }
.footer h3 { font-family: 'Playfair Display', Georgia, serif; color: #0b5d57; margin-bottom: 10px; }
.links a { margin: 0 10px; text-decoration: none; color: #777; transition: color 0.2s; cursor: pointer; }
.links a:hover { color: #0b5d57; }

/* Responsive */
@media (max-width: 768px) {
  .snap-page { padding: 100px 20px 40px; }
  .snap-card { flex-direction: column; gap: 24px; padding: 24px 20px; }
  .snap-header h1 { font-size: 28px; }
  .snap-sub br { display: none; }
  .snap-categories { gap: 10px; }
}

@media (max-width: 480px) {
  .snap-page { padding: 72px 14px 32px; }
  .snap-header h1 { font-size: 24px; }
}
</style>