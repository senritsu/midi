<template>
  <img alt="Vue logo" src="./assets/logo.png" />

  <h1>Web MIDI API Experiments</h1>

  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/gamepad-midi">Gamepad MIDI</router-link>
    <router-link to="/chords">Chords</router-link>
    <router-link to="/redirect">MIDI Redirect</router-link>
  </nav>

  <router-view class="content" />

  <h5>
    Prototype | source available on
    <a href="https://github.com/senritsu/midi">GitHub</a>
  </h5>
</template>

<script setup>
import GamepadMidiMapping from './components/GamepadMidiMapping.vue'

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  height: 100vh;
  width: 100vw;

  padding-top: 2em;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  flex: 1;
}

img {
  width: 2em;
}

nav {
  display: flex;

  font-size: 2em;
}

nav > a {
  margin: 0.5em;
  text-decoration: none;

  color: gray;

  border-bottom: 1px solid transparent;
  border-top: 1px solid transparent;
}

nav > a.router-link-active {
  color: darkgray;
  border-color: darkgray;
}
</style>
