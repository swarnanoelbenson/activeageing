<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function beginJourney() {
  router.push('/journey1')
}

function inviteOthers() {
  router.push('/invite')
}

function cancel() {
  router.back()
}
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <h1 class="modal-title">Ready to Go?</h1>
      <p class="modal-sub">Choose how you'd like to experience this route</p>

      <!-- Begin My Journey -->
      <button class="btn-begin" @click="beginJourney">
        <div class="btn-content">
          <div>
            <div class="btn-label">Begin My Journey</div>
            <div class="btn-desc">Start your personalized route now</div>
          </div>
          <span class="btn-arrow">→</span>
        </div>
      </button>

      <!-- Invite Others -->
      <button class="btn-invite" @click="inviteOthers">
        <div class="btn-content">
          <div>
            <div class="btn-label">Invite Others</div>
            <div class="btn-desc">Create an event and walk together</div>
          </div>
          <span class="invite-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Two people icon -->
              <circle cx="10" cy="9" r="4" stroke="#0b5d57" stroke-width="1.8" fill="none"/>
              <path d="M2 22c0-4 3.6-7 8-7" stroke="#0b5d57" stroke-width="1.8" stroke-linecap="round" fill="none"/>
              <circle cx="19" cy="9" r="3" stroke="#0b5d57" stroke-width="1.6" fill="none"/>
              <path d="M19 15c3.5 0 6 2.5 6 6" stroke="#0b5d57" stroke-width="1.6" stroke-linecap="round" fill="none"/>
            </svg>
          </span>
        </div>
      </button>

      <!-- Cancel -->
      <button class="btn-cancel" @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(180, 210, 205, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  font-family: 'Poppins', sans-serif;
}

.modal {
  background: white;
  border-radius: 24px;
  padding: 40px 36px 32px;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-title {
  font-size: 28px;
  font-weight: 800;
  color: #0b3d38;
  text-align: center;
  line-height: 1.15;
}

.modal-sub {
  font-size: 14px;
  color: #6a7a76;
  text-align: center;
  margin-top: -4px;
  margin-bottom: 6px;
}

/* ── Begin button ── */
.btn-begin {
  width: 100%;
  background: #0b5d57;
  border: none;
  border-radius: 14px;
  padding: 20px 24px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-begin:hover { background: #084a45; transform: translateY(-1px); }

/* ── Invite button ── */
.btn-invite {
  width: 100%;
  background: white;
  border: 2px solid #0b5d57;
  border-radius: 14px;
  padding: 20px 24px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-invite:hover { background: #e8f4f0; transform: translateY(-1px); }

/* Shared inner layout */
.btn-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.btn-label {
  font-size: 17px;
  font-weight: 700;
  text-align: left;
  line-height: 1.3;
}

.btn-desc {
  font-size: 13px;
  font-weight: 400;
  text-align: left;
  margin-top: 3px;
  opacity: 0.85;
}

/* Begin button text colours */
.btn-begin .btn-label { color: white; }
.btn-begin .btn-desc  { color: rgba(255,255,255,0.85); }

/* Invite button text colours */
.btn-invite .btn-label { color: #0b3d38; }
.btn-invite .btn-desc  { color: #6a7a76; }

.btn-arrow {
  font-size: 22px;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.invite-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

/* ── Cancel ── */
.btn-cancel {
  background: none;
  border: none;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #6a7a76;
  cursor: pointer;
  padding: 4px 16px;
  margin-top: 2px;
  transition: color 0.2s;
}
.btn-cancel:hover { color: #0b5d57; }

/* ── Responsive ── */
@media (max-width: 480px) {
  .modal { padding: 32px 20px 24px; margin: 0 16px; }
  .modal-title { font-size: 24px; }
}
</style>