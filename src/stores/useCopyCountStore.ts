import { defineStore } from 'pinia'

export const useCopyCountStore = defineStore('CopyCount', {
    state: () => ({
        value: 0,
    }),
    actions: {
        setValue(value: number) {
            this.value = value
        },
       
    },
})
