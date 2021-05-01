import useMidiPortLifecycle from './use-midi-port-lifecycle'

export default function (inputPort, {
  onNoteOn, 
  onNoteOff
}) {
  const {connected} = useMidiPortLifecycle(inputPort)
  
  inputPort.onmidimessage = (event) => {
    const [command, data1, data2] = event.data
    // const timestamp = event.timeStamp // relative to document load, like window.performance.now()

    // note on
    if (onNoteOn && command >= 0x90 && command < 0xa0) {
      const channel = command - 0x90
      const note = data1
      const velocity = data2

      onNoteOn(note, velocity, channel)
    }
    // note off
    if (onNoteOff && command >= 0x80 && command < 0x90) {
      const channel = command - 0x80
      const note = data1
      const velocity = data2

      onNoteOff(note, velocity, channel)
    }
  }
  
  return {
    connected
  }
}