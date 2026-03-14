// src/stores/useMissionStore.ts
import { defineStore } from 'pinia'

  function maskText(text: string) {
    if (!text) return "";
  
    const cleaned = String(text).replace(/\s+/g, ""); // 띄어쓰기 제거
  
    return [...cleaned]
      .map((char, i) => (i % 2 === 1 ? "O" : char))
      .join("");
  }
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
            this.restText = maskText(resData.title.replace(/<\/?b>/gi, ''))
        },
    },
})
