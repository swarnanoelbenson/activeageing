<!-- src/App.vue -->
<!--
  APP ROOT
  The single entry point that Vue mounts into index.html. All pages are
  rendered here via <router-view> — this file itself has no visible UI.

  On first load (detected via sessionStorage 'appLoaded' flag), stale survey
  data is cleared from localStorage so returning users always start the
  check-in fresh rather than seeing old results from a previous session.
  The flag is session-scoped so navigating between pages doesn't re-clear it.
-->
<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Session-scoped guard: runs once per browser tab, not on every navigation.
  // Without this, navigating back to the home page mid-session would wipe
  // the survey results the user just completed.
  if (!sessionStorage.getItem('appLoaded')) {
    localStorage.removeItem('surveyAnswers')
    localStorage.removeItem('surveyResult')
    sessionStorage.setItem('appLoaded', '1')
  }
})
</script>

