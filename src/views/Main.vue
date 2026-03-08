<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import 'vue3-carousel/carousel.css'
import axios from 'axios'
import { useIdleTimerStore } from '../stores/timer'
import { useMissionStore } from '../stores/useMissionStore'
import { useShowvideoStore } from '../stores/useShowvideoStore'
import { useCopyCountStore } from '@/stores/useCopyCountStore'
import { getCookie, setCookie,clearAllCookies} from '../cookie'
import { base64UrlEncode, addComma, toQueryString, safeBase64Encode, safeBase64Decode } from '@/util'

const missionStore = useMissionStore()
const copyCnt = useCopyCountStore();
const idleTimer = useIdleTimerStore()
const videoTrigger = ref<number | null>(null)
const router = useRouter()
const route = useRoute()

const active1 = ref(false)
const active2 = ref(false)

const isCopy = ref(false)

const startMission = ref(0)

const inputValue = ref('')
const submittedAnswer = ref<string[]>([])
const wrong = ref(false)
const inputCount = ref(1)
const domref = ref<HTMLElement | null>(null)

// 정답 연속 제출 막는 용
const isLocked = ref(false);

// --- 기존 코드 내에 추가 ---
const videoRefs = ref<HTMLVideoElement[]>([])

const canClickNext = ref(false) // 현재 영상이 끝났을 때만 true
const viewVideo = useShowvideoStore()

// 건너뛰기 버튼
const showSkipButton = ref(false)
const skipTimer = ref<number | null>(null)

/* 키워드복사횟수, 정답입력횟수, 정답체크 진행 */
// const copyCnt = ref(0)


// 검색어 복사 완료 
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
    // startMission.value = 2

    setTimeout(() => {
        isCopy.value = false
        openBridgePage()
    }, 1000)
  
}

// 정답 틀렸을때 에러 ui
const triggerError = () => {
    wrong.value = true
    // submittedAnswer 가 10개를 초과한경우, 0번째를 제거. 항상 최신 10개까지만 저장
    if (submittedAnswer.value.length > 10) {
        submittedAnswer.value.shift()
    }

    const input = inputValue.value.replace(/\s+/g, '')
    submittedAnswer.value.push(input)
    inputValue.value = ''

    setTimeout(() => {
        wrong.value = false
        domref.value?.focus()
    }, 500)
}



/*
 * 10분 카운트긴 한데 날짜가 봐뀌면 연결 끝
 * 연결 끝의 기준-> 10분, 창 종료
 */
async function record(state: 'submited' | 'end') {
    if (isLocked.value) return

    isLocked.value = true
    // const input = inputValue.value.replace(/\s+/g, '').toLowerCase()
    // const correctCondition = missionStore.data?.hashtag?.toLowerCase().includes(input)

    // 백에서 정답 체크 
    try {
        if (inputValue.value.length === 1 || !inputValue.value || inputValue.value.length > 10) {
            triggerError()
            return
        }

        const params = {
            logId: missionStore.data?.logId,
            logicType: missionStore.data?.logicType,
            middleType: missionStore.data?.middleType,
            copyCount: copyCnt.value,
            submittedAnswer: inputValue.value, // 정답칸에 입력한 텍스트
            inputCount: inputCount.value, // 오답시도횟수

            // submittedAnswer: submittedAnswer.value.join(','), // 오답 입력값 콤마로 join
            // userId: route.query.user_id,
            // bzTrackingId: route.query.bz_tracking_id,
            // ifa: route.query.ifa,
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

        if (error.response.status === 404) {
            window.alert('유효하지 않은 미션입니다.')
        }
        // 정답 틀린경우
        if (error.response.status === 500) {
            triggerError();
        }
    } finally {
        setTimeout(() => {
            isLocked.value = false
        }, 2000)
    }
}

// 미션상품 변경하기
async function getData(logId: string, fb = false, changeYn ?: string) {
    const queryParams = route.query;

    try {
        const params = {
            logId,
            changeYn
        }

        const res: any = await axios.get(
            `https://admin.lightning.ai.kr/api/mission/info?${toQueryString(params)}`,
        )

        // store에 데이터 저장
        missionStore.setData(res.data)

        if(changeYn === 'Y'){
            clearAllCookies();

            const encodedPsInfo = safeBase64Encode(JSON.stringify(res.data))
            if (encodedPsInfo) {
                // 미션 변경하기 했을때 쿠키에 데이터 새로 할당(새로고침해도 미션 유지되도록)
                console.log(res.data)
                setCookie('ps_info', encodedPsInfo,{ maxAge: 60 * 20 })
            }
        }

        videoTrigger.value = 0

        // 브릿지에서 넘어왔을때
        if (fb) {

            const { fb, logId, ...rest } = route.query

            // 브릿지페이지에서 넘어왔음을 알려주는 쿼리스트링 제거.
            router.replace({
                query: rest,
            });

            if (route.query.howto) {
                router.push({ path: '/howto', query: { ...route.query } });
                return;
            } else if (route.query.logId && route.query.changeYn === 'N') {
                startMission.value = 3
            }

        }

    } catch (error) {
        router.push({ path: '/fail', query: queryParams })
    }
}

//  현재 안쓰고 있음. 네이버 앱 이동시 이용했던 함수
const openNaverAppForAndroid = () => {
    // const keyword = missionStore.data?.workKeyword
    // const type1FallbackUrl = 'https://m.naver.com/'
    // const type2FallbackUrl = `https://lightning.ai.kr/test.html`
    // const type3FallbackUrl = `https://m.search.naver.com/search.naver?sm=mob_hty.top&where=m&query=${keyword}`
    // const type4FallbackUrl = `https://m.search.naver.com/search.naver?sm=mtb_hty.top&where=m&query=${keyword}`

    // missionStore.data.extenalUrl

    // const targetLink = missionStore.data.extenalUrl

    // const encodedUrl = encodeURIComponent(targetLink)

    // const appLink = `intent://inappbrowser?url=${encodedUrl}&target=new&version=6#Intent;scheme=naversearchapp;package=com.nhn.android.search;S.browser_fallback_url=${encodedUrl};end;`

    // const url = [
    //     // 삼성인터넷, 네이버 앱 둘 중 선택. package에 네이버기 때문에 스키마도 naversearchapp, 네이버 앱 없으면 설치페이지 이동
    //     `https://play.google.com/store/apps/details?id=com.android.chrome`,
    //     `intent://inappbrowser?url=${encodedUrl}&version=6#Intent;scheme=naversearchapp;package=com.nhn.android.search;S.browser_fallback_url=${encodedUrl};end;`,
    //     // (삼성인터넷, 크롬 선택)크롬이 정상적으로 이해할 수 있는 순수 url 만 전달해야함. inappbrowser형식은 맞지 않음. 검색결과 화면은
    //     `intent://m.naver.com#Intent;scheme=https;package=com.android.chrome;`,
    //     // 삼성인터넷, 크롬, 크롬앱 없으면 그냥 현재 브라우저에서 이동 (fallback)
    //     `intent://m.search.naver.com/search.naver?query=키워드&target=new#Intent;scheme=https;S.browser_fallback_url=m.search.naver.com/search.naver?query=키워드&target=new;end;`,
    //     'http://m.naver.com',
    // ]

    // const appLink = encodedUrl
    // const appLink = url[1]

    // window.open(targetLink, '_blank')
    // startMission.value = 3
    // return

    const bridgeDomain = missionStore.data?.bridgeDomain
    const externalUrl = missionStore.data?.extenalUrl

    const targetLink = `${bridgeDomain}?externalUrl=${encodeURIComponent(externalUrl)}`
    // 1️⃣ 유저가 클릭했을 때 앱 실행 시도안
    const link = document.createElement('a')
    link.href = targetLink
    // link.target = '_blank' // ✅ 새 창/새 탭 열기
    link.rel = 'noopener noreferrer' // 보안 권장
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // const now = Date.now()
    // // 2️⃣ 앱이 안 열리면 fallback (앱 미설치)

    // setTimeout(() => {
    //     if (Date.now() - now < 2500) {
    //         // 앱이 실행되지 않았다고 판단되면
    //         const goToStore = window.confirm(
    //             '네이버 앱이 설치되어 있지 않습니다.\n설치 페이지로 이동하시겠습니까?',
    //         )
    //         if (goToStore) {
    //             // window.location.href = storeUrl
    //         }
    //     }
    // }, 2000)

    startMission.value = 3
}


//  현재 안쓰고 있음. 네이버 앱 이동시 이용했던 함수

// function openNaverAppForApple() {
//     const bridgeDomain = missionStore.data.bridgeDomain
//     // const bridgeDomain = "https://bridge-cleaner.chamominedev.workers.dev/"
//     // const bridgeDomain = "https://starber.co.kr/"
//     const targetLink = missionStore.data.extenalUrl

//     // // return
//     const link = document.createElement('a')
//     link.href = targetLink
//     link.rel = 'noopener noreferrer' // 보안 권장
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)

//     startMission.value = 3
//     var appstoreUrl = 'http://itunes.apple.com/kr/app/id393499958?mt=8'
//     const now = Date.now()
//     // 2️⃣ 앱이 안 열리면 fallback (앱 미설치)
//     setTimeout(() => {
//         if (Date.now() - now < 2500) {
//             // 앱이 실행되지 않았다고 판단되면
//             const goToStore = window.confirm(
//                 '네이버 앱이 설치되어 있지 않습니다.\n설치 페이지로 이동하시겠습니까?',
//             )
//             if (goToStore) {
//                 window.location.href = appstoreUrl
//             }
//         }
//     }, 2000)

    

// }

function openBridgePage() {

    const bridgeDomain = missionStore.data.bridgeDomain
    // const bridgeDomain = "https://bridge-cleaner.chamominedev.workers.dev/"
    // const bridgeDomain = "https://starber.co.kr/"
    const externalUrl = missionStore.data.extenalUrl

    // 이미 브릿지에서 온 페이지인가
    const alreadyfb = !!route.query.fb

    // copyCount 브릿지 다녀와서도 유지하기 위함
    const cp = missionStore.data?.screenType == '2' ? 0 : copyCnt.value;

    const urlSearchParams = new URL(window.location.href);
    urlSearchParams.searchParams.set('cp', cp.toString());
    if (!alreadyfb) urlSearchParams.searchParams.set('fb', 'true');

    const query = {
        p: Math.floor(missionStore.data.currentRank / 40) + 1,
        r: missionStore.data.currentRank % 40,
        t: missionStore.restText,
        l: missionStore.data.lprice ? addComma(missionStore.data.lprice) : '',
        m: missionStore.data.mallName,
        u: externalUrl,
        iu: missionStore.data.imageUrl,
        sch: urlSearchParams.search,
        logId: missionStore.data.logId,
    }

    localStorage.clear();
    sessionStorage.clear();
    clearAllCookies();

    // form 생성
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = bridgeDomain
    form.style.display = 'none'

    // data 필드 (암호화 없이 그대로)
    const dataInput = document.createElement('input')
    dataInput.type = 'hidden'
    dataInput.name = 'ags'

    dataInput.value = base64UrlEncode(JSON.stringify(query))

    form.appendChild(dataInput)
    document.body.appendChild(form)

    // form 데이터 콘솔에 찍어보기
    // 전송 → 페이지 이동 발생

    //   return;
    form.submit()
    // 정리

    // const targetLink = `${bridgeDomain}?${toQueryString(query)}`;

    // // // return
    // const link = document.createElement('a')
    // link.href = targetLink
    // link.rel = 'noopener noreferrer' // 보안 권장
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)

    // startMission.value = 3
    // var appstoreUrl = 'http://itunes.apple.com/kr/app/id393499958?mt=8'
    // const now = Date.now()
    // // 2️⃣ 앱이 안 열리면 fallback (앱 미설치)
    // setTimeout(() => {
    //     if (Date.now() - now < 2500) {
    //         // 앱이 실행되지 않았다고 판단되면
    //         const goToStore = window.confirm(
    //             '네이버 앱이 설치되어 있지 않습니다.\n설치 페이지로 이동하시겠습니까?',
    //         )
    //         if (goToStore) {
    //             window.location.href = appstoreUrl
    //         }
    //     }
    // }, 2000)
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
function nextVideo(divide: 'button' | 'touched') {
    if (
        divide === 'touched' &&
        missionStore.data?.videoList[videoTrigger.value as number]?.skipTime > 0
    ) {
        return
    }
    const currentIdx = videoTrigger.value as number
    const videoList = missionStore.data.videoList
    const lastIdx = videoList.length - 1
    const currentVideo = videoList[currentIdx]

    if (!currentVideo) return

    const skipTime = Number(currentVideo.skipTime)

    // =====================================
    // 📌 skipTime 영상 → 버튼으로만 이동
    // =====================================
    if (skipTime > 0) {
        // 마지막 영상
        if (currentIdx === lastIdx) {
            videoTrigger.value = lastIdx + 1
            window.scrollTo({ top: 0 })
            return
        }

        // 다음 영상
        videoTrigger.value = (videoTrigger.value as number) + 1
        showSkipButton.value = false
        return
    }

    const isLast = currentIdx === lastIdx
    const isSkippable = currentVideo.isSkippable === 'Y'

    const videoEl = videoRefs.value[currentIdx]
    const isMiddleTouch =
        videoEl && videoEl.duration > 0 && videoEl.currentTime < videoEl.duration - 0.2

    // ============================
    // 📌 1) 마지막 영상 처리 (별도 규칙)
    // ============================
    if (isLast) {
        if (!isSkippable && isMiddleTouch) {
            // 마지막 + N → 중간 터치 무시
            return
        }

        // 마지막 + Y 중간 터치 → 종료
        // 마지막 + N/Y 끝나고 터치 → 종료
        videoTrigger.value = lastIdx + 1
        window.scrollTo({ top: 0 })
        return
    }

    // ============================
    // 📌 2) 마지막 영상 ‘외의’ 영상 규칙
    // ============================

    // 중간 터치라면:
    if (isMiddleTouch) {
        if (!isSkippable) {
            // N → 무시
            return
        }

        // Y → 즉시 다음
        goNext()
        return
    }

    // 영상이 끝난 뒤 터치라면:
    // Y/N 모두 다음으로 이동
    goNext()

    function goNext() {
        videoTrigger.value = (videoTrigger.value as number) + 1

        canClickNext.value = false
    }
}

function handleVideoEnd(index: string | number) {
    const videoList = missionStore.data.videoList
    const lastIdx = videoList.length - 1

    // 마지막 영상이 끝났으면 (Y/N 상관없이) 자동 종료
    if (index == lastIdx) {
        videoTrigger.value = lastIdx + 1
        window.scrollTo({ top: 0 })
        return
    }

    // 마지막이 아니면: 끝났음을 표시만 하고(= 다음 터치 허용)
    canClickNext.value = true
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

watch(videoTrigger, async (idx) => {
    if (idx === null) return
    showSkipButton.value = false

    if (skipTimer.value) {
        clearTimeout(skipTimer.value)
        skipTimer.value = null
    }

    const video = missionStore.data?.videoList?.[idx]
    if (!video) return

    const skipTime = Number(video.skipTime)

    // skipTime > 0 이면 자동 타이머로 버튼 노출
    if (skipTime > 0) {
        skipTimer.value = window.setTimeout(() => {
            showSkipButton.value = true
        }, skipTime * 1000)
    } else {
        // 기존 로직 유지 (isSkippable 기반)
        showSkipButton.value = false
    }
})



onMounted(() => {
    idleTimer.start(() => record('end'))
    
    // 쿠키로 받은 미션 데이터 가져오기
    const payload = getCookie('ps_info');

    // 쿠키 미존재시
    if(!payload) {
        window.alert('유효하지 않은 미션입니다.')
        router.push({ path: '/fail' })
        return;
    }

    
    if (!missionStore.data) {
        // 브릿지페이지에서 넘어왔을때 copyCnt 유지하기 위해 변수에 할당
        if (route.query.cp) {
            copyCnt.setValue(Number(route.query.cp) || 0)
        }
        // 브릿지에서 넘어왔을때
        if (route.query.fb == 'true' || route.query.logId) {
            getData(route.query.logId as string, true, route.query.changeYn as string)
            return
        } 

        // 페이지 최초 진입시, 쿠키에서 데이터 가져옴 
        // Base64 디코딩 및 store에 전역 변수 저장
        const infoData = JSON.parse(safeBase64Decode(payload) as string);
        missionStore.setData(infoData)
    }

    // 홈화면 말고 미션화면으로 시작하기
    if (route.query.mission == 'true') {
        if (route.query?.screenType == '2') {
            startMission.value = 2
        } else {
            startMission.value = 1
        }
    }

    if (route.query.fromfail == 'true') {
        videoTrigger.value = 0
    }

})

onBeforeUnmount(() => {
    idleTimer.stop()
})
</script>

<template>
    <section class="section">
        <div class="video-sec" v-if="
            videoTrigger !== null &&
            videoTrigger < missionStore.data?.videoList?.length &&
            missionStore.data &&
            !viewVideo.novideo &&
            missionStore.data.isVideoExposureNeeded === 'Y'
        " @click="() => nextVideo('touched')">
            <button v-if="showSkipButton" class="skipButton" :class="{ visible: showSkipButton }"
                @click="() => nextVideo('button')" gsd>
                건너뛰기<i class="skip"></i>
            </button>
            <video preload="auto" playsinline webkit-playsinline @ended="handleVideoEnd(i)"
                v-for="(url, i) in missionStore.data.videoList" :key="url.filename" v-show="i === videoTrigger" muted
                autoplay ref="videoRefs" :class="['video-item', { active: i === videoTrigger }]">
                <source :src="missionStore.data.domainUrl + url.filename" type="video/mp4" />
            </video>
        </div>
        <strong class="poi"><img class="coinimg" src="../assets/imgs/mini-coin.png" />선착순 미션</strong>
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
                                <img class="search-img" src="../assets/imgs/img_search_new.png" alt="" />
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
                                    <em v-if="missionStore.data">{{
                                        Math.floor(missionStore.data?.currentRank / 40) + 1
                                        }}페이지 {{ missionStore.data?.currentRank % 40 }}위</em>
                                </span>
                                <div class="box">
                                    <img :src="missionStore.data?.imageUrl" alt="" />

                                    <dl>
                                        <dt>
                                            {{ missionStore.restText }}
                                        </dt>
                                        <dd>
                                            <span class="price">{{
                                                missionStore.data?.lprice
                                                    ? addComma(missionStore.data?.lprice)
                                                    : ''
                                            }}원</span>
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
                    <div @click="() => (active1 = !active1)" class="qs" :class="{ active: active1 }">
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
                    <div @click="() => (active2 = !active2)" class="qs" :class="{ active: active2 }">
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
                <em>{{ Math.floor(missionStore.data?.currentRank / 40) + 1 }}페이지
                    {{ missionStore.data?.currentRank % 40 }}위</em>
            </div>
            <div class="text-box">
                <!-- <strong>{{ missionStore.boldText }}</strong> -->
                <p class="title">
                    {{ missionStore.restText }}
                </p>
                <span class="price">{{
                    missionStore.data?.lprice ? addComma(missionStore.data?.lprice) : ''
                    }}원</span>
                <span class="cul">{{ maskName(missionStore.data?.mallName) }}</span>
            </div>
            <span class="change-mission" @click="
                () => {
                    startMission = 0
                    getData(missionStore.data?.logId, false, 'Y')
                }
            ">미션 상품을 변경하기
                <img src="../assets/imgs/arrow-go.png" alt="" />
            </span>
        </template>

        <transition name="fade-up">
            <div class="toast" v-if="isCopy">키워드 복사 완료!</div>
        </transition>
    </section>
    <div class="foot-btns" :class="{ showInput: startMission == 3 }">
        <input ref="domref" type="text" v-model="inputValue" class="sendinput" :class="{ error: wrong }"
            v-if="startMission == 3" placeholder="첫번째 태그를 입력해주세요" />
        <button class="prevbtn" @click="() => router.push({ path: '/howto', query: { ...route.query } })">
            참여방법 확인
        </button>
        <button class="nextbtn" @click="
            () => {
                if (missionStore.data?.screenType == '2') {
                    // startMission = 2;
                    openBridgePage()
                } else {
                    startMission = 1
                }
            }
        " v-if="startMission == 0">
            미션 바로하기
        </button>
        <button class="gray" @click="() => showMessage(missionStore.data?.workKeyword)" v-if="startMission == 1">
            키워드 복사
        </button>

        <!-- <button class="nextbtn" v-if="startMission === 2 && agent === 'apple'">
            미션 시작하기
        </button>
        <a class="nextbtn" v-if="startMission === 2 && agent === 'android'" href="naversearchapp://default?version=1">
            미션 시작하기
        </a> -->
        <button :disabled="isLocked" class="nextbtn" @click="() => record('submited')" v-else-if="startMission == 3">
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

        .skipButton {
            position: absolute;
            top: 30px;
            right: 20px;
            z-index: 10;
            background: rgba(0, 0, 0, 0.5);
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 7px 5px 7px 16px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;

            & .skip {
                display: inline-block;
                width: 25px;
                height: 25px;
                background: url('../assets/icons/skip.svg') no-repeat center center;
                background-size: cover;
            }
        }

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

        &:disabled {
            background: #eee;
            color: #757575
        }
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

    .search-img {}

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
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 74%;
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
    transition: all 0s ease;
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
