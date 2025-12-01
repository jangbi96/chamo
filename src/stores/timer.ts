// stores/idleTimer.ts
import { defineStore } from 'pinia'

const DEFAULT_IDLE = 10 * 60 * 1000

export const useIdleTimerStore = defineStore('idleTimer', {
    state: () => ({
        timerId: null as number | null,
        executed: false,
        handler: null as (() => void) | null,
        registered: false, // 이벤트 중복 등록 방지
    }),

    actions: {
        start(callback: () => void, idleTime = DEFAULT_IDLE) {
            this.executed = false

            // 기존 타이머 제거
            if (this.timerId) clearTimeout(this.timerId)

            const resetTimer = () => {
                if (this.timerId) clearTimeout(this.timerId)
                this.timerId = window.setTimeout(() => {
                    callback()
                    this.executed = true
                    this.stop()
                }, idleTime)
            }

            // 이벤트 핸들러 생성 (한 번만)
            if (!this.handler) {
                this.handler = () => {
                    if (!this.executed) resetTimer()
                }
            }

            const events = ['touchstart', 'touchmove', 'scroll']

            // 이벤트를 중복 등록하지 않음
            if (!this.registered) {
                events.forEach((e) => window.addEventListener(e, this.handler!))
                this.registered = true
            }

            // 최초 타이머 설정
            resetTimer()
        },

        stop() {
            const events = ['touchstart', 'touchmove', 'scroll']

            if (this.registered && this.handler) {
                events.forEach((e) => window.removeEventListener(e, this.handler!))
            }
            this.registered = false

            if (this.timerId) clearTimeout(this.timerId)
            this.timerId = null
            this.executed = true
        },

        reset(callback: () => void, idleTime = DEFAULT_IDLE) {
            this.stop()
            this.start(callback, idleTime)
        },
    },
})
