<!-- src/App.vue -->
<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (!sessionStorage.getItem('appLoaded')) {
    localStorage.removeItem('surveyAnswers')
    localStorage.removeItem('surveyResult')
    sessionStorage.setItem('appLoaded', '1')
  }
})
</script>