// stores/idleTimer.ts
import { defineStore } from 'pinia'
const time = 10 * 60 * 1000;
// const time = 10 * 1000;
export const useIdleTimerStore = defineStore('idleTimer', {
  state: () => ({
    timerId: null as number | null,
    executed: false
  }),
  actions: {
    start(callback: () => void, idleTime = time) {
      this.executed = false

      const resetTimer = () => {
        if (this.timerId) clearTimeout(this.timerId)
        this.timerId = window.setTimeout(() => {
          callback()
          this.executed = true
          this.stop()
        }, idleTime)
      }

      // 이벤트 감지: 모바일 중심
      const events = ['touchstart', 'touchmove', 'scroll']
      const handler = () => {
        if (!this.executed) resetTimer()
      }

      events.forEach(e => window.addEventListener(e, handler))

      // 처음 시작 시 타이머 세팅
      resetTimer()

      // 타이머 종료 시 이벤트 제거
      this.stopHandler = () => {
        events.forEach(e => window.removeEventListener(e, handler))
        if (this.timerId) clearTimeout(this.timerId)
      }
    },
    stop() {
      if (this.stopHandler) this.stopHandler()
      this.timerId = null
    },
    reset(callback: () => void, idleTime = time) {
      this.stop()
      this.start(callback, idleTime)
    },
    stopHandler: null as (() => void) | null
  }
})
