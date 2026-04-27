<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()
const showModal = ref(false)

function selectRoute() {
  showModal.value = true
}

function beginJourney() {
  router.push('/journey1')
}

function inviteOthers() {
  router.push('/invite')
}

function closeModal() {
  showModal.value = false
}
</script>

<template>
  <div class="page">
    <AppNavbar active="check-in" />

    <div class="container">

      <!-- Back link -->
      <div class="back-link" @click="router.back()">‹ Back to preferences</div>

      <!-- Page title -->
      <h1 class="page-title">Your recommended route</h1>
      <p class="subtitle">Based on your preferences, here's the route we think you'll love.</p>

      <!-- ── MAIN ROUTE CARD ── -->
      <div class="route-card">
        <div class="card-header">
          <h2 class="route-name">Morning Park Loop via Brook Street</h2>
          <div class="success-rate">
            <div class="success-label">Success rate</div>
            <div class="success-num">95%</div>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b5d57" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <div>
              <div class="stat-val">3.5 km</div>
              <div class="stat-lbl">Distance</div>
            </div>
          </div>
          <div class="stat-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b5d57" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div>
              <div class="stat-val">25 min</div>
              <div class="stat-lbl">Duration</div>
            </div>
          </div>
          <div class="stat-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b5d57" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <div>
              <div class="stat-val">Easy</div>
              <div class="stat-lbl">Difficulty</div>
            </div>
          </div>
        </div>

        <div class="map-wrap">
          <div class="zoom-controls">
            <button class="zoom-btn">+</button>
            <button class="zoom-btn">−</button>
          </div>
          <button class="start-walk-btn">Start walk</button>
          <svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <rect width="640" height="220" fill="#e8f0ec"/>
            <ellipse cx="200" cy="110" rx="110" ry="90" fill="#d4e8df" opacity="0.7"/>
            <ellipse cx="460" cy="100" rx="130" ry="95" fill="#d4e8df" opacity="0.6"/>
            <path d="M 100 155 C 150 140, 200 130, 255 118 C 310 106, 360 100, 415 88 C 455 80, 490 72, 530 62"
              fill="none" stroke="#0b5d57" stroke-width="2.5" stroke-dasharray="7 4" stroke-linecap="round"/>
            <rect x="68" y="146" width="52" height="22" rx="11" fill="white" opacity="0.95"/>
            <circle cx="82" cy="157" r="7" fill="#0b5d57"/>
            <text x="93" y="161" font-size="9" fill="#333" font-weight="600" font-family="Poppins,sans-serif">Start</text>
            <rect x="228" y="96" width="66" height="20" rx="10" fill="white" opacity="0.92"/>
            <text x="261" y="110" text-anchor="middle" font-size="8.5" fill="#c9541a" font-weight="600" font-family="Poppins,sans-serif">Bench stop</text>
            <circle cx="255" cy="118" r="4" fill="white" stroke="#0b5d57" stroke-width="1.8"/>
            <rect x="340" y="78" width="72" height="20" rx="10" fill="white" opacity="0.92"/>
            <text x="376" y="92" text-anchor="middle" font-size="8.5" fill="#555" font-weight="500" font-family="Poppins,sans-serif">Keep straight</text>
            <circle cx="415" cy="88" r="4" fill="white" stroke="#0b5d57" stroke-width="1.8"/>
            <rect x="516" y="48" width="28" height="28" rx="8" fill="#0b5d57"/>
            <text x="530" y="67" text-anchor="middle" font-size="14" fill="white" font-family="Poppins,sans-serif">✓</text>
          </svg>
          <div class="map-legend">
            <span class="legend-item"><span class="dot dark"></span> Shaded</span>
            <span class="legend-item"><span class="dot orange"></span> Seating</span>
            <span class="legend-item"><span class="dot teal"></span> Drinking fountain</span>
            <span class="legend-item"><span class="dot sand"></span> Landmark</span>
            <span class="legend-item"><span class="dot grey"></span> Public restroom</span>
          </div>
        </div>
      </div>

      <!-- ── WHY + HIGHLIGHTS row ── -->
      <div class="info-row">
        <div class="why-card">
          <h3>Why this route works for you</h3>
          <p>This route matches your walking pace at 3.5 km/h and fits your preferred timeframe under 30 minutes. Benches are spaced at 200-meter intervals for comfortable pacing.</p>
        </div>
        <div class="highlights-card">
          <h4>Highlights along the way</h4>
          <div class="highlight-item">
            <div class="hl-icon orange-bg">★</div>
            <div>
              <div class="hl-name">Brook Cafe</div>
              <div class="hl-sub">Coffee stop · 0.9 km in</div>
            </div>
          </div>
          <div class="highlight-item">
            <div class="hl-icon teal-bg">◎</div>
            <div>
              <div class="hl-name">Park lookout</div>
              <div class="hl-sub">Scenic view · 1.3 km in</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── CTA BUTTON ── -->
      <div class="cta-row">
        <button class="select-route-btn" @click="selectRoute">Select This Route →</button>
      </div>

      <!-- ── OTHER ROUTES ── -->
      <div class="other-routes">
        <h3 class="other-title">Other routes you might like</h3>
        <p class="other-sub">More gentle routes near you, tailored for you.</p>
        <div class="route-list">
          <div class="route-row">
            <div class="route-info">
              <div class="route-row-name">Riverside Stroll</div>
              <div class="route-row-desc">Peaceful walk along water, mostly flat and easy on knees.</div>
              <div class="route-tags">
                <span class="rtag">2.5 km</span>
                <span class="rtag">20 min</span>
                <span class="rtag">Very easy</span>
              </div>
            </div>
            <div class="route-mini-map">
              <svg viewBox="0 0 120 70" width="120" height="70">
                <rect width="120" height="70" fill="#e8f0ec" rx="10"/>
                <path d="M 10 55 C 30 45, 55 38, 75 30 C 90 24, 100 20, 110 14"
                  fill="none" stroke="#0b5d57" stroke-width="2" stroke-dasharray="5 3" stroke-linecap="round"/>
                <circle cx="10" cy="55" r="5" fill="#0b5d57"/>
                <circle cx="75" cy="30" r="4" fill="white" stroke="#0b5d57" stroke-width="1.5"/>
                <circle cx="110" cy="14" r="5" fill="#c9541a"/>
              </svg>
            </div>
            <button class="view-btn">View route</button>
          </div>
          <div class="route-row">
            <div class="route-info">
              <div class="route-row-name">Library & Garden Path</div>
              <div class="route-row-desc">Loop through community spaces, lots of seating options.</div>
              <div class="route-tags">
                <span class="rtag">5 km</span>
                <span class="rtag">50 min</span>
                <span class="rtag">Very easy</span>
              </div>
            </div>
            <div class="route-mini-map">
              <svg viewBox="0 0 120 70" width="120" height="70">
                <rect width="120" height="70" fill="#e8f0ec" rx="10"/>
                <path d="M 15 55 C 35 48, 55 42, 70 32 C 85 22, 100 18, 108 14"
                  fill="none" stroke="#0b5d57" stroke-width="2" stroke-dasharray="5 3" stroke-linecap="round"/>
                <circle cx="15" cy="55" r="5" fill="#0b5d57"/>
                <circle cx="70" cy="32" r="4" fill="white" stroke="#0b5d57" stroke-width="1.5"/>
                <circle cx="108" cy="14" r="5" fill="#c9541a"/>
              </svg>
            </div>
            <button class="view-btn">View route</button>
          </div>
        </div>
      </div>

      <!-- ── PRIVATE EVENT BANNER ── -->
      <div class="event-banner">
        <div class="event-text">
          <h3>Turn this into a private event</h3>
          <p>Invite friends or family to join you on this route. Share the route, pick a time, and walk together.</p>
          <button class="create-event-btn">Create event</button>
        </div>
        <div class="event-illustration">
          <svg viewBox="0 0 160 100" width="160" height="100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="28" r="10" fill="#0b5d57"/>
            <ellipse cx="30" cy="52" rx="12" ry="16" fill="#0b5d57"/>
            <circle cx="60" cy="22" r="10" fill="#0b5d57"/>
            <ellipse cx="60" cy="46" rx="12" ry="16" fill="#0b5d57"/>
            <circle cx="90" cy="30" r="10" fill="#c9541a"/>
            <ellipse cx="90" cy="54" rx="12" ry="16" fill="#c9541a"/>
            <circle cx="120" cy="20" r="10" fill="#0b5d57"/>
            <ellipse cx="120" cy="44" rx="12" ry="16" fill="#0b5d57"/>
            <circle cx="145" cy="35" r="8" fill="#0b5d57"/>
            <ellipse cx="145" cy="56" rx="10" ry="13" fill="#0b5d57"/>
            <circle cx="50" cy="72" r="8" fill="#c9541a"/>
            <ellipse cx="50" cy="90" rx="10" ry="10" fill="#c9541a"/>
            <circle cx="75" cy="78" r="3" fill="#0b5d57" opacity="0.4"/>
            <circle cx="100" cy="75" r="3" fill="#0b5d57" opacity="0.4"/>
          </svg>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-brand">ActiveAgeing</div>
      <p class="footer-sub">Your companion for active, connected living</p>
    </footer>

    <!-- ── READY TO GO MODAL ── -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <Transition name="slide-up">
          <div v-if="showModal" class="modal">
            <h2 class="modal-title">Ready to Go?</h2>
            <p class="modal-sub">Choose how you'd like to experience this route</p>

            <!-- Begin My Journey -->
            <button class="btn-begin" @click="beginJourney">
              <div class="btn-content">
                <div class="btn-text">
                  <div class="btn-label">Begin My Journey</div>
                  <div class="btn-desc">Start your personalized route now</div>
                </div>
                <span class="btn-arrow">→</span>
              </div>
            </button>

            <!-- Invite Others -->
            <button class="btn-invite" @click="inviteOthers">
              <div class="btn-content">
                <div class="btn-text">
                  <div class="btn-label">Invite Others</div>
                  <div class="btn-desc">Create an event and walk together</div>
                </div>
                <span class="invite-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="10" cy="9" r="4" stroke="#0b5d57" stroke-width="1.8" fill="none"/>
                    <path d="M2 22c0-4 3.6-7 8-7" stroke="#0b5d57" stroke-width="1.8" stroke-linecap="round" fill="none"/>
                    <circle cx="19" cy="9" r="3" stroke="#0b5d57" stroke-width="1.6" fill="none"/>
                    <path d="M19 15c3.5 0 6 2.5 6 6" stroke="#0b5d57" stroke-width="1.6" stroke-linecap="round" fill="none"/>
                  </svg>
                </span>
              </div>
            </button>

            <!-- Cancel -->
            <button class="btn-cancel" @click="closeModal">Cancel</button>
          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.page {
  background: #f5f5f2;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  color: #1a2a28;
}

.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 80px 24px 48px;
}

/* ── Back link ── */
.back-link {
  font-size: 13px;
  font-weight: 500;
  color: #0b5d57;
  cursor: pointer;
  margin-bottom: 20px;
  display: inline-block;
}
.back-link:hover { text-decoration: underline; }

/* ── Page title ── */
.page-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 800;
  color: #0b5d57;
  line-height: 1.15;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #6a7a76;
  margin-bottom: 24px;
}

/* ── MAIN ROUTE CARD ── */
.route-card {
  background: white;
  border-radius: 16px;
  padding: 24px 24px 0;
  margin-bottom: 20px;
  border: 1px solid #e0e8e4;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.route-name {
  font-size: 17px;
  font-weight: 700;
  color: #1a2a28;
  flex: 1;
  padding-right: 16px;
  line-height: 1.3;
}

.success-rate { text-align: right; flex-shrink: 0; }
.success-label { font-size: 11px; color: #9aafaa; font-weight: 500; }
.success-num {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 26px;
  font-weight: 800;
  color: #0b5d57;
  line-height: 1.1;
}

.stats-row {
  display: flex;
  margin-bottom: 16px;
  border: 1px solid #e8ecea;
  border-radius: 12px;
  overflow: hidden;
}

.stat-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-right: 1px solid #e8ecea;
}
.stat-box:last-child { border-right: none; }
.stat-val { font-size: 15px; font-weight: 700; color: #0b5d57; line-height: 1.2; }
.stat-lbl { font-size: 11px; color: #9aafaa; font-weight: 500; }

.map-wrap {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #e8f0ec;
  margin: 0 -24px;
}
.map-wrap svg { display: block; }

.zoom-controls {
  position: absolute;
  top: 12px; right: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 2;
}
.zoom-btn {
  width: 28px; height: 28px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
}
.zoom-btn:hover { background: #f0f4f2; }

.start-walk-btn {
  position: absolute;
  bottom: 44px; right: 14px;
  background: #0b5d57;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 13px; font-weight: 700;
  padding: 10px 20px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  z-index: 2;
}
.start-walk-btn:hover { background: #084a45; }

.map-legend {
  display: flex;
  gap: 16px;
  padding: 10px 16px;
  background: white;
  flex-wrap: wrap;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #6a7a76;
  font-weight: 500;
}
.dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot.dark   { background: #1a2a28; }
.dot.orange { background: #c9541a; }
.dot.teal   { background: #0b5d57; }
.dot.sand   { background: #c8a96e; }
.dot.grey   { background: #9aafaa; }

/* ── WHY + HIGHLIGHTS ── */
.info-row { display: flex; gap: 16px; margin-bottom: 20px; }

.why-card {
  flex: 1;
  background: #0b5d57;
  color: white;
  border-radius: 14px;
  padding: 22px;
}
.why-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 10px; line-height: 1.3; }
.why-card p  { font-size: 13px; line-height: 1.65; opacity: 0.9; }

.highlights-card {
  flex: 1;
  background: white;
  border-radius: 14px;
  padding: 22px;
  border: 1px solid #e0e8e4;
}
.highlights-card h4 { font-size: 13px; font-weight: 600; color: #6a7a76; margin-bottom: 14px; }

.highlight-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #f7faf9;
  border-radius: 10px;
  margin-bottom: 8px;
}
.highlight-item:last-child { margin-bottom: 0; }

.hl-icon {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: white; flex-shrink: 0;
}
.orange-bg { background: #c9541a; }
.teal-bg   { background: #0b5d57; }
.hl-name { font-size: 13px; font-weight: 700; color: #0b5d57; margin-bottom: 2px; }
.hl-sub  { font-size: 11px; color: #9aafaa; }

/* ── CTA ── */
.cta-row { margin-bottom: 36px; }

.select-route-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #0f7a72, #0b5d57);
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 16px; font-weight: 700;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 16px rgba(11, 93, 87, 0.3);
}
.select-route-btn:hover { opacity: 0.92; transform: translateY(-1px); }

/* ── OTHER ROUTES ── */
.other-routes { margin-bottom: 28px; }
.other-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px; font-weight: 800; color: #0b5d57; margin-bottom: 6px;
}
.other-sub { font-size: 13px; color: #6a7a76; margin-bottom: 16px; }
.route-list { display: flex; flex-direction: column; gap: 12px; }

.route-row {
  background: white;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e0e8e4;
}
.route-info { flex: 1; }
.route-row-name { font-size: 15px; font-weight: 700; color: #0b5d57; margin-bottom: 4px; }
.route-row-desc { font-size: 12px; color: #6a7a76; margin-bottom: 10px; line-height: 1.5; }
.route-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.rtag {
  background: #e8f0ec; color: #0b5d57;
  font-size: 11px; font-weight: 600;
  padding: 3px 12px; border-radius: 999px;
}
.route-mini-map { flex-shrink: 0; border-radius: 10px; overflow: hidden; }
.view-btn {
  background: #0b5d57; color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 13px; font-weight: 700;
  padding: 10px 18px; border-radius: 10px;
  border: none; cursor: pointer; white-space: nowrap; flex-shrink: 0;
}
.view-btn:hover { background: #084a45; }

/* ── EVENT BANNER ── */
.event-banner {
  background: #e8f0ec;
  border-radius: 16px;
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 12px;
}
.event-text { flex: 1; }
.event-text h3 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px; font-weight: 800; color: #0b5d57;
  margin-bottom: 8px; line-height: 1.3;
}
.event-text p { font-size: 13px; color: #4a6a64; line-height: 1.65; margin-bottom: 16px; max-width: 38ch; }
.create-event-btn {
  background: #0b5d57; color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 14px; font-weight: 700;
  padding: 12px 24px; border-radius: 10px;
  border: none; cursor: pointer;
}
.create-event-btn:hover { background: #084a45; }
.event-illustration { flex-shrink: 0; }

/* ── Footer ── */
.footer {
  text-align: center;
  padding: 28px 24px;
  background: #f5f5f2;
  border-top: 1px solid #e0e4de;
}
.footer-brand {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 16px; font-weight: 800; color: #0b5d57; margin-bottom: 4px;
}
.footer-sub { font-size: 12px; color: #9aafaa; }

/* ══════════════════════════════════
   MODAL OVERLAY
══════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(160, 200, 195, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 24px;
}

.modal {
  background: white;
  border-radius: 24px;
  padding: 40px 36px 32px;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
}

.modal-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 28px;
  font-weight: 800;
  color: #0b3d38;
  text-align: center;
}

.modal-sub {
  font-size: 14px;
  color: #6a7a76;
  text-align: center;
  margin-top: -4px;
  margin-bottom: 6px;
}

/* Begin button — gradient green */
.btn-begin {
  width: 100%;
  background: linear-gradient(135deg, #12897f, #0b5d57);
  border: none;
  border-radius: 14px;
  padding: 20px 24px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 6px 20px rgba(11, 93, 87, 0.35);
}
.btn-begin:hover { opacity: 0.93; transform: translateY(-1px); }

/* Invite button */
.btn-invite {
  width: 100%;
  background: white;
  border: 2px solid #0b5d57;
  border-radius: 14px;
  padding: 20px 24px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-invite:hover { background: #e8f4f0; transform: translateY(-1px); }

.btn-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.btn-text { text-align: left; }

.btn-label {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
}
.btn-desc {
  font-size: 13px;
  font-weight: 400;
  margin-top: 3px;
  opacity: 0.85;
}

.btn-begin .btn-label,
.btn-begin .btn-desc { color: white; }

.btn-invite .btn-label { color: #0b3d38; }
.btn-invite .btn-desc  { color: #6a7a76; }

.btn-arrow {
  font-size: 22px;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.invite-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.btn-cancel {
  background: none;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #6a7a76;
  cursor: pointer;
  padding: 4px 16px;
  margin-top: 2px;
  transition: color 0.2s;
}
.btn-cancel:hover { color: #0b5d57; }

/* ── Transitions ── */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease; }
.slide-up-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.slide-up-enter-from  { transform: translateY(32px); opacity: 0; }
.slide-up-leave-to    { transform: translateY(16px); opacity: 0; }

/* ── Responsive ── */
@media (max-width: 640px) {
  .container { padding: 76px 16px 32px; }
  .info-row { flex-direction: column; }
  .route-row { flex-wrap: wrap; }
  .route-mini-map { order: -1; }
  .event-banner { flex-direction: column; }
  .modal { padding: 32px 20px 24px; }
  .modal-title { font-size: 24px; }
}
</style>