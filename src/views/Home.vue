<script setup>
import { useRouter } from 'vue-router'
import myImg from '../assets/myphoto.png'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()

function getStarted() {
  localStorage.removeItem('surveyAnswers')
  localStorage.removeItem('surveyResult')
  localStorage.removeItem('sessionCompleted')
  router.push('/survey')
}
</script>

<template>
  <div>
    <AppNavbar active="home" />
    <div class="homepage-container">

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-text">
        <p class="badge">NATIONAL HEALTH ALERT</p>

        <h1>
          Right now, 1 in 6 Australians aged 65 and above feel lonely.
        </h1>

        <p class="desc">
Staying connected and staying active can bring a wonderful boost to our wellbeing — more energy, brighter moods, and a stronger sense of belonging. Across Melbourne, thousands of older adults are discovering new friendships, new routines, and new confidence through simple everyday movement and community activities. You can begin your own journey too, gently and in your own time, in a place that’s warm, welcoming, and ready for you.
        </p>

        <button class="cta" @click="getStarted">
          Get Started →
        </button>
      </div>

      <div class="hero-img">
        <img :src="myImg" alt="My Image" />
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <h3>ActiveAgeing</h3>
      <div class="links">
        <a @click="router.push('/privacy')" style="cursor:pointer">Privacy Policy</a>
        <a @click="router.push('/terms')" style="cursor:pointer">Terms of Service</a>
        <a @click="router.push('/contact')" style="cursor:pointer">Contact Support</a>
      </div>
      <p>© 2024 ActiveAgeing Australia. Your journey to wellness, clarified.</p>
    </footer>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

body {
  margin: 0;
  font-family: 'Poppins', 'Arial', sans-serif;
  background: #f6f6f6;
  color: #333;
}

/* Layout */
.homepage-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Navbar */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.logo {
  font-weight: 700;
  font-size: 20px;
  color: #0b5d57;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 32px;
  font-size: 16px;
  font-weight: 500;
}

.nav-link {
  color: #0b5d57;
  text-decoration: none;
  cursor: pointer;
}

.nav-link:hover { color: #084a45; }

.nav-link.active {
  text-decoration: underline;
  text-underline-offset: 4px;
}


/* Hero */
.hero {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 60px;
  gap: 40px;
  flex: 1;
}

.hero-text {
  flex: 1;
  text-align: left;
}

.hero-text h1 {
  font-size: 38px; 
  font-weight: 700;
  color: #0b5d57;
  line-height: 1.3; 
  margin: 20px 0;
}

.badge {
  background: #fcd7c5;
  display: inline-block; 
  padding: 6px 14px; 
  border-radius: 20px; 
  font-size: 12px; 
  font-weight: 600; 
  letter-spacing: 0.5px;
}

.desc {
  margin: 20px 0;
  font-size: 16px; 
  line-height: 1.6; 
  color: #4a4a4a;
}

/* Button */
.cta {
  background: #0b5d57;
  color: white;
  font-size: 20px;
  font-weight: 600;
  padding: 18px 40px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.cta:hover { 
    background: #084a45; 
    transform: translateY(-2px); 
}

/* Image */
.hero-img img {
  width: 350px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

/* Card - HomePage Only */
.card {
  background: #8f1d1d; 
  color: white;
  padding: 60px 40px; 
  border-radius: 24px; 
  text-align: center; 
  margin: 80px auto; 
  width: 80%; 
  position: relative;  
  overflow: hidden;    
}

.card::after {
  content: '';
  position: absolute;
  top: -60px;
  right: -60px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.15);
}

.card h2 { 
    font-size: 28px; 
    margin-bottom: 20px; 
}

.card p { 
    font-size: 16px; 
    line-height: 1.6; 
}

/* Footer */
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
    transition: color 0.2s; 
} 

.links a:hover { 
    color: #0b5d57; 
} 

/* Responsive */
@media (max-width: 768px) {
  .homepage-container { max-width: 100%; margin: 0; padding: 0 20px; overflow-x: hidden; }

  .nav { padding: 16px 0; }
  .logo { font-size: 18px; }
  .nav-links { gap: 20px; font-size: 14px; }

  .hero {
    flex-direction: column;
    text-align: center;
    margin-top: 32px;
    gap: 24px;
  }
  .hero-text { text-align: center; }
  .hero-text h1 { font-size: 26px; }
  .desc { font-size: 14px; }
  .hero-img img { width: 220px; }

  .cta { font-size: 16px; padding: 14px 28px; width: 100%; }

  .card { width: 100%; box-sizing: border-box; margin: 40px 0; padding: 32px 20px; }
  .card h2 { font-size: 22px; }
  .card p { font-size: 14px; }
}
</style>