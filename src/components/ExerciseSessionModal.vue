<script setup>
import { ref, computed, onBeforeUnmount, nextTick, watch } from 'vue'

const props = defineProps({
  exercise: {
    type: Object,
    required: true,
    // { name: String, durationMinutes: Number, steps: [{title, image, desc}] }
  },
  inline: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close'])

// ── Timer ──
const timerSecs = ref(0)
let timerInterval = null

const timerDisplay = computed(() => {
  const m = Math.floor(timerSecs.value / 60)
  const s = timerSecs.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

function startTimer() {
  clearInterval(timerInterval)
  timerSecs.value = (props.exercise.durationMinutes ?? 5) * 60
  timerInterval = setInterval(() => {
    if (timerSecs.value > 0) timerSecs.value--
  }, 1000)
}

// ── Pose config ──
const LM = {
  LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_ELBOW:    13, RIGHT_ELBOW:    14,
  LEFT_HIP:      23, RIGHT_HIP:      24,
  LEFT_KNEE:     25, RIGHT_KNEE:     26,
  LEFT_ANKLE:    27, RIGHT_ANKLE:    28,
}

// threshA / labelA = the "resting" stage (angle crosses threshA to enter it)
// threshB / labelB = the "active" stage  (angle crosses threshB to enter it)
// reversed: false → angle must go HIGH (threshA) then LOW (threshB) to count a rep
// reversed: true  → angle must go LOW  (threshA) then HIGH (threshB) to count a rep
const EXERCISE_POSE_CONFIG = {
  'seated forward lean':    { a: LM.LEFT_SHOULDER, b: LM.LEFT_HIP,      c: LM.LEFT_KNEE,         threshA: 148, labelA: 'UPRIGHT',  threshB: 138, labelB: 'LEANING',  reversed: false },
  'seated chest stretch':   { a: LM.LEFT_ELBOW,    b: LM.LEFT_SHOULDER, c: LM.RIGHT_SHOULDER,    threshA: 50,  labelA: 'CLOSED',   threshB: 100, labelB: 'OPEN',     reversed: true  },
  'seated knee extensions': { a: LM.LEFT_HIP,      b: LM.LEFT_KNEE,     c: LM.LEFT_ANKLE,        threshA: 100, labelA: 'BENT',     threshB: 150, labelB: 'EXTENDED', reversed: true  },
  'brisk walking':          { a: LM.LEFT_HIP,      b: LM.LEFT_KNEE,     c: LM.LEFT_ANKLE,        threshA: 160, labelA: 'PLANT',    threshB: 120, labelB: 'STEP',     reversed: false },
  'sit-to-stand':           { a: LM.LEFT_HIP,      b: LM.LEFT_KNEE,     c: LM.LEFT_ANKLE,        threshA: 100, labelA: 'SIT',      threshB: 160, labelB: 'STAND',    reversed: true  },
  'arm raises':             { a: LM.LEFT_HIP,      b: LM.LEFT_SHOULDER, c: LM.LEFT_ELBOW,        threshA: 30,  labelA: 'DOWN',     threshB: 80,  labelB: 'RAISED',   reversed: true  },
  'mini squats':            { a: LM.LEFT_HIP,      b: LM.LEFT_KNEE,     c: LM.LEFT_ANKLE,        threshA: 165, labelA: 'STANDING', threshB: 145, labelB: 'SQUAT',    reversed: false },
  'hold and balance':       { a: LM.LEFT_HIP,      b: LM.LEFT_KNEE,     c: LM.LEFT_ANKLE,        threshA: 165, labelA: 'STANDING', threshB: 145, labelB: 'LIFTED',   reversed: false },
  'standing balance hold':  { a: LM.LEFT_HIP,      b: LM.LEFT_KNEE,     c: LM.LEFT_ANKLE,        threshA: 165, labelA: 'STANDING', threshB: 145, labelB: 'HOLDING',  reversed: false },
}

// ── Camera tips per exercise ──
const EXERCISE_TIPS = {
  'seated forward lean': {
    angle: 'Left side profile',
    instructions: [
      'Sit sideways so your left side faces the camera',
      'Ensure your shoulder, hip and knee are all visible',
      'Keep your back straight at the start position',
      'Camera should be at seat height',
    ],
  },
  'seated chest stretch': {
    angle: 'Front-facing',
    instructions: [
      'Face the camera directly',
      'Both shoulders must be fully visible',
      'Arms visible from shoulder to elbow',
      'Sit about 1.5–2 m from the camera',
    ],
  },
  'seated knee extensions': {
    angle: 'Left side profile',
    instructions: [
      'Sit sideways so your left side faces the camera',
      'Ensure your hip, knee and ankle are all visible',
      'Camera should be at seat height',
      'Keep your thigh still throughout the movement',
    ],
  },
  'brisk walking': {
    angle: 'Left side profile',
    instructions: [
      'Walk parallel to the camera — do not walk toward it',
      'Keep your left side facing the camera',
      'Ensure your full leg (hip to ankle) stays in frame',
      'Camera should be at hip height',
    ],
  },
  'sit-to-stand': {
    angle: 'Left side profile',
    instructions: [
      'Position the chair sideways so your left side faces the camera',
      'Ensure hip, knee and ankle are visible throughout',
      'Camera should be at seat height',
      'Make sure you have clear space to stand fully upright',
    ],
  },
  'arm raises': {
    angle: 'Front-facing',
    instructions: [
      'Face the camera directly',
      'Arms must be fully visible from shoulder to elbow',
      'Stand about 1.5–2 m from the camera',
      'Camera should be at waist/hip height',
    ],
  },
  'mini squats': {
    angle: 'Left side profile',
    instructions: [
      'Stand sideways so your left side faces the camera',
      'Feet shoulder-width apart',
      'Ensure your full leg (hip to ankle) is visible',
      'Camera should be at hip height',
    ],
  },
  'hold and balance': {
    angle: 'Front-facing',
    instructions: [
      'Face the camera directly',
      'Ensure both legs are fully visible',
      'Stand about 1.5–2 m from the camera',
      'Camera should be at waist/hip height',
    ],
  },
  'standing balance hold': {
    angle: 'Front-facing',
    instructions: [
      'Face the camera directly',
      'Ensure both legs are fully visible',
      'Stand about 1.5–2 m from the camera',
      'Camera should be at waist/hip height',
    ],
  },
}

const currentTips = computed(() => EXERCISE_TIPS[props.exercise.name.toLowerCase()] ?? null)

// ── MediaPipe ──
const interactiveMode = ref(false)
const poseLoading     = ref(false)
const cameraError     = ref(null)
const videoEl         = ref(null)
const canvasEl        = ref(null)
const repCount        = ref(0)
const poseStage       = ref(null)
let poseInstance  = null
let cameraStream  = null
let animFrameId   = null

function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  let angle = Math.abs(radians * 180 / Math.PI)
  if (angle > 180) angle = 360 - angle
  return angle
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src; s.crossOrigin = 'anonymous'
    s.onload = resolve; s.onerror = reject
    document.head.appendChild(s)
  })
}

async function loadMediaPipe() {
  await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js')
  await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js')
}

async function startInteractiveMode() {
  interactiveMode.value = true
  poseLoading.value     = true
  cameraError.value     = null
  await nextTick()
  try {
    await loadMediaPipe()
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })
    videoEl.value.srcObject = cameraStream
    await videoEl.value.play()
    poseInstance = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    })
    poseInstance.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 })
    poseInstance.onResults(onPoseResults)
    await poseInstance.initialize()
    poseLoading.value = false
    processFrame()
  } catch (err) {
    poseLoading.value = false
    cameraError.value = err.name === 'NotAllowedError'
      ? 'Camera permission denied. Please allow camera access and try again.'
      : 'Could not start the camera. Please check your device and try again.'
  }
}

async function processFrame() {
  if (!interactiveMode.value || !videoEl.value || videoEl.value.readyState < 2) {
    animFrameId = requestAnimationFrame(processFrame); return
  }
  await poseInstance.send({ image: videoEl.value })
  animFrameId = requestAnimationFrame(processFrame)
}

function onPoseResults(results) {
  const canvas = canvasEl.value
  const video  = videoEl.value
  if (!canvas || !video) return
  canvas.width  = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)
  if (results.poseLandmarks) {
    window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 3 })
    window.drawLandmarks(ctx, results.poseLandmarks, { color: '#FF0000', lineWidth: 1, radius: 4 })

    const cfg = EXERCISE_POSE_CONFIG[props.exercise.name.toLowerCase()]
    if (cfg) {
      const lm = results.poseLandmarks
      const ptA = lm[cfg.a], ptB = lm[cfg.b], ptC = lm[cfg.c]
      if (ptA.visibility > 0.5 && ptB.visibility > 0.5 && ptC.visibility > 0.5) {
        const angle = calculateAngle(ptA, ptB, ptC)
        if (!cfg.reversed) {
          // angle starts high (labelA/resting), drops to labelB (active), returns high = rep
          if (angle > cfg.threshA) { if (poseStage.value === cfg.labelB) repCount.value++; poseStage.value = cfg.labelA }
          if (angle < cfg.threshB) { poseStage.value = cfg.labelB }
        } else {
          // angle starts low (labelA/resting), rises to labelB (active), returns low = rep
          if (angle < cfg.threshA) { if (poseStage.value === cfg.labelB) repCount.value++; poseStage.value = cfg.labelA }
          if (angle > cfg.threshB) { poseStage.value = cfg.labelB }
        }
      }
    }
  }
  ctx.restore()
}

function stopInteractiveMode() {
  interactiveMode.value = false
  cameraError.value     = null
  repCount.value        = 0
  poseStage.value       = null
  cancelAnimationFrame(animFrameId)
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null }
  if (poseInstance) { poseInstance.close(); poseInstance = null }
}

function handleClose() {
  stopInteractiveMode()
  clearInterval(timerInterval)
  emit('close')
}

// Start timer / camera when exercise changes
watch(() => props.exercise, () => {
  stopInteractiveMode()
  if (props.inline) {
    nextTick(() => startInteractiveMode())
  } else {
    startTimer()
  }
}, { immediate: true })

onBeforeUnmount(() => {
  clearInterval(timerInterval)
  stopInteractiveMode()
})
</script>

<template>
  <!-- ── Inline mode: webcam + step panel side by side ── -->
  <template v-if="inline">
    <div v-if="cameraError" class="session-camera-error">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <p>{{ cameraError }}</p>
      <button class="session-interactive-btn" @click="startInteractiveMode">Retry</button>
    </div>
    <div v-else class="session-webcam-view">
      <div class="webcam-with-tips">
        <div class="session-webcam-container">
          <div class="session-webcam-wrap">
            <video ref="videoEl" class="session-webcam-video" autoplay playsinline muted></video>
            <canvas ref="canvasEl" class="session-webcam-canvas"></canvas>
            <div v-if="poseLoading" class="session-webcam-loading">
              <div class="session-webcam-spinner"></div>
              <span>Loading pose model…</span>
            </div>
          </div>
          <div class="pose-counter" v-if="!poseLoading">
            <div class="pose-overlay-label">REPS</div>
            <div class="pose-overlay-value">{{ repCount }}</div>
          </div>
          <div class="pose-stage" v-if="!poseLoading">
            <div class="pose-overlay-label">STAGE</div>
            <div class="pose-overlay-value">{{ poseStage ?? '—' }}</div>
          </div>
        </div>

        <div v-if="currentTips" class="exercise-tips-panel">
          <div class="tips-section">
            <div class="tips-section-title">Angle</div>
            <p class="tips-angle">{{ currentTips.angle }}</p>
          </div>
          <div class="tips-section">
            <div class="tips-section-title">Instructions</div>
            <ul class="tips-list">
              <li v-for="(tip, i) in currentTips.instructions" :key="i">{{ tip }}</li>
            </ul>
          </div>
          <div class="tips-section tips-clothing">
            <div class="tips-section-title">Best Results</div>
            <p class="tips-clothing-text">Wear fitted clothing in a colour that contrasts with your background — e.g. dark top against a light wall — for the most accurate pose detection.</p>
          </div>
        </div>
      </div>
    </div>
  </template>

  <!-- ── Modal mode: full overlay popup (used by Home.vue) ── -->
  <div v-else class="session-overlay" @click.self="handleClose">
    <div class="session-modal">

      <!-- Header -->
      <div class="session-header">
        <h1 class="session-title">{{ exercise.name }}</h1>
        <span class="session-tag" :class="{ 'session-tag-warning': timerSecs <= 30 && timerSecs > 0, 'session-tag-done': timerSecs === 0 }">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{ timerDisplay }}
        </span>
        <button class="session-interactive-btn" @click="startInteractiveMode" v-if="!interactiveMode">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          Interactive Mode
        </button>
        <button class="session-interactive-btn session-interactive-exit" @click="stopInteractiveMode" v-else>
          ✕ Exit Camera
        </button>
        <button class="session-close" @click="handleClose">✕</button>
      </div>

      <!-- Steps grid -->
      <div class="session-steps" v-if="!interactiveMode">
        <div class="session-step" v-for="(step, i) in exercise.steps" :key="i">
          <div class="session-step-subtitle">{{ step.title }}</div>
          <img :src="step.image" :alt="step.title" class="session-step-image" />
          <p class="session-step-desc">{{ step.desc }}</p>
        </div>
      </div>

      <!-- Webcam view -->
      <div class="session-webcam-view" v-else>
        <div v-if="cameraError" class="session-camera-error">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p>{{ cameraError }}</p>
          <button class="session-interactive-btn" @click="stopInteractiveMode">Go back</button>
        </div>
        <div v-else class="session-webcam-container">
          <div class="session-webcam-wrap">
            <video ref="videoEl" class="session-webcam-video" autoplay playsinline muted></video>
            <canvas ref="canvasEl" class="session-webcam-canvas"></canvas>
            <div v-if="poseLoading" class="session-webcam-loading">
              <div class="session-webcam-spinner"></div>
              <span>Loading pose model…</span>
            </div>
          </div>
          <div class="pose-counter" v-if="!poseLoading">
            <div class="pose-overlay-label">REPS</div>
            <div class="pose-overlay-value">{{ repCount }}</div>
          </div>
          <div class="pose-stage" v-if="!poseLoading">
            <div class="pose-overlay-label">STAGE</div>
            <div class="pose-overlay-value">{{ poseStage ?? '—' }}</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="session-footer">
        <button class="session-close-btn" @click="handleClose">Close</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.session-overlay {
  position: fixed; inset: 0; z-index: 700;
  background: rgba(0,0,0,0.55);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.session-modal {
  background: #ede9e1; border-radius: 20px;
  width: 100%; max-width: 860px; max-height: 90vh;
  overflow-y: auto; display: flex; flex-direction: column;
  box-shadow: 0 24px 64px rgba(0,0,0,0.25);
  font-family: 'Poppins', sans-serif;
}
.session-header {
  display: flex; align-items: center; flex-wrap: wrap; gap: 12px;
  padding: 24px 28px 18px;
  border-bottom: 1px solid #e0dbd2;
  background: #ede9e1;
}
.session-title { font-size: 22px; font-weight: 700; color: #0f3d35; margin: 0; }
.session-tag {
  display: flex; align-items: center; gap: 5px;
  border: 1.5px solid #000; border-radius: 8px;
  padding: 6px 14px; font-size: 14px; color: #000;
  font-variant-numeric: tabular-nums; white-space: nowrap;
}
.session-tag-warning { border-color: #c14f4f; color: #c14f4f; }
.session-tag-done    { border-color: #0b5d57; color: #0b5d57; }
.session-interactive-btn {
  display: flex; align-items: center; gap: 6px; margin-left: auto;
  background: #0b5d57; color: #fff; border: none; border-radius: 8px;
  padding: 8px 14px; font-family: 'Poppins', sans-serif;
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: background 0.2s; white-space: nowrap;
}
.session-interactive-btn:hover { background: #0f3d35; }
.session-interactive-exit { background: #7a3a2a; margin-left: 0; }
.session-interactive-exit:hover { background: #5a2a1a; }
.session-close {
  background: none; border: none; font-size: 18px;
  cursor: pointer; color: #666; padding: 4px 8px;
  border-radius: 6px; transition: background 0.2s;
}
.session-close:hover { background: #e0dbd2; color: #333; }

/* Steps grid */
.session-steps { display: flex; gap: 16px; padding: 20px 28px; }
.session-step {
  flex: 1; border-radius: 12px; overflow: hidden;
  background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  display: flex; flex-direction: column;
}
.session-step-subtitle {
  background: #1a5c52; color: #fff;
  font-weight: 700; font-size: 14px;
  text-align: center; padding: 10px 8px;
}
.session-step-image { width: 100%; aspect-ratio: 4/3; object-fit: contain; background: #ffffff; display: block; }
.session-step-desc { font-size: 13px; line-height: 1.55; color: #4a4a4a; padding: 10px 12px; margin: 0; }

/* Webcam */
.session-webcam-view { padding: 20px 28px; }
.webcam-with-tips {
  position: relative;
  display: flex;
  justify-content: left;
  padding-right: 240px;
}
.session-webcam-container { position: relative; width: 100%; max-width: 600px; }

/* Tips panel — pinned to the right edge, no overlap with video */
.exercise-tips-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 500px;
  background: #fff;
  border-radius: 14px;
  padding: 18px 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tips-section-title {
  font-size: 15px;
  font-weight: 700;
  color: #0b5d57;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 7px;
}
.tips-angle {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  background: #e8f4f3;
  border-radius: 8px;
  padding: 8px 12px;
}
.tips-list {
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tips-list li {
  font-size: 15px;
  color: #444;
  line-height: 1.5;
}
.tips-clothing-text {
  font-size: 15px;
  color: #444;
  line-height: 1.55;
  margin: 0;
  background: #fff8e8;
  border-left: 3px solid #e0a020;
  border-radius: 6px;
  padding: 8px 10px;
}
.session-webcam-wrap {
  position: relative; width: 100%; border-radius: 12px;
  overflow: hidden; background: #000; aspect-ratio: 4/3;
  transform: scaleX(-1);
}
.session-webcam-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.session-webcam-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.session-webcam-loading {
  position: absolute; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; color: #fff; font-size: 15px;
  transform: scaleX(-1);
}
.session-webcam-spinner {
  width: 32px; height: 32px;
  border: 3px solid rgba(255,255,255,0.3); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Rep/stage overlays */
.pose-counter {
  position: absolute; top: 10px; right: 10px;
  background: rgba(245,117,16,0.9); border-radius: 10px;
  padding: 6px 14px; text-align: center; min-width: 64px; z-index: 10;
}
.pose-stage {
  position: absolute; bottom: 10px; right: 10px;
  background: rgba(11,93,87,0.9); border-radius: 10px;
  padding: 6px 14px; text-align: center; min-width: 90px; z-index: 10;
}
.pose-overlay-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.8); text-transform: uppercase; }
.pose-overlay-value { font-size: 24px; font-weight: 700; color: #fff; line-height: 1.1; }


.session-camera-error {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 32px; color: #7a3a2a; text-align: center;
}

/* Footer */
.session-footer {
  padding: 16px 28px 24px; border-top: 1px solid #e0dbd2;
  display: flex; justify-content: flex-end;
}
.session-close-btn {
  background: #1a5c52; color: #fff; border: none; border-radius: 10px;
  padding: 12px 32px; font-family: 'Poppins', sans-serif;
  font-size: 15px; font-weight: 600; cursor: pointer;
  transition: background 0.2s;
}
.session-close-btn:hover { background: #0f3d35; }

@media (max-width: 600px) {
  .session-steps { flex-direction: column; padding: 16px; }
  .session-header { padding: 16px; }
  .session-footer { padding: 12px 16px 20px; }
}
</style>
