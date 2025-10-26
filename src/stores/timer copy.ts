// stores/timer.ts
import { defineStore } from 'pinia'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    startedAt: null as number | null,
    executed: false,
    lastCheckedDate: null as string | null, // YYYY-MM-DD
    timerId: null as number | null, // setTimeout ID
    intervalId: null as number | null // setInterval ID
  }),
  actions: {
    start() {
      if (!this.startedAt) {
        this.startedAt = Date.now()
        this.executed = false
        this.lastCheckedDate = new Date().toISOString().slice(0, 10)
      }
    },
    stop() {
      if (this.timerId) clearTimeout(this.timerId)
      if (this.intervalId) clearInterval(this.intervalId)
      this.timerId = null
      this.intervalId = null
    },
    checkAndRun(callback: () => void) {
      if (this.executed || !this.startedAt) return

      const now = Date.now()
      const elapsed = now - this.startedAt
      const remaining = 10 * 60 * 1000 - elapsed

      // 10분 경과 시 실행
      if (remaining <= 0) {
        callback()
        this.executed = true
        this.stop()
        return
      }

      // 남은 시간만큼 setTimeout
      this.timerId = window.setTimeout(() => {
        callback()
        this.executed = true
        this.stop()
      }, remaining)

      // 날짜 변경 체크용 interval
      this.intervalId = window.setInterval(() => {
        const today = new Date().toISOString().slice(0, 10)
        if (this.lastCheckedDate !== today) {
          callback()
          this.executed = true
          this.lastCheckedDate = today
          this.stop()
        }
      }, 60 * 1000)
    },
    reset() {
      this.stop()
      this.startedAt = null
      this.executed = false
      this.lastCheckedDate = null
    }
  }
})
