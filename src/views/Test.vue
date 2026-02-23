
<script setup lang="ts">
import { onMounted } from "vue"

function logoutAndGo() {
    // a태그로 하면 새 창이 뜨면서 로그아웃 화면에 머무름
    // window.open 으로하면 로그아웃되면서 네이버 홈으로 이동
//    const link = document.createElement('a')
//     link.href = 'https://nid.naver.com/nidlogin.logout'
//     link.rel = 'noopener noreferrer' // 보안 권장
//     link.target = '_blank'
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
  window.open(
  "https://nid.naver.com/nidlogin.logout",
  "_blank",
  "width=1,height=1,left=-1000,top=-1000"
)
//   location.href = "https://n.news.naver.com/article/215/0001241560"
}
</script>

<template>
<button @click="logoutAndGo">
  네이버 로그아웃 후 이동
</button>

</template>

<style scoped lang="scss">

</style>