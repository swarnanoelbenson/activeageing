// src/router/index.js — Client-side route definitions for the Vue SPA.
// All views are eagerly imported (no lazy-loading) because the app is small
// enough that a single bundle is faster than per-route code-splitting.

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Survey from '../views/Survey.vue'
import Results from '../views/Results.vue'
import ExerciseSession from '../views/ExerciseSession.vue'
import Celebration from '../views/Celebration.vue'
import EventsPage from '../views/EventsPage.vue'
import BreakPage from '../views/BreakPage.vue'
import HelpPage from '../views/HelpPage.vue'
import TermsPage from '../views/TermsPage.vue'
import PrivacyPage from '../views/PrivacyPage.vue'
import ContactPage from '../views/ContactPage.vue'
import RoutePlan from '../views/RoutePlan.vue'
import SnapshotView from '../views/SnapshotView.vue'
import RouteSurvey from '../views/RouteSurvey.vue'
import Planner from '../views/Planner.vue'
import AllExercisesPage from '../views/AllExercisesPage.vue'

// ── Route table ──
// Grouped loosely by feature area:
//   Wellness check-in: /snapshot → /survey → /results
//   Exercise:          /exercise → /break → /celebration
//   Route planning:    /routeplan → /routesurvey → /planner
//   Community:         /events, /exercises
//   Static/legal:      /help, /terms, /privacy, /contact
const routes = [
  { path: '/', name: 'Home', component: Home },

  // Wellness check-in flow
  { path: '/snapshot', name: 'Snapshot', component: SnapshotView},
  { path: '/survey', name: 'Survey', component: Survey },
  { path: '/results', name: 'Results', component: Results },

  // Exercise session flow
  { path: '/exercise', name: 'ExerciseSession', component: ExerciseSession},
  { path: '/break', name: 'Break', component: BreakPage },
  { path: '/celebration', name: 'Celebration', component: Celebration },

  // Route planning flow
  { path: '/routeplan', name: 'routeplan', component: RoutePlan},
  { path: '/routesurvey', name: 'RouteSurvey', component: RouteSurvey},
  { path: '/planner', name: 'Planner', component: Planner},

  // Community
  { path: '/events', name: 'Events', component: EventsPage },
  { path: '/exercises', name: 'AllExercises', component: AllExercisesPage },

  // Static / legal
  { path: '/help', name: 'Help', component: HelpPage },
  { path: '/terms', name: 'Terms', component: TermsPage },
  { path: '/privacy', name: 'Privacy', component: PrivacyPage },
  { path: '/contact', name: 'Contact', component: ContactPage },
]

const router = createRouter({
  // createWebHistory uses the HTML5 History API so URLs look like /survey
  // instead of /#/survey; requires the server to serve index.html for all paths.
  history: createWebHistory(),
  routes,
  // Reset scroll position to the top on every navigation; 'instant' (not
  // 'smooth') avoids a jarring animated scroll when switching between pages.
  scrollBehavior() {
    return { top: 0, behavior: 'instant' }
  }
})

export default router