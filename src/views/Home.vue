<script setup>
import { useRouter } from 'vue-router'
import myImg from '../assets/myphoto.png'

const router = useRouter()
</script>

<template>
  <div class="homepage-container">
    
    <!-- Navbar -->
    <header class="navbar">
      <div class="logo">ActiveAgeing</div>
      <nav>
        <a>Home</a>
        <a>Help</a>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-text">
        <p class="badge">NATIONAL HEALTH ALERT</p>

        <h1>
          Right now, 1 in 6 Australians aged 65 and above feel lonely.
        </h1>

        <p class="desc">
          Research tells us loneliness is as harmful to health as smoking 15 cigarettes a day. 
          It raises the risk of heart disease, stroke, depression, and early death. 
          And yet the answer is simpler than any medication: move more, connect more.
          Across Melbourne, thousands of older adults are already doing it. This is where you start.
        </p>

        <button class="cta" @click="router.push('/survey')">
          Get Started →
        </button>
      </div>

      <div class="hero-img">
        <img :src="myImg" alt="My Image" />
      </div>
    </section>

    <!-- Red Card -->
    <section class="card">
      <h2>Your wellness journey,<br> clarified.</h2>
      <p>
        Don't let another day pass in isolation. Join thousands of Melbourne seniors who are reclaiming their health through connection.
      </p>
    </section>

    <!-- Footer -->
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
}

/* Navbar */
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
  transition: color 0.2s;

}

.navbar a:hover { 
    color: #084a45; 
}


/* Hero */
.hero {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 60px;
  gap: 40px;
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
  font-size: 16px; 
  padding: 12px 24px; 
  border-radius: 8px; 
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
@media (max-width: 900px) { 
    .hero { 
        flex-direction: column; 
        text-align: center; 
    }
    .hero-text { 
        text-align: center; 
    } 
    .hero-img img { 
        width: 250px; 
        margin-top: 20px; 
    } 
    .card { 
        width: 90%; 
        padding: 40px 20px; 
    } 
}
</style>