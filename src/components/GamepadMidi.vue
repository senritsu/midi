<template>
  <div :class="$style.page">
    <h2>Gamepad MIDI Input</h2>
    <h3>Pads</h3>
    <div :class="$style.pads">
      <div v-for="(pad, i) in pads" :key="i" :class="$style.pad">
        <template v-if="pad">
          {{ pad.index }}: {{ pad.id }} ({{ pad.buttons.length }} buttons [{{ buttonStates[i].map(x => x ? '🟢' : '🔴').join('') }}], {{ pad.axes.length }} axes)
        </template>
        <span v-else>PAD {{ i }} MISSING</span>
      </div>
    </div>
    <span>Any button press will play C3 on output <strong>{{ activeOutput }}</strong></span>
    <h3>Devices</h3>
    <div :class="$style.devices">
      <div v-for="(device, i) in outputs" :key="i" :class="$style.device">
        Output {{ i }}: {{ device.id }} - {{ device.name }} ({{ device.state }}, {{ device.connection }})
        <button @click="() => {device.playNote('C3'); activeOutput = i}">Play C3 and set as active output</button>
      </div>
    </div>
  </div>
</template>

<script>
import WebMidi from 'webmidi'

export default {
  data () {
    return {
      pads: [],
      buttonStates: [],
      outputs: [],
      activeOutput: 0,
      loop: false
    }
  },
  methods: {
    refreshPads () {
      this.pads = [...navigator.getGamepads()]

      this.buttonStates = Array.from({ length: this.pads })

      this.pads.forEach((pad, i) => {
        if (pad === null) {
          this.buttonStates[i] = []
        } else {
          this.buttonStates[i] = pad.buttons.map(x => x.value)
        }
      })
    },
    refreshButtons () {
      const pads = [...navigator.getGamepads()]

      pads.forEach((pad, i) => {
        if (pad === null) {
          this.buttonStates[i] = []
        } else {
          pad.buttons.forEach((button, j) => {
            const previous = this.buttonStates[i][j]

            if (!previous && button.value) {
              this.outputs[this.activeOutput].playNote('C3', 1, {
                velocity: button.value
              })
            }

            this.buttonStates[i][j] = button.value
          })
        }
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

.pads {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.devices {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.device {
  display: flex;
}
</style>
