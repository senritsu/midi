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

const {
  connected: outputConnected,
  sendNoteOn,
  sendNoteOff,
  sendCC,
  sendPitchBend,
} = useMidiOutput(props.output)
const { connected: inputConnected } = useMidiInput(props.input, {
  onNoteOn: (note, velocity, channel) => {
    if (!props.redirects[channel] || !props.redirects[channel][note]) {
      return
    }

    const [newChannel, newNote] = props.redirects[channel][note]

    sendNoteOn(newNote, velocity, newChannel)
  },
  onNoteOff: (note, velocity, channel) => {
    if (!props.redirects[channel] || !props.redirects[channel][note]) {
      return
    }

    const [newChannel, newNote] = props.redirects[channel][note]

    sendNoteOff(newNote, velocity, newChannel)
  },
  onCC: (controller, value, channel) => {
    if (
      !props.redirects.cc[channel] ||
      !props.redirects.cc[channel][controller]
    ) {
      return
    }

    const [newChannel, newController] = props.redirects.cc[channel][controller]

    sendCC(newController, value, newChannel)
  },
  onPitchBend: (lsb, msb, channel) => {
    if (!props.redirects.pb[channel]) {
      return
    }

    const newChannel = props.redirects.pb[channel]

    console.log({ lsb, msb, channel })

    sendPitchBend(lsb, msb, newChannel)
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