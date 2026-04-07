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
  { path: '/contact', name: 'Contact', component: ContactPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router