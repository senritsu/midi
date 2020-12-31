<template>
  <div :class="$style.gamepad">
    <h4>
      Gamepad {{ pad.index }}: {{ pad.id }}
      <button v-if="!showDetails" @click="showDetails = true">➕</button>
      <button v-else @click="showDetails = false">➖</button>
    </h4>
    <template v-if="showDetails">
      <div :class="$style.mappings">
        <span v-if="activeMappingIndex > 0">{{ mappingNames[activeMappingIndex - 1] }}</span>
        <button :class="$style.previous" :disabled="activeMappingIndex <= 0" @click="activeMappingIndex--">◀</button>
        <div :class="$style.active">
          <input :value="activeMapping.name" @input="set('name', $event.target.value)" />
          <small>{{ Object.keys(activeMapping).length - 1 }} mappings</small>
        </div>
        <button :class="$style.next" v-if="activeMappingIndex < mappingNames.length - 1" @click="activeMappingIndex++">▶</button>
        <button :class="$style.new" v-else @click="addNewMapping">➕</button>
        <span v-if="activeMappingIndex < mappingNames.length - 1">{{ mappingNames[activeMappingIndex + 1] }}</span>
      </div>
      <div :class="$style.buttons">
        <GamepadButton
          v-for="(button, i) in pad.buttons" :key="i"
          :button="button" :index="i"
          :note="activeMapping[`button-${i}`]"
          @press="onButtonPress(i, $event)"
          @map="onMapButton(i, $event)"
        />
        <p :class="$style.hint">
          Normal note names can be used for mapping, e.g. <strong>C3</strong>, <strong>D#4</strong> or <strong>Ab2</strong>
        </p>
        <p :class="$style.hint">
          Special values <strong>-</strong> and <strong>+</strong> can be used for quick-switching to the previous or next mapping.
        </p>
      </div>
      <div :class="$style.axes">
        <GamepadAxis
          v-for="(value, i) in pad.axes" :key="i"
          :value="value" :index="i"
          :control="activeMapping[`axis-${i}`]"
          @change="onAxisChange(i, $event)"
          @map="onMapAxis(i, $event)"
        />
        <p :class="$style.hint">
          An axis mapped to the special value <strong>velocity</strong> will determine global note velocity, otherwise analog buttons set their own velocity and digital buttons always send max velocity.
        </p>
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
      mappings: [],
      activeMappingIndex: 0,
      velocity: null
    }
  },
  computed: {
    activeMapping () {
      return this.mappings[this.activeMappingIndex]
    },
    mappingNames () {
      return this.mappings.map(x => x.name)
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
      const mapping = this.mappings[this.activeMappingIndex]

      if (!value) {
        delete mapping[key]
      } else {
        mapping[key] = value
      }

      this.persist()

      if (!Object.entries(mapping).some(([key, value]) => key.startsWith('axis') && value === 'velocity')) {
        this.velocity = null
      }
    },
    onButtonPress (index, value) {
      const note = this.activeMapping[`button-${index}`]

      switch (note) {
        case '+': {
          if (this.activeMappingIndex < this.mappings.length - 1) {
            this.activeMappingIndex++
          }
          break
        }
        case '-': {
          if (this.activeMappingIndex > 0) {
            this.activeMappingIndex--
          }
          break
        }
        case undefined: {
          break
        }
        default: {
          const velocity = this.velocity !== null
            ? this.velocity
            : value

          this.$emit('play', { note, velocity })
        }
      }
    },
    onAxisChange (index, value) {
      const control = this.activeMapping[`axis-${index}`]

      if (control === 'velocity') {
        this.velocity = value * 0.5 + 0.5
      }
    },
    addNewMapping () {
      this.mappings.push({ name: 'new' })
      this.activeMappingIndex = this.mappings.length - 1

      this.persist()
    },
    persist () {
      localStorage.setItem(`midi-mappings-${this.pad.id}`, JSON.stringify(this.mappings))
    }
  },
  mounted () {
    const storedMappings = localStorage.getItem(`midi-mappings-${this.pad.id}`)

    this.mappings = storedMappings !== null ? JSON.parse(storedMappings) : [{ name: 'default' }]
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

.mappings {
  margin-bottom: 1em;

  display: grid;
  grid-template-columns: 3fr 1fr 3fr 1fr 3fr;
  align-items: start;
  gap: 0.25em;
}

.mappings > .active {
  grid-column: 3;
  display: flex;
  flex-direction: column;
}

.mappings > .active > input {
  max-width: 14em; /* TODO change when refactoring out control */
}

.mappings > .previous {
  grid-column: 2;
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

.hint {
  grid-column-start: 1;
  grid-column-end: -1;

  margin: 0;
  max-width: 30em; /* TODO change when improving styling */
  justify-self: center;
}
</style>
