<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import 'vue3-carousel/carousel.css'
import axios from 'axios'
import { useIdleTimerStore } from '../stores/timer'
import { useMissionStore } from '../stores/useMissionStore'
import { useShowvideoStore } from '../stores/useShowvideoStore'
const videoUrls = [
    'https://img.lightning.ai.kr/introduction1_t1.mp4',
    'https://img.lightning.ai.kr/introduction2_t1.mp4',
    'https://img.lightning.ai.kr/introduction3_t1.mp4',
]
const videoUrls2 = [
    'https://img.lightning.ai.kr/introduction1_t2.mp4',
    'https://img.lightning.ai.kr/introduction2_t2.mp4',
    'https://img.lightning.ai.kr/introduction3_t2.mp4',
]
const missionStore = useMissionStore()
const idleTimer = useIdleTimerStore()
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

const data = ref<any>(null)

// --- 기존 코드 내에 추가 ---
const videoRefs = ref<HTMLVideoElement[]>([])
const canClickNext = ref(false) // 현재 영상이 끝났을 때만 true
const viewVideo = useShowvideoStore()

/* 키워드복사횟수, 정답입력횟수, 정답체크 진행 */
const copyCnt = ref(0)

function toQueryString(obj: Record<string, any>): string {
    const params = new URLSearchParams()
    for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
            params.append(key, String(obj[key]))
        }
    }
    return params.toString()
}
async function showMessage(keyword: string) {
    try {
        // 최신 브라우저에서 HTTPS 환경이면 navigator.clipboard 사용
        await navigator.clipboard.writeText(keyword)
    } catch {
        // fallback: 모바일/HTTP 환경에서 document.execCommand 사용
        const textArea = document.createElement('textarea')
        textArea.value = keyword
        // 화면에 보이지 않도록 스타일
        textArea.style.position = 'fixed'
        textArea.style.top = '0'
        textArea.style.left = '0'
        textArea.style.width = '1px'
        textArea.style.height = '1px'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)

        textArea.select()
        try {
            document.execCommand('copy')
        } finally {
            document.body.removeChild(textArea)
        }
    }

    // 기존 UI 처리 그대로 유지
    isCopy.value = true
    copyCnt.value += 1
    startMission.value = 2

    setTimeout(() => {
        isCopy.value = false
    }, 1000)
}

function nextVideo() {
    // 세 번째 영상에서는 터치 금지
    if (videoTrigger.value >= videoUrls.length - 1) return

    // 끝나야 클릭 가능
    if (canClickNext.value) {
        videoTrigger.value += 1
        canClickNext.value = false // 다음 영상은 다시 false로 초기화
    }
}
const triggerError = () => {
    wrong.value = true
    // 애니메이션 다시 실행되게 잠시 후 클래스 제거
    // submittedAnswer.value = submittedAnswer.value + text;
    inputValue.value = ''
    setTimeout(() => {
        wrong.value = false
        test.value = true
        domref.value?.focus()
    }, 500)
}

function addComma(num: string | number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? ''
}

/*
 * 10분 카운트긴 한데 날짜가 봐뀌면 연결 끝
 * 연결 끝의 기준-> 10분, 창 종료
 */
async function record(state: 'submited' | 'end') {
    if (inputValue.value.length === 1 || !inputValue.value) {
        triggerError()
        return
    }

    try {
        const params = {
            logId: missionStore.data?.logId,
            copyCount: copyCnt.value,
            submittedAnswer: inputValue.value,
        }

        // 정답일경우
        if (state === 'submited') {
            const res1 = await axios.post(
                `https://admin.lightning.ai.kr/api/mission/attemptRecord?${toQueryString(params)}`,
            )

            if (res1) {
                router.push('/success')
            }
        }

        // 연결이 끊긴경우
        if (state === 'end') {
            const res1 = await axios.post(
                `https://admin.lightning.ai.kr/api/mission/attemptRecord?${toQueryString(params)}`,
            )
        }
    } catch (error: any) {
        if (error.status === 409) {
            triggerError()
        }
    }
}

// async function getData(logId?: string) {
//     try {
//         const params = {
//             userId: route.query.user_id,
//             bzTrackingId: route.query.bz_tracking_id,
//             ifa: route.query.ifa,
//             ...(logId ? { logId } : {}),
//         }

//         const res: any = await axios.get(
//             `http://admin.lightning.ai.kr/api/mission/info?${toQueryString(params)}`,
//         )

//         data.value = res.data
//         const text = res.data.title

//         const rr = text.replace(/<\/?b>/gi, '')

//         boldText.value = res.data.workKeyword
//         restText.value = rr
//     } catch (error) {
//         // router.push('/fail')
//         console.log(error)
//     }
// }
const nowTime = computed(() => {
    const now = new Date()
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
})

async function getData(logId?: string) {
    try {
        const params = {
            userId: route.query.user_id,
            bzTrackingId: route.query.bz_tracking_id,
            ifa: route.query.ifa,
            ...(logId ? { logId } : {}),
        }

        const res: any = await axios.get(
            `https://admin.lightning.ai.kr/api/mission/info?${toQueryString(params)}`,
        )

        // store에 데이터 저장
        missionStore.setData(res.data)
    } catch (error) {
        router.push('/fail')
        console.log(error)
    }
}

const openNaverAppForAndroid = () => {
    const appLink = 'naversearchapp://default?version=1'
    const appLink2 =
        'naversearchapp://inappbrowser?url=https://www.facebook.com/share/p/1FXg6CyJaB/&target=new&version=6'
    const webUrl = 'https://m.naver.com/'
    const storeUrl = 'https://play.google.com/store/apps/details?id=com.nhn.android.search'

    const now = Date.now()

    // 1️⃣ 유저가 클릭했을 때 앱 실행 시도
    const link = document.createElement('a')
    link.href = missionStore.data.screenType === '1' ? appLink : appLink2
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 2️⃣ 앱이 안 열리면 fallback (앱 미설치)
    setTimeout(() => {
        if (Date.now() - now < 2500) {
            // 앱이 실행되지 않았다고 판단되면
            const goToStore = window.confirm(
                '네이버 앱이 설치되어 있지 않습니다.\n설치 페이지로 이동하시겠습니까?',
            )
            if (goToStore) {
                window.location.href = storeUrl
            }
        }
    }, 2000)

    startMission.value = 3
}

const agent = ref('android')
function openNaverAppForApple() {
    const appLink = 'naversearchapp://default?version=1'
    const appLink2 =
        'naversearchapp://inappbrowser?url=https://www.facebook.com/share/p/1FXg6CyJaB/&target=new&version=6'

    // window.location.href = appLink
    // 1️⃣ 유저가 클릭했을 때 앱 실행 시도
    const link = document.createElement('a')
    link.href = missionStore.data.screenType === '1' ? appLink : appLink2
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    startMission.value = 3
}

watch(
    () => startMission.value,
    (newVal) => {
        if (newVal === 0) {
            window.scrollTo({
                top: 0,
            })
        }
    },
)

function handleVideoEnd(index: number) {
    console.log('Video ended:', index)
    if (index < videoUrls.length - 1) {
        canClickNext.value = true
    } else {
        videoTrigger.value = videoUrls.length
        window.scrollTo({ top: 0 })
    }
}

function maskName(str: string, maskChar = 'O') {
    if (typeof str !== 'string') return str
    const s = str.trim()
    const len = s.length

    if (len === 0) return s
    if (len === 1) return s // 1글자는 그대로
    if (len === 2) return s[0] + maskChar // 2글자면 앞 1글자 + O
    // 3글자 이상이면 앞 2글자 + (나머지 길이만큼 O)
    return s.slice(0, 2) + maskChar.repeat(len - 2)
}

const naverRedirect = ref<string>('')

onMounted(() => {
    idleTimer.start(() => record('end'))

    getData()

    // 비디오 끝날 때마다 이벤트 연결
    // videoRefs.value.forEach((video, index) => {
    //     video.addEventListener('ended', () => {
    //         console.log('Video ended', index)
    //         if (index < videoUrls.length - 1) {
    //             canClickNext.value = true
    //         } else {
    //             videoTrigger.value = videoUrls.length
    //             window.scrollTo({ top: 0 })
    //         }
    //     })
    // })
    if (route.query.mission == 'true') {
        startMission.value = 1
    }

    const userAgent = navigator.userAgent.toLowerCase() //userAgent 문자열 값 받아오기

    if (userAgent.indexOf('android') > -1) {
        //안드로이드일 때 실행할 x동작
        agent.value = 'android'
    } else if (
        userAgent.indexOf('iphone') > -1 ||
        userAgent.indexOf('ipad') > -1 ||
        userAgent.indexOf('ipod') > -1
    ) {
        agent.value = 'apple'
    }
})

onBeforeUnmount(() => {
    idleTimer.stop()
})

// watch(
//     () => missionStore.data,
//     (val) => {
//         if (val && val.isVideoExposureNeeded === 'Y') {
//             nextTick(() => {
//                 videoTrigger.value = 0
//                 videoRefs.value?.[0]?.play?.()
//             })
//         }
//     },
//     { immediate: true },
// )
</script>

<template>
    <section class="section">
        <div
            class="video-sec"
            v-if="
                videoTrigger < 3 &&
                missionStore.data &&
                !viewVideo.novideo &&
                missionStore.data.isVideoExposureNeeded === 'Y'
            "
            @click="nextVideo"
        >
            <video
                preload="auto"
                playsinline
                webkit-playsinline
                @ended="handleVideoEnd(i)"
                v-for="(url, i) in missionStore.data.screenType === '1' ? videoUrls : videoUrls2"
                :key="url"
                v-show="i === videoTrigger"
                muted
                autoplay
                ref="videoRefs"
                :class="['video-item', { active: i === videoTrigger }]"
            >
                <source :src="url" type="video/mp4" />
            </video>
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
                            <div class="img-wrap">
                                <strong>{{ missionStore.data?.workKeyword ?? '' }}</strong>
                                <img
                                    class="search-img"
                                    src="../assets/imgs/img_search_new.png"
                                    alt=""
                                />
                            </div>
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
                                    <em v-if="missionStore.data"
                                        >{{
                                            Math.floor(missionStore.data?.currentRank / 40) + 1
                                        }}페이지 {{ missionStore.data?.currentRank % 40 }}위</em
                                    >
                                </span>
                                <div class="box">
                                    <img :src="missionStore.data?.imageUrl" alt="" />

                                    <dl>
                                        <dt>
                                            {{ missionStore.restText }}
                                        </dt>
                                        <dd>
                                            <span class="price"
                                                >{{
                                                    missionStore.data?.lprice
                                                        ? addComma(missionStore.data?.lprice)
                                                        : ''
                                                }}원</span
                                            >
                                            <span class="cul">{{
                                                maskName(missionStore.data?.mallName)
                                            }}</span>
                                            <!-- <span class="star">4.9(434) &nbsp; 구매 304 </span> -->
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
        <template v-else-if="startMission > 0 || route.query.mission">
            <p class="dsc">네이버 가격비교 탭에서 하단의<br />상품을 찾아주세요.</p>
            <div class="w-box">
                <img :src="missionStore.data?.imageUrl" alt="" />
            </div>
            <div class="dsc-box">
                <img src="../assets/imgs/ad.png" alt="" />
                제외
                <em
                    >{{ Math.floor(missionStore.data?.currentRank / 40) + 1 }}페이지
                    {{ missionStore.data?.currentRank % 40 }}위</em
                >
            </div>
            <div class="text-box">
                <!-- <strong>{{ missionStore.boldText }}</strong> -->
                <p class="title">
                    {{ missionStore.restText }}
                </p>
                <span class="price"
                    >{{
                        missionStore.data?.lprice ? addComma(missionStore.data?.lprice) : ''
                    }}원</span
                >
                <span class="cul">{{ maskName(missionStore.data?.mallName) }}</span>
            </div>
            <span
                class="change-mission"
                @click="
                    () => {
                        startMission = 0
                        getData(missionStore.data?.logId)
                    }
                "
                >미션 상품을 변경하기
                <img src="../assets/imgs/arrow-go.png" alt="" />
            </span>
        </template>

        <transition name="fade-up">
            <div class="toast" v-if="isCopy">키워드 복사 완료!</div>
        </transition>
    </section>
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
        <button
            class="prevbtn"
            @click="() => router.push({ path: '/howto', query: { ...route.query } })"
        >
            참여방법 확인
        </button>
        <button class="nextbtn" @click="() => (startMission = 1)" v-if="startMission == 0">
            미션 바로하기
        </button>
        <button
            class="gray"
            @click="() => showMessage(missionStore.data?.workKeyword)"
            v-if="startMission == 1"
        >
            키워드 복사
        </button>

        <button
            class="nextbtn"
            v-if="startMission === 2 && agent === 'apple'"
            @click="openNaverAppForApple"
        >
            미션 시작하기
        </button>
        <a
            class="nextbtn"
            v-if="startMission === 2 && agent === 'android'"
            href="naversearchapp://default?version=1"
            @click.prevent="openNaverAppForAndroid"
        >
            미션 시작하기
        </a>
        <button class="nextbtn" @click="() => record('submited')" v-else-if="startMission == 3">
            정답 제출
        </button>
    </div>
</template>

<style scoped lang="scss">
.section {
    background: #f8f8f8;
    padding: 5% 0 200px 0;
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
        background: #fff;
        width: 100vw;
        height: 100vh;
        z-index: 2;

        video {
            inset: 0;
            width: 100%;
            display: block;
            opacity: 0;
            max-width: 406px;
            /* 원본 폭에 맞춤 */
            height: auto;
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
    transition: opacity 1s ease;
    /* 페이드 속도 조정 가능 */
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
            background: rgba(239, 68, 68, 0.2);
            /* 빨간색 */
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

    button,
    a {
        /* flex-grow: 1; */
        width: calc(50% - 5px);
        height: 100%;
        font-size: 22px;
        border-radius: 10px;
        font-weight: 500;
        padding: 17px 0;
        display: inline-block;
        text-align: center;
    }

    .prevbtn {
        background: #e6e8eb;
        color: #444;
    }

    .nextbtn {
        height: auto;
        line-height: normal;
        background: #03cc64;
        color: #fff;
    }

    .gray {
        background: #40474d;
        color: #fff;
    }
}

.poi {
    font-size: 17px;
    font-weight: 500;
    border-radius: 50px;
    background: #28a163;
    width: 130px;
    height: 33px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;

    .coinimg {
        width: 23px;
        margin-right: 5px;
    }
}

.main-txt {
    color: #40474d;
    text-align: center;
    font-weight: 600;
    // margin: 20px 0 15px 0;
    margin: 2% 0 3% 0;
    line-height: 1.2;
    font-size: 20px;

    em {
        font-size: 25px;
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
    margin-top: 2%;
    width: calc(100% - 40px);
    justify-content: space-between;
    margin-bottom: 20px;

    .search-img {
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
        padding-bottom: 7%;
        position: relative;

        &:last-child {
            padding-bottom: 0;
        }

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
            font-size: 18px;
            font-weight: 600;
        }

        .gray-txt {
            font-size: 16px;
            font-weight: 500;
            margin: 3% 0;
            color: #9ea7ad;
        }

        .img-wrap {
            position: relative;

            strong {
                position: absolute;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #03cc64;
                font-size: 20px;
                top: 50%;
                font-weight: 600;
                width: max-content;
            }
        }

        .search-img {
            width: 95%;

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
        padding-top: 5%;
        font-size: 16px;
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
    margin-top: 3%;
}

.w-box {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    width: 35%;
    // height: 150px;
    border-radius: 15px;
    overflow: hidden;
    margin-top: 6%;
    aspect-ratio: 1 / 1;
    @include flex();

    img {
        width: 85%;
    }
}

.dsc-box {
    background: #fff;
    border-radius: 30px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    padding: 5px;
    overflow: hidden;
    @include flex(center, center);
    font-size: 21px;
    font-weight: 600;
    margin-top: 15px;
    color: #444444;

    img {
        display: inline-block;
        width: 70px;
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
    padding: 15px;
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
    font-size: 18px;
    margin-top: 5%;

    img {
        width: 10px;
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
    transform: translateY(10px);
    /* 밑에서 올라옴 */
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
    transform: translateY(-10px);
    /* 위로 뿅 올라가며 사라짐 */
}
</style>
