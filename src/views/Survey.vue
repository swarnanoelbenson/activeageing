<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// number
const step = ref(1)
const total = 6

// questions and options
const questions = [
  {
    text: 'How often do you currently exercise or do physical activity?',
    options: ['Every day', 'A few times a week', 'Once a week', 'Rarely or never']
  },
  {
    text: 'How would you describe your mobility?',
    options: [
      'I move freely without assistance',
      'I have some limitations but manage well',
      'I need support or aids to move around',
      'N/A'
    ]
  },
  {
    text: 'How long can you comfortably stay active in one session?',
    options: ['Less than 15 minutes', '15 to 30 minutes', '30 to 60 minutes', 'More than 60 minutes']
  },
  {
    text: 'Do you currently experience any of the following?',
    options: ['Joint pain or stiffness', 'Breathlessness during light activity', 'Balance issues', 'None of the above']
  },
  {
    text: 'How would you describe your energy levels on a typical day?',
    options: ['I feel energetic and active', 'I have moderate energy but tire easily', 'I feel tired most of the time', 'N/A']
  },
  {
    text: 'How often do you leave your home for social or physical activities?',
    options: ['Daily', 'A few times a week', 'Once a week or less', 'Rarely or never']
  }
]

// answer
const answers = ref(Array(total).fill(null))

// selectOption
function selectOption(option) {
  answers.value[step.value - 1] = option
  if (step.value < total) {
    step.value++
  } else {
    alert('Survey complete! Your answers: ' + answers.value.join(', '))
    // TODO: to backend
  }
}

// Back
function goBack() {
  if (step.value === 1) {
    router.push({ name: 'Home' })
  } else {
    step.value--
  }
}

function finishSurvey() {
  router.push({ name: 'Results' })
}
</script>

<template>
  <div class="survey-container">
    <!-- Navbar -->
    <header class="navbar">
      <div class="logo">ActiveAgeing</div>
      <nav>
        <a>Home</a>
        <a>Help</a>
      </nav>
    </header>

    <!-- Progress -->
    <div class="progress-section">
      <p>STEP {{ step }} OF {{ total }}</p>
      <div class="progress-bar">
        <div class="progress" :style="{ width: (step / total * 100) + '%' }"></div>
      </div>
      <span>Vitality Assessment</span>
    </div>

    <!-- question -->
    <h1>{{ questions[step - 1].text }}</h1>
    <p class="desc">We want to ensure your journey is safe and comfortable.</p>

    <!-- option -->
    <div class="options">
      <div
        v-for="option in questions[step - 1].options"
        :key="option"
        class="survey-card"
        @click="selectOption(option)"
      >
        {{ option }}
      </div>
    </div>

    <!-- Benefit  -->
    <div class="benefit-box">
      <strong>Benefit</strong>
      <p>
        A simple, guided check-in allows users to quickly reflect on their current activity level without feeling
        overwhelmed. By removing typing and presenting one question at a time, the experience remains accessible
        and encourages completion, enabling the platform to provide relevant and personalised next steps.
      </p>
    </div>

    <!-- Back button -->
    <button class="back-btn" @click="goBack">
      ← {{ step === 1 ? 'Home' : 'Back' }}
    </button>

    <!-- Finish button  -->
    <button
      v-if="step === total"
      class="finish-btn"
      @click="finishSurvey"
    >
      Finish →
    </button>
  </div>
</template>

<style>
body {
  font-family: 'Poppins', sans-serif;
  background: #fbfbfb;
  margin: 0;
}

/* Layout */
.survey-container {
  max-width: 900px;
  margin: auto;
  padding: 40px;
  position: relative;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Progress */
.progress-section {
  margin: 30px 0;
}
.progress-bar {
  height: 8px;
  background: #ddd;
  border-radius: 10px;
  margin: 10px 0;
}
.progress {
  height: 100%;
  background: #0b5d57;
  border-radius: 10px;
}

/* Question */
h1 {
  color: #0b5d57;
}
.desc {
  color: #666;
  margin-bottom: 20px;
}

/* Options */
.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}
.survey-card {
  background: #d1c1c1;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
  text-align: center;
}
.survey-card:hover {
  background: #c14f4f;
  color: white;
}

/* Benefit */
.benefit-box {
  margin-top: 30px;
  background: #fddede;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: #660000;
}
.benefit-box p {
  margin: 10px 0 0 0;
}

/* Finish button */
.finish-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;  
  padding: 10px 20px;
  background: #c14f4f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  z-index: 10;
}
.finish-btn:hover {
  background: #a43b3b;
}

/* Back button */
.back-btn {
  position: fixed; 
  bottom: 20px;
  left: 20px;
  padding: 10px 20px;
  background: #0b5d57;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  z-index: 10;
}
.back-btn:hover {
  background: #074a46;
}
</style>