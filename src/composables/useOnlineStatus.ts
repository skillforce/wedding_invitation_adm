import { onMounted, onUnmounted } from 'vue'
import {
  isOnline,
  startNetworkStatusMonitor,
  stopNetworkStatusMonitor,
} from '@/utils/networkStatus'

export function useOnlineStatus() {
  onMounted(() => {
    startNetworkStatusMonitor()
  })

  onUnmounted(() => {
    stopNetworkStatusMonitor()
  })

  return { isOnline }
}
