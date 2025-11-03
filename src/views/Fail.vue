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
        <h1>참여할 수 있는<br />미션이 없어요.😥</h1>
        <p>잠시 후 다시 시도해주세요</p>
        <div class="obs">
            <img src="../assets/imgs/box.png" />
        </div>
        <button class="end" @click="close">이전 화면으로 돌아가기</button>
    </section>
</template>

<style scoped lang="scss">
.complete {
    height: 100vh;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // padding-top: 100px;

    button {
        width: 90%;
        display: inline-block;
        border-radius: 10px;
        background: #03cc64;
        color: #fff;
        padding: 15px 0;
        font-weight: 500;
        font-size: 21px;

        position: fixed;
        bottom: 5%;
    }

    h1 {
        color: #04c75b;
        font-weight: 700;
        font-size: 35px;
        text-align: center;
        margin-bottom: 10px;
        line-height: 1.1;
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
        width: 70%;
    }
}
</style>
