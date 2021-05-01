<template>
  <div class="redirect">
    <template v-if="state === 'connected'">
      <h3>Inputs</h3>
      <div class="list">
        <MidiPortRadio
          v-for="input in inputs"
          :key="input.id"
          :port="input"
          v-model="selectedInput"
        />
      </div>

      <h3>Outputs</h3>
      <div class="list">
        <MidiPortRadio
          v-for="output in outputs"
          :key="output.id"
          :port="output"
          v-model="selectedOutput"
        />
      </div>

      <h3>Redirects</h3>

      <textarea
        class="script-input"
        v-model="script"
        rows="20"
        cols="80"
        :placeholder="'# this is a comment\n# each line can contain one redirect\n# channel:note => channel:note\n2:1 => 1:1\n# channel goes from 1 to 16, note goes from 0 to 127\n1:0 => 16:127\n\n# empty lines are ok\n\n10:42 => 5:21'"
      />

      <MidiNoteRedirect
        v-if="selectedInput && selectedOutput"
        :input="inputs[selectedInput]"
        :output="outputs[selectedOutput]"
        :redirects="redirects"
      />
    </template>
    <span v-else-if="state === 'pending'">Trying to connect...</span>
    <span v-else>Error</span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import parseRedirectScript from './parse-redirect-script'
import useWebMidi from './use-web-midi'

import MidiPortRadio from './MidiPortRadio.vue'
import MidiNoteRedirect from './MidiNoteRedirect.vue'

const { state, inputs, outputs } = useWebMidi()

const selectedInput = ref(null)
const selectedOutput = ref(null)

const script = ref('')

const redirects = ref({})

watch(script, (script) => {
  redirects.value = parseRedirectScript(script)
})

watch(selectedInput, (id) => {
  if (!id) return

  const inputName = inputs.value[id].name
  const outputName = outputs.value[selectedOutput.value]?.name

  if (outputName && inputName === outputName) {
    selectedOutput.value = null
  }
})

watch(selectedOutput, (id) => {
  if (!id) return

  const inputName = inputs.value[selectedInput.value]?.name
  const outputName = outputs.value[id].name

  if (inputName && inputName === outputName) {
    selectedInput.value = null
  }
})
</script>

<style scoped>
.redirect {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>