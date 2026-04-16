<!-- src/App.vue -->
<template>
  <PasswordGate>
    <router-view></router-view>
  </PasswordGate>
</template>

<script setup>
import { onMounted } from 'vue'
import PasswordGate from './components/PasswordGate.vue'

onMounted(() => {
  if (!sessionStorage.getItem('appLoaded')) {
    localStorage.removeItem('surveyAnswers')
    localStorage.removeItem('surveyResult')
    sessionStorage.setItem('appLoaded', '1')
  }
})
</script>

