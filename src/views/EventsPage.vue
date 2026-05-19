<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import fallbackImg from '../assets/myphoto.png'
import AppNavbar from '../components/AppNavbar.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const route  = useRoute()
const imgFallback = fallbackImg

const events   = ref([])
const loading  = ref(true)
const apiError = ref(false)

// Initial tab is driven by the URL query so that other pages can deep-link
// directly to the personalised tab — e.g. router.push('/events?tab=personalized').
const activeTab = ref(route.query.tab === 'personalized' ? 'personalized' : 'browse')

// External links open in a new tab via window.open after the user confirms
// the disclaimer. We never navigate away directly so the user stays in-app.
const disclaimerUrl  = ref('')
const showDisclaimer = ref(false)
function openExternal(url) {
  disclaimerUrl.value = url
  showDisclaimer.value = true
}
function confirmExternal() {
  window.open(disclaimerUrl.value, '_blank', 'noopener,noreferrer')
  showDisclaimer.value = false
}

// True when the user has completed the wellness check-in and has saved results
// we can match against. Controls which state the personalised tab renders.
const hasSnapshot = computed(() => !!localStorage.getItem('surveyResult'))

const searchKeyword    = ref('')
const filterDifficulty = ref('')
const sortOption       = ref('date-asc')

const PAGE_SIZE   = 9
const currentPage = ref(1)

// Maps the survey category name (used in Results.vue) to the difficulty
// label used on event cards so personalisation can filter by difficulty.
const CATEGORY_TO_DIFFICULTY = {
  'Just Getting Started': 'Easy',
  'Building Momentum':    'Medium',
  'Thriving':             'Hard',
}

const userDifficulty = computed(() => {
  try {
    const result = JSON.parse(localStorage.getItem('surveyResult') ?? 'null')
    return CATEGORY_TO_DIFFICULTY[result?.categoryName] ?? null
  } catch {
    return null
  }
})

// Shows up to 3 events that match the user's difficulty level, sorted by the
// current sortOption. Returns empty when the user hasn't done the check-in.
const personalizedEvents = computed(() => {
  if (!userDifficulty.value) return []
  return events.value
    .filter(e => e.difficulty === userDifficulty.value)
    .slice(0, 3)
})

// Fallback: shown below the "no matches" message when the check-in is done
// but no events match the user's level right now.
const similarEvents = computed(() => {
  if (personalizedEvents.value.length > 0) return []
  return events.value.slice(0, 3)
})

// Full filtered + sorted list for the Browse tab. Invalid dates are pushed
// to the end rather than causing a crash — fallback events have string times
// like "Mon, 10:00 AM" which don't parse as valid Date objects.
const filteredEvents = computed(() => {
  let list = [...events.value]
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(e =>
      e.title?.toLowerCase().includes(kw) ||
      e.desc?.toLowerCase().includes(kw) ||
      e.location?.toLowerCase().includes(kw)
    )
  }
  if (filterDifficulty.value) {
    list = list.filter(e => e.difficulty === filterDifficulty.value)
  }
  list.sort((a, b) => {
    const da = new Date(a.time), db = new Date(b.time)
    const validA = !isNaN(da), validB = !isNaN(db)
    if (!validA && !validB) return 0
    if (!validA) return 1
    if (!validB) return -1
    return sortOption.value === 'date-desc' ? db - da : da - db
  })
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEvents.value.length / PAGE_SIZE)))

const pagedEvents = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredEvents.value.slice(start, start + PAGE_SIZE)
})

watch([searchKeyword, filterDifficulty, sortOption], () => { currentPage.value = 1 })

// Static fallback data shown when the API fetch fails (network error or empty
// response). Keeps the page usable offline or during a backend outage.
const fallbackEvents = [
  {
    title: 'Gentle Park Walk',
    desc: 'A relaxed stroll through scenic parks and gardens',
    time: 'Mon, 10:00 AM',
    location: 'Green Park',
    difficulty: 'Medium',
    interested: 12,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Morning Yoga Flow',
    desc: 'Start your day with gentle stretches',
    time: 'Tue, 8:00 AM',
    location: 'Wellness Studio',
    difficulty: 'Medium',
    interested: 10,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Brisk Morning Walk',
    desc: 'Energizing walk to start the day',
    time: 'Wed, 7:00 AM',
    location: 'Central Park',
    difficulty: 'Medium',
    interested: 11,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: false,
  },
  {
    title: 'Mindful Tai Chi',
    desc: 'Gentle movements for balance and calm',
    time: 'Wed, 9:00 AM',
    location: 'Community Center',
    difficulty: null,
    interested: 8,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Community Crocheting',
    desc: 'A friendly circle to share patterns and stories',
    time: 'Fri, 2:00 PM',
    location: 'City Library',
    difficulty: null,
    interested: 15,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Scenic Nature Walk',
    desc: 'Explore beautiful trails with a group',
    time: 'Thu, 10:30 AM',
    location: 'Riverside Trail',
    difficulty: 'Medium',
    interested: 14,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: false,
  },
  {
    title: 'Coffee & Conversation',
    desc: 'Meet new friends over morning coffee',
    time: 'Sat, 10:00 AM',
    location: 'Brook Cafe',
    difficulty: null,
    interested: 20,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: false,
  },
  {
    title: 'Chair Yoga Session',
    desc: 'Gentle yoga exercises done from a chair',
    time: 'Mon, 2:00 PM',
    location: 'Senior Center',
    difficulty: 'Medium',
    interested: 9,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Book Club Meetup',
    desc: "Discuss this month's selected book",
    time: 'Fri, 3:00 PM',
    location: 'Public Library',
    difficulty: null,
    interested: 16,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
]

const difficultyBadgeClass = (difficulty) => {
  const d = (difficulty ?? '').toLowerCase()
  if (d === 'easy') return 'badge-easy'
  if (d === 'medium') return 'badge-medium'
  if (d === 'hard') return 'badge-hard'
  return ''
}

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`)
    const data = await res.json()
    if (data.events && data.events.length > 0) {
      events.value = data.events
    } else {
      // API returned successfully but with no events — use fallback to avoid
      // showing an empty page.
      events.value = fallbackEvents
      apiError.value = true
    }
  } catch {
    events.value = fallbackEvents
    apiError.value = true
  } finally {
    loading.value = false
    // Tour fires 600ms after load so the page has time to paint before the
    // first spotlight highlight is measured.
    if (!localStorage.getItem('eventsTourSeen')) {
      setTimeout(startTour, 600)
    }
  }

  // Resize and scroll listeners keep the tour spotlight in the right position
  // while the user's viewport changes mid-tour.
  window.addEventListener('resize', measureTourRect)
  window.addEventListener('scroll', measureTourRect, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureTourRect)
  window.removeEventListener('scroll', measureTourRect)
})

// ── Page Tour ─────────────────────────────────────────────────────────────
// Tour auto-starts on first visit (checked via localStorage 'eventsTourSeen').
// It switches the tab to 'browse' before starting so filters-bar and cards
// are visible when the spotlight highlights them — they don't exist on the
// personalised tab.
const TOUR_STEPS = [
  { selector: '.tab-group',   position: 'bottom', title: 'Switch Views',      desc: 'Toggle between personalised recommendations (matched to your wellness level) and browsing all available events.' },
  { selector: '.sort-group',  position: 'bottom', title: 'Sort Events',       desc: 'Choose whether to see the earliest upcoming events first, or the latest ones at the top.' },
  { selector: '.filters-bar', position: 'bottom', title: 'Filter & Search',   desc: 'Search by keyword or filter by activity category to find events that suit you. Hit Clear to reset.' },
  { selector: '.cards',       position: 'top',    title: 'Event Cards',       desc: 'Each card shows the event name, location, time, and a link to register. Tap View to learn more.' },
]

const tourActive = ref(false)
const tourStep   = ref(0)
const tourRect   = ref(null)

const TOOLTIP_H = 210  // estimated tooltip height used for above/below placement logic

const spotlightStyle = computed(() => {
  if (!tourRect.value) return {}
  const pad = 10
  return {
    left:   `${tourRect.value.left   - pad}px`,
    top:    `${tourRect.value.top    - pad}px`,
    width:  `${tourRect.value.width  + pad * 2}px`,
    height: `${tourRect.value.height + pad * 2}px`,
  }
})

const tooltipStyle = computed(() => {
  if (!tourRect.value) return {}
  const step = TOUR_STEPS[tourStep.value]
  const pad  = 10
  const gap  = 14
  const vw   = window.innerWidth
  const vh   = window.innerHeight
  const w    = Math.min(320, vw - 32)

  let left = tourRect.value.left + tourRect.value.width / 2 - w / 2
  left = Math.max(16, Math.min(left, vw - w - 16))

  const spaceBelow = vh - tourRect.value.bottom - pad - gap
  const spaceAbove = tourRect.value.top - pad - gap

  let top
  if (step.position === 'bottom' && spaceBelow >= TOOLTIP_H) {
    top = tourRect.value.bottom + pad + gap
  } else if (spaceAbove >= TOOLTIP_H) {
    top = tourRect.value.top - pad - gap - TOOLTIP_H
  } else {
    top = spaceBelow >= spaceAbove
      ? tourRect.value.bottom + pad + gap
      : tourRect.value.top - pad - gap - TOOLTIP_H
  }

  top = Math.max(8, Math.min(top, vh - TOOLTIP_H - 8))
  return { top: `${top}px`, left: `${left}px`, width: `${w}px` }
})

function measureTourRect() {
  const step = TOUR_STEPS[tourStep.value]
  if (!step) return
  const el = document.querySelector(step.selector)
  if (el) tourRect.value = el.getBoundingClientRect()
}

function updateTourRect() {
  const step = TOUR_STEPS[tourStep.value]
  if (!step) return
  const el = document.querySelector(step.selector)
  if (!el) return
  el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  setTimeout(measureTourRect, 320)
}

function startTour() {
  // Make sure we're on browse tab so filters-bar and cards are visible
  activeTab.value = 'browse'
  tourStep.value   = 0
  tourActive.value = true
  nextTick(updateTourRect)
}

function nextTourStep() {
  if (tourStep.value < TOUR_STEPS.length - 1) {
    tourStep.value++
    nextTick(updateTourRect)
  } else {
    endTour()
  }
}

function endTour() {
  tourActive.value = false
  localStorage.setItem('eventsTourSeen', '1')
}
</script>

<template>
  <div class="page-wrapper">
    <AppNavbar active="events" />
    <div class="container">



      <!--
        PAGE HEADER
        A short headline and one-line description that sets the tone for the
        whole events page — curated, accessible, and matched to the user's pace.
      -->
      <section class="hero">
        <h1>Curated Events for <span>Active Connections</span></h1>
        <p class="desc">
          Discover a selection of activities specifically matched to your current pace. No pressure, just progress.
        </p>
      </section>

      <!--
        TAB TOGGLE + SORT
        Two tabs let users switch between their personalised recommendations
        and the full event catalogue. The sort dropdown sits on the same row
        and controls the order of whichever tab is currently active.
      -->
      <div class="show-me-row">
        <span class="show-me-label">Show me:</span>
        <div class="tab-group">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'personalized' }"
            @click="activeTab = 'personalized'"
          >
            Personalized Recommendations
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'browse' }"
            @click="activeTab = 'browse'"
          >
            Browse All Events
          </button>
        </div>
        <div class="sort-group">
          <label class="sort-label">Sort by:</label>
          <select v-model="sortOption" class="sort-select">
            <option value="date-asc">Date (earliest first)</option>
            <option value="date-desc">Date (latest first)</option>
          </select>
        </div>
      </div>

      <!--
        BROWSE FILTERS
        Only visible when the "Browse All Events" tab is active. A keyword
        search and a category dropdown let users narrow down a large list to
        only the events they care about. The "Clear" button resets both filters
        in one click.
      -->
      <div v-if="activeTab === 'browse'" class="filters-bar">
        <div class="filter-group">
          <label>Search by keyword</label>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="Search events..."
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label>Category</label>
          <select v-model="filterDifficulty" class="filter-select">
            <option value="">All</option>
            <option value="Easy">Just Getting Started</option>
            <option value="Medium">Building Momentum</option>
            <option value="Hard">Thriving</option>
          </select>
        </div>
        <button
          class="filter-clear-btn"
          :disabled="!searchKeyword && !filterDifficulty"
          @click="searchKeyword = ''; filterDifficulty = ''"
        >
          Clear
        </button>
      </div>

      <!-- Loading -->
      <section v-if="loading" class="loading-box">
        <p>Loading events…</p>
      </section>

      <!--
        PERSONALIZED SECTION
        Only shown when the "Personalised Recommendations" tab is active.
        Handles three distinct situations:
          1. User hasn't done the wellness check-in yet — show a prompt to
             complete it so we have something to match against.
          2. Check-in is done but no events match their level right now —
             show a polite sorry message and display similar events below.
          3. Matching events exist — show them as cards.
      -->
      <section v-if="!loading && activeTab === 'personalized'" class="personalized-section">

        <!-- Case 1: No snapshot yet -->
        <div v-if="!hasSnapshot" class="no-snapshot">
          <div class="checkin-empty-icon">📋</div>
          <h2 class="checkin-empty-title">No snapshot yet</h2>
          <p class="checkin-empty-desc">
            Take a quick 5-minute check-in to see how you're tracking against the Australian benchmark
            for adults 65 and over. You'll get a personalised wellness category and exercise suggestions.
          </p>
          <div class="checkin-empty-steps">
            <div class="checkin-step">
              <div class="checkin-step-num">1</div>
              <span>Answer a few questions about your activity, sleep, and wellbeing</span>
            </div>
            <div class="checkin-step">
              <div class="checkin-step-num">2</div>
              <span>Get your wellness category scored against the 65+ benchmark</span>
            </div>
            <div class="checkin-step">
              <div class="checkin-step-num">3</div>
              <span>See personalised exercises and events matched to your level</span>
            </div>
          </div>
          <button class="snapshot-btn" @click="router.push('/survey')">Start Check-in →</button>
        </div>

        <!-- Case 2: Snapshot exists but no matching events -->
        <div v-else-if="personalizedEvents.length === 0" class="sorry-box">
          <div class="sorry-icon">🔍</div>
          <h2 class="sorry-title">No events for your level right now</h2>
          <p class="sorry-desc">
            We couldn't find upcoming events that match your wellness level at the moment.
            Check back soon — new events are added regularly. In the meantime, have a look at some similar activities below.
          </p>
        </div>

        <!-- Case 3: Personalized events found -->
        <div v-else class="cards">
          <div
            class="card"
            v-for="(event, index) in personalizedEvents"
            :key="'p-' + (event.id ?? index)"
          >
            <div class="card-img-wrap">
              <img
                :src="event.img ?? imgFallback"
                class="card-img"
                @error="e => e.target.src = imgFallback"
              />
              <span v-if="event.difficulty" class="difficulty-badge" :class="difficultyBadgeClass(event.difficulty)">
                {{ event.difficulty }}
              </span>
            </div>
            <div class="card-content">
              <h2>{{ event.title }}</h2>
              <p class="card-desc">{{ event.desc }}</p>
              <div class="info">
                <div class="info-row">
                  <span><strong>{{ event.location }} <br>{{ event.time }}</strong></span>
                </div>
                <div v-if="event.activity_type" class="info-row">
                  <span class="info-icon">🏃</span>
                  <span>{{ event.activity_type }}</span>
                </div>
              </div>
              <button class="btn" @click="event.url ? openExternal(event.url) : null">View</button>
            </div>
          </div>
        </div>

      </section>

      <!--
        BROWSE CARDS
        The full event grid, visible only on the "Browse All Events" tab.
        Each card shows an image, difficulty badge, title, description,
        location, time, and a "View" button that opens the event externally
        (with a disclaimer modal shown first).
      -->
      <section v-if="!loading && activeTab === 'browse'" class="cards">
        <div
          class="card"
          v-for="(event, index) in pagedEvents"
          :key="'b-' + (event.id ?? index)"
        >
          <div class="card-img-wrap">
            <img
              :src="event.img ?? imgFallback"
              @error="e => e.target.src = imgFallback"
            />
            <span v-if="event.difficulty" class="difficulty-badge" :class="difficultyBadgeClass(event.difficulty)">
              {{ event.difficulty }}
            </span>
          </div>
          <div class="card-content">
            <h2>{{ event.title }}</h2>
            <p class="card-desc">{{ event.desc }}</p>
            <div class="info">
              <div class="info-row">
                <span><strong>{{ event.location }} <br>{{ event.time }}</strong></span>
              </div>
              <div v-if="event.activity_type" class="info-row">
                <span class="info-icon">🏃</span>
                <span>{{ event.activity_type }}</span>
              </div>
            </div>
            <button class="btn" @click="event.url ? openExternal(event.url) : null">View</button>
          </div>
        </div>
        <div v-if="filteredEvents.length === 0" class="no-results">
          No events match your filters. Try adjusting your search.
        </div>
      </section>

      <!--
        SIMILAR EVENTS
        Shown below the "no matches" sorry message on the personalised tab.
        Displays three general events so the user always has something to
        look at even when nothing matches their exact level. A "View more"
        button at the bottom switches them to the full Browse tab.
      -->
      <section
        v-if="!loading && activeTab === 'personalized' && hasSnapshot && similarEvents.length > 0"
        class="similar-section"
      >
        <div class="similar-header">
          <h2 class="similar-title">Similar Events</h2>
          <p class="similar-desc">We couldn't find events that exactly match your wellness level right now — but you might enjoy these nearby activities.</p>
        </div>
        <div class="similar-cards">
          <div
            class="card"
            v-for="(event, index) in similarEvents"
            :key="'s-' + (event.id ?? index)"
          >
            <div class="card-img-wrap">
              <img
                :src="event.img ?? imgFallback"
                class="card-img"
                @error="e => e.target.src = imgFallback"
              />
              <span v-if="event.difficulty" class="difficulty-badge" :class="difficultyBadgeClass(event.difficulty)">
                {{ event.difficulty }}
              </span>
            </div>
            <div class="card-content">
              <h2>{{ event.title }}</h2>
              <p class="card-desc">{{ event.desc }}</p>
              <div class="info">
                <div class="info-row">
                  <span><strong>{{ event.location }} <br>{{ event.time }}</strong></span>
                </div>
                <div v-if="event.activity_type" class="info-row">
                  <span class="info-icon">🏃</span>
                  <span>{{ event.activity_type }}</span>
                </div>
              </div>
              <button class="btn" @click="event.url ? openExternal(event.url) : null">View</button>
            </div>
          </div>
        </div>
        <div class="similar-footer">
          <button class="similar-more-btn" @click="activeTab = 'browse'">View more events →</button>
        </div>
      </section>

      <!--
        PAGINATION
        Only shown on the Browse tab when there are more events than fit on
        one page. Each page number is a button; clicking one scrolls back to
        the top automatically so the user doesn't have to.
      -->
      <div v-if="activeTab === 'browse' && !loading && totalPages > 1" class="pagination">
        <button
          v-for="page in totalPages"
          :key="page"
          class="page-btn"
          :class="{ active: page === currentPage }"
          @click="currentPage = page; $nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))"
        >
          {{ page }}
        </button>
      </div>



    </div>

    <AppFooter />

    <!--
      GUIDED PAGE TOUR
      A step-by-step spotlight overlay that auto-starts the first time a user
      visits this page. It highlights the tab toggle, sort controls, filter
      bar, and event cards in sequence so new users understand the layout
      without having to figure it out on their own.
    -->
    <!-- Page Tour -->
    <Teleport to="body">
      <div v-if="tourActive" class="tour-overlay">
        <div class="tour-spotlight" :style="spotlightStyle"></div>
        <div class="tour-tooltip" :style="tooltipStyle">
          <div class="tour-step-num">{{ tourStep + 1 }} / {{ TOUR_STEPS.length }}</div>
          <h3 class="tour-title">{{ TOUR_STEPS[tourStep].title }}</h3>
          <p class="tour-desc">{{ TOUR_STEPS[tourStep].desc }}</p>
          <div class="tour-actions">
            <button class="tour-skip" @click="endTour">Skip tour</button>
            <button class="tour-next" @click="nextTourStep">
              {{ tourStep < TOUR_STEPS.length - 1 ? 'Next →' : 'Get Started!' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!--
      EXTERNAL LINK DISCLAIMER
      A small confirmation modal that appears before sending a user to an
      external event website. It makes clear that the destination is outside
      ActiveAgeing and gives them the option to cancel or continue.
    -->
    <!-- External link disclaimer -->
    <Teleport to="body">
      <div v-if="showDisclaimer" class="disclaimer-overlay" @click.self="showDisclaimer = false">
        <div class="disclaimer-modal">
          <h3 class="disclaimer-title">You're leaving ActiveAgeing</h3>
          <p class="disclaimer-text">This link will take you to an external website. ActiveAgeing is not responsible for content on third-party sites.</p>
          <div class="disclaimer-actions">
            <button class="disclaimer-btn-cancel" @click="showDisclaimer = false">Cancel</button>
            <button class="disclaimer-btn-confirm" @click="confirmExternal">Continue →</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* ── Global reset ──────────────────────────────────────────────────────────
   :global(body) is needed because the body sits outside this component's
   scoped boundary. Sets the base background and font so the page matches
   even in areas outside the component root. */
:global(body) {
  margin: 0;
  font-family: 'Poppins', 'Arial', sans-serif;
  background: #f6f6f6;
  color: #333;
}

.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f6f6f6;
}

.container {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  padding-top: var(--navbar-h, 70px);
  box-sizing: border-box;
}

/* BACK LINK */
.back-link {
  margin-top: 24px;
  font-size: 20px;
  color: #444;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.back-link:hover { color: #0b5d57; }

/* HERO */
.hero {
  margin-top: 32px;
}

.badge {
  background: #fcd7c5;
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 14px 0;
}

.hero h1 {
  font-size: 38px;
  font-weight: 700;
  color: #0b5d57;
  line-height: 1.3;
  margin: 0 0 14px 0;
}

.hero h1 span { color: #b45309; }

.desc {
  font-size: 20px;
  line-height: 1.6;
  color: #4a4a4a;
  margin: 0;
}

/* ── Tab toggle + sort row ─────────────────────────────────────────────────
   justify-content: space-between pushes the sort group to the far right.
   The sort-group uses margin-left: auto as an additional push for when the
   tab group wraps on narrow screens. */
.show-me-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
  justify-content: space-between;
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.sort-label {
  font-size: 20px;
  font-weight: 500;
  color: #444;
  white-space: nowrap;
}

.sort-select {
  padding: 10px 22px;
  border: 2px solid #0b5d57;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #0b5d57;
  background: white;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-select:focus { background: #e8f4f3; }

.show-me-label {
  font-size: 20px;
  color: #444;
  font-weight: 500;
  white-space: nowrap;
}

.tab-group {
  display: flex;
  gap: 10px;
}

.tab-btn {
  padding: 10px 22px;
  border-radius: 8px;
  border: 2px solid #0b5d57;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  background: white;
  color: #0b5d57;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #0b5d57;
  color: white;
}

.tab-btn:hover:not(.active) {
  background: #e8f4f3;
}

/* ── Filters bar ───────────────────────────────────────────────────────────
   White card that wraps the keyword input, category dropdown, and clear
   button. flex-wrap allows it to reflow into two rows on narrow screens. */
.filters-bar {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  padding: 18px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 160px;
}

.filter-group label {
  font-size: 20px;
  font-weight: 600;
  color: #555;
}

.filter-input,
.filter-select {
  padding: 2px 15px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  color: #333;
  background: white;
  outline: none;
  transition: border-color 0.2s;
}

.filter-clear-btn {
  align-self: flex-end;
  padding: 6px 18px;
  border: none;
  border-radius: 8px;
  background: #dc2626;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.filter-clear-btn:not(:disabled):hover { background: #b91c1c; }
.filter-clear-btn:disabled { opacity: 0.4; cursor: default; }

.filter-input::placeholder { color: #aaa; }

.filter-input:focus,
.filter-select:focus {
  border-color: #0b5d57;
}

/* ── Event cards grid ──────────────────────────────────────────────────────
   Three-column grid on desktop, drops to two on 768px and one on 480px.
   flex-direction: column on each card lets margin-top: auto on the button
   push it to the bottom regardless of card height. */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 24px;
}

.card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
}

.card-img-wrap {
  position: relative;
}

.card-img {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
  object-position: top;
}

.difficulty-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  background: white;
  color: #333;
}

.badge-easy { background: white; color: #333; }
.badge-medium { background: white; color: #333; }
.badge-hard { background: white; color: #333; }

.card-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-content h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0b5d57;
  margin: 0 0 8px 0;
}

.card-desc {
  font-size: 18px;
  color: #555;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 14px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  color: #555;
}

.info-icon { font-size: 20px; }

.loading-box {
  text-align: center;
  padding: 60px 0;
  color: #5a6b67;
  font-size: 20px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 0;
  color: #888;
  font-size: 20px;
}

/* BUTTON */
.btn {
  display: block;
  width: 100%;
  padding: 10px;
  background: #0b5d57;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 500;
  margin-top: auto;
  transition: background 0.2s;
}

.btn:hover { background: #084a45; }

/* CTA */
.cta-box {
  margin: 80px 0;
  display: flex;
  justify-content: center;
}

.cta-btn.big {
  background: #a54511;
  border: none;
  padding: 16px 30px;
  border-radius: 10px;
  color: white;
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.cta-btn.big:hover { background: #8b2d08; }


/* NO SNAPSHOT */
.no-snapshot {
  grid-column: 1 / -1;
  max-width: 560px;
  margin: 0 auto 48px;
  background: #f9f7f3;
  border-radius: 24px;
  padding: 48px 40px;
  text-align: center;
  border: 1.5px solid #e4dfd5;
}

.checkin-empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.checkin-empty-title {
  font-size: 26px;
  font-weight: 700;
  color: #0f3d35;
  margin-bottom: 14px;
}

.checkin-empty-desc {
  font-size: 20px;
  color: #5a6b67;
  line-height: 1.7;
  margin-bottom: 28px;
}

.checkin-empty-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
  margin-bottom: 32px;
}

.checkin-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 20px;
  color: #3a5a55;
  font-weight: 500;
  line-height: 1.5;
}

.checkin-step-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #e0ede9;
  color: #0b5d57;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.snapshot-btn {
  background: #0b5d57;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 15px 36px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.snapshot-btn:hover { background: #0f3d35; transform: translateY(-1px); }

/* ── Pagination ────────────────────────────────────────────────────────────
   Active page is underlined (not boxed) to keep it subtle. Clicking a page
   number also triggers a smooth scroll-to-top via $nextTick in the template. */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 32px 0 8px;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: none;
  background: transparent;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #444;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.2s;
}

.page-btn:hover:not(.active) {
  color: #0b5d57;
  background: #e8f4f3;
}

.page-btn.active {
  color: #0b5d57;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
  background: transparent;
}

/* ── External link disclaimer modal ────────────────────────────────────────
   z-index: 900 sits above the page content but below the tour (1000).
   @click.self on the overlay closes it by clicking the dark backdrop. */
.disclaimer-overlay {
  position: fixed; inset: 0; z-index: 900;
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.disclaimer-modal {
  background: #fff; border-radius: 16px;
  padding: 32px 28px; max-width: 400px; width: 100%;
  text-align: center;
  box-shadow: 0 16px 48px rgba(0,0,0,0.2);
  font-family: 'Poppins', sans-serif;
}
.disclaimer-icon { font-size: 36px; margin-bottom: 12px; }
.disclaimer-title { font-size: 20px; font-weight: 700; color: #0b5d57; margin: 0 0 10px; }
.disclaimer-text { font-size: 20px; color: #555; line-height: 1.6; margin: 0 0 24px; }
.disclaimer-actions { display: flex; gap: 12px; }
.disclaimer-btn-cancel {
  flex: 1; padding: 12px; border: 2px solid #ddd; border-radius: 10px;
  background: #fff; color: #555; font-family: 'Poppins', sans-serif;
  font-size: 20px; font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.disclaimer-btn-cancel:hover { background: #f5f5f5; }
.disclaimer-btn-confirm {
  flex: 1; padding: 12px; border: none; border-radius: 10px;
  background: #0b5d57; color: #fff; font-family: 'Poppins', sans-serif;
  font-size: 20px; font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.disclaimer-btn-confirm:hover { background: #084a45; }

/* ── Responsive ────────────────────────────────────────────────────────────
   Cards go to 2-column at 768px and 1-column at 480px. The tab/sort row
   stacks vertically on mobile so it doesn't overflow horizontally. */
@media (max-width: 768px) {
  .container { padding: 0 20px; padding-top: var(--navbar-h, 70px); }
  .hero h1 { font-size: 26px; }
  .cards { grid-template-columns: repeat(2, 1fr); }
  .show-me-row { flex-direction: column; align-items: flex-start; gap: 10px; }
  .tab-group { flex-wrap: wrap; }
  .filters-bar { flex-direction: column; gap: 12px; }
  .filter-group { min-width: 100%; }
  .sort-group { width: 100%; }
  .sort-select { width: 100%; }
  .no-snapshot { padding: 32px 20px; }
  .checkin-empty-title { font-size: 22px; }
  .pagination { flex-wrap: wrap; gap: 4px; margin: 20px 0 4px; }
  .page-btn { min-width: 36px; height: 36px; font-size: 20px; }
}

@media (max-width: 480px) {
  .cards { grid-template-columns: 1fr; }
  .tab-btn { font-size: 20px; padding: 9px 16px; }
  .hero h1 { font-size: 22px; }
  .desc { font-size: 20px; }
  .card-content h2 { font-size: 20px; }
  .snapshot-btn { width: 100%; }
}

/* ── Tour overlay ──────────────────────────────────────────────────────────
   pointer-events: none on the overlay itself so scroll and click pass through
   to the page — only the tooltip has pointer-events: all so buttons work. */
.tour-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.55);
}

.tour-spotlight {
  position: fixed;
  border-radius: 12px;
  /* 9999px outward box-shadow dims everything outside the spotlight without
     needing a separate overlay element — the transparent box acts as the cutout. */
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
  background: transparent;
  pointer-events: none;
  transition: top 0.25s, left 0.25s, width 0.25s, height 0.25s;
}

.tour-tooltip {
  position: fixed;
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px 18px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
  pointer-events: all;
  font-family: 'Poppins', sans-serif;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  transition: top 0.25s, left 0.25s;
}

.tour-step-num {
  font-size: 14px;
  font-weight: 600;
  color: #0b5d57;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.tour-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f3d35;
  margin: 0 0 8px;
}

.tour-desc {
  font-size: 20px;
  color: #4a5e5a;
  line-height: 1.6;
  margin: 0 0 16px;
}

.tour-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.tour-skip {
  background: none;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  color: #888;
  cursor: pointer;
  padding: 0;
}

.tour-skip:hover { color: #333; }

.tour-next {
  background: #0b5d57;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.tour-next:hover { background: #084a45; }

/* ── Personalized section wrapper ── */
.personalized-section {
  margin-top: 24px;
}

/* Sorry state (snapshot exists, no matches) */
.sorry-box {
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px;
  text-align: center;
  border: 1.5px solid #e4dfd5;
}

.sorry-icon {
  font-size: 44px;
  margin-bottom: 16px;
}

.sorry-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f3d35;
  margin: 0 0 12px;
}

.sorry-desc {
  font-size: 20px;
  color: #5a6b67;
  line-height: 1.7;
  max-width: 520px;
  margin: 0 auto;
}

/* ── Similar Events section ── */
.similar-section {
  margin-top: 40px;
}

.similar-header {
  margin-bottom: 20px;
}

.similar-title {
  font-size: 24px;
  font-weight: 700;
  color: #0b5d57;
  margin: 0 0 8px;
}

.similar-desc {
  font-size: 20px;
  color: #5a6b67;
  margin: 0;
  line-height: 1.6;
}

.similar-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.similar-footer {
  margin-top: 24px;
  text-align: center;
}

.similar-more-btn {
  background: none;
  border: 2px solid #0b5d57;
  border-radius: 10px;
  padding: 12px 32px;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #0b5d57;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.similar-more-btn:hover {
  background: #0b5d57;
  color: #fff;
}

@media (max-width: 768px) {
  .similar-cards { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .similar-cards { grid-template-columns: 1fr; }
  .similar-title { font-size: 20px; }
}
</style>