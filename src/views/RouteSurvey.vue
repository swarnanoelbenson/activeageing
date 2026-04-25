<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const answers = ref({
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  q5: null,
})

function select(q, value) {
  answers.value[q] = value
}

function isSelected(q, value) {
  return answers.value[q] === value
}

function findMyRoute() {
  router.push('/planner')
}
</script>

<template>
  <div class="page-wrapper">

    <div class="topbar">
      <span class="brand">ACTIVEAGEING</span>
      <span class="back-link" @click="router.push('/routeplan')">Back to Home</span>
    </div>

    <div class="survey-outer">
      <div class="survey-container">

        <h1 class="page-title">Plan My Activity</h1>
        <p class="page-sub">
          Select your preferences below to create a personalized<br />
          activity path designed just for you.
        </p>

        <!-- Q1 -->
        <div class="question-block">
          <div class="q-label">
            <span class="q-num">1</span>
            <span class="q-text">What type of activity are you planning?</span>
          </div>
          <div class="options-row cols-3">
            <div class="option-card" :class="{ selected: isSelected('q1','walking') }" @click="select('q1','walking')">
              <div class="opt-icon-wrap" :class="{ 'icon-selected': isSelected('q1','walking') }">🚶</div>
              <div class="opt-label">Walking</div>
            </div>
            <div class="option-card" :class="{ selected: isSelected('q1','cycling') }" @click="select('q1','cycling')">
              <div class="opt-icon-wrap" :class="{ 'icon-selected': isSelected('q1','cycling') }">🚴</div>
              <div class="opt-label">Cycling</div>
            </div>
            <div class="option-card" :class="{ selected: isSelected('q1','jogging') }" @click="select('q1','jogging')">
              <div class="opt-icon-wrap" :class="{ 'icon-selected': isSelected('q1','jogging') }">🏃</div>
              <div class="opt-label">Light jogging</div>
            </div>
          </div>
        </div>

        <!-- Q2 -->
        <div class="question-block">
          <div class="q-label">
            <span class="q-num">2</span>
            <span class="q-text">How long do you want to be active?</span>
          </div>
          <div class="options-row cols-4">
            <div class="option-card time-card" :class="{ selected: isSelected('q2','15') }" @click="select('q2','15')">
              <div class="time-num">15</div>
              <div class="time-unit">minutes</div>
            </div>
            <div class="option-card time-card" :class="{ selected: isSelected('q2','30') }" @click="select('q2','30')">
              <div class="time-num">30</div>
              <div class="time-unit">minutes</div>
            </div>
            <div class="option-card time-card" :class="{ selected: isSelected('q2','45') }" @click="select('q2','45')">
              <div class="time-num">45</div>
              <div class="time-unit">minutes</div>
            </div>
            <div class="option-card time-card" :class="{ selected: isSelected('q2','60') }" @click="select('q2','60')">
              <div class="time-num">1</div>
              <div class="time-unit">hour</div>
            </div>
          </div>
        </div>

        <!-- Q3 -->
        <div class="question-block">
          <div class="q-label">
            <span class="q-num">3</span>
            <span class="q-text">How would you describe your preferred pace?</span>
          </div>
          <div class="options-row cols-3">
            <div class="option-card" :class="{ selected: isSelected('q3','easy') }" @click="select('q3','easy')">
              <div class="opt-icon-wrap" :class="{ 'icon-selected': isSelected('q3','easy') }">😊</div>
              <div class="opt-label">Easy and relaxed</div>
            </div>
            <div class="option-card" :class="{ selected: isSelected('q3','moderate') }" @click="select('q3','moderate')">
              <div class="opt-icon-wrap" :class="{ 'icon-selected': isSelected('q3','moderate') }">⚡</div>
              <div class="opt-label">Moderate</div>
            </div>
            <div class="option-card" :class="{ selected: isSelected('q3','brisk') }" @click="select('q3','brisk')">
              <div class="opt-icon-wrap" :class="{ 'icon-selected': isSelected('q3','brisk') }">💨</div>
              <div class="opt-label">Brisk</div>
            </div>
          </div>
        </div>

        <!-- Q4 -->
        <div class="question-block">
          <div class="q-label">
            <span class="q-num">4</span>
            <span class="q-text">What kind of environment do you prefer?</span>
          </div>
          <div class="options-row cols-3">
            <div class="option-card" :class="{ selected: isSelected('q4','parks') }" @click="select('q4','parks')">
              <div class="opt-icon-wrap" :class="{ 'icon-selected': isSelected('q4','parks') }">🌳</div>
              <div class="opt-label">Parks and greenery</div>
            </div>
            <div class="option-card" :class="{ selected: isSelected('q4','streets') }" @click="select('q4','streets')">
              <div class="opt-icon-wrap" :class="{ 'icon-selected': isSelected('q4','streets') }">🏙️</div>
              <div class="opt-label">Streets and footpaths</div>
            </div>
            <div class="option-card" :class="{ selected: isSelected('q4','mix') }" @click="select('q4','mix')">
              <div class="opt-icon-wrap" :class="{ 'icon-selected': isSelected('q4','mix') }">🗺️</div>
              <div class="opt-label">Mix of both</div>
            </div>
          </div>
        </div>

        <!-- Q5 -->
        <div class="question-block">
          <div class="q-label">
            <span class="q-num">5</span>
            <span class="q-text">Do you need rest stops along the way?</span>
          </div>
          <div class="options-row cols-3">
            <div class="option-card" :class="{ selected: isSelected('q5','yes') }" @click="select('q5','yes')">
              <div class="opt-icon-wrap" :class="{ 'icon-selected': isSelected('q5','yes') }">🪑</div>
              <div class="opt-label">Yes please</div>
            </div>
            <div class="option-card" :class="{ selected: isSelected('q5','ifneeded') }" @click="select('q5','ifneeded')">
              <div class="opt-icon-wrap" :class="{ 'icon-selected': isSelected('q5','ifneeded') }">🙂</div>
              <div class="opt-label">Only if needed</div>
            </div>
            <div class="option-card" :class="{ selected: isSelected('q5','nopref') }" @click="select('q5','nopref')">
              <div class="opt-icon-wrap" :class="{ 'icon-selected': isSelected('q5','nopref') }">🚶</div>
              <div class="opt-label">No preference</div>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="submit-row">
          <button class="find-btn" @click="findMyRoute">
            <span class="find-btn-icon">🗺️</span>
            <span>Find my route</span>
          </button>
        </div>

      </div>
    </div>

    <footer class="footer">
      <div class="footer-brand">ActiveAgeing</div>
      <div class="footer-links">
        <a @click="router.push('/privacy')">Privacy Policy</a>
        <a @click="router.push('/terms')">Terms of Service</a>
        <a @click="router.push('/contact')">Contact Support</a>
      </div>
      <div class="footer-copy">© 2024 ActiveAgeing Australia. Your journey to wellness, clarified.</div>
    </footer>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.page-wrapper {
  min-height: 100vh;
  background: #f5f5f2;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 40px;
}

.brand {
  font-size: 14px;
  font-weight: 700;
  color: #0b5d57;
  letter-spacing: 0.06em;
}

.back-link {
  font-size: 14px;
  font-weight: 500;
  color: #0b5d57;
  cursor: pointer;
  transition: color 0.2s;
}
.back-link:hover { color: #084a45; text-decoration: underline; }

.survey-outer {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 8px 20px 48px;
}

.survey-container {
  width: 100%;
  max-width: 500px;
}

.page-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 30px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-sub {
  font-size: 13px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 32px;
}

.question-block { margin-bottom: 32px; }

.q-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.q-num {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: #0b5d57;
  color: white;
  font-size: 13px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.q-text {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.options-row { display: grid; gap: 10px; }
.cols-3 { grid-template-columns: repeat(3, 1fr); }
.cols-4 { grid-template-columns: repeat(4, 1fr); }

/* ── Card: unselected ── */
.option-card {
  background: white;
  border: 1.5px solid #e2e2e2;
  border-radius: 12px;
  padding: 18px 10px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, background 0.18s, border-color 0.18s;
  gap: 10px;
  user-select: none;
}

.option-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0,0,0,0.07);
}

/* ── Card: selected — light green background + teal border ── */
.option-card.selected {
  background: #dff0eb;
  border: 2px solid #0b5d57;
}

/* ── Icon wrapper: default ── */
.opt-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #f0f0ee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: background 0.18s;
  flex-shrink: 0;
}

/* ── Icon wrapper: selected — dark green circle ── */
.opt-icon-wrap.icon-selected {
  background: #0b5d57;
  /* emoji colour can't be changed with CSS, but the dark bg creates the right contrast */
  filter: brightness(1.1);
}

.opt-label {
  font-size: 12px;
  font-weight: 600;
  color: #222;
  line-height: 1.4;
}

/* ── Time cards (no icon, just numbers) ── */
.time-card { padding: 16px 8px 12px; }

.time-num {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1;
}

/* When a time card is selected, make the number white so it reads on green bg */
.time-card.selected .time-num { color: #0b5d57; }

.time-unit {
  font-size: 11px;
  color: #999;
  font-weight: 500;
}

/* ── Submit ── */
.submit-row {
  display: flex;
  justify-content: center;
  padding: 28px 0 8px;
}

.find-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #0b5d57;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  padding: 17px 52px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.find-btn:hover {
  background: #084a45;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(11,93,87,0.35);
}

.find-btn-icon { font-size: 18px; }

/* ── Footer ── */
.footer {
  background: #0b5d57;
  color: rgba(255,255,255,0.75);
  text-align: center;
  padding: 28px 24px 20px;
  font-size: 13px;
}

.footer-brand {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 17px;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.footer-links a {
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;
}
.footer-links a:hover { color: white; }

.footer-copy { font-size: 12px; color: rgba(255,255,255,0.45); }

@media (max-width: 560px) {
  .topbar { padding: 14px 16px; }
  .survey-outer { padding: 8px 12px 32px; }
  .cols-4 { grid-template-columns: repeat(2, 1fr); }
  .page-title { font-size: 24px; }
  .page-sub br { display: none; }
}
</style>