import { createRouter, createWebHistory } from 'vue-router'

import Home from './components/Home.vue'
import GamepadMidiMapping from './components/GamepadMidiMapping.vue'
import ChordsExperiment from './components/ChordsExperiment.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/gamepad-midi', component: GamepadMidiMapping },
    { path: '/chords', component: ChordsExperiment },
    { path: '/redirect', component: () => import('./components/MidiRedirect.vue') },
  ]
})