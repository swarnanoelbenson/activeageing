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

const startAddress   = ref('')
const startLat       = ref(null)
const startLng       = ref(null)
const locationStatus = ref('')   // '', 'locating', 'found', 'error'
const submitted      = ref(false)
const suggestions    = ref([])
const showDropdown   = ref(false)

let debounceTimer = null

function select(q, value) {
  answers.value[q] = value
}

function isSelected(q, value) {
  return answers.value[q] === value
}

function onAddressInput() {
  // Reset coords whenever the user edits the field
  startLat.value = null
  startLng.value = null
  locationStatus.value = ''

  clearTimeout(debounceTimer)
  const query = startAddress.value.trim()
  if (query.length < 2) {
    suggestions.value = []
    showDropdown.value = false
    return
  }

  debounceTimer = setTimeout(async () => {
    try {
      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?q=${encodeURIComponent(query + ', Victoria, Australia')}` +
        `&format=json&addressdetails=1&limit=8&countrycodes=au`
      const r    = await fetch(url, { headers: { 'Accept-Language': 'en' } })
      const data = await r.json()

      // Keep only results that are actually in Victoria
      suggestions.value = data
        .filter(d => d.address?.state === 'Victoria')
        .map(d => {
          const a    = d.address
          const name = a.suburb ?? a.town ?? a.village ?? a.city ?? a.county ?? query
          const postcode = a.postcode ? ` ${a.postcode}` : ''
          return {
            label: `${name}${postcode}, Victoria`,
            lat:   parseFloat(d.lat),
            lng:   parseFloat(d.lon),
          }
        })
        // deduplicate by label
        .filter((v, i, arr) => arr.findIndex(x => x.label === v.label) === i)

      showDropdown.value = suggestions.value.length > 0
    } catch {
      suggestions.value = []
      showDropdown.value = false
    }
  }, 300)
}

function pickSuggestion(s) {
  startAddress.value   = s.label
  startLat.value       = s.lat
  startLng.value       = s.lng
  locationStatus.value = 'found'
  suggestions.value    = []
  showDropdown.value   = false
}

function closeDropdown() {
  // Small delay so a click on an option fires before blur hides it
  setTimeout(() => { showDropdown.value = false }, 150)
}

function useMyLocation() {
  if (!navigator.geolocation) {
    locationStatus.value = 'error'
    return
  }
  locationStatus.value = 'locating'
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      startLat.value = pos.coords.latitude
      startLng.value = pos.coords.longitude
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${startLat.value}&lon=${startLng.value}&format=json&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await r.json()
        const a    = data.address ?? {}
        const name = a.suburb ?? a.town ?? a.village ?? a.city ?? ''
        const postcode = a.postcode ? ` ${a.postcode}` : ''
        startAddress.value = name
          ? `${name}${postcode}, Victoria`
          : (data.display_name ?? `${startLat.value.toFixed(5)}, ${startLng.value.toFixed(5)}`)
      } catch {
        startAddress.value = `${startLat.value.toFixed(5)}, ${startLng.value.toFixed(5)}`
      }
      locationStatus.value = 'found'
    },
    () => { locationStatus.value = 'error' },
    { timeout: 8000 }
  )
}

async function findMyRoute() {
  submitted.value = true
  const { q1, q2, q3, q4, q5 } = answers.value
  const locationMissing = !startLat.value && !startAddress.value.trim()
  if (!q1 || !q2 || !q3 || !q4 || !q5 || locationMissing) return

  const payload = {
    activity_type:    q1,
    duration_minutes: Number(q2),
    preferred_pace:   q3,
    environment_pref: q4,
    rest_stops:       q5,
    start_address:    startAddress.value.trim() || null,
    start_lat:        startLat.value,
    start_lng:        startLng.value,
  }

  // Persist for Planner.vue to read
  sessionStorage.setItem('routeSurvey', JSON.stringify(payload))

  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/routesurvey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('Could not save route survey:', err)
  }

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
        <div class="question-block" :class="{ 'q-error': submitted && !answers.q1 }">
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
        <div class="question-block" :class="{ 'q-error': submitted && !answers.q2 }">
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
        <div class="question-block" :class="{ 'q-error': submitted && !answers.q3 }">
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
        <div class="question-block" :class="{ 'q-error': submitted && !answers.q4 }">
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
        <div class="question-block" :class="{ 'q-error': submitted && !answers.q5 }">
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

        <!-- Q6: Starting Location -->
        <div class="question-block" :class="{ 'q-error': submitted && !startLat && !startAddress.trim() }">
          <div class="q-label">
            <span class="q-num">6</span>
            <span class="q-text">Where would you like to start?</span>
          </div>
          <div class="location-row">
            <div class="autocomplete-wrap">
              <input
                class="location-input"
                type="text"
                placeholder="Enter a suburb or address…"
                v-model="startAddress"
                @input="onAddressInput"
                @blur="closeDropdown"
                autocomplete="off"
              />
              <ul v-if="showDropdown" class="suggestions-list">
                <li
                  v-for="s in suggestions"
                  :key="s.label"
                  class="suggestion-item"
                  @mousedown.prevent="pickSuggestion(s)"
                >
                  📍 {{ s.label }}
                </li>
              </ul>
            </div>
            <button class="locate-btn" @click="useMyLocation" :disabled="locationStatus === 'locating'">
              {{ locationStatus === 'locating' ? 'Locating…' : '📍 Use my location' }}
            </button>
          </div>
          <p v-if="locationStatus === 'found'" class="loc-status loc-ok">✓ Location set</p>
          <p v-if="locationStatus === 'error'" class="loc-status loc-err">Could not detect location — please type an address above.</p>
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
  padding: 8px 8px 48px;
}

.survey-container {
  width: 100%;
  max-width: 1000px;
}

.page-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 36px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-sub {
  font-size: 15px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 32px;
}

.question-block { margin-bottom: 32px; }
.q-error { padding: 12px; border-radius: 12px; background: #fff5f5; outline: 1.5px solid #e53935; }
.q-error .q-num { background: #e53935; }

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
  font-size: 17px;
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

/* ── Location ── */
.location-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.autocomplete-wrap {
  flex: 1;
  position: relative;
}

.location-input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #e2e2e2;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #1a1a1a;
  background: white;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.location-input:focus { border-color: #0b5d57; }

.suggestions-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1.5px solid #d0e8e5;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.10);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  z-index: 100;
  max-height: 220px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 10px 14px;
  font-size: 13px;
  color: #1a1a1a;
  cursor: pointer;
  transition: background 0.15s;
}
.suggestion-item:hover { background: #f0f8f7; }

.locate-btn {
  white-space: nowrap;
  padding: 12px 16px;
  background: #0b5d57;
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.locate-btn:hover:not(:disabled) { background: #084a45; }
.locate-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.loc-status { font-size: 12px; margin-top: 6px; }
.loc-ok  { color: #0b5d57; }
.loc-err { color: #c0392b; }

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