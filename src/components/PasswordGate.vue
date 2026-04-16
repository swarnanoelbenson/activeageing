<template>
  <div v-if="!unlocked" class="gate">
    <div class="gate-card">
      <div class="gate-logo">ActiveAgeing</div>
      <h2 class="gate-title">Enter Access Code</h2>
      <p class="gate-sub">This site is password protected.</p>

      <div class="gate-input-wrap">
        <input
          v-model="input"
          type="password"
          class="gate-input"
          :class="{ error: failed }"
          placeholder="Enter code"
          maxlength="6"
          @keyup.enter="attempt"
        />
        <p v-if="failed" class="gate-error">Incorrect code. Please try again.</p>
      </div>

      <button class="gate-btn" @click="attempt">Continue →</button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref } from 'vue'

const PASSWORD = 'T4M9KA'

const input    = ref('')
const failed   = ref(false)
const unlocked = ref(sessionStorage.getItem('aa_auth') === '1')

function attempt() {
  if (input.value === PASSWORD) {
    sessionStorage.setItem('aa_auth', '1')
    unlocked.value = true
    failed.value = false
  } else {
    failed.value = true
    input.value = ''
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.gate {
  min-height: 100vh;
  background: #f4f1eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
}

.gate-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 56px 48px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.gate-logo {
  font-size: 18px;
  font-weight: 700;
  color: #0b5d57;
  margin-bottom: 8px;
}

.gate-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f3d35;
  margin: 0;
}

.gate-sub {
  font-size: 14px;
  color: #5a6b67;
  margin: 0 0 8px;
}

.gate-input-wrap {
  width: 100%;
}

.gate-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #d5cfc4;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  letter-spacing: 0.2em;
  text-align: center;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.gate-input:focus { border-color: #0b5d57; }
.gate-input.error  { border-color: #c14f4f; }

.gate-error {
  font-size: 13px;
  color: #c14f4f;
  margin: 8px 0 0;
}

.gate-btn {
  width: 100%;
  background: #0b5d57;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;
}

.gate-btn:hover { background: #0f3d35; }

@media (max-width: 480px) {
  .gate-card { padding: 40px 24px; }
}
</style>
