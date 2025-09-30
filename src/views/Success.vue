<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import 'vue3-carousel/carousel.css'
import { ref } from 'vue'
</script>

<template>
    <section class="complete">
        <img class="firework" src=".Array./" alt="" />
        <img class="present" src="" alt="" />
        <h1>축하합니다!</h1>
        <p>미션 성공 포인트가 지급되었습니다.</p>
        <button>종료하기</button>
    </section>
</template>

<style scoped lang="scss">
.complete {
    height: 100vh;
    background: #e7f9f4;
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
        width: 90%;
        display: inline-block;
        border-radius: 10px;
    }
}
</style>
