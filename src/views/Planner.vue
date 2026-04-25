<script setup>
</script>

<template>
  <div class="page">

    <!-- Top bar -->
    <div class="topbar">
      <h3>ActiveAgeing</h3>
      <span class="support">Support</span>
    </div>

    <div class="container">

      <!-- Title -->
      <h1>Route Planner</h1>
      <p class="subtitle">
        AI-optimized routes designed for accessibility, comfort, and scenic beauty.
      </p>

      <!-- Main layout -->
      <div class="main">

        <!-- LEFT MAP -->
        <div class="map-card">
          <div class="badge">● AI ROUTE ACTIVE</div>
          <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" />
        </div>

        <!-- RIGHT PANEL -->
        <div class="side-card">
          <div class="tag">RECOMMENDED</div>

          <h2>Lakeside Serenity Walk</h2>
          <p class="meta">📍 1.2km &nbsp; ⏱ 25 mins</p>

          <div class="info">
            <div>
              <strong>High Accessibility</strong>
              <p>Many benches available every 200m for resting.</p>
            </div>

            <div>
              <strong>Near Cafe Bloom</strong>
              <p>Convenient stop for refreshments and restrooms.</p>
            </div>
          </div>

          <button class="btn">Select This Route →</button>
        </div>

      </div>

      <!-- Highlight -->
      <div class="highlight">
        This route is perfectly suited for you with frequent rest benches every 200m and a paved level surface
      </div>

      <!-- Suggestions -->
      <div class="suggestions">
        <div class="header">
          <h3>Other Suggestions</h3>
          <span>View all</span>
        </div>

        <div class="cards">

          <div class="suggest-card">
            <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470" />
            <div>
              <h4>Oak Ridge Trail</h4>
              <p>Shady, level gravel path through the heritage oak grove.</p>
            </div>
            <span class="distance">0.8km</span>
          </div>

          <div class="suggest-card">
            <img src="https://images.unsplash.com/photo-1493244040629-496f6d136cc3" />
            <div>
              <h4>Botanical Loop</h4>
              <p>Fully paved circular route through seasonal gardens.</p>
            </div>
            <span class="distance">1.5km</span>
          </div>

        </div>
      </div>

    </div>

    <!-- Footer -->
    <footer class="footer">
      <h4>ActiveAgeing</h4>
      <p>Privacy Policy · Terms of Service · Accessibility</p>
    </footer>

  </div>
</template>

<style scoped>
.page {
  background: #f6f7f6;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

/* Top */
.topbar {
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
  font-weight: 600;
}

.container {
  max-width: 1100px;
  margin: auto;
  padding: 20px;
}

h1 {
  font-size: 42px;
  color: #0b5d57;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

/* Main layout */
.main {
  display: flex;
  gap: 24px;
}

/* Map */
.map-card {
  flex: 2;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.map-card img {
  width: 100%;
  height: 350px;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
}

/* Side */
.side-card {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 20px;
}

.tag {
  background: #5a2d0c;
  color: white;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 12px;
}

.meta {
  color: #0b5d57;
  margin-bottom: 20px;
}

.info p {
  font-size: 13px;
  color: #555;
}

.btn {
  margin-top: 20px;
  width: 100%;
  padding: 14px;
  background: #0b5d57;
  color: white;
  border-radius: 10px;
  border: none;
}

/* Highlight */
.highlight {
  margin-top: 25px;
  background: #0b5d57;
  color: white;
  padding: 16px;
  border-radius: 12px;
}

/* Suggestions */
.suggestions {
  margin-top: 30px;
}

.header {
  display: flex;
  justify-content: space-between;
}

.cards {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.suggest-card {
  background: white;
  padding: 15px;
  border-radius: 15px;
  display: flex;
  gap: 15px;
  flex: 1;
  align-items: center;
}

.suggest-card img {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  object-fit: cover;
}

.distance {
  margin-left: auto;
  color: #0b5d57;
  font-weight: 600;
}

/* Footer */
.footer {
  text-align: center;
  margin-top: 40px;
  padding: 30px;
  color: #666;
}
</style>