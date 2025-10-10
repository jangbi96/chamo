<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import 'vue3-carousel/carousel.css'
const router = useRouter()

const active1 = ref(false)
const active2 = ref(false)

const isCopy = ref(false)
const afterCopy = ref(false)

const startMission = ref(false)
function showMessage() {
    isCopy.value = true
    afterCopy.value = true
    // 2초 후에 자동으로 사라짐
    setTimeout(() => {
        isCopy.value = false
    }, 2000)
}
</script>

<template>
    <section class="section">
        <strong class="poi">P</strong>
        <h1 class="main-txt">
            <em>첫번째 관련태그</em> 찾으면<br />포인트를 드려요.
        </h1>
        <p class="normal-txt">미션에 참여하고 포인트를 받으세요.</p>
        <div class="black-tit">첫번째 관련태그는?</div>
        <div class="main-visual">
            <img src="../assets/imgs/nav.png" alt="" />
        </div>
        <ul class="howto-step">
            <li>
                <span class="title">1단계</span>
                <div class="circle">
                    <img src="/src/assets/icons/ic-step1.svg" />
                </div>
                <span class="b-title">키워드 검색</span>
            </li>
            <li>
                <span class="title">2단계</span>
                <div class="circle">
                    <img src="/src/assets/icons/ic-step2.svg" />
                </div>
                <span class="b-title">상품 찾기</span>
            </li>
            <li>
                <span class="title">3단계</span>
                <div class="circle">
                    <img src="/src/assets/icons/ic-step3.svg" />
                </div>
                <span class="b-title">관련태그 찾기</span>
            </li>
        </ul>
        <div
            class="w-box"
            @click="() => (active1 = !active1)"
            :class="{ active: active1 }"
        >
            <em>Q1</em>
            관련 태그 찾는 방법
            <img src="../assets/icons/arrow-more.svg" alt="" />
        </div>
        <div class="active-content" v-show="!!active1">
            <ul>
                <li>미션 힌트를 보고 상품을 찾아주세요.</li>
                <li>
                    상품에 들어간 후 '상세정보 펼쳐보기'버튼을 누르고 아래로
                    내리면 <em>'첫번째 태그'</em>가 있습니다.
                </li>
            </ul>
            <img src="../assets/imgs/howto1.png" alt="" />
        </div>
        <div
            class="w-box"
            @click="() => (active2 = !active2)"
            :class="{ active: active2 }"
        >
            <em>Q2</em>
            상품이 미션힌트의 순위에 보이지 않아요
            <img src="../assets/icons/arrow-more.svg" alt="" />
        </div>
        <div class="active-content" v-show="!!active2">
            <ul>
                <li>
                    미션 힌트의 순위에 상품이 보이지 않으면
                    <em>'가격비교 더보기'</em>버튼을 클릭하여 미션 상품을
                    찾아주세요.
                </li>
                <li>
                    그래도 못 찾겠다면,
                    <em>'새로고침'하여 다른 상품으로 변경 후</em>참여해주세요.
                </li>
            </ul>
            <img src="../assets/imgs/howto2.png" alt="" />
        </div>
        <div class="foot-btns" :class="{ showInput: startMission }">
            <template v-if="!afterCopy">
                <button class="prevbtn" @click="() => router.push('/howto')">
                    참여방법보기
                </button>
                <button class="nextbtn" @click="showMessage">
                    키워드 복사하기
                </button>
            </template>
            <template v-else-if="showMessage && !startMission">
                <button class="prev" @click="afterCopy = false">이전</button>
                <button class="start" @click="startMission = true">
                    미션 시작하기
                </button>
            </template>

            <template v-if="startMission">
                <input type="text" class="input" />
                <button class="change">미션 상품 변경</button>
                <button class="send" @click="router.push('/success')">
                    정답 제출
                </button>
            </template>
        </div>
        <!-- <div class="toast">키워드 복사 완료!</div> -->

        <transition name="fade-out-only">
            <div class="toast" v-if="isCopy">키워드 복사 완료!</div>
        </transition>
        <span class="rest" :class="{ startMission: startMission }"
            >남은 참여 횟수: 1</span
        >
    </section>
</template>

<style scoped lang="scss">
.section {
    background: #f8f8f8;
    padding: 50px 0 150px 0;
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
    /* height: 90px; */
    background: #fff;
    padding: 20px;
    display: flex;
    gap: 10px;
    z-index: 1;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -6px 18px -8px rgba(0, 0, 0, 0.3);
    &.showInput {
        flex-wrap: wrap;
    }
    button {
        flex-grow: 1;
        height: 100%;
        font-size: 20px;
        border-radius: 10px;
        font-weight: 500;
        padding: 13px 0;
    }
    .prevbtn {
        background: #f2f2f4;
    }
    .nextbtn {
        background: #006bff;
        color: #fff;
    }
    .prev {
        flex-grow: 4;
        background: #f2f2f4;
    }
    .start {
        flex-grow: 5;
        background: #04c75b;
        color: #fff;
    }
    .input {
        width: 100%;
        background: rgba(4, 199, 91, 0.1);
        height: 50px;
        border-radius: 10px;
        padding-left: 20px;
        font-size: 20px;
    }
    .send {
        flex-grow: 1;
        background: #04c75b;
        color: #fff;
    }
    .change {
        background: #f2f2f4;
        flex-grow: 1;
    }
}
.poi {
    font-size: 35px;
    font-weight: 500;
    border-radius: 50%;
    border: 2px solid #04c75b;
    background: #d6fce5;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #04c75b;
}
.main-txt {
    text-align: center;
    font-weight: 600;
    margin: 25px 0 15px 0;
    line-height: 1.2;
    em {
        color: #04c75b;
    }
}
.normal-txt {
    color: #70747e;
    margin-bottom: 25px;
}

.black-tit {
    display: inline-block;
    font-weight: 500;
    background: #000;
    color: #fff;
    border-radius: 35px;
    padding: 11px 15px 11px 45px;
    font-size: 21px;
    margin-bottom: 30px;
    position: relative;
    &::before {
        content: 'Q';
        color: #000;
        display: inline-block;
        background: #fff;
        position: absolute;
        font-size: 24px;
        font-weight: 600;
        width: 30px;
        height: 30px;
        @include flex();
        border-radius: 50%;
        left: 7px;
        top: 50%;
        transform: translateY(-50%);
    }
}
.main-visual {
    width: 90%;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    padding: 15px 20px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    @include flex();
    margin-bottom: 15px;
}
.howto-step {
    display: flex;
    width: calc(100% - 40px);
    justify-content: space-between;
    margin-bottom: 20px;

    li {
        @include flex();
        flex-direction: column;
        .title {
            width: 70px;
            font-size: 15px;
            padding: 5px 0;
            font-weight: 500;
            text-align: center;
            background: #fff;
            border-radius: 30px;
            position: relative;
            top: 12px;
            box-shadow: 0px 0px 13px 0px rgba(3, 108, 253, 0.4);
        }
        &:first-child {
            .circle {
                background: #539bf2;
            }
            .b-title,
            .title {
                color: #539bf2;
            }
        }
        &:nth-child(2) {
            margin: 0 20px;
            .circle {
                background: #1580ea;
            }
            .b-title,
            .title {
                color: #1580ea;
            }
        }
        &:last-child {
            .circle {
                background: #006bff;
            }
            .b-title,
            .title {
                color: #006bff;
            }
        }
        .circle {
            border-radius: 50%;
            width: 80px;
            height: 80px;
            @include flex();
            img {
                width: 50%;
            }
        }
    }
    .b-title {
        font-weight: 500;
        margin-top: 10px;
    }
}

.w-box {
    width: 90%;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 10px;
    padding: 15px;
    font-size: 16px;
    margin-bottom: 10px;
    position: relative;
    z-index: 1;

    img {
        width: 8px;
        display: inline-block;
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
    }
    &.active {
        color: #04c75b;
        img {
            transform: translateY(-50%) rotate(90deg);
        }
    }
    em {
        font-weight: 500;
        color: #04c75b;
        margin-right: 10px;
    }
}
.active-content {
    width: calc(100% - 40px);
    top: -15px;
    position: relative;
    img {
        width: 70%;
        display: block;
        margin: 0 auto;
    }
    ul {
        margin-bottom: 20px;
        background: #dcefe3;
        border-radius: 0 0 10px 10px;
        padding: 20px 15px 10px 15px;
        li {
            font-size: 15px;
            margin-bottom: 10px;
            text-indent: -13px;
            padding-left: 15px;
            line-height: 1.3;
            &::before {
                content: '';
                display: inline-block;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #000;
                position: relative;
                top: -4px;
                margin-right: 7px;
            }
            em {
                color: #04c75b;
            }
        }
    }
}
.toast {
    position: fixed;
    bottom: 110px;
    color: #fff;
    background: #000;
    padding: 10px 15px 10px 35px;
    z-index: 2;
    border-radius: 30px;
    background: url('../assets/icons/check.svg') no-repeat left 10px center #000;
    background-size: 15px;
}
.rest {
    box-shadow: 0px 0px 12px 2px rgba(4, 199, 91, 0.8);
    position: fixed;
    bottom: 100px;
    right: 20px;
    color: #fff;
    background: #04c75b;
    padding: 10px;
    z-index: 1;
    border-radius: 10px;
    &.startMission {
        bottom: 160px;
    }
}
.fade-out-only-enter-active {
    transition: none;
}

/* 사라질 때만 opacity 애니메이션 적용 */
.fade-out-only-leave-active {
    transition: opacity 0.8s ease;
}
.fade-out-only-leave-from {
    opacity: 1;
}
.fade-out-only-leave-to {
    opacity: 0;
}
</style>
