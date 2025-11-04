// src/stores/useMissionStore.ts
import { defineStore } from 'pinia'

export const useShowvideoStore = defineStore('video', {
    state: () => ({
        novideo: false,
    }),
    actions: {
        setData(a: boolean) {
            this.novideo = a
        },
    },
})
