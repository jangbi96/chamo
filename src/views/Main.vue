<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import 'vue3-carousel/carousel.css'
</script>

<template>
    <section class="section">
        <strong>P</strong>
        <h1 class="main-txt">첫번째 관련태그 찾으면<br />포인트를 드려요.</h1>
        <p class="normal-txt">미션에 참여하고 포인트를 받으세요.</p>
        <div class="black-tit">첫번째 관련태그는?</div>
        <div class="main-visual">
            <img src="../assets/imgs/nav.png" alt="" />
        </div>
        <ul>
            <li>
                <span class="title">1단계</span>
                <div class="circle"></div>
                <span class="b-title">키워드 검색</span>
            </li>
        </ul>
        <div class="foot-btns">
            <button class="prevbtn">이전</button>
            <button class="nextbtn">다음</button>
        </div>
    </section>
</template>

<style scoped lang="scss">
.section {
    background: #f8f8f8;
    padding: 50px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.foot-btns {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 90px;
    background: #fff;
    padding: 20px;
    display: flex;
    gap: 10px;
    z-index: 1;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -6px 18px -8px rgba(0, 0, 0, 0.3);
    button {
        flex-grow: 1;
        height: 100%;
        font-size: 20px;
        border-radius: 10px;
        font-weight: 600;
    }
    .prevbtn {
        background: #f2f2f4;
    }
    .nextbtn {
        background: #04c75b;
        color: #fff;
    }
}
</style>
