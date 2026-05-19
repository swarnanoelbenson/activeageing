// src/main.js — Vue application entry point.
// Creates the root app instance, registers the router plugin so <router-view>
// and <router-link> work globally, then mounts into the #app div defined in
// index.html. All per-page logic lives in App.vue and the views; nothing
// else should be bootstrapped here unless it needs to be globally available.
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .mount('#app')
