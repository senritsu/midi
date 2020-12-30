<template>
  <div :class="$style.gamepad">
    <h4>
      Gamepad {{ pad.index }}: {{ pad.id }}
      <button v-if="!showDetails" @click="showDetails = true">➕</button>
      <button v-else @click="showDetails = false">➖</button>
    </h4>
    <div v-if="showDetails" :class="$style.buttons">
      <GamepadButton
        v-for="(button, i) in pad.buttons" :key="i"
        :button="button" :index="i"
        :note="buttonMapping[i]"
        @press="onPress(i, $event)"
        @map="onMap(i, $event)"
      />
    </div>
    <div v-if="showDetails" :class="$style.axes">
      <GamepadAxis v-for="(value, i) in pad.axes" :key="i" :value="value" :index="i" />
    </div>
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
      buttonMapping: {}
    }
  },
  methods: {
    onMap (index, note) {
      if (note) {
        this.buttonMapping[index] = note
      } else {
        delete this.buttonMapping[index]
      }
    },
    onPress (index, value) {
      if (this.buttonMapping[index]) {
        this.$emit('play', { note: this.buttonMapping[index], velocity: value })
      }
    }
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
