<template>
  <div class="keyboard">
    <ChordKeyboardKey
      v-for="(note, i) in white"
      :key="note"
      :style="{gridArea: `1 / ${1 + 2 * i} / span 2 / span 2`}"
      :active="notes.includes(note)"
    />
    <ChordKeyboardKey
      v-for="(note, i) in black.slice(0, 2)"
      :key="note"
      :style="{gridArea: `1 / ${2 + 2 * i} / span 1 / span 2`}"
      black
      :active="notes.includes(note)"
    />
    <ChordKeyboardKey
      v-for="(note, i) in black.slice(2)"
      :key="note"
      :style="{gridArea: `1 / ${8 + 2 * i} / span 1 / span 2`}"
      black
      :active="notes.includes(note)"
    />
  </div>
</template>

<script>
import ChordKeyboardKey from './ChordKeyboardKey.vue'

export default {
  components: {
    ChordKeyboardKey
  },
  props: {
    notes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    white () {
      return ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(x => x + '4')
    },
    black () {
      return ['C#', 'D#', 'F#', 'G#', 'A#'].map(x => x + '4')
    }
  }
}
</script>

<style scoped>
.keyboard {
  display: grid;
  grid-template-columns: repeat(14, 0.2em);
  grid-template-rows: 0.6em 0.4em;

  place-items: stretch;

  margin: 0.2em;

  border: 1px solid black;
  border-right: none;
}
</style>