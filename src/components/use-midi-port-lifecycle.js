import { ref, onUnmounted } from 'vue'

export default function (port) {
  port.open()

  onUnmounted(() => {
    port.close()
  })

  const connected = ref(port.state === 'connected')

  port.onstatechange = ({ port }) => {
    connected.value = port.state === 'connected'
  }
  
  return {
    connected
  }
}