// src/stores/useMissionStore.ts
import { defineStore } from 'pinia'

export const useMissionStore = defineStore('mission', {
    state: () => ({
        data: null as any,
        boldText: '',
        restText: '',
    }),
    actions: {
        setData(resData: any) {
            this.data = resData
            this.boldText = resData.workKeyword
            this.restText = resData.title.replace(/<\/?b>/gi, '')
        },
    },
})
