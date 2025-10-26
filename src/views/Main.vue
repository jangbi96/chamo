<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import 'vue3-carousel/carousel.css'
import axios from 'axios'

const videoUrls = [
    'http://lightning.ai.kr.s3.ap-northeast-2.amazonaws.com/introduction1.mp4',
    'http://lightning.ai.kr.s3.ap-northeast-2.amazonaws.com/introduction2.mp4',
    'http://lightning.ai.kr.s3.ap-northeast-2.amazonaws.com/introduction3.mp4',
]

const videoTrigger = ref(0)
const router = useRouter()
const route = useRoute()
const active1 = ref(false)
const active2 = ref(false)

const isCopy = ref(false)

const startMission = ref(0)
const inputValue = ref('')
const wrong = ref(false)
const test = ref(false)
const domref = ref<HTMLElement | null>(null)

const data = ref()

axios
    .get('https://jsonplaceholder.typicode.com/todos/1')
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err))

async function showMessage() {
    try {
        await navigator.clipboard.writeText('sdfsdf')
        isCopy.value = true
        startMission.value = 2
        // 2초 후에 자동으로 사라짐
        setTimeout(() => {
            isCopy.value = false
        }, 1000)
    } catch (error) {}
}

function nextVideo() {
    videoTrigger.value = videoTrigger.value + 1
}
const triggerError = () => {
    wrong.value = true
    // 애니메이션 다시 실행되게 잠시 후 클래스 제거
    inputValue.value = ''
    setTimeout(() => {
        wrong.value = false
        test.value = true
        domref.value?.focus()
    }, 500)
}
onMounted(() => {
    if (route.query.mission) {
        startMission.value = 1
    }
})
</script>

<template>
    <section class="section">
        <div class="video-sec" v-show="videoTrigger < 3">
            <video
                v-for="(url, i) in videoUrls"
                :key="url"
                v-show="i === videoTrigger"
                :src="url"
                muted
                autoplay
                @click="nextVideo"
                :class="['video-item', { active: i === videoTrigger }]"
            ></video>
        </div>
        <strong class="poi"
            ><img class="coinimg" src="../assets/imgs/mini-coin.png" />선착순 미션</strong
        >
        <h1 class="main-txt">
            첫번째 관련태그 찾고<br />
            <em>포인트 받기</em>
        </h1>
        <template v-if="startMission === 0">
            <ul class="howto-step">
                <li>
                    <span class="icon"></span>
                    <dl>
                        <dt>키워드 검색</dt>
                        <dd>
                            <p class="gray-txt">네이버 앱에서 복사된 키워드를 직접 검색</p>
                            <img class="search-img" src="../assets/imgs/img_search.png" alt="" />
                        </dd>
                    </dl>
                </li>
                <li>
                    <span class="icon"></span>
                    <dl>
                        <dt>상품 찾기</dt>
                        <dd>
                            <p class="gray-txt">가격비교 더보기 눌러서 상품 찾기</p>
                            <div class="example-box">
                                <span class="tit">
                                    <img src="../assets/imgs/ad.png" alt="" /> 제외
                                    <em>1페이지 9위</em>
                                </span>
                                <div class="box">
                                    <img src="../assets/imgs/test-thumb.png" alt="" />
                                    <dl>
                                        <dt>
                                            씨게이트 외장하드 4TB 데이터<br />복구 외장 HDD 4테라
                                            전용
                                        </dt>
                                        <dd>
                                            <span class="price"> 209,900원 </span>
                                            <span class="cul">씨게이트공식스토어</span>
                                            <span class="star">4.9(434) &nbsp; 구매 304 </span>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </dd>
                    </dl>
                </li>
                <li>
                    <span class="icon"></span>
                    <dl>
                        <dt>관련 태그 찾고 입력</dt>
                        <dd>
                            <p class="gray-txt">상품 상세페이지 하단에서 관련태그 찾아 입력</p>
                        </dd>
                    </dl>
                </li>
            </ul>
            <ul class="questions">
                <li>
                    <div
                        @click="() => (active1 = !active1)"
                        class="qs"
                        :class="{ active: active1 }"
                    >
                        관련 태그를 어떻게 찾는건가요?
                    </div>
                    <div v-if="active1" class="active-content">
                        <p>미션 힌트를 보고 상품을 찾아주세요.</p>
                        <p>
                            상품에 들어간 후, '상세정보 펼쳐보기'버튼을<br />누르고 아래로 내려
                            <em>'첫번째 태그'가 있습니다.</em>
                        </p>
                        <img src="../assets/imgs/step5-q.png" class="mission-img" alt="" />
                    </div>
                </li>
                <li>
                    <div
                        @click="() => (active2 = !active2)"
                        class="qs"
                        :class="{ active: active2 }"
                    >
                        상품이 미션의 순위에 보이지 않아요.
                    </div>
                    <div v-if="active2" class="active-content">
                        <p>
                            미션 힌트의 순위에 상품이 보이지 않으면
                            <em>'가격비교 더보기'</em> 버튼을 클릭하여 션 상품을 찾아주세요.
                        </p>
                        <p>
                            그래도 못 찾겠다면,
                            <em>'새로고침' 하여 다른 상품으로 변경 후</em> 참여해주세요.
                        </p>
                        <img src="../assets/imgs/step2-q.png" class="mission-img" alt="" />
                    </div>
                </li>
            </ul>
        </template>
        <template v-else-if="startMission > 0">
            <p class="dsc">네이버 가격비교 탭에서 하단의<br />상품을 찾아주세요.</p>
            <div class="w-box">
                <img src="../assets/imgs/test-thumb.png" alt="" />
            </div>
            <div class="dsc-box">
                <img src="../assets/imgs/ad.png" alt="" />
                제외 <em>1페이지 9위</em>
            </div>
            <div class="text-box">
                <p class="title">
                    씨게이트 외장하드 4TB 데이터<br />
                    복구 외장 HDD 4테라 전용
                </p>
                <span class="price">209,900원</span>
                <span class="cul">씨게이트공식스토어</span>
            </div>
            <span class="change-mission" @click="startMission = 0"
                >미션 상품을 변경하기
                <img src="../assets/imgs/arrow-go.png" alt="" />
            </span>
        </template>

        <div class="foot-btns" :class="{ showInput: startMission == 3 }">
            <input
                ref="domref"
                type="text"
                v-model="inputValue"
                class="sendinput"
                :class="{ error: wrong }"
                v-if="startMission == 3"
                placeholder="첫번째 태그를 입력해주세요"
            />
            <button class="prevbtn" @click="() => router.push('/howto')">참여방법 확인</button>
            <button class="nextbtn" @click="() => (startMission = 1)" v-if="startMission == 0">
                미션 바로하기
            </button>
            <button class="gray" @click="showMessage" v-if="startMission == 1">키워드 복사</button>
            <button class="nextbtn" @click="() => (startMission = 3)" v-else-if="startMission == 2">
                미션 시작하기
            </button>
            <button
                class="nextbtn"
                @click="
                    () => {
                        if (!test) {
                            triggerError()
                            return
                        }
                        router.push('/success')
                    }
                "
                v-else-if="startMission == 3"
            >
                정답 제출
            </button>
        </div>

        <transition name="fade-up">
            <div class="toast" v-if="isCopy">키워드 복사 완료!</div>
        </transition>
    </section>
</template>

<style scoped lang="scss">
.section {
    background: #f8f8f8;
    padding: 50px 0 200px 0;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    min-height: 100vh;
    .video-sec {
        position: fixed;
        top: 0;
        left: 0;
        @include flex();
        background: #000;
        width: 100vw;
        height: 100vh;
        z-index: 2;
        video {
            inset: 0;
            width: 100%;
            display: block;
            opacity: 0;
            transition: opacity 0.5s ease;
            &.active {
                opacity: 1;
                z-index: 1;
            }
        }
    }
}
/* 마지막 비디오가 사라질 때 부드럽게 fade-out */
.fade-video-enter-active,
.fade-video-leave-active {
    transition: opacity 1s ease; /* 페이드 속도 조정 가능 */
}

.fade-video-enter-from,
.fade-video-leave-to {
    opacity: 0;
}
.fade-video-enter-to,
.fade-video-leave-from {
    opacity: 1;
}
.foot-btns {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    /* height: 90px; */
    background: #fff;
    padding: 15px 15px 20px;
    display: flex;
    gap: 10px;
    z-index: 1;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -6px 18px -8px rgba(0, 0, 0, 0.3);
    &.showInput {
        flex-wrap: wrap;
    }
    .sendinput {
        width: 100%;
        background: #f2f4f5;
        border-radius: 10px;
        height: 60px;
        padding: 0 15px;
        font-size: 20px;
        &.error {
            border: 1px solid #ef4444;
            background: rgba(239, 68, 68, 0.2); /* 빨간색 */
            animation: shake 0.3s ease;
        }
    }
    /* 흔들림 효과 */
    @keyframes shake {
        0% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-6px);
        }
        50% {
            transform: translateX(6px);
        }
        75% {
            transform: translateX(-4px);
        }
        100% {
            transform: translateX(0);
        }
    }
    button {
        /* flex-grow: 1; */
        width: calc(50% - 5px);
        height: 100%;
        font-size: 22px;
        border-radius: 10px;
        font-weight: 600;
        padding: 17px 0;
    }
    .prevbtn {
        background: #e6e8eb;
        color: #444;
    }
    .nextbtn {
        background: #03cc64;
        color: #fff;
    }
    .gray {
        background: #40474d;
        color: #fff;
    }
}
.poi {
    font-size: 18px;
    font-weight: 500;
    border-radius: 50px;
    background: #28a163;
    width: 140px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    .coinimg {
        width: 25px;
        margin-right: 5px;
    }
}
.main-txt {
    color: #40474d;
    text-align: center;
    font-weight: 600;
    margin: 20px 0 15px 0;
    line-height: 1.2;
    font-size: 25px;

    em {
        font-size: 35px;
        font-weight: 800;
        color: #26b968;
    }
}
.normal-txt {
    color: #70747e;
    margin-bottom: 25px;
}

.howto-step {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    width: calc(100% - 40px);
    justify-content: space-between;
    margin-bottom: 20px;

    .search-img {
        width: 100%;
    }
    .icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 15px;
        box-shadow: 0px 4px 12px rgba(4, 199, 91, 0.25);
    }
    li {
        @include flex();
        align-items: start;
        justify-content: start;
        padding-bottom: 35px;
        position: relative;
        &::before {
            content: '';
            display: inline-block;
            background: #dedede;
            width: 1px;
            position: absolute;
            left: 25px;
            height: calc(100% - 63px);
            top: 58px;
        }
        &:first-child {
            .icon {
                background: url('../assets/imgs/ic-1.png') no-repeat center center #fff;
                background-size: 48%;
            }
        }
        &:nth-child(2) {
            .icon {
                background: url('../assets/imgs/ic-2.png') no-repeat center center #fff;
                background-size: 57%;
            }
        }
        &:last-child {
            &::before {
                content: none;
            }
            .icon {
                background: url('../assets/imgs/ic-3.png') no-repeat center center #fff;
                background-size: 35%;
            }
        }
    }

    dl {
        width: calc(100% - 65px);
        dt {
            color: #40474d;
            font-size: 20px;
            font-weight: 600;
        }
        .gray-txt {
            font-size: 17px;
            font-weight: 500;
            margin: 10px 0 10px;
            color: #9ea7ad;
        }
        .search-img {
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
        }
    }
    .example-box {
        display: flex;
        flex-direction: column;

        .tit {
            margin-top: 8px;
            margin-bottom: 8px;
            background: #fff;
            border-radius: 50px;
            padding: 7px 20px 7px 10px;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
            display: inline-flex;
            align-items: center;
            width: fit-content;
            color: #444;
            font-weight: 600;
            font-size: 17px;
            em {
                color: #03cc64;
                margin-left: 5px;
            }
            img {
                margin-right: 5px;
                width: 50px;
                display: inline-block;
            }
        }
        .box {
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
            background: #fff;
            border-radius: 7px;
            padding: 10px 15px;
            @include flex(start, center);
            img {
                width: 65px;
            }
            dl {
                margin-left: 5px;
                dt {
                    font-size: 14px;
                    line-height: 1.2;
                }
                dd {
                    span {
                        font-size: 14px;
                        display: block;
                    }
                    .price {
                        font-weight: 600;
                        margin-top: 3px;
                        margin-bottom: 5px;
                        color: #636c73;
                    }
                    .cul {
                        color: #636c73;
                        font-weight: 400;
                    }
                    .star {
                        margin-top: 5px;
                        font-size: 12px;
                        color: #636c73;
                        padding-left: 12px;
                        background: url('../assets/imgs/vector.png') no-repeat left center;
                        background-size: 10px;
                    }
                }
            }
        }
    }
}

.questions {
    border-top: 8px solid #ebebeb;
    width: 100%;
    padding: 10px 30px 0;
    .qs {
        padding-top: 30px;
        font-size: 17px;
        color: #636c73;
        background: url('../assets/imgs/arrow-close.png') no-repeat right bottom;
        background-size: 10px;
        &.active {
            color: #03cc64;
            font-weight: 600;
            background: url('../assets/imgs/arrow-open.png') no-repeat right bottom 6px;
            background-size: 16px;
        }
    }
}
.active-content {
    margin-top: 20px;
    img {
        width: 100%;
        display: block;
        margin: 0 auto;
    }

    p {
        font-size: 15px;
        text-indent: -13px;
        color: #989898;
        line-height: 1.4;
        padding-left: 20px;
        font-weight: 500;
        &::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #989898;
            position: relative;
            top: -4px;
            margin-right: 7px;
        }
        em {
            color: #04c75b;
        }
    }
    .mission-img {
        margin-top: 15px;
    }
}
.toast {
    position: fixed;
    bottom: 110px;
    color: #40474d;
    background: #fff;
    padding: 12px 15px 12px 38px;
    z-index: 3;
    font-size: 18px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
    border-radius: 30px;
    background: url('../assets/imgs/ic_check.png') no-repeat left 10px center #fff;
    background-size: 20px;
    font-weight: 600;
}
.dsc {
    color: #989898;
    text-align: center;
    line-height: 1.4;
    font-size: 17px;
}
.w-box {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    width: 150px;
    height: 150px;
    border-radius: 15px;
    overflow: hidden;
    margin-top: 25px;
    @include flex();
    img {
        width: 85%;
    }
}
.dsc-box {
    background: #fff;
    border-radius: 30px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    padding: 10px;
    overflow: hidden;
    @include flex(center, center);
    font-size: 25px;
    font-weight: 600;
    margin-top: 15px;
    color: #444444;
    img {
        display: inline-block;
        width: 80px;
        margin-right: 10px;
    }
    em {
        color: #03cc64;
        margin-left: 10px;
        user-select: none;
    }
}
.text-box {
    user-select: none;

    margin-top: 10px;
    width: 90%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    @include flex(center, center);
    flex-direction: column;
    gap: 7px;
    .title {
        color: #40474d;
        font-weight: 700;
        text-align: center;
        line-height: 1.2;
    }
    .price {
        color: #5f5f5f;
        font-weight: 700;
    }
    .cul {
        color: #5f5f5f;
    }
}
.change-mission {
    color: #636c73;
    font-weight: 500;
    font-size: 22px;
    margin-top: 20px;
    img {
        width: 12px;
        position: relative;
        top: 1px;
        margin-left: 10px;
        display: inline-block;
    }
}
.fade-out-only-enter-active {
    transition: none;
}

/* transition name="fade-up" 에 대응하는 클래스들 */
.fade-up-enter-active,
.fade-up-leave-active {
    transition: all 0.5s ease;
}

.fade-up-enter-from {
    opacity: 0;
    transform: translateY(10px); /* 밑에서 올라옴 */
}
.fade-up-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.fade-up-leave-from {
    opacity: 1;
    transform: translateY(0);
}
.fade-up-leave-to {
    opacity: 0;
    transform: translateY(-10px); /* 위로 뿅 올라가며 사라짐 */
}
</style>
