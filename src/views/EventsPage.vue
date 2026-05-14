<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import fallbackImg from '../assets/myphoto.png'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()
const imgFallback = fallbackImg

const events   = ref([])
const loading  = ref(true)
const apiError = ref(false)
const maxEvents = ref(12)

// Tab state: 'personalized' | 'browse'
const activeTab = ref('personalized')

// Filter state
const searchKeyword = ref('')
const filterActivity = ref('')
const filterDifficulty = ref('')

const displayedEvents = computed(() =>
  maxEvents.value === null ? events.value : events.value.slice(0, maxEvents.value)
)

// Personalized events: just show the first 3 as "recommended"
const personalizedEvents = computed(() => events.value.slice(0, 3))

// Browse all events with filters applied
const filteredEvents = computed(() => {
  let list = maxEvents.value === null ? events.value : events.value.slice(0, maxEvents.value)
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(e =>
      e.title?.toLowerCase().includes(kw) ||
      e.desc?.toLowerCase().includes(kw) ||
      e.location?.toLowerCase().includes(kw)
    )
  }
  if (filterActivity.value) {
    list = list.filter(e =>
      e.activity_type?.toLowerCase() === filterActivity.value.toLowerCase()
    )
  }
  if (filterDifficulty.value) {
    list = list.filter(e =>
      e.difficulty?.toLowerCase() === filterDifficulty.value.toLowerCase()
    )
  }
  return list
})

const fallbackEvents = [
  {
    title: 'Gentle Park Walk',
    desc: 'A relaxed stroll through scenic parks and gardens',
    time: 'Mon, 10:00 AM',
    location: 'Green Park',
    activity_type: 'Walking',
    difficulty: 'Easy',
    interested: 12,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Morning Yoga Flow',
    desc: 'Start your day with gentle stretches',
    time: 'Tue, 8:00 AM',
    location: 'Wellness Studio',
    activity_type: 'Exercise',
    difficulty: 'Easy',
    interested: 10,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Brisk Morning Walk',
    desc: 'Energizing walk to start the day',
    time: 'Wed, 7:00 AM',
    location: 'Central Park',
    activity_type: 'Walking',
    difficulty: 'Medium',
    interested: 11,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: false,
  },
  {
    title: 'Mindful Tai Chi',
    desc: 'Gentle movements for balance and calm',
    time: 'Wed, 9:00 AM',
    location: 'Community Center',
    activity_type: 'Exercise',
    difficulty: 'Easy',
    interested: 8,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Community Crocheting',
    desc: 'A friendly circle to share patterns and stories',
    time: 'Fri, 2:00 PM',
    location: 'City Library',
    activity_type: 'Social',
    difficulty: 'Easy',
    interested: 15,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Scenic Nature Walk',
    desc: 'Explore beautiful trails with a group',
    time: 'Thu, 10:30 AM',
    location: 'Riverside Trail',
    activity_type: 'Walking',
    difficulty: 'Medium',
    interested: 14,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: false,
  },
  {
    title: 'Coffee & Conversation',
    desc: 'Meet new friends over morning coffee',
    time: 'Sat, 10:00 AM',
    location: 'Brook Cafe',
    activity_type: 'Social',
    difficulty: 'Easy',
    interested: 20,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: false,
  },
  {
    title: 'Chair Yoga Session',
    desc: 'Gentle yoga exercises done from a chair',
    time: 'Mon, 2:00 PM',
    location: 'Senior Center',
    activity_type: 'Exercise',
    difficulty: 'Easy',
    interested: 9,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Book Club Meetup',
    desc: "Discuss this month's selected book",
    time: 'Fri, 3:00 PM',
    location: 'Public Library',
    activity_type: 'Social',
    difficulty: 'Easy',
    interested: 16,
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
]

const difficultyBadgeClass = (difficulty) => {
  if (!difficulty) return ''
  const d = difficulty.toLowerCase()
  if (d === 'easy') return 'badge-easy'
  if (d === 'medium') return 'badge-medium'
  return 'badge-hard'
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
        <p class="badge">Category: Building Momentum</p>
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
          <label>Activity type</label>
          <select v-model="filterActivity" class="filter-select">
            <option value="">All</option>
            <option value="Walking">Walking</option>
            <option value="Exercise">Exercise</option>
            <option value="Social">Social</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Difficulty</label>
          <select v-model="filterDifficulty" class="filter-select">
            <option value="">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
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
                  <span class="info-icon">🕒</span>
                  <span>{{ event.location }} · {{ event.time }}</span>
                </div>
                <div v-if="event.activity_type" class="info-row">
                  <span class="info-icon">🏃</span>
                  <span>{{ event.activity_type }}</span>
                </div>
                <div v-if="event.interested" class="info-row">
                  <span class="info-icon">👥</span>
                  <span>{{ event.interested }} interested</span>
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
            v-for="(event, index) in filteredEvents"
            :key="'b-' + (event.id ?? index)"
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
                  <span class="info-icon">🕒</span>
                  <span>{{ event.location }} · {{ event.time }}</span>
                </div>
                <div v-if="event.activity_type" class="info-row">
                  <span class="info-icon">🏃</span>
                  <span>{{ event.activity_type }}</span>
                </div>
                <div v-if="event.interested" class="info-row">
                  <span class="info-icon">👥</span>
                  <span>{{ event.interested }} interested</span>
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

      <!-- CTA -->
      <section class="cta-box">
        <button class="cta-btn big" @click="router.push('/results')">
          ← Back to My Wellness Snapshot
        </button>
      </section>

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
  font-size: 15px;
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
  font-size: 14px;
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
  font-size: 16px;
  line-height: 1.6;
  color: #4a4a4a;
  margin: 0;
}

/* TAB TOGGLE */
.show-me-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
}

.show-me-label {
  font-size: 15px;
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
  font-size: 15px;
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
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.filter-input,
.filter-select {
  padding: 9px 14px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
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
  font-size: 17px;
  font-weight: 700;
  color: #0b5d57;
  margin: 0 0 8px 0;
}

.card-desc {
  font-size: 14px;
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
  font-size: 13px;
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