<template>
  <div :class="$style.gamepad">
    <h4>
      Gamepad {{ pad.index }}: {{ pad.id }}
      <button v-if="!showDetails" @click="showDetails = true">➕</button>
      <button v-else @click="showDetails = false">➖</button>
    </h4>
    <template v-if="showDetails">
      <span>Active mapping: <strong>{{ activeMappingName }}</strong> ({{ Object.keys(activeMapping).length }} mappings)</span>
      <div :class="$style.buttons">
        <GamepadButton
          v-for="(button, i) in pad.buttons" :key="i"
          :button="button" :index="i"
          :note="activeMapping[`button-${i}`]"
          @press="onButtonPress(i, $event)"
          @map="onMapButton(i, $event)"
        />
      </div>
      <div :class="$style.axes">
        <GamepadAxis
          v-for="(value, i) in pad.axes" :key="i"
          :value="value" :index="i"
          :control="activeMapping[`axis-${i}`]"
          @change="onAxisChange(i, $event)"
          @map="onMapAxis(i, $event)"
        />
      </div>
    </template>
  </div>
</template>

<script>
import GamepadButton from '@/components/GamepadButton.vue'
import GamepadAxis from '@/components/GamepadAxis.vue'

export default {
  components: {
    GamepadButton,
    GamepadAxis
  },
  props: {
    pad: { type: Object, required: true }
  },
  data () {
    return {
      showDetails: false,
      mappings: {},
      activeMappingName: 'default',
      velocity: null
    }
  },
  computed: {
    activeMapping () {
      return this.mappings[this.activeMappingName] || {}
    }
  },
  methods: {
    onMapButton (index, note) {
      const key = `button-${index}`

      this.set(key, note)
    },
    onMapAxis (index, control) {
      const key = `axis-${index}`

      this.set(key, control)
    },
    set (key, value) {
      const mapping = this.mappings[this.activeMappingName] || (this.mappings[this.activeMappingName] = {})

      if (value === null) {
        delete mapping[key]
      } else {
        mapping[key] = value
      }

      localStorage.setItem(`midi-mappings-${this.pad.id}`, JSON.stringify(this.mappings))

      if (!Object.values(mapping).some(x => x === 'velocity')) {
        this.velocity = null
      }
    },
    onButtonPress (index, value) {
      const note = this.activeMapping[`button-${index}`]
      if (note) {
        const velocity = this.velocity !== null
          ? this.velocity
          : value

        this.$emit('play', { note, velocity })
      }
    },
    onAxisChange (index, value) {
      const control = this.activeMapping[`axis-${index}`]

      if (control === 'velocity') {
        this.velocity = value * 0.5 + 0.5
      }
    }
  },
  mounted () {
    const storedMappings = localStorage.getItem(`midi-mappings-${this.pad.id}`)

    this.mappings = storedMappings !== null ? JSON.parse(storedMappings) : {}
  }
}
</script>

<style module>
.gamepad {
  padding: 0.5em;
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
}

.gamepad:not(:last-child) {
  margin-bottom: 0.5em;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
}

.axes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
}
</style>
