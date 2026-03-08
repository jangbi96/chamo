// src/stores/useMissionStore.ts
import { defineStore } from 'pinia'
function maskKoreanText(text : string) {
    return String(text)
      .split(" ")
      .map((word) => {
        const chars = [...word];
  
        return chars
          .map((char, i) => {
            if (!/[가-힣]/.test(char)) return char; // 한글 아니면 그대로
            return i % 2 === 1 ? "O" : char;       // 홀수 index 마스킹
          })
          .join("");
      })
      .join(" ");
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
            this.restText = maskKoreanText(resData.title.replace(/<\/?b>/gi, ''))
        },
    },
})
