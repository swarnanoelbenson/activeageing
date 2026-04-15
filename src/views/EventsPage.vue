<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import fallbackImg from '../assets/myphoto.png'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()
// expose for template
const imgFallback = fallbackImg

const events   = ref([])
const loading  = ref(true)
const apiError = ref(false)
const maxEvents = ref(12)
const displayedEvents = computed(() =>
  maxEvents.value === null ? events.value : events.value.slice(0, maxEvents.value)
)

const fallbackEvents = [
  {
    title: 'Gentle Morning Walk — Carlton Gardens',
    desc: 'A free, low-paced group walk through Carlton Gardens. Perfect for those looking to get moving in a welcoming, social setting.',
    time: 'Every Tuesday, 9:00 AM',
    location: 'Carlton Gardens, Melbourne VIC 3000',
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Mindful Tai Chi for Seniors',
    desc: 'Gentle Tai Chi sessions in Fitzroy Park led by a certified instructor. Improves balance, flexibility and inner calm — all levels welcome.',
    time: 'Every Wednesday, 8:30 AM',
    location: 'Fitzroy Park, Melbourne VIC 3065',
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Chair Yoga & Relaxation',
    desc: 'A seated yoga class specifically designed for older adults. No experience needed — just bring comfortable clothing and a willingness to move.',
    time: 'Every Thursday, 10:00 AM',
    location: 'Richmond Community Hub, Richmond VIC 3121',
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Seniors Social Swim',
    desc: 'Lane swimming and a social catch-up at the Melbourne City Baths. Lifeguard present. Open to all fitness levels.',
    time: 'Every Monday & Friday, 7:30 AM',
    location: 'Melbourne City Baths, Swanston St, Melbourne VIC 3000',
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: false,
  },
  {
    title: 'Community Crocheting & Craft Circle',
    desc: 'Join others for a relaxed afternoon of craft, conversation and connection. Beginners welcome. Materials provided.',
    time: 'Every Saturday, 2:00 PM – 4:00 PM',
    location: 'Fitzroy Library, Fitzroy VIC 3065',
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
  {
    title: 'Healthy Ageing Information Session',
    desc: 'A free talk covering nutrition, physical activity and mental wellbeing for adults 65+. Hosted by COTA Victoria.',
    time: 'First Monday of each month, 11:00 AM',
    location: 'COTA Victoria, Level 4, 2 Lonsdale St, Melbourne VIC 3000',
    img: fallbackImg, url: 'https://www.eventbrite.com.au', is_free: true,
  },
]

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
  <div class="container">

    <AppNavbar active="events" />

    <!-- HERO -->
    <section class="hero">
      <div class="hero-text">
        <p class="badge">CATEGORY: BUILDING MOMENTUM</p>

        <h1>
          Curated Events for <br />
          <span>Active Connections</span>
        </h1>

        <p class="desc">
          Discover a selection of gatherings specifically matched to your current pace.
          No pressure, just progress.
        </p>
      </div>
    </section>

    <!-- Controls -->
    <div v-if="!loading" class="controls">
      <label for="max-events">Show up to:</label>
      <select id="max-events" v-model="maxEvents">
        <option :value="12">12 events</option>
        <option :value="24">24 events</option>
        <option :value="36">36 events</option>
        <option :value="null">All</option>
      </select>
    </div>

    <!-- Loading -->
    <section v-if="loading" class="loading-box">
      <p>Loading events…</p>
    </section>

    <!-- EVENT CARDS -->
    <section v-else class="cards">
      <div class="card" v-for="(event, index) in displayedEvents" :key="event.id ?? index">

        <img :src="event.img ?? imgFallback" class="card-img" @error="e => e.target.src = imgFallback" />

        <div class="card-content">
          <div class="card-badges">
            <span v-if="event.is_free" class="badge-free">Free</span>
          </div>
          <h3>{{ event.title }}</h3>

          <p class="desc">{{ event.desc }}</p>

          <div class="info">
            <div>🕒 {{ event.time }}</div>
            <div>📍 {{ event.location }}</div>
          </div>

          <a v-if="event.url" :href="event.url" target="_blank" rel="noopener" class="btn">View on Eventbrite</a>
          <button v-else class="btn">Interested</button>
        </div>

      </div>
    </section>

    <!-- CTA -->
    <section class="cta-box">
      <button class="cta-btn big" @click="router.push('/results')">
        ← Back to Wellness Snapshot
      </button>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <h3>ActiveAgeing</h3>

      <div class="links">
        <a>Privacy Policy</a>
        <a>Terms of Service</a>
        <a>Contact Support</a>
      </div>

      <p>© 2024 ActiveAgeing Australia. Your journey to wellness, clarified.</p>
    </footer>

  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* GLOBAL */
body {
  margin: 0;
  font-family: 'Poppins', 'Arial', sans-serif;
  background: #f6f6f6;
  color: #333;
}

/* SAME AS HOMEPAGE */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  box-sizing: border-box;
}

/* NAVBAR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.logo {
  font-weight: 700;
  color: #0b5d57;
  font-size: 20px;
}

.navbar a {
  margin-left: 20px;
  text-decoration: none;
  color: #0b5d57;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.navbar a:hover { color: #084a45; }

.navbar .active {
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* HERO */
.hero {
  margin-top: 60px;
}

.hero-text h1 {
  font-size: 38px;
  font-weight: 700;
  color: #0b5d57;
  line-height: 1.3;
  margin: 20px 0;
}

.hero-text span {
  color: #b45309;
}

.badge {
  background: #fcd7c5;
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.desc {
  font-size: 15px;
  line-height: 1.6;
  color: #4a4a4a;
}

/* CONTROLS */
.controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
  font-size: 14px;
  color: #555;
}

.controls select {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #333;
  background: white;
  cursor: pointer;
}

/* CARDS */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  min-width: 0;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
}

.card-img {
  display: block;
  object-fit: cover;
  object-position: top;
  border-radius: 10px;
}

.loading-box {
  text-align: center;
  padding: 60px 0;
  color: #5a6b67;
  font-size: 16px;
}

.card-content {
  padding-top: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-content .btn {
  margin-top: auto;
}

.card-badges { margin-bottom: 6px; }
.badge-free {
  background: #d4edda;
  color: #155724;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
}

.card h3 {
  margin-bottom: 8px;
  color: #0b5d57;
}

.info {
  font-size: 13px;
  margin: 10px 0;
  color: #555;
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
}

.btn:hover {
  background: #084a45;
}

/* CTA */
.cta-box {
  margin: 80px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: transparent; 
  padding: 0; 
}

.cta-btn.big {
  background: #a54511;
  border: none;
  padding: 16px 30px;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.cta-btn.big:hover {
  background: #8b2d08;
}

/* FOOTER */
.footer {
  text-align: center;
  padding: 40px 0;
  font-size: 14px;
  color: #555;
}

.footer h3 {
  color: #0b5d57;
  margin-bottom: 10px;
}

.links a {
  margin: 0 10px;
  text-decoration: none;
  color: #555;
}

.links a:hover {
  color: #0b5d57;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .container { max-width: 100%; margin: 0; padding: 0 20px; overflow-x: hidden; }
  .navbar { padding: 16px 20px; }
  .logo { font-size: 18px; }
  .navbar a { font-size: 14px; margin-left: 14px; }

  .container { padding: 0 20px; }
  .hero { margin-top: 32px; }
  .hero h1 { font-size: 28px; }
  .desc { font-size: 14px; }

  .cards { grid-template-columns: 1fr; }
  .controls { margin-top: 20px; }

  .footer { padding: 24px 20px; }
  .footer-links { flex-wrap: wrap; gap: 12px; }
}
</style>