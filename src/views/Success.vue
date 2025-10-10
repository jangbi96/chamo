<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import 'vue3-carousel/carousel.css'
import { ref } from 'vue'
</script>

<template>
    <section class="complete">
        <transition name="fade-slide" appear>
            <img class="firework" src="../assets/imgs/firework.png" alt="" />
        </transition>
        <transition name="fade-slide-delay" appear>
            <img class="present" src="../assets/imgs/present.png" alt="" />
        </transition>
        <h1>축하합니다!</h1>
        <p>미션 성공 포인트가 지급되었습니다.</p>
        <button class="end">종료하기</button>
    </section>
</template>

<style scoped lang="scss">
.complete {
    height: 100vh;
    background: #e7f9f4;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    button {
        width: 90%;
        display: inline-block;
        border-radius: 10px;
        background: #000;
        color: #fff;
        padding: 10px 0;
        font-size: 18px;
        position: fixed;

        bottom: 20px;
    }
    h1 {
        color: #04c75b;
        font-weight: 600;
        font-size: 40px;
        margin: 20px 0 10px;
    }
    p {
        font-size: 18px;
    }
}

.firework {
    width: 50%;
}
.present {
    margin: 30px 0 40px 0;
    width: 60%;
    position: relative;
    left: -10px;
}

.fade-slide-enter-active {
    transition: all 1s ease;
}
.fade-slide-leave-active {
    transition: all 1s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(-40px); /* 위에서 시작 */
}
.fade-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-40px);
}

.fade-slide-delay-enter-active {
    transition: all 1s 0.2s ease;
}
.fade-slide-delay-leave-active {
    transition: all 1s 0.2s ease;
}

.fade-slide-delay-enter-from {
    opacity: 0;
    transform: scale(0.5);
}
.fade-slide-delay-enter-to {
    opacity: 1;
    transform: scale(1);
}

.fade-slide-delay-leave-from {
    opacity: 1;
    transform: scale(1);
}
.fade-slide-delay-leave-to {
    opacity: 0;
    transform: scale(0.5);
}
</style>
