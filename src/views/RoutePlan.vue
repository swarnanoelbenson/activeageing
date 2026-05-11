<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()

function planRoute() {
  router.push('/routesurvey')
}

const codeInput    = ref('')
const codeInputErr = ref('')

function viewEvent() {
  const code = codeInput.value.trim().toUpperCase()
  if (!code) { codeInputErr.value = 'Please enter an event code.'; return }
  codeInputErr.value = ''
  router.push(`/planner?code=${code}`)
}
</script>

<template>
  <div class="page-wrapper">
    <AppNavbar active="routeplan" />
    <div class="page-container">

      <!-- Featured Card -->
      <div class="feature-card">

        <!-- Left: Text content -->
        <div class="card-left">
          <div class="featured-pill">★ Featured</div>

          <h2>Plan my path</h2>
          <p class="card-desc">
            Design a walking route that suits your pace, time,
            and comfort. Walk solo, or turn it into a private
            event and invite friends along.
          </p>

          <ul class="feature-list">
            <li>
              <span class="check-icon">✓</span>
              Choose your pace and walking time
            </li>
            <li>
              <span class="check-icon">✓</span>
              Pick scenic parks or quiet streets
            </li>
            <li>
              <span class="check-icon">✓</span>
              Keep it private or invite others to join
            </li>
          </ul>

          <button class="plan-btn" @click="planRoute">Plan route →</button>
        </div>

        <!-- Right: Route map illustration -->
        <div class="card-right">
          <div class="map-box">
            <svg width="100%" height="100%" viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="50" r="32" fill="#c8ddd9" opacity="0.5"/>
              <circle cx="230" cy="190" r="28" fill="#c8ddd9" opacity="0.5"/>
              <path
                d="M 50 210 Q 80 180 110 160 Q 140 140 160 110 Q 180 80 220 60"
                stroke="#0b5d57"
                stroke-width="3"
                stroke-dasharray="8 6"
                fill="none"
                stroke-linecap="round"
              />
              <circle cx="50" cy="210" r="10" fill="#0b5d57"/>
              <text x="60" y="230" fill="#0b5d57" font-size="11" font-family="Poppins, sans-serif" font-weight="600">Start</text>
              <circle cx="140" cy="140" r="7" fill="white" stroke="#0b5d57" stroke-width="2.5"/>
              <text x="148" y="137" fill="#444" font-size="10" font-family="Poppins, sans-serif">Bench stop</text>
              <circle cx="185" cy="100" r="7" fill="white" stroke="#0b5d57" stroke-width="2.5"/>
              <text x="192" y="97" fill="#444" font-size="10" font-family="Poppins, sans-serif">Park view</text>
              <rect x="207" y="45" width="26" height="26" rx="7" fill="#8b3a2a"/>
              <text x="214" y="64" fill="white" font-size="15" font-family="Poppins, sans-serif">★</text>
            </svg>

            <div class="route-summary">
              <span class="summary-check">✓</span>
              <div>
                <div class="summary-label">Your route</div>
                <div class="summary-value">25 min · Easy</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Enter Code -->
      <div class="enter-code-card">
        <div class="enter-code-left">
          <div class="enter-code-icon">🔑</div>
          <div>
            <div class="enter-code-title">Have an event code?</div>
            <div class="enter-code-desc">Someone shared a walking event with you. Enter the code to view the route and join them.</div>
          </div>
        </div>
        <div class="enter-code-right">
          <div class="enter-code-row">
            <input
              v-model="codeInput"
              class="enter-code-input"
              placeholder="e.g. AB1C2D"
              maxlength="8"
              @keyup.enter="viewEvent"
              @input="codeInputErr = ''"
            />
            <button class="enter-code-btn" @click="viewEvent">View Event →</button>
          </div>
          <p v-if="codeInputErr" class="enter-code-err">{{ codeInputErr }}</p>
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
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }

.page-wrapper {
  min-height: 100vh;
  background: #faf8f3;
}

.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 100px 48px 0;
  font-family: 'Poppins', sans-serif;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.feature-card {
  background: #e8f0ed;
  border-radius: 24px;
  padding: 56px 60px;
  display: flex;
  align-items: center;
  gap: 60px;
}

.card-left { flex: 1; }

.featured-pill {
  display: inline-block;
  background: white;
  color: #444;
  font-size: 20px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}

.card-left h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 38px;
  font-weight: 800;
  color: #0b5d57;
  margin: 0 0 16px;
}

.card-desc {
  font-size: 20px;
  line-height: 1.7;
  color: #555;
  margin-bottom: 28px;
  max-width: 400px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 36px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  color: #333;
  font-weight: 500;
}
.check-icon {
  width: 24px; height: 24px;
  background: #0b5d57;
  color: white;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700;
  flex-shrink: 0;
}

.plan-btn {
  background: #0b5d57;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  padding: 16px 36px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.plan-btn:hover { background: #084a45; transform: translateY(-2px); }

.card-right { flex-shrink: 0; }

.map-box {
  width: 300px; height: 280px;
  background: white;
  border-radius: 20px;
  position: relative;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  overflow: hidden;
}

.route-summary {
  position: absolute;
  bottom: 20px; right: 16px;
  background: white;
  border: 1.5px solid #d6e4e0;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.summary-check { color: #0b5d57; font-size: 20px; font-weight: 700; }
.summary-label { font-size: 20px; color: #888; }
.summary-value { font-size: 20px; font-weight: 700; color: #0b5d57; }

/* Enter Code card */
.enter-code-card {
  margin-top: 24px;
  background: white;
  border-radius: 20px;
  padding: 32px 40px;
  display: flex;
  align-items: center;
  gap: 40px;
  border: 1.5px solid #e4eeec;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.enter-code-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
}

.enter-code-icon {
  font-size: 32px;
  flex-shrink: 0;
  margin-top: 2px;
}

.enter-code-title {
  font-size: 20px;
  font-weight: 700;
  color: #0b3d38;
  margin-bottom: 6px;
}

.enter-code-desc {
  font-size: 20px;
  color: #6a7a76;
  line-height: 1.55;
  max-width: 340px;
}

.enter-code-right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 280px;
}

.enter-code-row {
  display: flex;
  gap: 10px;
}

.enter-code-input {
  flex: 1;
  padding: 13px 16px;
  border: 1.5px solid #ccd8d5;
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #0b3d38;
  background: #f8faf9;
  outline: none;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: border-color 0.2s;
}
.enter-code-input::placeholder { font-weight: 400; letter-spacing: 0; color: #aab8b5; text-transform: none; }
.enter-code-input:focus { border-color: #0b5d57; background: white; }

.enter-code-btn {
  padding: 13px 22px;
  background: #0b5d57;
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  white-space: nowrap;
}
.enter-code-btn:hover { background: #084a45; transform: translateY(-1px); }

.enter-code-err {
  font-size: 20px;
  color: #c0392b;
  margin: 0;
  padding-left: 4px;
}

.footer { text-align: center; padding: 40px 0; font-size: 20px; color: #777; margin-top: auto; }
.footer h3 { font-family: 'Playfair Display', Georgia, serif; color: #0b5d57; margin-bottom: 10px; }
.links a { margin: 0 10px; text-decoration: none; color: #777; transition: color 0.2s; cursor: pointer; }
.links a:hover { color: #0b5d57; }

@media (max-width: 768px) {
  .page-container { padding: 100px 16px 0; }
  .feature-card { flex-direction: column; padding: 28px 20px; gap: 24px; }
  .map-box { width: 100%; height: 240px; }
  .card-left h2 { font-size: 26px; }
  .card-desc { max-width: 100%; }
  .enter-code-card { flex-direction: column; padding: 20px; gap: 16px; }
  .enter-code-right { min-width: unset; width: 100%; }
  .enter-code-desc { max-width: unset; }
  .enter-code-row { flex-direction: column; }
  .enter-code-btn { width: 100%; }
}
</style>