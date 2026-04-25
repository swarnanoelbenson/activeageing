<template>
  <div class="page">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-inner">
        <span class="brand">ActiveAgeing</span>
        <ul class="nav-links">
          <li><a href="#" class="active">Home</a></li>
          <li><a href="#">Check-In</a></li>
          <li><a href="#">Events</a></li>
        </ul>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <span class="welcome-badge">Welcome back</span>
          <h1>Active Ageing,<br />Rediscovering<br />Memories</h1>
          <p>
            Staying connected and staying active can bring a wonderful boost to
            our wellbeing. More energy, brighter moods, and a stronger sense of
            belonging through simple everyday movement and community activities.
          </p>
          <a href="#" class="btn-primary">Get started →</a>
        </div>
        <div class="hero-image">
          <span>[ Hero image: elderly couple laughing ]</span>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="stats-bar">
      <div class="stats-inner">
        <div class="stat">
          <strong>150+</strong>
          <span>Walking routes</span>
        </div>
        <div class="stat">
          <strong>50+</strong>
          <span>Weekly events</span>
        </div>
        <div class="stat">
          <strong>30+</strong>
          <span>Guided exercises</span>
        </div>
        <div class="stat highlight">
          <strong>100%</strong>
          <span>Private, no data stored</span>
        </div>
      </div>
    </section>

    <!-- Plan My Path -->
    <section class="feature-card-section">
      <div class="feature-card">
        <div class="feature-label">⭐ Featured</div>
        <div class="feature-content">
          <div class="feature-text">
            <h2>Plan my path</h2>
            <p>
              Design a walking route that suits your pace, time, and comfort.
              Walk solo, or turn it into a private event and invite friends
              along.
            </p>
            <ul class="check-list">
              <li>
                <span class="check-icon">✓</span> Choose your pace and walking
                time
              </li>
              <li>
                <span class="check-icon">✓</span> Pick scenic parks or quiet
                streets
              </li>
              <li>
                <span class="check-icon">✓</span> Keep it private or invite
                others to join
              </li>
            </ul>
            <a href="#" class="btn-primary">Plan route →</a>
          </div>
          <div class="feature-map">
            <div class="map-visual">
              <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Route path -->
                <path d="M30 140 C60 130, 80 100, 100 80 C120 60, 150 50, 170 30" stroke="#1a7a6e" stroke-width="2.5" stroke-dasharray="6,3" fill="none"/>
                <!-- Start dot -->
                <circle cx="30" cy="140" r="8" fill="#1a7a6e"/>
                <text x="42" y="145" font-size="9" fill="#444">Start</text>
                <!-- Bench stop -->
                <circle cx="110" cy="75" r="5" fill="#fff" stroke="#1a7a6e" stroke-width="2"/>
                <rect x="88" y="82" width="48" height="16" rx="4" fill="#f0f9f8" stroke="#1a7a6e" stroke-width="1"/>
                <text x="92" y="93" font-size="7" fill="#1a7a6e">Bench stop</text>
                <!-- End marker -->
                <rect x="161" y="20" width="18" height="18" rx="4" fill="#e8401c"/>
                <text x="166" y="32" font-size="9" fill="#fff" font-weight="bold">★</text>
                <!-- Route info badge -->
                <rect x="120" y="125" width="72" height="24" rx="6" fill="#fff" stroke="#ddd" stroke-width="1"/>
                <text x="130" y="137" font-size="7" fill="#888">Your route</text>
                <text x="130" y="146" font-size="7.5" fill="#1a7a6e" font-weight="600">25 min · Easy</text>
                <!-- Scatter dots for parks -->
                <circle cx="60" cy="110" r="3" fill="#b2dfdb" opacity="0.7"/>
                <circle cx="140" cy="55" r="4" fill="#b2dfdb" opacity="0.7"/>
                <circle cx="80" cy="90" r="2.5" fill="#b2dfdb" opacity="0.5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Wellness Snapshot -->
    <section class="wellness-section">
      <div class="wellness-inner">
        <p class="section-tag">Start here</p>
        <h2>Wellness snapshot</h2>
        <p class="section-sub">
          Answer a few questions and see where you stand compared to the
          Australian benchmark for adults 65 and over.
        </p>

        <div class="wellness-content">
          <div class="wellness-categories">
            <div class="category thriving">
              <span class="cat-icon">⭐</span>
              <div>
                <strong>Thriving</strong>
                <p>Keep doing what you love</p>
              </div>
            </div>
            <div class="category momentum">
              <span class="cat-icon">📈</span>
              <div>
                <strong>Building momentum</strong>
                <p>On a great upward path</p>
              </div>
            </div>
            <div class="category starting active-cat">
              <span class="cat-icon">🕐</span>
              <div>
                <strong>Just getting started</strong>
                <p>Gentle first steps for you</p>
              </div>
            </div>
          </div>

          <div class="wellness-how">
            <p class="how-title">How it works</p>
            <ol class="steps-list">
              <li>
                <span class="step-num">1</span>
                <div>
                  <strong>Quick questionnaire</strong>
                  <p>Tell us about your activity, sleep, and social connection.</p>
                </div>
              </li>
              <li>
                <span class="step-num">2</span>
                <div>
                  <strong>Get your category</strong>
                  <p>Scored against the Australian benchmark for 65+.</p>
                </div>
              </li>
              <li>
                <span class="step-num">3</span>
                <div>
                  <strong>Exercises made for you</strong>
                  <p>Suggestions that match your starting point.</p>
                </div>
              </li>
            </ol>
            <a href="#" class="btn-primary">Get my snapshot →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Explore Section -->
    <section class="explore-section">
      <div class="explore-inner">
        <p class="section-tag">More to explore</p>
        <h2>Stay active, stay connected</h2>

        <div class="explore-cards">
          <div class="explore-card">
            <div class="explore-card-content">
              <div>
                <h3>Explore events</h3>
                <p>
                  Discover local walks, classes, and meetups happening in your
                  community this week.
                </p>
                <a href="#" class="btn-outline">Find events →</a>
              </div>
              <div class="explore-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="4" y="10" width="56" height="48" rx="6" fill="#e8f5f4" stroke="#1a7a6e" stroke-width="2"/>
                  <rect x="4" y="10" width="56" height="16" rx="6" fill="#1a7a6e"/>
                  <rect x="18" y="4" width="6" height="12" rx="3" fill="#1a7a6e"/>
                  <rect x="40" y="4" width="6" height="12" rx="3" fill="#1a7a6e"/>
                  <circle cx="20" cy="40" r="4" fill="#1a7a6e" opacity="0.5"/>
                  <circle cx="32" cy="40" r="4" fill="#1a7a6e"/>
                  <circle cx="44" cy="40" r="4" fill="#1a7a6e" opacity="0.3"/>
                  <circle cx="20" cy="52" r="4" fill="#1a7a6e" opacity="0.3"/>
                  <circle cx="32" cy="52" r="4" fill="#1a7a6e" opacity="0.5"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="explore-card">
            <div class="explore-card-content">
              <div>
                <h3>Browse exercises</h3>
                <p>
                  All exercises in one place, from gentle stretches to guided
                  strength routines.
                </p>
                <a href="#" class="btn-outline">View all →</a>
              </div>
              <div class="explore-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="2" y="28" width="14" height="8" rx="4" fill="#1a7a6e"/>
                  <rect x="48" y="28" width="14" height="8" rx="4" fill="#1a7a6e"/>
                  <rect x="14" y="24" width="8" height="16" rx="4" fill="#e8401c"/>
                  <rect x="42" y="24" width="8" height="16" rx="4" fill="#e8401c"/>
                  <rect x="22" y="20" width="20" height="24" rx="4" fill="#1a7a6e" opacity="0.15" stroke="#1a7a6e" stroke-width="2"/>
                  <line x1="32" y1="20" x2="32" y2="44" stroke="#1a7a6e" stroke-width="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Footer -->
    <section class="cta-footer">
      <div class="cta-inner">
        <h2>Ready to start your journey?</h2>
        <p>Take the snapshot, plan a walk, invite a friend. All at your own pace.</p>
        <a href="#" class="btn-white">Plan my route →</a>
      </div>
    </section>
  </div>
</template>

<script setup>
// No logic needed for static page
</script>

<style scoped>
/* ---- Tokens ---- */
:root {
  --teal: #1a7a6e;
  --teal-light: #e8f5f4;
  --teal-mid: #2d9e8f;
  --orange: #e8401c;
  --text: #1c2b2a;
  --text-muted: #5a6e6c;
  --bg: #ffffff;
  --border: #e0ece9;
  --font-display: 'Lora', Georgia, serif;
  --font-body: 'DM Sans', 'Helvetica Neue', sans-serif;
}

/* ---- Reset ---- */
* { box-sizing: border-box; margin: 0; padding: 0; }
a { text-decoration: none; }
ul { list-style: none; }

.page {
  font-family: var(--font-body);
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
}

/* ---- Navbar ---- */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.brand {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--teal);
  letter-spacing: -0.02em;
}
.nav-links {
  display: flex;
  gap: 32px;
}
.nav-links a {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 500;
  padding-bottom: 3px;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}
.nav-links a:hover,
.nav-links a.active {
  color: var(--teal);
  border-bottom-color: var(--teal);
}

/* ---- Hero ---- */
.hero {
  background: #f7faf9;
  padding: 64px 24px 60px;
}
.hero-inner {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}
.welcome-badge {
  display: inline-block;
  background: #e8f5f4;
  color: var(--teal);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
  letter-spacing: 0.02em;
  border: 1px solid #c4e0dc;
}
.hero-text h1 {
  font-family: var(--font-display);
  font-size: 2.6rem;
  font-weight: 700;
  color: var(--teal);
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}
.hero-text p {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 28px;
  max-width: 400px;
}
.hero-image {
  background: var(--teal);
  border-radius: 12px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-image span {
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
  font-style: italic;
}

/* ---- Buttons ---- */
.btn-primary {
  display: inline-block;
  background: var(--teal);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s, transform 0.15s;
}
.btn-primary:hover {
  background: var(--teal-mid);
  transform: translateY(-1px);
}
.btn-outline {
  display: inline-block;
  border: 2px solid var(--teal);
  color: var(--teal);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
}
.btn-outline:hover {
  background: var(--teal);
  color: #fff;
}
.btn-white {
  display: inline-block;
  background: #fff;
  color: var(--teal);
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: opacity 0.2s, transform 0.15s;
}
.btn-white:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* ---- Stats ---- */
.stats-bar {
  background: #f0f6f5;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 28px 24px;
}
.stats-inner {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  text-align: center;
}
.stat strong {
  display: block;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--teal);
  font-family: var(--font-display);
  letter-spacing: -0.02em;
}
.stat span {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 2px;
}
.stat.highlight strong {
  color: var(--orange);
}

/* ---- Feature Card ---- */
.feature-card-section {
  padding: 48px 24px;
}
.feature-card {
  max-width: 900px;
  margin: 0 auto;
  background: #f7faf9;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 36px;
}
.feature-label {
  font-size: 0.78rem;
  color: var(--teal);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}
.feature-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}
.feature-text h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--teal);
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}
.feature-text p {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin-bottom: 20px;
}
.check-list {
  margin-bottom: 28px;
}
.check-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--text);
  margin-bottom: 10px;
}
.check-icon {
  width: 22px;
  height: 22px;
  background: var(--teal);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
  line-height: 22px;
  text-align: center;
}
.feature-map {
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.map-visual svg {
  width: 100%;
  height: auto;
}

/* ---- Wellness ---- */
.wellness-section {
  background: #f7faf9;
  padding: 64px 24px;
  text-align: center;
  border-top: 1px solid var(--border);
}
.wellness-inner {
  max-width: 900px;
  margin: 0 auto;
}
.section-tag {
  font-size: 0.78rem;
  color: var(--orange);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.wellness-section h2,
.explore-section h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--teal);
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}
.section-sub {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.65;
  max-width: 480px;
  margin: 0 auto 40px;
}
.wellness-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  text-align: left;
  align-items: start;
}
.wellness-categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.category {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #fff;
}
.category.active-cat {
  background: #fef3f0;
  border-color: #f4b8a8;
}
.cat-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}
.category strong {
  display: block;
  font-size: 0.93rem;
  color: var(--text);
  margin-bottom: 2px;
}
.category p {
  font-size: 0.82rem;
  color: var(--text-muted);
}
.wellness-how {
  text-align: left;
}
.how-title {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 20px;
}
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}
.steps-list li {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.step-num {
  width: 28px;
  height: 28px;
  background: var(--teal);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 700;
  flex-shrink: 0;
  line-height: 28px;
  text-align: center;
}
.steps-list strong {
  display: block;
  font-size: 0.92rem;
  color: var(--text);
  margin-bottom: 3px;
}
.steps-list p {
  font-size: 0.83rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* ---- Explore ---- */
.explore-section {
  padding: 64px 24px;
  text-align: center;
  border-top: 1px solid var(--border);
}
.explore-inner {
  max-width: 900px;
  margin: 0 auto;
}
.explore-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 36px;
  text-align: left;
}
.explore-card {
  background: #f7faf9;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 28px;
  transition: box-shadow 0.2s;
}
.explore-card:hover {
  box-shadow: 0 4px 20px rgba(26,122,110,0.1);
}
.explore-card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.explore-card h3 {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--teal);
  margin-bottom: 8px;
}
.explore-card p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 18px;
}
.explore-icon {
  flex-shrink: 0;
}

/* ---- CTA Footer ---- */
.cta-footer {
  background: var(--teal);
  padding: 72px 24px;
  text-align: center;
}
.cta-inner {
  max-width: 600px;
  margin: 0 auto;
}
.cta-footer h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}
.cta-footer p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.75);
  margin-bottom: 32px;
  line-height: 1.65;
}

/* ---- Responsive ---- */
@media (max-width: 700px) {
  .hero-inner,
  .feature-content,
  .wellness-content,
  .explore-cards {
    grid-template-columns: 1fr;
  }
  .stats-inner {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero-text h1 {
    font-size: 2rem;
  }
  .hero-image {
    height: 160px;
  }
}
</style>