import useMidiPortLifecycle from './use-midi-port-lifecycle'

export default function (outputPort) {
  const {connected} = useMidiPortLifecycle(outputPort)

  outputPort.onstatechange = ({ port }) => {
    connected.value = port.state === 'connected'
  }

  return {
    connected,
    sendNoteOn(note, velocity = 127, channel = 0) {
      outputPort.send([0x90 + channel, note, velocity])
    },
    sendNoteOff(note, velocity = 127, channel = 0) {
      outputPort.send([0x80 + channel, note, velocity])
    }
  }
}