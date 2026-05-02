<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()
const API    = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const COLOUR = '#c2185b'

const loading     = ref(true)
const error       = ref(null)
const routes      = ref([])
const survey      = ref(null)
const activeRoute = ref(0)

const activityLabel   = { walking: 'Walking', jogging: 'Light Jogging', cycling: 'Cycling' }
const difficultyLabel = { easy: 'Easy', moderate: 'Moderate', brisk: 'Challenging' }

const STOP_POINTS = [
  { label: 'Shaded',            color: '#1a5c54' },
  { label: 'Seating',           color: '#8b3a2a' },
  { label: 'Drinking fountain', color: '#2d7d78' },
  { label: 'Landmark',          color: '#c9a96e' },
  { label: 'Public restroom',   color: '#7a8c72' },
]

// ── Main map ──
let mainMap      = null
let mainPolyline = null
let mainMarker   = null

// ── Thumbnail maps (one per route) ──
const thumbMaps = []

// ── Ready modal ──
const showReady = ref(false)
function openReady()    { showReady.value = true }
function closeReady()   { showReady.value = false }
function beginJourney() { router.push('/journey1') }
function inviteOthers() { router.push('/invite') }

function goReady() {
  openReady()
}

// ── Route selection ──
function selectRoute(index) {
  activeRoute.value = index
  drawMainRoute(index)
}

function drawMainRoute(index) {
  if (!mainMap) return
  const route = routes.value[index]
  if (!route) return

  if (mainPolyline) { mainMap.removeLayer(mainPolyline); mainPolyline = null }
  if (mainMarker)   { mainMap.removeLayer(mainMarker);   mainMarker   = null }

  const latlngs = route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
  mainPolyline  = L.polyline(latlngs, { color: COLOUR, weight: 5 }).addTo(mainMap)

  const [sLng, sLat] = route.geometry.coordinates[0]
  mainMarker = L.circleMarker([sLat, sLng], {
    radius: 7, fillColor: COLOUR, color: 'white', weight: 2, fillOpacity: 1,
  }).addTo(mainMap)

  mainMap.fitBounds(mainPolyline.getBounds(), { padding: [16, 16] })
}

function routeDescription(index) {
  const activity = activityLabel[survey.value?.activity_type]?.toLowerCase() ?? 'walking'
  const pace     = survey.value?.preferred_pace ?? 'moderate'
  const r        = routes.value[index]
  return `A ${pace}-pace ${activity} route covering ${r?.distance_label} in approximately ${r?.duration_label}, starting from your chosen location.`
}

onMounted(async () => {
  const raw = sessionStorage.getItem('routeSurvey')
  if (!raw) {
    error.value = 'No survey data found. Please complete the route survey first.'
    loading.value = false
    return
  }

  survey.value = JSON.parse(raw)

  if (!survey.value.start_lat || !survey.value.start_lng) {
    error.value = 'No starting location was set. Please go back and enter a starting suburb.'
    loading.value = false
    return
  }

  try {
    const res  = await fetch(`${API}/api/routes`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(survey.value),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Failed to load routes')
    routes.value = data.routes
  } catch (e) {
    error.value   = e.message
    loading.value = false
    return
  }

  loading.value = false
  await new Promise(r => setTimeout(r, 80))
  initMaps()
})

function initMaps() {
  // Main interactive map
  const mainContainer = document.getElementById('map-main')
  if (mainContainer && routes.value[0]) {
    mainMap = L.map(mainContainer, {
      zoomControl: true, attributionControl: false,
      dragging: true, scrollWheelZoom: true, doubleClickZoom: true, touchZoom: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mainMap)
    drawMainRoute(0)
  }

  // Thumbnails for all 3 routes
  routes.value.forEach((route, i) => {
    const container = document.getElementById(`map-t${i}`)
    if (!container) return
    const m = L.map(container, {
      zoomControl: false, attributionControl: false,
      dragging: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(m)
    const latlngs = route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
    const line    = L.polyline(latlngs, { color: COLOUR, weight: 3 }).addTo(m)
    m.fitBounds(line.getBounds(), { padding: [4, 4] })
    thumbMaps.push(m)
  })
}

onBeforeUnmount(() => {
  if (mainMap) { mainMap.remove(); mainMap = null }
  thumbMaps.forEach(m => m.remove())
  thumbMaps.length = 0
})
</script>

<template>
  <div class="page">

    <AppNavbar active="routeplan" />

    <div class="container">

      <!-- Title -->
      <h1>Route Planner</h1>
      <p class="subtitle">AI-optimized routes designed for accessibility, comfort, and scenic beauty.</p>

      <!-- Loading -->
      <div v-if="loading" class="status-box">
        <div class="spinner"></div>
        <p>Finding your routes…</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="status-box error-box">
        <p>{{ error }}</p>
        <button class="btn" style="width:auto;padding:10px 24px;margin-top:12px" @click="router.push('/routesurvey')">Go back to survey</button>
      </div>

      <template v-else>

        <!-- Metrics row -->
        <div class="metrics-row">
          <div class="metric-card">
            <span class="metric-icon">→</span>
            <div>
              <div class="metric-value">{{ routes[activeRoute]?.distance_label }}</div>
              <div class="metric-label">Distance</div>
            </div>
          </div>
          <div class="metric-card">
            <span class="metric-icon">⏱</span>
            <div>
              <div class="metric-value">{{ routes[activeRoute]?.duration_label }}</div>
              <div class="metric-label">Duration</div>
            </div>
          </div>
          <div class="metric-card">
            <span class="metric-icon">☆</span>
            <div>
              <div class="metric-value">{{ difficultyLabel[survey?.preferred_pace] ?? 'Easy' }}</div>
              <div class="metric-label">Difficulty</div>
            </div>
          </div>
        </div>

        <!-- Main layout -->
        <div class="main">

          <!-- LEFT MAP -->
          <div class="map-card">
            <div id="map-main"></div>
            <div class="stop-legend">
              <div v-for="s in STOP_POINTS" :key="s.label" class="stop-item">
                <span class="stop-dot" :style="{ background: s.color }"></span>
                <span class="stop-label">{{ s.label }}</span>
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL -->
          <div class="side-card">
            <div class="tag">RECOMMENDED</div>

            <h2>Route {{ activeRoute + 1 }}</h2>
            <p class="meta">📍 {{ routes[activeRoute]?.distance_label }} &nbsp; ⏱ {{ routes[activeRoute]?.duration_label }}</p>

            <div class="info">
              <div>
                <strong>Activity</strong>
                <p>{{ activityLabel[survey?.activity_type] ?? 'Walking' }}</p>
              </div>
              <div>
                <strong>Pace</strong>
                <p style="text-transform:capitalize">{{ survey?.preferred_pace }}</p>
              </div>
              <div>
                <strong>Description</strong>
                <p>{{ routeDescription(activeRoute) }}</p>
              </div>
            </div>

            <button class="btn" @click="goReady()">Select This Route →</button>
          </div>

        </div>

        <!-- Highlight -->
        <div class="highlight">
          Your personalized {{ activityLabel[survey?.activity_type]?.toLowerCase() }} route — {{ routes[activeRoute]?.distance_label }} at a {{ survey?.preferred_pace }} pace, designed for your comfort.
        </div>

        <!-- All Routes -->
        <div class="suggestions">
          <div class="header">
            <h3>All Routes</h3>
          </div>

          <div class="cards">
            <div
              v-for="(route, i) in routes"
              :key="i"
              class="suggest-card"
              :class="{ 'card-active': activeRoute === i }"
              @click="selectRoute(i)"
            >
              <div :id="`map-t${i}`" class="suggest-map"></div>
              <div class="suggest-info">
                <h4>Route {{ i + 1 }}</h4>
                <p>{{ route.distance_label }} · {{ route.duration_label }}</p>
              </div>
              <div class="suggest-actions">
                <span class="distance">{{ route.distance_label }}</span>
              </div>
            </div>
          </div>
        </div>

      </template>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-brand">ActiveAgeing</div>
      <div class="footer-links">
        <a @click="router.push('/privacy')">Privacy Policy</a>
        <a @click="router.push('/terms')">Terms of Service</a>
        <a @click="router.push('/contact')">Contact Support</a>
      </div>
      <div class="footer-copy">© 2024 ActiveAgeing Australia. Your journey to wellness, clarified.</div>
    </footer>

    <!-- Ready to Go modal -->
    <Transition name="fade">
      <div v-if="showReady" class="ready-overlay" @click.self="closeReady">
        <Transition name="slide-up">
          <div v-if="showReady" class="ready-modal">
            <h2 class="ready-title">Ready to Go?</h2>
            <p class="ready-sub">Choose how you'd like to experience this route</p>

            <button class="btn-begin" @click="beginJourney">
              <div class="rdy-btn-content">
                <div class="rdy-btn-text">
                  <div class="rdy-label">Begin My Journey</div>
                  <div class="rdy-desc">Start your personalized route now</div>
                </div>
                <span class="rdy-arrow">→</span>
              </div>
            </button>

            <button class="btn-invite" @click="inviteOthers">
              <div class="rdy-btn-content">
                <div class="rdy-btn-text">
                  <div class="rdy-label rdy-label-dark">Invite Others</div>
                  <div class="rdy-desc rdy-desc-dark">Create an event and walk together</div>
                </div>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="10" cy="9" r="4" stroke="#0b5d57" stroke-width="1.8" fill="none"/>
                  <path d="M2 22c0-4 3.6-7 8-7" stroke="#0b5d57" stroke-width="1.8" stroke-linecap="round" fill="none"/>
                  <circle cx="19" cy="9" r="3" stroke="#0b5d57" stroke-width="1.6" fill="none"/>
                  <path d="M19 15c3.5 0 6 2.5 6 6" stroke="#0b5d57" stroke-width="1.6" stroke-linecap="round" fill="none"/>
                </svg>
              </div>
            </button>

            <button class="rdy-cancel" @click="closeReady">Cancel</button>
          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.page {
  background: #f6f7f6;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 1100px;
  margin: auto;
  padding: 100px 20px 20px;
}

h1 { font-size: 42px; color: #0b5d57; }
.subtitle { color: #666; margin-bottom: 24px; }

/* Loading / error */
.status-box {
  display: flex; flex-direction: column; align-items: center;
  gap: 16px; padding: 60px 20px; color: #555;
}
.error-box { color: #c0392b; }
.spinner {
  width: 40px; height: 40px;
  border: 4px solid #e0e0e0; border-top-color: #0b5d57;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Metrics */
.metrics-row { display: flex; gap: 16px; margin-bottom: 20px; }

.metric-card {
  flex: 1; background: white; border-radius: 14px;
  padding: 18px 20px; display: flex; align-items: center; gap: 14px;
}

.metric-icon  { font-size: 20px; color: #0b5d57; flex-shrink: 0; }
.metric-value { font-size: 20px; font-weight: 700; color: #0b5d57; line-height: 1.2; }
.metric-label { font-size: 12px; color: #888; margin-top: 2px; }

/* Main layout */
.main { display: flex; gap: 24px; }

.map-card {
  flex: 2; background: white; border-radius: 20px;
  overflow: hidden; position: relative;
  display: flex; flex-direction: column;
}

#map-main { flex: 1; min-height: 350px; }

.side-card { flex: 1; background: white; border-radius: 20px; padding: 20px; }

.tag {
  background: #5a2d0c; color: white;
  display: inline-block; padding: 5px 10px; border-radius: 10px; font-size: 12px;
}

.meta { color: #0b5d57; margin-bottom: 20px; }
.info p { font-size: 13px; color: #555; }

.btn {
  margin-top: 20px; width: 100%; padding: 14px;
  background: linear-gradient(135deg, #0f7a72, #0b5d57);
  color: white; border-radius: 10px; border: none; cursor: pointer;
  font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600;
  box-shadow: 0 4px 14px rgba(11,93,87,0.28);
  transition: opacity 0.2s, transform 0.15s;
}
.btn:hover { opacity: 0.92; transform: translateY(-1px); }

/* Stop points */
.stop-legend {
  display: flex; flex-wrap: wrap; gap: 10px 18px;
  padding: 12px 16px; border-top: 1px solid #f0f0f0; background: white;
}
.stop-item  { display: flex; align-items: center; gap: 6px; }
.stop-dot   { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
.stop-label { font-size: 12px; color: #555; }

/* Highlight */
.highlight {
  margin-top: 25px; background: #0b5d57;
  color: white; padding: 16px; border-radius: 12px;
}

/* All Routes */
.suggestions { margin-top: 30px; }
.header { display: flex; justify-content: space-between; }
.cards  { display: flex; gap: 20px; margin-top: 15px; }

.suggest-card {
  background: white; padding: 20px; border-radius: 15px;
  display: flex; gap: 18px; flex: 1; align-items: center;
  min-height: 130px; cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s, opacity 0.3s, filter 0.3s;
  border: 2px solid transparent;
}
.suggest-card:hover  { box-shadow: 0 4px 16px rgba(0,0,0,0.10); }
.card-active         { border-color: #c2185b; box-shadow: 0 4px 20px rgba(194,24,91,0.15); }

.suggest-map { width: 110px; height: 110px; border-radius: 12px; overflow: hidden; flex-shrink: 0; }

.suggest-info       { flex: 1; }
.suggest-info h4    { margin: 0 0 6px; font-size: 16px; }
.suggest-info p     { margin: 0; font-size: 14px; color: #888; }

.suggest-actions    { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.distance           { color: #0b5d57; font-weight: 700; }

/* Footer */
.footer {
  background: #0b5d57; color: rgba(255,255,255,0.75);
  text-align: center; padding: 28px 24px 20px; font-size: 13px; margin-top: 40px;
}
.footer-brand { font-size: 17px; font-weight: 700; color: white; margin-bottom: 10px; }
.footer-links { display: flex; justify-content: center; gap: 20px; margin-bottom: 12px; flex-wrap: wrap; }
.footer-links a { color: rgba(255,255,255,0.75); text-decoration: none; font-size: 13px; cursor: pointer; transition: color 0.2s; }
.footer-links a:hover { color: white; }
.footer-copy { font-size: 12px; color: rgba(255,255,255,0.45); }

/* Ready modal */
.ready-overlay {
  position: fixed; inset: 0;
  background: rgba(160,210,205,0.45);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 3000; padding: 24px;
}
.ready-modal {
  background: white; border-radius: 24px; padding: 40px 36px 32px;
  width: 100%; max-width: 420px;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
}
.ready-title { font-size: 28px; font-weight: 800; color: #0b3d38; text-align: center; margin: 0; }
.ready-sub   { font-size: 14px; color: #6a7a76; text-align: center; margin: -4px 0 6px; }

.btn-begin {
  width: 100%; background: linear-gradient(135deg, #12897f, #0b5d57);
  border: none; border-radius: 14px; padding: 20px 24px; cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 6px 20px rgba(11,93,87,0.35);
}
.btn-begin:hover { opacity: 0.93; transform: translateY(-1px); }

.btn-invite {
  width: 100%; background: white; border: 2px solid #0b5d57;
  border-radius: 14px; padding: 20px 24px; cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-invite:hover { background: #e8f4f0; transform: translateY(-1px); }

.rdy-btn-content { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.rdy-btn-text    { text-align: left; }
.rdy-label       { font-size: 17px; font-weight: 700; color: white; line-height: 1.3; }
.rdy-label-dark  { color: #0b3d38; }
.rdy-desc        { font-size: 13px; font-weight: 400; color: rgba(255,255,255,0.85); margin-top: 3px; }
.rdy-desc-dark   { color: #6a7a76; }
.rdy-arrow       { font-size: 22px; color: white; font-weight: 600; flex-shrink: 0; }

.rdy-cancel {
  background: none; border: none; font-family: 'Poppins', sans-serif;
  font-size: 14px; font-weight: 500; color: #6a7a76;
  cursor: pointer; padding: 4px 16px; margin-top: 2px; transition: color 0.2s;
}
.rdy-cancel:hover { color: #0b5d57; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
.slide-up-enter-active { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease; }
.slide-up-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.slide-up-enter-from   { transform: translateY(32px); opacity: 0; }
.slide-up-leave-to     { transform: translateY(16px); opacity: 0; }
</style>
