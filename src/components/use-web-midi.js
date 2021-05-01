import { ref, onUnmounted } from 'vue'

export default function useWebMidi () {
  const state = ref('pending')
  const inputs = ref({})
  const outputs = ref({})

  onUnmounted(() => {
    Object.values(inputs.value).forEach((port) => {
      port.close()
    })
    Object.values(outputs.value).forEach((port) => {
      port.close()
    })
  })

  const connect = async () => {
    try {
      const midiAccess = await navigator.requestMIDIAccess({
        sysex: false,
      })

      inputs.value = Object.fromEntries(midiAccess.inputs)
      outputs.value = Object.fromEntries(midiAccess.outputs)

      midiAccess.onstatechange = ({ port }) => {
        const lookup = port.type === 'input' ? inputs.value : outputs.value

        if (port.state === 'disconnected' && port.id in lookup) {
          delete lookup[port.id]
        }
        if (port.state === 'connected' && !(port.id in lookup)) {
          lookup[port.id] = port
        }
      }

      state.value = 'connected'
    } catch (error) {
      console.error(`midi access failed: ${error}`)

      state.value = 'error'
    }
  }

  connect()

  return {
    state,
    inputs,
    outputs
  }
}