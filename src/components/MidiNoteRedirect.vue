<template>
  <div class="redirect-rule">
    Routing notes from {{ input.name }}
    <div :class="{ indicator: true, on: inputConnected }" />
    to {{ output.name }}
    <div :class="{ indicator: true, on: outputConnected }" />
  </div>
</template>

<script setup="props">
import { defineProps } from 'vue'

import useMidiInput from './use-midi-input'
import useMidiOutput from './use-midi-output'

const props = defineProps({
  input: { type: Object, required: true },
  output: { Object, required: true },
  redirects: { Object, required: true },
})

const { connected: outputConnected, sendNoteOn, sendNoteOff } = useMidiOutput(
  props.output,
)
const { connected: inputConnected } = useMidiInput(props.input, {
  onNoteOn: (note, velocity, channel) => {
    if (channel in props.redirects) {
      if (note in props.redirects[channel]) {
        const [newChannel, newNote] = props.redirects[channel][note]

        sendNoteOn(newNote, velocity, newChannel)
      }
    }
  },
  onNoteOff: (note, velocity, channel) => {
    if (channel in props.redirects) {
      if (note in props.redirects[channel]) {
        const [newChannel, newNote] = props.redirects[channel][note]

        sendNoteOff(newNote, velocity, newChannel)
      }
    }
  },
})
</script>

<style scoped>
.redirect-rule {
  display: flex;
  align-items: baseline;
}

.indicator {
  width: 0.75em;
  height: 0.75em;
  margin: 0.25em;
  border: 1px solid black;
  border-radius: 50%;
  background-color: goldenrod;
}

.indicator.on {
  background-color: lime;
}
</style>