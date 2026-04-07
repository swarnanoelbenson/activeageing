<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToResults = () => {
  router.push({ name: 'Results' })
}

const events = [
  {
    title: 'Gentle Park Walk',
    desc: 'A slow-paced social stroll designed for those looking to stretch their legs and meet friendly neighbors.',
    time: 'Today, 10:00 AM',
    location: 'Carlton Gardens',
    img: new URL('../assets/myphoto.png', import.meta.url).href
  },
  {
    title: 'Mindful Tai Chi',
    desc: 'Focused movement sessions in Fitzroy Park designed to improve balance, strength, and inner calm.',
    time: 'Tomorrow, 9:00 AM',
    location: 'Fitzroy Park',
    img: new URL('../assets/myphoto.png', import.meta.url).href
  },
  {
    title: 'Community Crocheting',
    desc: 'Gather at the Richmond Hub for an afternoon of creativity. All skill levels are welcome.',
    time: 'Sat, 2:00 PM - 4:00 PM',
    location: 'Richmond Hub',
    img: new URL('../assets/myphoto.png', import.meta.url).href
  }
]
</script>

<template>
  <div class="container">

    <!-- NAVBAR -->
    <header class="navbar">
      <div class="logo">ActiveAgeing</div>
      <nav>
        <a @click="router.push('/')">Home</a>
        <a class="active">Assessment</a>
        <a @click="router.push('/help')" style="cursor:pointer">Help</a>
      </nav>
    </header>

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

    <!-- EVENT CARDS -->
    <section class="cards">
      <div class="card" v-for="(event, index) in events" :key="index">

        <img :src="event.img" class="card-img" />

        <div class="card-content">
          <h3>{{ event.title }}</h3>

          <p class="desc">{{ event.desc }}</p>

          <div class="info">
            <div>🕒 {{ event.time }}</div>
            <div>📍 {{ event.location }}</div>
          </div>

          <button class="btn">Interested</button>
        </div>

      </div>
    </section>

    <!-- CTA -->
    <section class="cta-box">
      <button class="cta-btn big" @click="goToResults">
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
  font-weight: 500;
  cursor: pointer;
}

.navbar a:hover {
  color: #084a45;
}

.navbar .active {
  border-bottom: 2px solid #0b5d57;
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

/* CARDS */
.cards {
  display: flex;
  gap: 20px;
  margin-top: 40px;
}

.card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  flex: 1;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.25s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
}

.card-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.card-content {
  padding: 16px;
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
  width: 100%;
  padding: 10px;
  background: #0b5d57;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
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
@media (max-width: 900px) {
  .cards {
    flex-direction: column;
  }
}
</style>