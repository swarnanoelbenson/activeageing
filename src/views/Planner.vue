<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import AppNavbar from '../components/AppNavbar.vue'
import AppFooter from '../components/AppFooter.vue'

// Token must be set before any mapboxgl.Map constructor runs — setting it
// here at module evaluation time guarantees it's ready even if initMaps()
// is called from inside an async onMounted.
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const router = useRouter()
const API    = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
// Pink/magenta chosen to contrast well against the streets-v12 basemap
// greens and greys, keeping the route line visible at all zoom levels.
const COLOUR = '#c2185b'

const loading     = ref(true)
const error       = ref(null)
const routes      = ref([])
const survey      = ref(null)
const activeRoute = ref(0)

const ROUTE_NAMES = ['Sunrise Trail', 'Forest Walk', 'River Bend', 'Meadow Path', 'Ocean Breeze', 'Mountain Stream']
const ORDINAL_TAGS = ['1st Recommendation', '2nd Recommendation', '3rd Recommendation', '4th Recommendation', '5th Recommendation', '6th Recommendation']

const activityLabel   = { walking: 'Walking', jogging: 'Light Jogging', cycling: 'Cycling' }
const difficultyLabel = { easy: 'Easy', moderate: 'Moderate', brisk: 'Challenging' }

const STOP_POINTS = [
  { label: 'Shaded',            color: '#1a5c54', cat: 'shaded'            },
  { label: 'Seating',           color: '#8b3a2a', cat: 'seating'           },
  { label: 'Drinking fountain', color: '#2d7d78', cat: 'drinking_fountain' },
  { label: 'Landmark',          color: '#c9a96e', cat: 'landmark'          },
  { label: 'Public restroom',   color: '#7a8c72', cat: 'restroom'          },
]

const catLabel = {
  shaded:            'Shaded / Park',
  seating:           'Seating / Bench',
  drinking_fountain: 'Drinking Fountain',
  landmark:          'Landmark / Attraction',
  restroom:          'Public Restroom',
}

// ── POI visibility state ──
// Sets are used rather than arrays because membership tests (has/delete) are
// O(1). Vue cannot observe Set mutations, so any change must replace the ref
// with a new Set — see toggleCategory() for the pattern.
const activeCategories = ref(new Set(['shaded', 'seating', 'drinking_fountain', 'landmark', 'restroom']))
const addedPOIIds      = ref(new Set())
const removedPOIIds    = ref(new Set())
const selectedPOI      = ref(null)
const showPOIModal     = ref(false)

// ── Waypoint rerouting ──
// `currentWaypoints` accumulates [lng, lat] pairs each time the user adds a
// POI stop; it's passed to the waypoint endpoint so the route threads through
// all chosen stops in insertion order.
const currentWaypoints = ref([])   // [[lng, lat], ...] accumulated across Add actions
const routeLoading     = ref(false)
const poisLoading      = ref(false)
// `poisLoaded` prevents re-fetching POIs when the user switches routes; POIs
// are fetched once per page load and are reused across route switches.
const poisLoaded       = ref(false)

// ── Shared event banner (shown when a code is loaded) ──
const sharedEventBanner = ref(null)

// ── Fullscreen ──
// onFullscreenChange calls mainMap.resize() after 100ms so Mapbox
// recomputes the canvas dimensions after the browser finishes the
// fullscreen transition animation.
const isFullscreen = ref(false)
function toggleFullscreen() {
  const el = document.getElementById('map-main')
  if (!el) return
  if (!document.fullscreenElement) {
    el.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}
function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
  setTimeout(() => mainMap?.resize(), 100)
}

// ── Open in Google Maps ──
// Google Maps directions URL supports a maximum of 8 waypoints in the free
// tier. The function samples evenly-spaced coords from the geometry to stay
// under that limit while still approximating the full route shape.
function openInGoogleMaps() {
  const route = routes.value[activeRoute.value]
  if (!route) return
  const coords = route.geometry.coordinates
  const origin      = `${coords[0][1]},${coords[0][0]}`
  const destination = `${coords[coords.length - 1][1]},${coords[coords.length - 1][0]}`
  const MAX_WP = 8
  const step = Math.max(1, Math.floor((coords.length - 2) / MAX_WP))
  const wps = []
  for (let i = step; i < coords.length - 1; i += step) {
    wps.push(`${coords[i][1]},${coords[i][0]}`)
    if (wps.length >= MAX_WP) break
  }
  const mode = survey.value?.activity_type === 'cycling' ? 'bicycling' : 'walking'
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`
  if (wps.length) url += `&waypoints=${encodeURIComponent(wps.join('|'))}`
  window.open(url, '_blank')
}

// ── Main map ──
// Plain `let` (not ref) because Mapbox map instances are mutable objects
// that Vue shouldn't wrap in a Proxy — deep reactivity on GL objects
// causes internal errors.
let mainMap         = null
let mainStartMarker = null
let mainEndMarker   = null
// Guard so POI click listeners are added only once even if fetchAndDrawPOIs
// is called again after a reroute.
let poisListenersAdded = false

// ── Thumbnail maps ──
// Stored in a plain array so they can be cleaned up in onBeforeUnmount;
// not reactive because the template references them only by DOM id.
const thumbMaps = []

// ── Helpers ──
function routeBounds(coords) {
  return coords.reduce(
    (b, c) => b.extend(c),
    new mapboxgl.LngLatBounds(coords[0], coords[0])
  )
}

function makeMarkerEl(label, bg) {
  const el = document.createElement('div')
  el.style.cssText = `
    width:42px;height:42px;background:${bg};border:3px solid #fff;
    border-radius:50%;display:flex;align-items:center;justify-content:center;
    color:#fff;font-weight:800;font-size: 20px;font-family:'Poppins',sans-serif;
    box-shadow:0 4px 12px rgba(0,0,0,0.35);cursor:default;
  `
  el.textContent = label
  return el
}

// Returns true when start and end coords are within 100m (round trip)
function isRoundTrip(coords) {
  const [sx, sy] = coords[0]
  const [ex, ey] = coords[coords.length - 1]
  const dx = (ex - sx) * 111320 * Math.cos(sy * Math.PI / 180)
  const dy = (ey - sy) * 111320
  return Math.hypot(dx, dy) < 100
}

// Creates the right-pointing chevron image used for direction arrows
function buildArrowImage() {
  const size = 28
  const c    = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.fillStyle = 'rgba(0,68,255, 0.92)'  // light blue
  ctx.beginPath()
  ctx.moveTo(6,  7)           // upper-left
  ctx.lineTo(22, size / 2)    // right tip
  ctx.lineTo(6,  21)          // lower-left
  ctx.lineTo(10, size / 2)    // inner notch
  ctx.closePath()
  ctx.fill()
  return ctx.getImageData(0, 0, size, size)
}

// ── POI path filtering (point-to-segment distance) ──
// `ptSegDist` computes the perpendicular distance from a point to a
// line segment in metric coordinates. `isNearRoute` uses it to discard
// Overpass results that are within the bounding box but far from the
// actual route line — 60m buffer keeps only genuinely accessible stops.
function ptSegDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay)
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

function isNearRoute(lon, lat, coords, bufferM = 60) {
  const latScale = 111320
  const lngScale = 111320 * Math.cos((lat * Math.PI) / 180)
  for (let i = 0; i < coords.length - 1; i++) {
    const [ax, ay] = coords[i]
    const [bx, by] = coords[i + 1]
    const d = ptSegDist(
      (lon - ax) * lngScale, (lat - ay) * latScale,
      0, 0,
      (bx - ax) * lngScale, (by - ay) * latScale
    )
    if (d <= bufferM) return true
  }
  return false
}

// ── POI filter update ──
// Builds Mapbox GL expression filters that combine category visibility,
// the "added" set (gold ring layer), and the "removed" set (hidden). The
// `__none__` sentinel is used to hide a layer without removing it — a
// removed layer loses its source binding and is expensive to re-add.
function applyPOIFilter() {
  if (!mainMap || !mainMap.getLayer('pois-layer')) return

  const activeCats = [...activeCategories.value]
  const removedIds = [...removedPOIIds.value]
  const addedIds   = [...addedPOIIds.value]

  if (activeCats.length === 0) {
    mainMap.setFilter('pois-layer',       ['==', ['get', 'cat'], '__none__'])
    if (mainMap.getLayer('pois-added-layer'))
      mainMap.setFilter('pois-added-layer', ['==', ['get', 'cat'], '__none__'])
    return
  }

  const catF      = ['in', ['get', 'cat'], ['literal', activeCats]]
  const notRm     = removedIds.length ? ['!', ['in', ['get', 'id'], ['literal', removedIds]]] : null
  const notAdded  = addedIds.length   ? ['!', ['in', ['get', 'id'], ['literal', addedIds]]]   : null
  const conds     = [catF, notRm, notAdded].filter(Boolean)
  const normalF   = conds.length > 1 ? ['all', ...conds] : conds[0]

  mainMap.setFilter('pois-layer', normalF)

  if (mainMap.getLayer('pois-added-layer')) {
    mainMap.setFilter(
      'pois-added-layer',
      addedIds.length ? ['in', ['get', 'id'], ['literal', addedIds]] : ['==', ['get', 'cat'], '__none__']
    )
  }
}

// Replace the Set rather than mutating it — Vue's reactivity system tracks
// the ref value by identity, not by Set contents.
function toggleCategory(cat) {
  const s = new Set(activeCategories.value)
  s.has(cat) ? s.delete(cat) : s.add(cat)
  activeCategories.value = s
  applyPOIFilter()
}

// ── POI modal ──
function openPOIModal(feature) {
  selectedPOI.value = {
    id:          feature.properties.id,
    name:        feature.properties.name,
    cat:         feature.properties.cat,
    coordinates: feature.geometry.coordinates.slice(),
  }
  showPOIModal.value = true
}

async function addPOI() {
  if (!selectedPOI.value) return

  const s = new Set(addedPOIIds.value)
  s.add(selectedPOI.value.id)
  addedPOIIds.value = s
  showPOIModal.value = false
  applyPOIFilter()

  // Reroute through the new waypoint
  const newWaypoint = [selectedPOI.value.coordinates[0], selectedPOI.value.coordinates[1]]
  const allWaypoints = [...currentWaypoints.value, newWaypoint]
  await rerouteWithWaypoints(allWaypoints)
  currentWaypoints.value = allWaypoints
}

async function removePOI() {
  if (!selectedPOI.value) return

  const added = new Set(addedPOIIds.value)
  added.delete(selectedPOI.value.id)
  addedPOIIds.value = added

  const removed = new Set(removedPOIIds.value)
  removed.add(selectedPOI.value.id)
  removedPOIIds.value = removed

  showPOIModal.value = false
  applyPOIFilter()

  // Re-fetch POIs so removed one disappears from click targets too
  // Rebuild waypoints list excluding the removed POI's coordinates
  const removedCoord = selectedPOI.value.coordinates
  currentWaypoints.value = currentWaypoints.value.filter(
    w => !(Math.abs(w[0] - removedCoord[0]) < 1e-7 && Math.abs(w[1] - removedCoord[1]) < 1e-7)
  )
  await rerouteWithWaypoints(currentWaypoints.value)
}

async function rerouteWithWaypoints(waypoints) {
  if (!survey.value) return
  routeLoading.value = true
  try {
    const body = {
      activity_type: survey.value.activity_type,
      start_lat:     survey.value.start_lat,
      start_lng:     survey.value.start_lng,
      waypoints:     waypoints.length ? waypoints : undefined,
    }

    let res, data
    if (waypoints.length) {
      res  = await fetch(`${API}/api/routes/waypoint`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      data = await res.json()
      if (!res.ok) throw new Error(data.error)

      routes.value[activeRoute.value] = {
        ...routes.value[activeRoute.value],
        geometry:       data.geometry,
        distance_label: data.distance_label,
        duration_label: data.duration_label,
      }
    } else {
      // No waypoints left — restore original route from ORS round-trip
      res  = await fetch(`${API}/api/routes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(survey.value),
      })
      data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (data.routes?.[activeRoute.value]) {
        routes.value[activeRoute.value] = data.routes[activeRoute.value]
      }
    }

    // Redraw route line and markers (skip POI re-fetch to preserve selections)
    if (mainMap && mainMap.getSource('main-route')) {
      mainMap.getSource('main-route').setData({
        type: 'Feature', geometry: routes.value[activeRoute.value].geometry,
      })
      if (mainStartMarker) mainStartMarker.remove()
      if (mainEndMarker)   mainEndMarker.remove()
      const coords = routes.value[activeRoute.value].geometry.coordinates
      const rt = isRoundTrip(coords)
      mainEndMarker = new mapboxgl.Marker({
        element: makeMarkerEl('F', '#dc2626'), offset: rt ? [26, 0] : [0, 0],
      }).setLngLat(coords[coords.length - 1]).addTo(mainMap)
      mainStartMarker = new mapboxgl.Marker({
        element: makeMarkerEl('S', '#16a34a'), offset: rt ? [-26, 0] : [0, 0],
      }).setLngLat(coords[0]).addTo(mainMap)
    }
  } catch (e) {
    console.warn('Waypoint reroute failed:', e.message)
  } finally {
    routeLoading.value = false
  }
}

// ── POI fetch (Overpass API) ──
// Overpass is rate-limited and occasionally returns HTML error pages, so
// three mirror URLs are tried in order. The 5s noticeTimer hides the loading
// overlay if Overpass is slow — POIs will still appear when the fetch
// resolves, but the user isn't blocked from interacting with the map.
async function fetchAndDrawPOIs(coords) {
  if (!mainMap) return
  if (poisLoaded.value) return
  poisLoading.value = true
  const noticeTimer = setTimeout(() => { poisLoading.value = false }, 5000)
  const lngs  = coords.map(c => c[0])
  const lats  = coords.map(c => c[1])
  const south = (Math.min(...lats) - 0.002).toFixed(5)
  const north = (Math.max(...lats) + 0.002).toFixed(5)
  const west  = (Math.min(...lngs) - 0.002).toFixed(5)
  const east  = (Math.max(...lngs) + 0.002).toFixed(5)

  const overpassQuery = `[out:json][timeout:25];(
    node["amenity"="bench"](${south},${west},${north},${east});
    node["amenity"="drinking_water"](${south},${west},${north},${east});
    node["amenity"="toilets"](${south},${west},${north},${east});
    node["tourism"="attraction"](${south},${west},${north},${east});
    node["historic"](${south},${west},${north},${east});
    node["leisure"="park"](${south},${west},${north},${east});
  );out body;`

  const OVERPASS_MIRRORS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  ]

  async function tryOverpass(url) {
    const r = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    `data=${encodeURIComponent(overpassQuery)}`,
    })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const text = await r.text()
    // Overpass sometimes returns an HTML error page instead of JSON
    if (!text.trimStart().startsWith('{')) throw new Error('Non-JSON response')
    return JSON.parse(text)
  }

  try {
    let data = null
    for (const mirror of OVERPASS_MIRRORS) {
      try { data = await tryOverpass(mirror); break }
      catch (e) { console.warn(`Overpass mirror ${mirror} failed:`, e.message) }
    }
    if (!data) throw new Error('All Overpass mirrors failed')

    const features = data.elements
      .filter(el => isNearRoute(el.lon, el.lat, coords, 60))
      .map(el => {
        const t = el.tags ?? {}
        let cat = 'landmark'
        if (t.amenity === 'bench')          cat = 'seating'
        if (t.amenity === 'drinking_water') cat = 'drinking_fountain'
        if (t.amenity === 'toilets')        cat = 'restroom'
        if (t.leisure === 'park')           cat = 'shaded'
        const name = t.name ?? catLabel[cat] ?? cat
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [el.lon, el.lat] },
          properties: { cat, name, id: el.id },
        }
      })

    const geojson = { type: 'FeatureCollection', features }

    if (mainMap.getSource('pois')) {
      mainMap.getSource('pois').setData(geojson)
      applyPOIFilter()
    } else {
      mainMap.addSource('pois', { type: 'geojson', data: geojson })

      // Normal POI layer
      mainMap.addLayer({
        id: 'pois-layer', type: 'circle', source: 'pois',
        paint: {
          'circle-color': ['match', ['get', 'cat'],
            'shaded',            '#1a5c54',
            'seating',           '#8b3a2a',
            'drinking_fountain', '#2d7d78',
            'landmark',          '#c9a96e',
            'restroom',          '#7a8c72',
            '#888',
          ],
          'circle-radius':       9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        },
      })

      // Added POI layer (gold ring, larger)
      mainMap.addLayer({
        id: 'pois-added-layer', type: 'circle', source: 'pois',
        filter: ['==', ['get', 'cat'], '__none__'],
        paint: {
          'circle-color': ['match', ['get', 'cat'],
            'shaded',            '#1a5c54',
            'seating',           '#8b3a2a',
            'drinking_fountain', '#2d7d78',
            'landmark',          '#c9a96e',
            'restroom',          '#7a8c72',
            '#888',
          ],
          'circle-radius':       13,
          'circle-stroke-width': 4,
          'circle-stroke-color': '#f59e0b',
        },
      })
    }

    if (!poisListenersAdded) {
      poisListenersAdded = true

      const onPOIClick = e => {
        e.originalEvent.stopPropagation()
        openPOIModal(e.features[0])
      }
      mainMap.on('click', 'pois-layer',       onPOIClick)
      mainMap.on('click', 'pois-added-layer', onPOIClick)
      mainMap.on('mouseenter', 'pois-layer',       () => { mainMap.getCanvas().style.cursor = 'pointer' })
      mainMap.on('mouseenter', 'pois-added-layer', () => { mainMap.getCanvas().style.cursor = 'pointer' })
      mainMap.on('mouseleave', 'pois-layer',       () => { mainMap.getCanvas().style.cursor = '' })
      mainMap.on('mouseleave', 'pois-added-layer', () => { mainMap.getCanvas().style.cursor = '' })
    }
  } catch (err) {
    console.warn('POI fetch failed:', err.message)
  } finally {
    clearTimeout(noticeTimer)
    poisLoading.value = false
    poisLoaded.value = true
  }
}

// ── Ready modal ──
// Two-step flow: openReady() → user picks "Begin" or "Schedule & Invite";
// "Begin" calls openInGoogleMaps() directly; "Schedule & Invite" switches
// to the schedule modal via openSchedule().
const showReady = ref(false)
function openReady()    { showReady.value = true }
function closeReady()   { showReady.value = false }
function beginJourney() { closeReady(); openInGoogleMaps() }
function goReady()      { openReady() }

// ── Schedule & Invite modal ──
// `shareCode` is empty until createEvent() succeeds; the modal template
// switches between the "pick date" step and the "share code" step based
// on whether shareCode is truthy.
const showSchedule     = ref(false)
const scheduleDate     = ref('')
const scheduleCreating = ref(false)
const scheduleError    = ref('')
const shareCode        = ref('')
const shareCodeUrl     = computed(() =>
  shareCode.value && typeof window !== 'undefined'
    ? `${window.location.origin}/planner?code=${shareCode.value}`
    : ''
)
const copiedCode = ref(false)

const scheduleMin = computed(() => new Date().toISOString().split('T')[0])
const scheduleMax = computed(() => {
  const d = new Date(); d.setMonth(d.getMonth() + 3); return d.toISOString().split('T')[0]
})

function openSchedule() {
  showReady.value = false
  showSchedule.value = true
  shareCode.value = ''
  scheduleDate.value = ''
  scheduleError.value = ''
}

function inviteOthers() { openSchedule() }

async function createEvent() {
  if (!scheduleDate.value) { scheduleError.value = 'Please pick a date.'; return }
  scheduleCreating.value = true; scheduleError.value = ''
  try {
    const currentRoute = routes.value[activeRoute.value]
    const res = await fetch(`${API}/api/shared-routes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activity_type:  survey.value?.activity_type,
        distance_label: currentRoute?.distance_label,
        duration_label: currentRoute?.duration_label,
        preferred_pace: survey.value?.preferred_pace,
        start_address:  survey.value?.start_address || '',
        scheduled_date: scheduleDate.value,
        route_geometry: currentRoute?.geometry,   // full GeoJSON geometry
        survey_data:    survey.value,             // full survey for reconstruction
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to create event')
    shareCode.value = data.code
  } catch (e) {
    scheduleError.value = e.message
  } finally {
    scheduleCreating.value = false
  }
}

function copyCodeUrl() {
  navigator.clipboard.writeText(shareCodeUrl.value).then(() => {
    copiedCode.value = true
    setTimeout(() => { copiedCode.value = false }, 2000)
  })
}

// ── PDF download ──
// Opens a new window with hand-crafted HTML (not the Vue template) and
// calls window.print() so the user's browser handles paper/PDF rendering.
// `preserveDrawingBuffer: true` on the Mapbox map (set in initMaps) is
// required for getCanvas().toDataURL() to succeed — without it, WebGL
// clears the buffer after each frame and toDataURL returns a blank image.
async function downloadPDF() {
  // Capture the current map view as a base64 image
  let mapImageData = null
  if (mainMap) {
    mainMap.triggerRepaint()
    await new Promise(r => setTimeout(r, 80))
    try { mapImageData = mainMap.getCanvas().toDataURL('image/jpeg', 0.85) } catch (_) {}
  }

  const act  = activityLabel[survey.value?.activity_type] ?? 'Walking'
  const dist = routes.value[activeRoute.value]?.distance_label ?? '-'
  const dur  = routes.value[activeRoute.value]?.duration_label ?? '-'
  const pace = survey.value?.preferred_pace ?? '-'
  const date = scheduleDate.value
  const code = shareCode.value
  const url  = shareCodeUrl.value

  const mapHtml = mapImageData
    ? `<img src="${mapImageData}" style="width:100%;border-radius:10px;margin-bottom:22px;max-height:280px;object-fit:cover;display:block" />`
    : ''

  const win = window.open('', '_blank', 'width=720,height=960')
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>ActiveAgeing – Route Event</title>
<style>
  body{font-family:Arial,sans-serif;max-width:580px;margin:44px auto;color:#222;line-height:1.5}
  h1{color:#0b5d57;font-size:26px;margin-bottom:4px}
  .sub{color:#888;font-size: 20px;margin-bottom:24px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:24px}
  .cell{background:#f4f1eb;border-radius:10px;padding:14px 16px}
  .lbl{font-size: 20px;font-weight:700;color:#9aafaa;text-transform:uppercase;letter-spacing:.06em}
  .val{font-size: 20px;font-weight:700;color:#0b3d38;margin-top:4px;text-transform:capitalize}
  .code-box{text-align:center;background:#e8f5f3;border-radius:14px;padding:22px;margin:20px 0}
  .code-lbl{font-size: 20px;font-weight:700;color:#0b5d57;text-transform:uppercase;letter-spacing:.08em}
  .code-val{font-size:40px;font-weight:800;color:#0b5d57;letter-spacing:8px;margin-top:8px}
  .url-lbl{font-size: 20px;color:#666;margin-top:10px;word-break:break-all}
  .note{font-size: 20px;color:#aaa;text-align:center;margin-top:16px}
  @media print{body{margin:20px}}
</style></head><body>
<h1>ActiveAgeing Route Event</h1>
<p class="sub">Share the code below so friends can join your route!</p>
${mapHtml}
<div class="grid">
  <div class="cell"><div class="lbl">Activity</div><div class="val">${act}</div></div>
  <div class="cell"><div class="lbl">Distance</div><div class="val">${dist}</div></div>
  <div class="cell"><div class="lbl">Duration</div><div class="val">${dur}</div></div>
  <div class="cell"><div class="lbl">Pace</div><div class="val">${pace}</div></div>
  <div class="cell"><div class="lbl">Scheduled Date</div><div class="val">${date}</div></div>
</div>
<div class="code-box">
  <div class="code-lbl">Event Code</div>
  <div class="code-val">${code}</div>
  <div class="url-lbl">Or visit: ${url}</div>
</div>
<p class="note">This event expires 48 hours after the scheduled date.</p>
</body></html>`)
  win.document.close()
  win.print()
}

// ── Code lookup — loads shared route directly into planner ──
// If route_geometry and survey_data are missing (old-format events that
// only stored metadata), we surface a clear error asking the organiser
// to reshare — partial data would silently break the map draw.
const codeInput   = ref('')
const codeLooking = ref(false)
const codeError   = ref('')

async function lookupEvent() {
  const code = codeInput.value.trim().toUpperCase()
  if (!code) return
  codeLooking.value = true; codeError.value = ''
  try {
    const res  = await fetch(`${API}/api/shared-routes/${code}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Event not found or has expired')

    if (!data.route_geometry || !data.survey_data) {
      throw new Error('This event does not have a saved route. Ask the organiser to reshare.')
    }

    // Populate the planner with the shared route's data
    survey.value = data.survey_data
    routes.value = [{
      index:          0,
      geometry:       data.route_geometry,
      distance_label: data.distance_label,
      duration_label: data.duration_label,
      distance_m:     0,
      duration_s:     0,
    }]
    activeRoute.value       = 0
    currentWaypoints.value  = []
    addedPOIIds.value       = new Set()
    removedPOIIds.value     = new Set()

    sharedEventBanner.value = {
      code:     data.code,
      activity: activityLabel[data.activity_type] ?? data.activity_type ?? 'Route',
      date:     String(data.scheduled_date ?? '').split('T')[0],
      expires:  data.expires_at,
    }

    error.value   = null
    loading.value = false

    if (mainMap) {
      // Map already running — just redraw the route
      drawMainRoute(0)
    } else {
      // First load via URL code — init the map
      await new Promise(r => setTimeout(r, 80))
      initMaps()
    }
  } catch (e) {
    codeError.value = e.message
  } finally {
    codeLooking.value = false
  }
}

// ── Route selection ──
// Switching routes resets all waypoints and added POIs so the new route
// starts clean; dismisses the shared-event banner because the user is now
// browsing their own generated routes rather than a friend's shared one.
function selectRoute(index) {
  activeRoute.value      = index
  currentWaypoints.value = []
  addedPOIIds.value      = new Set()
  sharedEventBanner.value = null   // exiting shared view when user picks their own route
  drawMainRoute(index)
}

function drawMainRoute(index) {
  if (!mainMap) return
  const route = routes.value[index]
  if (!route) return
  const coords = route.geometry.coordinates

  mainMap.getSource('main-route').setData({ type: 'Feature', geometry: route.geometry })

  if (mainStartMarker) mainStartMarker.remove()
  if (mainEndMarker)   mainEndMarker.remove()

  const rt = isRoundTrip(coords)

  // Add F first (lower in DOM stack), then S on top; offset both when round trip
  mainEndMarker = new mapboxgl.Marker({ element: makeMarkerEl('F', '#dc2626'), offset: rt ? [26, 0] : [0, 0] })
    .setLngLat(coords[coords.length - 1])
    .addTo(mainMap)

  mainStartMarker = new mapboxgl.Marker({ element: makeMarkerEl('S', '#16a34a'), offset: rt ? [-26, 0] : [0, 0] })
    .setLngLat(coords[0])
    .addTo(mainMap)

  mainMap.fitBounds(routeBounds(coords), { padding: 50, duration: 600 })
  fetchAndDrawPOIs(coords)
}

function routeDescription(index) {
  const activity = activityLabel[survey.value?.activity_type]?.toLowerCase() ?? 'walking'
  const pace     = survey.value?.preferred_pace ?? 'moderate'
  const r        = routes.value[index]
  return `A ${pace}-pace ${activity} route covering ${r?.distance_label} in approximately ${r?.duration_label}, starting from your chosen location.`
}

onMounted(async () => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
  const urlParams = new URLSearchParams(window.location.search)
  const urlCode   = urlParams.get('code')
  // Pre-fill the code input so it's visible even if lookupEvent() fails
  if (urlCode) codeInput.value = urlCode

  // URL code takes priority: load the shared route and skip the survey
  // fetch entirely. If lookupEvent errors, fall through to the normal
  // sessionStorage survey path so the user sees a useful error state.
  if (urlCode) {
    await lookupEvent()
    // lookupEvent sets loading=false and calls initMaps() on success
    // If it errored, fall through to show the normal error/survey path below
    if (!error.value && routes.value.length) return
  }

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
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(survey.value),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Failed to load routes')
    routes.value = data.routes
  } catch (e) {
    error.value = e.message; loading.value = false; return
  }
  loading.value = false
  await new Promise(r => setTimeout(r, 80))
  initMaps()
})

function initMaps() {
  const mainContainer = document.getElementById('map-main')
  if (mainContainer && routes.value[0]) {
    const firstCoords = routes.value[0].geometry.coordinates
    mainMap = new mapboxgl.Map({
      container:            mainContainer,
      style:                'mapbox://styles/mapbox/streets-v12',
      bounds:               routeBounds(firstCoords),
      fitBoundsOptions:     { padding: 50 },
      attributionControl:   false,
      preserveDrawingBuffer: true,   // needed for map-capture in PDF
    })
    mainMap.addControl(new mapboxgl.NavigationControl(), 'top-right')

    mainMap.on('load', () => {
      // Route source + line layer
      mainMap.addSource('main-route', {
        type: 'geojson',
        data: { type: 'Feature', geometry: routes.value[0].geometry },
      })
      mainMap.addLayer({
        id: 'main-route-line', type: 'line', source: 'main-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint:  { 'line-color': COLOUR, 'line-width': 5 },
      })

      // Direction arrows along the path
      mainMap.addImage('route-arrow', buildArrowImage())
      mainMap.addLayer({
        id: 'route-arrows', type: 'symbol', source: 'main-route',
        layout: {
          'symbol-placement':      'line',
          'symbol-spacing':        ['interpolate', ['linear'], ['zoom'], 10, 350, 14, 150, 17, 60],
          'icon-image':            'route-arrow',
          'icon-size':             ['interpolate', ['linear'], ['zoom'], 10, 0.55, 17, 1.1],
          'icon-allow-overlap':    true,
          'icon-ignore-placement': true,
          'icon-rotation-alignment': 'map',
        },
      })

      // Start / Finish markers (offset when round trip)
      const rt = isRoundTrip(firstCoords)

      mainEndMarker = new mapboxgl.Marker({
        element: makeMarkerEl('F', '#dc2626'), offset: rt ? [26, 0] : [0, 0],
      }).setLngLat(firstCoords[firstCoords.length - 1]).addTo(mainMap)

      mainStartMarker = new mapboxgl.Marker({
        element: makeMarkerEl('S', '#16a34a'), offset: rt ? [-26, 0] : [0, 0],
      }).setLngLat(firstCoords[0]).addTo(mainMap)

      fetchAndDrawPOIs(firstCoords)
    })
  }

  routes.value.forEach((route, i) => {
    const container = document.getElementById(`map-t${i}`)
    if (!container) return
    const coords = route.geometry.coordinates
    const m = new mapboxgl.Map({
      container, style: 'mapbox://styles/mapbox/streets-v12',
      bounds: routeBounds(coords), fitBoundsOptions: { padding: 8 },
      interactive: false, attributionControl: false,
    })
    m.on('load', () => {
      m.addSource(`thumb-route-${i}`, { type: 'geojson', data: { type: 'Feature', geometry: route.geometry } })
      m.addLayer({
        id: `thumb-route-line-${i}`, type: 'line', source: `thumb-route-${i}`,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint:  { 'line-color': COLOUR, 'line-width': 3 },
      })
    })
    thumbMaps.push(m)
  })
}

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  if (mainStartMarker) { mainStartMarker.remove(); mainStartMarker = null }
  if (mainEndMarker)   { mainEndMarker.remove();   mainEndMarker   = null }
  if (mainMap)         { mainMap.remove();          mainMap         = null }
  thumbMaps.forEach(m => m.remove())
  thumbMaps.length = 0
  poisListenersAdded = false
})
</script>

<template>
  <div class="page">

    <AppNavbar active="routeplan" />

    <div class="container">

      <!--
        SHARED EVENT BANNER
        Shown when a user arrives via a shared event code (e.g. from a friend's
        invite link). It displays the event code, activity type, and date at the
        top of the page so the user knows they're viewing a specific planned
        outing rather than just browsing routes.
      -->
      <!-- Shared event banner -->
      <Transition name="fade">
        <div v-if="sharedEventBanner" class="shared-banner">
          <div class="shared-banner-left">
            <span class="shared-banner-icon">📅</span>
            <div>
              <div class="shared-banner-title">Viewing shared event</div>
              <div class="shared-banner-meta">
                <span class="shared-banner-chip">{{ sharedEventBanner.code }}</span>
                <span>{{ sharedEventBanner.activity }}</span>
                <span v-if="sharedEventBanner.date">· {{ sharedEventBanner.date }}</span>
              </div>
            </div>
          </div>
          <button class="shared-banner-close" @click="sharedEventBanner = null">✕ Exit</button>
        </div>
      </Transition>

      <!-- Title -->
      <h1>Route Planner</h1>
      <p class="subtitle">AI-optimized routes designed for accessibility, comfort, and scenic beauty.</p>

      <!--
        EVENT CODE ENTRY BAR
        Lets users enter a short invite code to jump straight into a friend's
        planned route. If no code is entered, this bar also explains how to
        generate one — select a route below and hit "Schedule & Invite".
      -->
      <!-- Code entry bar -->
      <div class="code-entry-bar">
        <div class="code-entry-inner">
          <span class="code-entry-label">Have an event code?</span>
          <input
            v-model="codeInput"
            class="code-entry-input"
            placeholder="Enter code (e.g. AB1C2D)"
            maxlength="8"
            @keyup.enter="lookupEvent"
          />
          <button class="code-entry-btn" :disabled="codeLooking || !codeInput.trim()" @click="lookupEvent">
            {{ codeLooking ? 'Looking…' : 'View Event' }}
          </button>
        </div>
        <p v-if="codeError" class="code-entry-error">{{ codeError }}</p>
        <p class="code-entry-hint">
          Don't have a code yet? Select a route below, then use <strong>Schedule &amp; Invite</strong> to generate a code and share it with your group.
        </p>
      </div>

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

        <!--
          METRICS ROW
          Three at-a-glance cards showing the distance, estimated duration, and
          difficulty of the currently selected route. Updates live whenever the
          user switches to a different route option below.
        -->
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

          <!--
            MAP PANEL (LEFT)
            The interactive Mapbox map that draws the selected route. Below the
            map is a legend explaining the S (start) and F (finish) markers, and
            a row of checkboxes that toggle different categories of nearby stop
            points (cafés, toilets, parks, etc.) on and off.
          -->
          <!-- LEFT MAP -->
          <div class="map-card">
            <div id="map-main" style="position:relative">
              <!-- Rerouting spinner overlay -->
              <Transition name="fade">
                <div v-if="routeLoading" class="reroute-overlay">
                  <div class="reroute-spinner"></div>
                  <span>Updating route…</span>
                </div>
              </Transition>

              <!-- POI loading notice -->
              <Transition name="fade">
                <div v-if="poisLoading" class="poi-loading-notice">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Stop points may take a moment to load. Thanks for your patience!
                </div>
              </Transition>

              <!-- Fullscreen toggle button -->
              <button class="map-fullscreen-btn" @click="toggleFullscreen" :title="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'">
                <svg v-if="!isFullscreen" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M1 6V1h5M12 1h5v5M17 12v5h-5M6 17H1v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M6 1v5H1M17 6h-5V1M12 17v-5h5M1 12h5v5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <!-- S / F marker note -->
            <div class="map-marker-note">
              <span class="marker-chip marker-s">S</span> Starting point &nbsp;·&nbsp;
              <span class="marker-chip marker-f">F</span> Finishing point
            </div>

            <!-- Stop-point legend with checkboxes -->
            <div class="stop-legend">
              <div
                v-for="s in STOP_POINTS"
                :key="s.cat"
                class="stop-item"
                :class="{ 'stop-item-off': !activeCategories.has(s.cat) }"
                @click="toggleCategory(s.cat)"
              >
                <input
                  type="checkbox"
                  class="stop-checkbox"
                  :checked="activeCategories.has(s.cat)"
                  @click.stop="toggleCategory(s.cat)"
                />
                <span class="stop-dot" :style="{ background: s.color, opacity: activeCategories.has(s.cat) ? 1 : 0.3 }"></span>
                <span class="stop-label">{{ s.label }}</span>
              </div>
            </div>
          </div>

          <!--
            ROUTE DETAIL PANEL (RIGHT)
            Shows the name, distance, duration, activity type, pace, and a
            short description for the currently active route. "Select This Route"
            opens the Ready to Go modal, and "Open in Google Maps" hands the
            route off to Google Maps for turn-by-turn navigation.
          -->
          <!-- RIGHT PANEL -->
          <div class="side-card">
            <div class="tag">{{ ORDINAL_TAGS[activeRoute] ?? (activeRoute + 1 + 'th Recommendation') }}</div>

            <h2>{{ ROUTE_NAMES[activeRoute] ?? 'Route ' + (activeRoute + 1) }}</h2>
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
            <button class="btn-gmaps" @click="openInGoogleMaps">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="flex-shrink:0">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#4285F4"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
              Open in Google Maps
            </button>
          </div>

        </div>

        <!-- Highlight -->
        <div class="highlight">
          Your personalized {{ activityLabel[survey?.activity_type]?.toLowerCase() }} route — {{ routes[activeRoute]?.distance_label }} at a {{ survey?.preferred_pace }} pace, designed for your comfort.
        </div>

        <!--
          ALL ROUTES THUMBNAILS
          A horizontal strip of small map thumbnails — one per suggested route.
          Clicking any thumbnail switches the main map and detail panel to that
          route. The currently active one is highlighted with a border.
        -->
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
                <h4>{{ ROUTE_NAMES[i] ?? 'Route ' + (i + 1) }}</h4>
                <p>{{ route.duration_label }}</p>
              </div>
              <div class="suggest-actions">
                <span class="distance">{{ route.distance_label }}</span>
              </div>
            </div>
          </div>
        </div>

      </template>
    </div>

    <AppFooter />

    <!--
      READY TO GO MODAL
      Pops up when the user clicks "Select This Route". It gives them two
      paths: start the walk right now (Begin My Journey), or pick a date and
      generate a share code so they can invite friends first (Schedule & Invite).
    -->
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
                  <div class="rdy-label rdy-label-dark">Schedule and Invite</div>
                  <div class="rdy-desc rdy-desc-dark">Pick a date and share with friends</div>
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

    <!--
      SCHEDULE & INVITE MODAL
      Opens after the user picks "Schedule and Invite" in the Ready to Go
      modal. Step one is picking a date and hitting "Create Event", which
      generates a short code. Step two shows that code alongside a shareable
      URL that friends can use to load the same route directly in the planner.
      A PDF download option is also available for users who prefer a printed copy.
    -->
    <!-- Schedule & Invite modal -->
    <Transition name="fade">
      <div v-if="showSchedule" class="share-overlay" @click.self="showSchedule = false">
        <div class="share-modal">
          <div class="share-modal-header">
            <h3>Schedule &amp; Invite</h3>
            <button class="share-close-x" @click="showSchedule = false">✕</button>
          </div>

          <template v-if="!shareCode">
            <p class="share-sub">Pick a date for this route — a share code will be generated for your friends.</p>

            <div class="share-route-info">
              <div class="share-detail">
                <span class="share-detail-label">Activity</span>
                <span class="share-detail-val">{{ activityLabel[survey?.activity_type] ?? 'Walking' }}</span>
              </div>
              <div class="share-detail">
                <span class="share-detail-label">Distance</span>
                <span class="share-detail-val">{{ routes[activeRoute]?.distance_label }}</span>
              </div>
              <div class="share-detail">
                <span class="share-detail-label">Duration</span>
                <span class="share-detail-val">{{ routes[activeRoute]?.duration_label }}</span>
              </div>
            </div>

            <label class="sched-label">Scheduled date</label>
            <input
              v-model="scheduleDate"
              type="date"
              class="sched-date-input"
              :min="scheduleMin"
              :max="scheduleMax"
            />
            <p v-if="scheduleError" class="sched-error">{{ scheduleError }}</p>

            <button class="share-done-btn sched-create-btn" :disabled="scheduleCreating" @click="createEvent">
              {{ scheduleCreating ? 'Creating…' : 'Create Event →' }}
            </button>
          </template>

          <template v-else>
            <p class="share-sub">Your event is ready! Share the code below so friends can join your route. It expires 48 hours after the scheduled date.</p>

            <div class="share-route-info">
              <div class="share-detail">
                <span class="share-detail-label">Activity</span>
                <span class="share-detail-val">{{ activityLabel[survey?.activity_type] ?? 'Walking' }}</span>
              </div>
              <div class="share-detail">
                <span class="share-detail-label">Date</span>
                <span class="share-detail-val">{{ scheduleDate }}</span>
              </div>
            </div>

            <div class="code-display-box">
              <div class="code-display-label">Event Code</div>
              <div class="code-display-val">{{ shareCode }}</div>
            </div>

            <div class="share-url-row">
              <input class="share-url-input" :value="shareCodeUrl" readonly />
              <button class="share-copy-btn" @click="copyCodeUrl">{{ copiedCode ? '✓ Copied!' : 'Copy' }}</button>
            </div>

            <div class="sched-action-row">
              <button class="sched-pdf-btn" @click="downloadPDF">⬇ Download PDF</button>
              <button class="share-done-btn sched-done-btn" @click="showSchedule = false">Done</button>
            </div>
          </template>
        </div>
      </div>
    </Transition>

    <!-- POI action modal -->
    <Transition name="fade">
      <div v-if="showPOIModal && selectedPOI" class="poi-overlay" @click.self="showPOIModal = false">
        <div class="poi-modal">
          <button class="share-close-x poi-close" @click="showPOIModal = false">✕</button>

          <div class="poi-cat-badge" :style="{ background: STOP_POINTS.find(s => s.cat === selectedPOI.cat)?.color ?? '#888' }">
            {{ catLabel[selectedPOI.cat] ?? selectedPOI.cat }}
          </div>

          <div class="poi-name">{{ selectedPOI.name }}</div>

          <p class="poi-hint">Add this stop to your planned route, or remove it from the map.</p>

          <div class="poi-actions">
            <button class="poi-btn-add" @click="addPOI">
              ✓ Add to Route
            </button>
            <button class="poi-btn-remove" @click="removePOI">
              ✕ Remove
            </button>
          </div>
        </div>
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
  padding: calc(var(--navbar-h, 70px) + 20px) 20px 20px;
}

h1 { font-size: 42px; color: #0b5d57; }
.subtitle { color: #666; margin-bottom: 20px; }

/* ── Code entry bar ──────── inline flex row so the label, input, and
   button sit side-by-side on desktop; wraps to column on mobile. */
.code-entry-bar {
  background: white; border-radius: 14px;
  padding: 16px 20px; margin-bottom: 24px;
  border: 1.5px solid #e8f0ee;
}
.code-entry-inner {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
}
.code-entry-label {
  font-size: 20px; font-weight: 600; color: #0b5d57; white-space: nowrap;
}
.code-entry-input {
  flex: 1; min-width: 160px; padding: 10px 14px;
  border: 1.5px solid #d0d9d6; border-radius: 10px;
  font-family: 'Poppins', sans-serif; font-size: 20px; color: #333;
  outline: none; background: #f9f9f7; letter-spacing: 0.08em;
  text-transform: uppercase;
}
.code-entry-input:focus { border-color: #0b5d57; }
.code-entry-btn {
  padding: 10px 20px; background: #0b5d57; color: white;
  border: none; border-radius: 10px; font-family: 'Poppins', sans-serif;
  font-size: 20px; font-weight: 600; cursor: pointer;
  transition: background 0.2s; white-space: nowrap;
}
.code-entry-btn:hover:not(:disabled) { background: #084a45; }
.code-entry-btn:disabled { opacity: 0.55; cursor: default; }
.code-entry-error { margin: 8px 0 0; font-size: 20px; color: #c0392b; }
.code-entry-hint { margin: 10px 0 0; font-size: 20px; color: #666; line-height: 1.6; }

/* ── Loading / error states ──────── centred column with a CSS spinner;
   error-box uses red text to distinguish it from the normal loading copy. */
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

/* ── Metrics row ──────── three equal-flex cards showing distance, duration,
   difficulty; updates reactively when the user switches routes below. */
.metrics-row { display: flex; gap: 16px; margin-bottom: 20px; }

.metric-card {
  flex: 1; background: white; border-radius: 14px;
  padding: 18px 20px; display: flex; align-items: center; gap: 14px;
}

.metric-icon  { font-size: 20px; color: #0b5d57; flex-shrink: 0; }
.metric-value { font-size: 20px; font-weight: 700; color: #0b5d57; line-height: 1.2; }
.metric-label { font-size: 20px; color: #888; margin-top: 2px; }

/* ── Main layout ──────── map card (flex: 2) + side card (flex: 1); the
   map gets more horizontal space since it's the primary interaction area. */
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
  display: inline-block; padding: 5px 10px; border-radius: 10px; font-size: 20px;
}

.meta { color: #0b5d57; margin-bottom: 20px; font-size: 20px;}
.info p { font-size: 20px; color: #555; }

.btn {
  margin-top: 20px; width: 100%; padding: 14px;
  background: linear-gradient(135deg, #0f7a72, #0b5d57);
  color: white; border-radius: 10px; border: none; cursor: pointer;
  font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600;
  box-shadow: 0 4px 14px rgba(11,93,87,0.28);
  transition: opacity 0.2s, transform 0.15s;
}
.btn:hover { opacity: 0.92; transform: translateY(-1px); }

/* ── S/F marker note ──────── small legend below the map explaining the
   green S (start) and red F (finish) markers; helps first-time users. */
.map-marker-note {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  padding: 8px 16px; border-top: 1px solid #f0f0f0;
  font-size: 20px; color: #555; background: white;
}
.marker-chip {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%;
  font-size: 11px; font-weight: 800; color: white; flex-shrink: 0;
}
.marker-s { background: #16a34a; }
.marker-f { background: #dc2626; }

/* ── Stop-point legend ──────── wrapping flex row of category checkboxes;
   .stop-item-off strikes through the label and dims the dot to signal
   that category is hidden without removing the checkbox from the layout. */
.stop-legend {
  display: flex; flex-wrap: wrap; gap: 6px 16px;
  padding: 12px 16px; border-top: 1px solid #f0f0f0; background: white;
}
.stop-item {
  display: flex; align-items: center; gap: 7px;
  cursor: pointer; user-select: none;
  padding: 4px 6px; border-radius: 8px;
  transition: background 0.15s;
}
.stop-item:hover { background: #f4f1eb; }
.stop-item-off .stop-label { color: #bbb; text-decoration: line-through; }

.stop-checkbox {
  width: 15px; height: 15px; cursor: pointer;
  accent-color: #0b5d57; flex-shrink: 0;
}
.stop-dot   { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; transition: opacity 0.2s; }
.stop-label { font-size: 20px; color: #555; }

/* ── Highlight bar ──────── full-width teal banner summarising the active
   route's key stats; gives a single sentence of context between the main
   map and the route thumbnail strip. */
.highlight {
  margin-top: 25px; background: #0b5d57;
  color: white; padding: 16px; border-radius: 12px;
}

/* ── All Routes thumbnails ──────── horizontal strip of small non-interactive
   Mapbox maps (interactive: false) so users can preview each route before
   switching; .card-active pink border matches the route line colour. */
.suggestions { margin-top: 30px; }
.header { display: flex; justify-content: space-between; }
.cards  { display: flex; gap: 20px; margin-top: 15px; }

.suggest-card {
  background: white; padding: 20px; border-radius: 15px;
  display: flex; gap: 18px; flex: 1; align-items: center;
  min-height: 130px; cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
  border: 2px solid transparent;
}
.suggest-card:hover  { box-shadow: 0 4px 16px rgba(0,0,0,0.10); }
.card-active         { border-color: #c2185b; box-shadow: 0 4px 20px rgba(194,24,91,0.15); }

.suggest-map { width: 110px; height: 110px; border-radius: 12px; overflow: hidden; flex-shrink: 0; }

.suggest-info       { flex: 1; }
.suggest-info h4    { margin: 0 0 6px; font-size: 20px; }
.suggest-info p     { margin: 0; font-size: 20px; color: #888; }

.suggest-actions    { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; font-size: 20px;  }
.distance           { color: #0b5d57; font-weight: 700; }


/* ── Ready modal ──────── teal-tinted frosted backdrop; slide-up spring
   animation (cubic-bezier 0.34,1.56,0.64,1) gives it a bouncy feel that
   signals a positive action rather than a neutral dialog. */
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
.ready-sub   { font-size: 20px; color: #6a7a76; text-align: center; margin: -4px 0 6px; }

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
.rdy-label       { font-size: 20px; font-weight: 700; color: white; line-height: 1.3; }
.rdy-label-dark  { color: #0b3d38; }
.rdy-desc        { font-size: 20px; font-weight: 400; color: rgba(255,255,255,0.85); margin-top: 3px; }
.rdy-desc-dark   { color: #6a7a76; }
.rdy-arrow       { font-size: 22px; color: white; font-weight: 600; flex-shrink: 0; }

.rdy-cancel {
  background: none; border: none; font-family: 'Poppins', sans-serif;
  font-size: 20px; font-weight: 500; color: #6a7a76;
  cursor: pointer; padding: 4px 16px; margin-top: 2px; transition: color 0.2s;
}
.rdy-cancel:hover { color: #0b5d57; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
.slide-up-enter-active { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease; }
.slide-up-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.slide-up-enter-from   { transform: translateY(32px); opacity: 0; }
.slide-up-leave-to     { transform: translateY(16px); opacity: 0; }

/* ── Share / Schedule modal ──────── darker semi-opaque backdrop than the
   ready modal to signal this is a data-entry step rather than a choice. */
.share-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 3000; padding: 24px;
}
.share-modal {
  background: white; border-radius: 20px; padding: 32px 28px;
  width: 100%; max-width: 460px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.2);
}
.share-modal-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 10px;
}
.share-modal-header h3 { margin: 0; font-size: 20px; color: #0b3d38; }
.share-close-x {
  background: none; border: none; font-size: 20px;
  cursor: pointer; color: #888; padding: 4px 8px;
  border-radius: 6px; transition: background 0.15s;
}
.share-close-x:hover { background: #f0f0f0; color: #333; }
.share-sub { font-size: 20px; color: #6a7a76; margin-bottom: 20px; line-height: 1.5; }

.share-route-info {
  display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;
}
.share-detail {
  flex: 1; min-width: 90px; background: #f4f1eb; border-radius: 12px;
  padding: 12px 14px; display: flex; flex-direction: column; gap: 4px;
}
.share-detail-label { font-size: 20px; font-weight: 600; color: #9aafaa; text-transform: uppercase; letter-spacing: 0.06em; }
.share-detail-val   { font-size: 20px; font-weight: 700; color: #0b3d38; }

.sched-label {
  display: block; font-size: 20px; font-weight: 600;
  color: #0b3d38; margin-bottom: 8px;
}
.sched-date-input {
  width: 100%; padding: 11px 14px; border: 1.5px solid #d0d9d6;
  border-radius: 10px; font-family: 'Poppins', sans-serif; font-size: 20px;
  color: #333; background: #f9f9f7; outline: none; margin-bottom: 12px;
  box-sizing: border-box;
}
.sched-date-input:focus { border-color: #0b5d57; }
.sched-date-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.7;
  font-size: 20px;
}
.sched-error { font-size: 20px; color: #c0392b; margin: -8px 0 10px; }
.sched-create-btn { margin-top: 4px; }

.code-display-box {
  text-align: center; background: #e8f5f3; border-radius: 14px;
  padding: 20px; margin-bottom: 16px;
}
.code-display-label {
  font-size: 20px; font-weight: 700; color: #0b5d57;
  text-transform: uppercase; letter-spacing: 0.08em;
}
.code-display-val {
  font-size: 36px; font-weight: 800; color: #0b5d57;
  letter-spacing: 8px; margin-top: 6px;
}

.share-url-row { display: flex; gap: 8px; margin-bottom: 16px; }
.share-url-input {
  flex: 1; padding: 11px 14px; border: 1.5px solid #d0d9d6;
  border-radius: 10px; font-size: 20px; color: #444;
  font-family: 'Poppins', sans-serif; background: #f9f9f7; outline: none; max-width: 325px;
}
.share-copy-btn {
  padding: 11px 18px; background: #0b5d57; color: white;
  border: none; border-radius: 10px; font-family: 'Poppins', sans-serif;
  font-size: 20px; font-weight: 600; cursor: pointer;
  transition: background 0.2s; white-space: nowrap; min-width: 80px;
}
.share-copy-btn:hover { background: #084a45; }

.sched-action-row { display: flex; gap: 10px; }
.sched-pdf-btn {
  flex: 1; padding: 13px; background: #f4f1eb;
  color: #0b3d38; border: none; border-radius: 12px;
  font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.sched-pdf-btn:hover { background: #e8e4da; }
.sched-done-btn { flex: 1; }

.share-done-btn {
  width: 100%; padding: 13px; background: #0b5d57;
  color: white; border: none; border-radius: 12px;
  font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.share-done-btn:hover:not(:disabled) { background: #084a45; }
.share-done-btn:disabled { opacity: 0.55; cursor: default; }

/* ── Shared event banner ──────── teal gradient bar shown when the page is
   loaded via a friend's invite code; dismissed when the user selects their
   own route, reverting to the normal planning flow. */
.shared-banner {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  background: linear-gradient(135deg, #0b5d57, #0f7a72);
  color: white; border-radius: 14px; padding: 14px 18px;
  margin-bottom: 20px; flex-wrap: wrap;
}
.shared-banner-left {
  display: flex; align-items: center; gap: 12px;
}
.shared-banner-icon { font-size: 24px; flex-shrink: 0; }
.shared-banner-title {
  font-size: 20px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: rgba(255,255,255,0.75); margin-bottom: 4px;
}
.shared-banner-meta {
  display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 600; flex-wrap: wrap;
}
.shared-banner-chip {
  background: rgba(255,255,255,0.2); padding: 2px 10px;
  border-radius: 20px; font-size: 20px; font-weight: 800; letter-spacing: 2px;
}
.shared-banner-close {
  background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.3);
  color: white; padding: 7px 14px; border-radius: 8px;
  font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600;
  cursor: pointer; transition: background 0.2s; white-space: nowrap;
}
.shared-banner-close:hover { background: rgba(255,255,255,0.25); }

/* ── POI action modal ──────── z-index: 4000 so it sits above the ready
   and schedule modals (3000) if any are somehow open simultaneously. */
.poi-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.38);
  backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center;
  z-index: 4000; padding: 24px;
}
.poi-modal {
  background: white; border-radius: 18px; padding: 28px 26px 24px;
  width: 100%; max-width: 340px; position: relative;
  box-shadow: 0 20px 56px rgba(0,0,0,0.22);
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.poi-close {
  position: absolute; top: 12px; right: 12px;
}
.poi-cat-badge {
  color: white; font-size: 20px; font-weight: 700;
  padding: 5px 14px; border-radius: 20px; text-transform: uppercase;
  letter-spacing: 0.06em; margin-top: 4px;
}
.poi-name {
  font-size: 20px; font-weight: 700; color: #0b3d38;
  text-align: center; line-height: 1.35; margin-top: 2px;
}
.poi-hint {
  font-size: 20px; color: #6a7a76; text-align: center;
  margin: 0 0 6px; line-height: 1.5;
}
.poi-actions {
  display: flex; gap: 10px; width: 100%;
}
.poi-btn-add {
  flex: 1; padding: 12px; background: #0b5d57; color: white;
  border: none; border-radius: 12px; font-family: 'Poppins', sans-serif;
  font-size: 20px; font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.poi-btn-add:hover { background: #084a45; }
.poi-btn-remove {
  flex: 1; padding: 12px; background: #fee2e2; color: #b91c1c;
  border: none; border-radius: 12px; font-family: 'Poppins', sans-serif;
  font-size: 20px; font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.poi-btn-remove:hover { background: #fecaca; }

/* ── Fullscreen button ──────── absolute-positioned top-left inside #map-main
   so it's always visible regardless of the map's rendered height; stays
   visible in fullscreen mode via the :fullscreen pseudo-class rules below. */
.map-fullscreen-btn {
  position: absolute;
  top: 10px; left: 10px;
  z-index: 10;
  width: 36px; height: 36px;
  background: white;
  border: none; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #333;
  box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  transition: background 0.15s, color 0.15s;
}
.map-fullscreen-btn:hover { background: #f0f0f0; color: #0b5d57; }

/* Keep the fullscreen button visible when map is fullscreen */
#map-main:fullscreen .map-fullscreen-btn {
  top: 10px; left: 10px;
}
#map-main:fullscreen {
  width: 100vw; height: 100vh;
}

/* ── Google Maps button ──────── white background with Google Blue border
   on hover so it reads as a branded external-link action, distinct from
   the primary teal "Select This Route" button above it. */
.btn-gmaps {
  margin-top: 10px; width: 100%; padding: 13px 16px;
  background: white; color: #333;
  border: 1.5px solid #d8dbd9; border-radius: 10px;
  font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}
.btn-gmaps:hover { background: #90b3ee; border-color: #4285F4; transform: translateY(-1px); }

/* ── Rerouting overlay ──────── semi-transparent overlay with a spinner
   that blocks map interaction while a waypoint reroute is in-flight;
   pointer-events: none so the map pan/zoom still works underneath. */
.reroute-overlay {
  position: absolute; inset: 0; z-index: 10;
  background: rgba(255,255,255,0.62);
  backdrop-filter: blur(2px);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 10px; font-size: 20px; font-weight: 600; color: #0b5d57;
  border-radius: 20px 20px 0 0;
  pointer-events: none;
}
.poi-loading-notice {
  position: absolute; inset: 0; z-index: 10;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(3px);
  border-radius: 20px 20px 0 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 10px;
  color: #fff; font-size: 20px; font-weight: 500; text-align: center;
  padding: 24px;
  pointer-events: none;
}
.reroute-spinner {
  width: 32px; height: 32px;
  border: 3px solid #d0ede9; border-top-color: #0b5d57;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}

@media (max-width: 768px) {
  h1 { font-size: 28px; }
  .subtitle { font-size: 20px; }
  .container { padding: calc(var(--navbar-h, 70px) + 16px) 16px 20px; }

  .code-entry-bar { padding: 14px 16px; }
  .code-entry-inner { flex-direction: column; align-items: stretch; }
  .code-entry-label { white-space: normal; }
  .code-entry-input { min-width: 0; width: 100%; box-sizing: border-box; }
  .code-entry-btn { width: 100%; box-sizing: border-box; white-space: normal; }

  .metrics-row { flex-wrap: wrap; }
  .metric-card { flex: 1 1 calc(50% - 8px); min-width: 0; }

  .main { flex-direction: column; }
  #map-main { min-height: 300px; }
  .side-card { padding: 16px; }

  .stop-legend { gap: 4px 12px; padding: 10px 12px; }

  .highlight { font-size: 20px; padding: 14px; }

  .cards { flex-direction: column; }
  .suggest-card { min-height: unset; }
  .suggest-map { width: 80px; height: 80px; flex-shrink: 0; }

  .shared-banner { flex-direction: column; gap: 10px; }
  .shared-banner-close { align-self: flex-start; }

  .ready-modal { padding: 28px 20px 24px; max-width: 94vw; }
  .share-modal { padding: 24px 18px; max-width: 94vw; }
  .poi-modal { max-width: 94vw; padding: 22px 18px 20px; }

  .sched-action-row { flex-direction: column; }
  .sched-pdf-btn, .sched-done-btn { flex: unset; }
}

@media (max-width: 480px) {
  .metrics-row { flex-direction: column; }
  .metric-card { flex: 1 1 100%; }
  .suggest-info h4 { font-size: 20px; }
}
</style>
