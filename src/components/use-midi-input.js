import useMidiPortLifecycle from './use-midi-port-lifecycle'

export default function (inputPort, {
  onNoteOn, 
  onNoteOff,
  onCC,
  onPitchBend
}) {
  const {connected} = useMidiPortLifecycle(inputPort)
  
  inputPort.onmidimessage = (event) => {
    const [command, data1, data2] = event.data
    // const timestamp = event.timeStamp // relative to document load, like window.performance.now()

    console.log({command, data1, data2})

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
    // CC
    if (onCC && command >= 0xB0 && command < 0xC0) {
      const channel = command - 0xB0
      const controller = data1
      const value = data2

      onCC(controller, value, channel)
    }
    // pitch bend
    if (onPitchBend && command >= 0xE0 && command < 0xF0) {
      const channel = command - 0xE0
      const lsb = data1
      const msb = data2

      onPitchBend(lsb, msb, channel)
    }
  }
  
  return {
    connected
  }
}