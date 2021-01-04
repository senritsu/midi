<template>
  <div :class="$style.page">
    <h2>Gamepad MIDI mapping</h2>
    <h5>Prototype | source available on <a href="https://github.com/senritsu/midi">GitHub</a></h5>
    <div :class="$style.columns">
      <div :class="$style.column">
        <h3>Pads</h3>
        <div :class="$style.pads">
          <template v-for="(pad, i) in pads">
            <Gamepad v-if="pad" :key="`pad-${i}`" :pad="pad" @play="onPlay" />
            <span v-else :key="`pad-${i}-disconnected`">PAD {{ i }} DISCONNECTED</span>
          </template>
        </div>
        <br>
        <div :class="$style.help">
          <span>Buttons will send their mapped note (e.g. "C3") to output <strong>{{ activeOutput }}</strong> on press</span>
        </div>
      </div>

      <div :class="$style.column">

        <h3>Devices</h3>
        <div :class="$style.devices">
          <div v-for="(device, i) in outputs" :key="i" :class="$style.device">
            Output {{ i }}: {{ device.id }} - {{ device.name }} ({{ device.state }}, {{ device.connection }})
            <button @click="() => {device.playNote('C3'); activeOutput = i}">Play C3 and set as active output</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WebMidi from 'webmidi'

import Gamepad from '@/components/Gamepad.vue'

const clonePad = pad => {
  if (!pad) return null

  const { id, index, buttons, axes } = pad

  return {
    id,
    index,
    buttons: buttons.map(cloneButton),
    axes: [...axes]
  }
}

const cloneButton = ({ value, pressed }) => ({
  value,
  pressed
})

export default {
  components: {
    Gamepad
  },
  data () {
    return {
      pads: [],
      outputs: [],
      activeOutput: 0,
      loop: false
    }
  },
  methods: {
    refreshPads () {
      this.pads = [...navigator.getGamepads()].map(clonePad)
    },
    refreshButtons () {
      const pads = [...navigator.getGamepads()]

      pads.forEach((pad, i) => {
        if (pad === null) {
          this.pads[i] = null
        } else if (pad !== null && this.pads[i] === null) {
          this.pads[i] = clonePad(pad)
        } else if (this.pads[i] !== null) {
          pad.buttons.forEach((button, j) => {
            this.pads[i].buttons[j].value = button.value
            this.pads[i].buttons[j].pressed = button.pressed
          })
          pad.axes.forEach((value, j) => {
            this.pads[i].axes[j] = value
          })
        }
      })
    },
    onPlay ({ note, velocity }) {
      this.outputs[this.activeOutput].playNote(note, 1, {
        velocity
      })
    },
    tick (t) {
      if (!this.loop) return

      this.refreshButtons()

      requestAnimationFrame(this.tick)
    }
  },
  mounted () {
    window.addEventListener('gamepadconnected', this.refreshPads)
    window.addEventListener('gamepaddisconnected', this.refreshPads)

    WebMidi.enable(error => {
      if (error) {
        console.error(error)
      } else {
        // this.inputs = WebMidi.inputs
        this.outputs = WebMidi.outputs
      }
    })

    this.loop = true
    requestAnimationFrame(this.tick)
  },
  unmounted () {
    window.removeEventListener('gamepadconnected', this.refreshPads)
    window.removeEventListener('gamepaddisconnected', this.refreshPads)

    this.loop = false
  }
}
</script>

<style module>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.columns {
  display: flex;
  width: 100%;
}

.column {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 2em;
}
.column:not(:last-child) {
  border-right: 1px solid #d5d5d5;
}

.pads {
  display: flex;
  flex-direction: column;
}
.devices {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.device {
  display: flex;
}

.help {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.help > span {
  text-align: left;
  margin-bottom: 0.5em;
}
</style>
