<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router  = useRouter()
const API     = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const COLOURS = ['#c2185b', '#c2185b', '#c2185b']

const loading = ref(true)
const error   = ref(null)
const routes  = ref([])
const survey  = ref(null)

const maps = []

const activityLabel = { walking: 'Walking', jogging: 'Light Jogging', cycling: 'Cycling' }

// ── Route detail modal ──
const modalIndex = ref(null)
let   modalMap   = null

// ── Ready modal ──
const showReady = ref(false)

function openReady() {
  showReady.value = true
}

function closeReady() {
  showReady.value = false
}

function beginJourney() {
  router.push('/journey1')
}

function inviteOthers() {
  router.push('/invite')
}

// ── Select route (was goReady) ──
function goReady(index = 0) {
  // close detail modal if open, then show ready overlay
  if (modalIndex.value !== null) closeModal()
  openReady()
}

async function openModal(index) {
  modalIndex.value = index
  await new Promise(r => setTimeout(r, 80))
  const route = routes.value[index]
  if (!route) return
  const container = document.getElementById('map-modal')
  if (!container) return
  modalMap = L.map(container, { zoomControl: true, attributionControl: false })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(modalMap)
  const latlngs = route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
  const line = L.polyline(latlngs, { color: COLOURS[index], weight: 4 }).addTo(modalMap)
  const [sLng, sLat] = route.geometry.coordinates[0]
  L.circleMarker([sLat, sLng], { radius: 7, fillColor: '#e8720c', color: 'white', weight: 2, fillOpacity: 1 }).addTo(modalMap)
  modalMap.fitBounds(line.getBounds(), { padding: [20, 20] })
}

function closeModal() {
  if (modalMap) { modalMap.remove(); modalMap = null }
  modalIndex.value = null
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(survey.value),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Failed to load routes')
    routes.value = data.routes
  } catch (e) {
    error.value = e.message
    loading.value = false
    return
  }

  loading.value = false

  await new Promise(r => setTimeout(r, 80))
  initMaps()
})

function initMaps() {
  const configs = [
    { id: 'map-main', routeIndex: 0 },
    { id: 'map-s1',   routeIndex: 1 },
    { id: 'map-s2',   routeIndex: 2 },
  ]

  configs.forEach(({ id, routeIndex }) => {
    const route = routes.value[routeIndex]
    if (!route) return
    const container = document.getElementById(id)
    if (!container) return

    const isMain = routeIndex === 0
    const m = L.map(container, {
      zoomControl: isMain,
      attributionControl: false,
      dragging: isMain,
      scrollWheelZoom: isMain,
      doubleClickZoom: isMain,
      touchZoom: isMain,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(m)

    const latlngs = route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
    const line = L.polyline(latlngs, { color: COLOURS[routeIndex] ?? '#e8720c', weight: isMain ? 5 : 3 }).addTo(m)

    if (isMain) {
      const [sLng, sLat] = route.geometry.coordinates[0]
      L.circleMarker([sLat, sLng], { radius: 7, fillColor: '#e8720c', color: 'white', weight: 2, fillOpacity: 1 }).addTo(m)
    }

    m.fitBounds(line.getBounds(), { padding: routeIndex === 0 ? [16, 16] : [4, 4] })
    maps.push(m)
  })
}

onBeforeUnmount(() => {
  maps.forEach(m => m.remove())
  maps.length = 0
})
</script>

<template>
  <div class="page">

    <!-- Top bar -->
    <div class="topbar">
      <h3>ActiveAgeing</h3>
      <span class="support" @click="router.push('/routesurvey')" style="cursor:pointer">← Back</span>
    </div>

    <div class="container">

      <!-- Title -->
      <h1>Route Planner</h1>
      <p class="subtitle">
        AI-optimized routes designed for accessibility, comfort, and scenic beauty.
      </p>

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

      <!-- Main layout -->
      <template v-else>
        <div class="main">

          <!-- LEFT MAP — Route 1 -->
          <div class="map-card">
            <div id="map-main"></div>
          </div>

          <!-- RIGHT PANEL -->
          <div class="side-card">
            <div class="tag">RECOMMENDED</div>

            <h2>Route 1</h2>
            <p class="meta">📍 {{ routes[0]?.distance_label }} &nbsp; ⏱ {{ routes[0]?.duration_label }}</p>

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
                <p>{{ routeDescription(0) }}</p>
              </div>
            </div>

            <button class="btn" @click="goReady(0)">Select This Route →</button>
          </div>

        </div>

        <!-- Highlight -->
        <div class="highlight">
          Your personalized {{ activityLabel[survey?.activity_type]?.toLowerCase() }} route — {{ routes[0]?.distance_label }} at a {{ survey?.preferred_pace }} pace, designed for your comfort.
        </div>

        <!-- Suggestions -->
        <div class="suggestions">
          <div class="header">
            <h3>Other Suggestions</h3>
            <span>View all</span>
          </div>

          <div class="cards">

            <div class="suggest-card" v-if="routes[1]" @click="openModal(1)">
              <div id="map-s1" class="suggest-map"></div>
              <div class="suggest-info">
                <h4>Route 2</h4>
                <p>{{ routes[1]?.distance_label }} · {{ routes[1]?.duration_label }}</p>
              </div>
              <div class="suggest-actions">
                <span class="distance">{{ routes[1]?.distance_label }}</span>
                <button class="view-btn" @click.stop="openModal(1)">View</button>
              </div>
            </div>

            <div class="suggest-card" v-if="routes[2]" @click="openModal(2)">
              <div id="map-s2" class="suggest-map"></div>
              <div class="suggest-info">
                <h4>Route 3</h4>
                <p>{{ routes[2]?.distance_label }} · {{ routes[2]?.duration_label }}</p>
              </div>
              <div class="suggest-actions">
                <span class="distance">{{ routes[2]?.distance_label }}</span>
                <button class="view-btn" @click.stop="openModal(2)">View</button>
              </div>
            </div>

          </div>
        </div>
      </template>

    </div>

    <!-- Footer -->
    <footer class="footer">
      <h4>ActiveAgeing</h4>
      <p>Privacy Policy · Terms of Service · Accessibility</p>
    </footer>

    <!-- ── Route detail modal ── -->
    <div v-if="modalIndex !== null" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>Route {{ modalIndex + 1 }}</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div id="map-modal"></div>
        <div class="modal-body">
          <p class="meta">📍 {{ routes[modalIndex]?.distance_label }} &nbsp; ⏱ {{ routes[modalIndex]?.duration_label }}</p>
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
              <p>{{ routeDescription(modalIndex) }}</p>
            </div>
          </div>
          <div class="modal-btn-row">
            <button class="btn" style="margin-top:0" @click="goReady(modalIndex)">Select This Route →</button>
            <button class="btn btn-outline" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════
         READY TO GO MODAL (inlined)
    ══════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showReady" class="ready-overlay" @click.self="closeReady">
        <Transition name="slide-up">
          <div v-if="showReady" class="ready-modal">
            <h2 class="ready-title">Ready to Go?</h2>
            <p class="ready-sub">Choose how you'd like to experience this route</p>

            <!-- Begin My Journey -->
            <button class="btn-begin" @click="beginJourney">
              <div class="rdy-btn-content">
                <div class="rdy-btn-text">
                  <div class="rdy-label">Begin My Journey</div>
                  <div class="rdy-desc">Start your personalized route now</div>
                </div>
                <span class="rdy-arrow">→</span>
              </div>
            </button>

            <!-- Invite Others -->
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

/* Top */
.topbar {
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
  font-weight: 600;
}

.container {
  max-width: 1100px;
  margin: auto;
  padding: 20px;
}

h1 {
  font-size: 42px;
  color: #0b5d57;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

/* Loading / error */
.status-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 20px;
  color: #555;
}
.error-box { color: #c0392b; }
.spinner {
  width: 40px; height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #0b5d57;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Main layout */
.main {
  display: flex;
  gap: 24px;
}

.map-card {
  flex: 2;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

#map-main {
  flex: 1;
  min-height: 350px;
}

.badge {
  position: absolute;
  top: 15px; left: 15px;
  background: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  z-index: 1000;
}

.side-card {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 20px;
}

.tag {
  background: #5a2d0c;
  color: white;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 12px;
}

.meta {
  color: #0b5d57;
  margin-bottom: 20px;
}

.info p {
  font-size: 13px;
  color: #555;
}

/* Main select route btn — gradient */
.btn {
  margin-top: 20px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #0f7a72, #0b5d57);
  color: white;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(11,93,87,0.28);
  transition: opacity 0.2s, transform 0.15s;
}
.btn:hover { opacity: 0.92; transform: translateY(-1px); }

.highlight {
  margin-top: 25px;
  background: #0b5d57;
  color: white;
  padding: 16px;
  border-radius: 12px;
}

.suggestions { margin-top: 30px; }

.header {
  display: flex;
  justify-content: space-between;
}

.cards {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.suggest-card {
  background: white;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  gap: 18px;
  flex: 1;
  align-items: center;
  min-height: 130px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.suggest-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.10); }

.suggest-map {
  width: 110px; height: 110px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.suggest-info { flex: 1; }
.suggest-info h4 { margin: 0 0 6px; font-size: 16px; }
.suggest-info p  { margin: 0; font-size: 14px; color: #888; }

.suggest-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.distance { color: #0b5d57; font-weight: 1000; }

.view-btn {
  padding: 20px 50px;
  background: #0b5d57;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.view-btn:hover { background: #084a45; }

/* Route detail modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 620px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}
.modal-header h3 { margin: 0; color: #0b5d57; }

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #888;
  line-height: 1;
}
.modal-close:hover { color: #333; }

#map-modal {
  width: 100%;
  min-height: 280px;
  flex: 1;
}

.modal-body { padding: 20px; }

.modal-btn-row {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}
.modal-btn-row .btn { flex: 1; margin-top: 0; }

.btn-outline {
  background: white;
  color: #0b5d57;
  border: 1.5px solid #0b5d57;
  box-shadow: none;
}
.btn-outline:hover { background: #f0f8f7; }

/* Footer */
.footer {
  text-align: center;
  margin-top: 40px;
  padding: 30px;
  color: #666;
}

/* ══════════════════════════════
   READY TO GO MODAL
══════════════════════════════ */
.ready-overlay {
  position: fixed;
  inset: 0;
  background: rgba(160, 210, 205, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 24px;
}

.ready-modal {
  background: white;
  border-radius: 24px;
  padding: 40px 36px 32px;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
}

.ready-title {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0b3d38;
  text-align: center;
  margin: 0;
}

.ready-sub {
  font-size: 14px;
  color: #6a7a76;
  text-align: center;
  margin: -4px 0 6px;
}

/* Begin button */
.btn-begin {
  width: 100%;
  background: linear-gradient(135deg, #12897f, #0b5d57);
  border: none;
  border-radius: 14px;
  padding: 20px 24px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 6px 20px rgba(11,93,87,0.35);
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

.rdy-btn-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.rdy-btn-text { text-align: left; }

.rdy-label {
  font-size: 17px;
  font-weight: 700;
  color: white;
  line-height: 1.3;
}
.rdy-label-dark { color: #0b3d38; }

.rdy-desc {
  font-size: 13px;
  font-weight: 400;
  color: rgba(255,255,255,0.85);
  margin-top: 3px;
}
.rdy-desc-dark { color: #6a7a76; }

.rdy-arrow {
  font-size: 22px;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.rdy-cancel {
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
.rdy-cancel:hover { color: #0b5d57; }

/* Transitions */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease; }
.slide-up-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.slide-up-enter-from  { transform: translateY(32px); opacity: 0; }
.slide-up-leave-to    { transform: translateY(16px); opacity: 0; }
</style>
