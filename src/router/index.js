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

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/survey', name: 'Survey', component: Survey },
  { path: '/results', name: 'Results', component: Results },
  { path: '/exercise', name: 'ExerciseSession', component: ExerciseSession},
  { path: '/celebration', name: 'Celebration', component: Celebration },
  { path: '/events', name: 'Events', component: EventsPage },
  { path: '/break', name: 'Break', component: BreakPage },
  { path: '/help', name: 'Help', component: HelpPage },
  { path: '/terms', name: 'Terms', component: TermsPage },
  { path: '/privacy', name: 'Privacy', component: PrivacyPage },
  { path: '/contact', name: 'Contact', component: ContactPage },
  { path: '/routeplan', name: 'routeplan', component: RoutePlan},
  { path: '/snapshot', name: 'Snapshot', component: SnapshotView},
  { path: '/routesurvey', name: 'RouteSurvey', component: RouteSurvey},
  { path: '/planner', name: 'Planner', component: Planner},
  { path: '/exercises', name: 'AllExercises', component: AllExercisesPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'instant' }
  }
})

export default router