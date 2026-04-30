<script setup>
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()
</script>

<template>
  <div class="page">
    <AppNavbar active="check-in" />

    <div class="layout">

      <!-- ── LEFT: Map ── -->
      <div class="map-side">
        <div class="map-card">
          <!-- Journey in progress badge -->
          <div class="progress-badge">
            <span class="pulse-dot"></span>
            JOURNEY IN PROGRESS
          </div>

          <!-- Map illustration -->
          <div class="map-body">
            <svg viewBox="0 0 860 680" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <rect width="860" height="680" fill="#dde8e4"/>

              <!-- Location pin circle -->
              <circle cx="370" cy="252" r="52" fill="white" opacity="0.95" filter="url(#shadow)"/>
              <circle cx="370" cy="252" r="8" fill="#0b5d57"/>
              <!-- pin point -->
              <path d="M 370 260 L 366 270 L 374 270 Z" fill="#0b5d57"/>

              <defs>
                <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.12"/>
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <!-- ── RIGHT: Info panel ── -->
      <div class="info-side">

        <!-- Recommended tag -->
        <div class="recommended-tag">RECOMMENDED</div>

        <!-- Route name -->
        <h1 class="route-name">Lakeside Serenity Walk</h1>

        <!-- Meta -->
        <div class="route-meta">
          <span class="meta-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            1.2km
          </span>
          <span class="meta-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            45 minutes
          </span>
        </div>

        <!-- AI Recommendation card -->
        <div class="ai-card">
          <div class="ai-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0b5d57" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="4"/>
              <line x1="12" y1="2" x2="12" y2="6"/>
              <line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="6" y2="12"/>
              <line x1="18" y1="12" x2="22" y2="12"/>
            </svg>
          </div>
          <div>
            <div class="ai-label">AI Recommendation</div>
            <p class="ai-text">
              This route is perfectly suited for you with frequent rest benches every 200m and a paved level surface based on your preferences.
            </p>
          </div>
        </div>

        <!-- Info items -->
        <div class="info-list">
          <div class="info-item">
            <div class="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0b5d57" stroke-width="1.8">
                <rect x="3" y="7" width="18" height="13" rx="2"/>
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="12" y1="12" x2="12" y2="16"/>
                <line x1="10" y1="14" x2="14" y2="14"/>
              </svg>
            </div>
            <div>
              <div class="info-title">High Accessibility</div>
              <p class="info-desc">Many benches available every 200m for resting.</p>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0b5d57" stroke-width="1.8">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
            </div>
            <div>
              <div class="info-title">Near Cafe Bloom</div>
              <p class="info-desc">Convenient stop for refreshments and accessible restrooms.</p>
            </div>
          </div>
        </div>

        <!-- Route Selected button -->
        <button class="route-selected-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Route Selected
        </button>

      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.page {
  background: #f0f2ef;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  color: #1a2a28;
}

/* ── Two-column layout ── */
.layout {
  display: flex;
  align-items: flex-start;
  gap: 48px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 88px 48px 48px;
  min-height: calc(100vh - 64px);
}

/* ── LEFT MAP ── */
.map-side {
  flex: 1.2;
  min-width: 0;
}

.map-card {
  background: #cdd8d4;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  height: calc(100vh - 160px);
  max-height: 740px;
  min-height: 500px;
}

.map-body {
  width: 100%;
  height: 100%;
}

.map-body svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Journey in progress badge */
.progress-badge {
  position: absolute;
  top: 24px;
  left: 24px;
  background: #0b9a8a;
  color: white;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  padding: 10px 20px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 9px;
  z-index: 10;
  box-shadow: 0 4px 16px rgba(11, 154, 138, 0.35);
}

.pulse-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: white;
  flex-shrink: 0;
  animation: pulse 1.8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}

/* ── RIGHT INFO PANEL ── */
.info-side {
  flex: 0 0 340px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;
}

/* Recommended tag */
.recommended-tag {
  display: inline-block;
  background: #5a2d0c;
  color: white;
  font-size: 11px;
  font-weight: 800;
  padding: 6px 16px;
  border-radius: 999px;
  letter-spacing: 0.07em;
  width: fit-content;
}

/* Route name */
.route-name {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 800;
  color: #0f1f1c;
  line-height: 1.2;
}

/* Meta row */
.route-meta {
  display: flex;
  gap: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: #1a2a28;
}

/* AI card */
.ai-card {
  background: #e4f0ec;
  border-left: 4px solid #0b5d57;
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.ai-icon-wrap {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.ai-label {
  font-size: 14px;
  font-weight: 700;
  color: #0b5d57;
  margin-bottom: 6px;
}

.ai-text {
  font-size: 13px;
  color: #3a5a55;
  line-height: 1.65;
}

/* Info list */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.info-icon {
  width: 42px;
  height: 42px;
  background: #ebebeb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f1f1c;
  margin-bottom: 4px;
}

.info-desc {
  font-size: 13px;
  color: #5a6a66;
  line-height: 1.6;
}

/* Route Selected button */
.route-selected-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #12b89e, #0b9a8a);
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 17px;
  font-weight: 700;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 6px 24px rgba(11, 154, 138, 0.35);
  transition: opacity 0.2s, transform 0.15s;
  margin-top: 4px;
}
.route-selected-btn:hover { opacity: 0.92; transform: translateY(-1px); }

/* ── Responsive ── */
@media (max-width: 900px) {
  .layout {
    flex-direction: column;
    padding: 80px 20px 40px;
    gap: 28px;
  }
  .map-card {
    height: 50vw;
    min-height: 280px;
    max-height: 400px;
  }
  .info-side { flex: none; width: 100%; }
}
</style>