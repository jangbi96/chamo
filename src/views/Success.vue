<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import 'vue3-carousel/carousel.css'
import { ref } from 'vue'
const close = () => {
    // window.location.href = 'about:blank'
    // window.open('', '_self').close()
    window.close()
}
</script>

<template>
    <section class="complete">
        <h1>축하합니다</h1>
        <p>
            미션 성공 포인트가<br />
            지급되었습니다.
        </p>
        <div class="obs">
            <transition name="fade-slide" appear>
                <img class="firework" src="../assets/imgs/firework.png" alt="" />
            </transition>

            <transition name="fade-slide" appear>
                <img class="present" src="../assets/imgs/present.png" alt="" />
            </transition>

            <transition name="fade-drop" appear>
                <img class="coin" src="../assets/imgs/ic_coin.png" alt="" />
            </transition>
        </div>

        <button class="end" @click="close">종료하기</button>
    </section>
</template>

<style scoped lang="scss">
.complete {
    height: 100vh;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding-top: 100px;
    button {
        width: 90%;
        display: inline-block;
        border-radius: 10px;
        background: #03cc64;
        color: #fff;
        padding: 15px 0;
        font-weight: 500;
        font-size: 25px;
        position: fixed;

        bottom: 20px;
    }
    h1 {
        color: #04c75b;
        font-weight: 700;
        font-size: 45px;
        margin-bottom: 10px;
    }
    p {
        font-size: 22px;
        color: #989898;
        text-align: center;
        line-height: 1.4;
        margin-bottom: 20px;
    }
}

.firework {
    width: 250px;
    position: relative;
    top: 30px;
}
.present {
    width: 250px;
    position: relative;
}
.coin {
    position: absolute;
    width: 130px;
    z-index: 1;
    top: 90px;
}
.obs {
    @include flex();
    flex-direction: column;
    position: relative;
    img {
        margin: 0 auto;
    }
}

/* ---------------------------
  폭죽 + 선물 (fade-slide)
--------------------------- */
.fade-slide-enter-active {
    transition: all 0.8s ease-out;
}
.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}
.fade-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.fade-drop-enter-active {
    transition: all 0.5s 0.5s ease-out;
}
.fade-drop-enter-from {
    opacity: 0;
    transform: translateY(-40px);
}
.fade-drop-enter-to {
    opacity: 1;
    transform: translateY(0);
}

/* .drop-enter-from {
    opacity: 0;
    transform: translateY(-120px);
}

.drop-enter-active {
    animation: drop 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    animation-delay: 0.4s;
}

.drop-enter-to {
    opacity: 1;
    transform: translateY(0);
}

@keyframes drop {
    0% {
        opacity: 0;
        transform: translateY(-120px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
} */
</style>
