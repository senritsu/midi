import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./components/Home.vue') },
    {
      path: '/gamepad-midi',
      component: () => import('./components/GamepadMidiMapping.vue'),
    },
    {
      path: '/chords',
      component: () => import('./components/ChordsExperiment.vue'),
    },
    {
      path: '/redirect',
      component: () => import('./components/MidiRedirect.vue'),
    },
  ],
})
