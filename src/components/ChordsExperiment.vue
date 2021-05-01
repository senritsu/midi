<template>
  <div :class="$style.page">
    <h2>Chord progression practice</h2>

    <p>COMING SOON</p>
    <em>meanwhile, all chords in C major with tonic C4</em>

    <div :class="$style.chords">
      <template v-for="(chord, i) in chords" :key="i">
        <strong>{{ chord.symbol }}</strong>
        <span :class="$style.notes">{{ chord.notes.join(', ') }}</span>
        <ChordKeyboard :notes="chord.notes" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { Scale } from '@tonaljs/tonal'
import { Chord } from '@tonaljs/tonal'

import ChordKeyboard from './ChordKeyboard.vue'

const chords = Scale.scaleChords('C4 major').map((chord) =>
  Chord.getChord(chord, 'C4'),
)
</script>

<style module>
.page {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.chords {
  display: grid;
  align-items: center;
  justify-items: start;
  grid-template-columns: auto auto auto;
}

.notes {
  margin-left: 1em;
}
</style>