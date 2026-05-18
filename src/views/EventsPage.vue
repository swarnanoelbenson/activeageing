<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import fallbackImg from '../assets/myphoto.png'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()
const route  = useRoute()
const imgFallback = fallbackImg

const events   = ref([])
const loading  = ref(true)
const apiError = ref(false)

// Tab state: 'personalized' | 'browse'
const activeTab = ref(route.query.tab === 'personalized' ? 'personalized' : 'browse')

const hasSnapshot = computed(() => !!localStorage.getItem('surveyResult'))

// Filter state
const searchKeyword = ref('')
const filterDifficulty = ref('')

// Sort
const sortOption = ref('date-asc')

// Pagination
const PAGE_SIZE = 9
const currentPage = ref(1)

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

// Personalized events: earliest events matching the user's difficulty level
const personalizedEvents = computed(() => {
  if (!userDifficulty.value) return []
  return events.value
    .filter(e => e.difficulty === userDifficulty.value)
    .slice(0, 3)
})

// Browse all events with filters applied (no page cap)
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

// Reset to page 1 when filters change
watch([searchKeyword, filterDifficulty, sortOption], () => { currentPage.value = 1 })

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
      events.value = fallbackEvents
      apiError.value = true
    }
  } catch {
    events.value = fallbackEvents
    apiError.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <AppNavbar active="events" />
    <div class="container">

      <!-- BACK LINK -->
      <div class="back-link" @click="router.push('/')">
        ‹ Back to home
      </div>

      <!-- HERO -->
      <section class="hero">
        <h1>Curated Events for <span>Active Connections</span></h1>
        <p class="desc">
          Discover a selection of activities specifically matched to your current pace. No pressure, just progress.
        </p>
      </section>

      <!-- TAB TOGGLE -->
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

      <!-- BROWSE FILTERS (only shown when browse tab is active) -->
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
          <label>Difficulty</label>
          <select v-model="filterDifficulty" class="filter-select">
            <option value="">All</option>
            <option value="Easy">Easy (Just Getting Started)</option>
            <option value="Medium">Medium (Building Momentum)</option>
            <option value="Hard">Hard (Thriving)</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <section v-if="loading" class="loading-box">
        <p>Loading events…</p>
      </section>

      <!-- EVENT CARDS -->
      <section v-else class="cards">
        <template v-if="activeTab === 'personalized'">
          <!-- No snapshot state -->
          <div v-if="!hasSnapshot" class="no-snapshot">
            <div class="no-snapshot-icon">📋</div>
            <h2>No snapshot yet</h2>
            <p>Take a quick 5-minute check-in to see how you're tracking against the Australian benchmark for adults 65 and over. You'll get a personalised wellness category and exercise suggestions.</p>
            <button class="snapshot-btn" @click="router.push('/survey')">Take the Check-in Survey</button>
          </div>
          <div
            v-else
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
              <a v-if="event.url" :href="event.url" target="_blank" rel="noopener" class="btn">View</a>
              <button v-else class="btn">Interested</button>
            </div>
          </div>
        </template>

        <template v-else>
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
              <a v-if="event.url" :href="event.url" target="_blank" rel="noopener" class="btn">View</a>
              <button v-else class="btn">Interested</button>
            </div>
          </div>
          <div v-if="filteredEvents.length === 0" class="no-results">
            No events match your filters. Try adjusting your search.
          </div>
        </template>
      </section>

      <!-- PAGINATION (browse tab only) -->
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



      <!-- FOOTER -->
      <footer class="footer">
        <h3>ActiveAgeing</h3>
        <div class="links">
          <a>Privacy Policy</a>
          <a>·</a>
          <a>Terms of Service</a>
          <a>·</a>
          <a>Contact Support</a>
        </div>
        <p class="footer-copy">© 2026 ActiveAgeing Australia. Your journey to wellness, certified.</p>
      </footer>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* GLOBAL */
:global(body) {
  margin: 0;
  font-family: 'Poppins', 'Arial', sans-serif;
  background: #f6f6f6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
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

/* TAB TOGGLE */
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
  padding: 15px 22px;
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

/* FILTERS BAR */
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

.filter-input::placeholder { color: #aaa; }

.filter-input:focus,
.filter-select:focus {
  border-color: #0b5d57;
}

/* CARDS */
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
  font-size: 13px;
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

.info-icon { font-size: 14px; }

.loading-box {
  text-align: center;
  padding: 60px 0;
  color: #5a6b67;
  font-size: 16px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 0;
  color: #888;
  font-size: 16px;
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
  font-size: 15px;
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
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.cta-btn.big:hover { background: #8b2d08; }

/* FOOTER */
.footer {
  text-align: center;
  padding: 40px 0;
  font-size: 14px;
  color: #555;
  border-top: 1px solid #e5e5e5;
}

.footer h3 {
  color: #0b5d57;
  margin-bottom: 10px;
  font-size: 18px;
}

.links {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.links a {
  text-decoration: none;
  color: #555;
  cursor: pointer;
}

.links a:hover { color: #0b5d57; }

.footer-copy {
  color: #888;
  margin: 6px 0 0 0;
  font-size: 13px;
}

/* NO SNAPSHOT */
.no-snapshot {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.no-snapshot-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-snapshot h2 {
  font-size: 22px;
  font-weight: 700;
  color: #0b5d57;
  margin: 0 0 12px;
}

.no-snapshot p {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  max-width: 520px;
  margin: 0 auto 24px;
}

.snapshot-btn {
  padding: 13px 32px;
  background: #0b5d57;
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.snapshot-btn:hover { background: #084a45; }

/* PAGINATION */
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
  font-size: 16px;
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

/* RESPONSIVE */
@media (max-width: 768px) {
  .container { padding: 0 20px; }
  .hero h1 { font-size: 26px; }
  .cards { grid-template-columns: repeat(2, 1fr); }
  .show-me-row { flex-direction: column; align-items: flex-start; gap: 10px; }
  .tab-group { flex-wrap: wrap; }
  .filters-bar { gap: 14px; }
}

@media (max-width: 480px) {
  .cards { grid-template-columns: 1fr; }
  .tab-btn { font-size: 14px; padding: 9px 16px; }
}
</style>