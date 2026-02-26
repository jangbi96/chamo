<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import 'vue3-carousel/carousel.css'
import { useMissionStore } from '../stores/useMissionStore'
import { useShowvideoStore } from '../stores/useShowvideoStore'

import {
    Carousel,
    Slide,
    Pagination as CarouselPagination,
    Navigation as CarouselNavigation,
} from 'vue3-carousel'
import { onMounted, ref } from 'vue'
import { useCopyCountStore } from '@/stores/useCopyCountStore'
const carousel = ref() // Carousel 인스턴스
const carouselConfig = {
    itemsToShow: 1,
    // wrapAround: ,
    touchDrag: true,
}

const missionStore = useMissionStore()
const viewVideo = useShowvideoStore()
const router = useRouter()
const route = useRoute()

const step = ref(1)
const copyCnt = useCopyCountStore();

function toQueryString(obj: Record<string, any>): string {
    const params = new URLSearchParams()
    for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
            params.append(key, String(obj[key]))
        }
    }
    return params.toString()
}
function openNaverAppForApple() {
    const keyword = encodeURIComponent(missionStore.data.workKeyword)

    const bridgeDomain = missionStore.data.bridgeDomain
    const externalUrl = missionStore.data.extenalUrl

    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // 이미 브릿지에서 온 페이지인가
    const alreadyfb = !!route.query.fb
    function base64UrlEncode(str: string) {
        const b64 = btoa(
            new TextEncoder()
                .encode(str)
                .reduce((acc, byte) => acc + String.fromCharCode(byte), ''),
        );
        return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    }

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


}
const prevSlide = () => {
    if (step.value === 1) {
        viewVideo.setData(true)
        router.push({ path: '/', query: { ...route.query, mission: 'false' } })
    }
    carousel.value?.prev()
}
const nextSlide = () => {
    if (step.value === 5) {
        if (missionStore.data?.screenType === '2') {
            openNaverAppForApple()
        } else {
            router.push({
                path: '/',
                query: {
                    ...route.query,
                    mission: 'true',
                    screenType: missionStore.data?.screenType,
                },
            })
        }
        // sessionStorage.setItem('novideo', 'true')
        // viewVideo.setData(true)
    }

    carousel.value?.next()
}
function addComma(num: string | number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? ''
}

// 슬라이드가 바뀔 때 이벤트로도 자동 갱신 (공식 이벤트)
const onSlideChange = (a: any) => {
    console.log(a)
    step.value = a.currentSlideIndex + 1 // index는 0부터 시작하므로 +1
}

onMounted(() => {

    if (!missionStore.data) {
        const query = route.query
        delete query.fb
        router.push({ path: '/', query })
    }
})
</script>

<template>
    <!-- <Icon name="ic-ham" class="mr-5 align-middle" :style="{ width: '' }" /> -->

    <section class="section">
        <ul class="steps">
            <li v-for="item in 5" :key="item" :class="{ active: step === item }"></li>
        </ul>
        <Carousel v-bind="carouselConfig" ref="carousel" @slide-end="onSlideChange">
            <Slide class="slide-item">
                <h1>
                    검색창에 <em>키워드를<br />검색</em>해주세요.
                </h1>
                <p>
                    <span class="circle"></span>
                    네이버 앱 복사한 키워드를<br />
                    붙여넣어 주세요.
                </p>
                <div class="slide-wrap">
                    <strong class="slide1-txt">{{ missionStore.data?.workKeyword }}</strong>
                    <img src="../assets/imgs/step1_new.png" />
                </div>
            </Slide>
            <Slide class="slide-item">
                <h1>가격비교 탭에서<br /><em>더보기 버튼 클릭</em></h1>
                <p>
                    <span class="circle"></span>

                    네이버 앱 가격비교 탭에서<br />가격 더보기를 클릭해주세요.
                </p>
                <div class="slide-wrap">
                    <strong class="slide2-txt">{{ missionStore.data?.workKeyword }}</strong>
                    <img src="../assets/imgs/step2_new.png" />
                </div>
            </Slide>
            <Slide class="slide-item third">
                <h1>상품이 페이지에서<br /><em>미션상품을 찾기</em></h1>
                <p>
                    <span class="circle"></span>
                    <span class="ad"></span><em class="han">표시 제외</em>하고 상품을<br />
                    찾아주세요.
                </p>
                <div class="slide-wrap">
                    <div class="slide3-txt">
                        <img :src="missionStore.data?.imageUrl" alt="" />
                        <dl>
                            <dt>{{ missionStore.restText }}</dt>
                            <dd>
                                <span>{{ addComma(missionStore.data?.lprice || '') }}원</span>
                                <em>{{ missionStore.data?.mallName }}</em>
                            </dd>
                        </dl>
                    </div>
                    <img src="../assets/imgs/step3_new.png" />
                </div>
            </Slide>
            <Slide class="slide-item">
                <h1>상세페이지 하단의<br /><em>펼쳐보기 버튼 클릭</em></h1>
                <p>
                    <span class="circle"></span>

                    상세페이지 하단으로 이동
                </p>
                <div class="slide-wrap">
                    <img src="../assets/imgs/step4.png" />
                </div>
            </Slide>
            <Slide class="slide-item">
                <h1>
                    <em>첫번째 관련 태그를 암기</em>
                </h1>
                <p>
                    <span class="circle"></span>

                    미션 화면에서<br />
                    정답을 입력해주세요.
                </p>
                <div class="slide-wrap">
                    <img src="../assets/imgs/step5.png" />
                </div>
            </Slide>
        </Carousel>

        <div class="foot-btns">
            <button class="prevbtn" @click="prevSlide">이전</button>
            <button class="nextbtn" @click="nextSlide">
                {{ step == 5 ? '미션 바로하기' : '다음' }}
            </button>
        </div>
    </section>
</template>

<style scoped lang="scss">
.section {
    background: #f8f8f8;
    padding: 10% 0;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
}

.steps {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    gap: 5px;
    margin-bottom: 4%;

    li {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #d1d5d9;

        &.active {
            background: #04c75b;
        }
    }
}

.slide-item {
    display: flex;
    flex-direction: column;
    justify-content: start;

    h1 {
        text-align: center;
        line-height: 1.2;
        font-weight: 600;
        margin-bottom: 10px;
        font-size: 25px;

        em {
            color: #04c75b;
        }
    }

    p {
        width: 90%;
        color: #989898;
        font-size: 16px;
        text-align: center;
        line-height: 1.4;
        margin-bottom: 30px;
        position: relative;

        .circle {
            top: -2px;
            position: absolute;
            left: 15%;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            display: inline-block;
            background: rgba(3, 204, 100, 0.2);
            @include flex();
            align-items: center;
            justify-items: center;

            &::before {
                content: '';
                width: 11px;
                height: 11px;
                border-radius: 50%;
                display: inline-block;
                background: #03cc64;
            }

            &::after {
                content: '';
                width: 40px;
                height: 338px;
                display: inline-block;
                border-top: 1px solid #03cc64;
                border-left: 1px solid #03cc64;
                left: -28px;
                position: absolute;
                top: 12px;
                z-index: -1;
            }
        }
    }

    .slide-wrap {
        position: relative;
        width: 90%;

        .slide1-txt,
        .slide2-txt,
        .slide3-txt {
            position: absolute;
        }

        &:last-of-type {
            img {
                margin: 0 auto;
            }
        }

        .slide1-txt {
            top: 26.8%;
            font-weight: 500;
            font-size: 25px;
            color: #03cc64;
            left: 50%;
            transform: translateX(-50%);
            width: max-content;
        }

        .slide2-txt {
            color: #525a61;
            left: 25%;
            top: 11.4%;
            font-weight: 600;
            width: max-content;
        }

        .slide3-txt {
            display: flex;
            top: 43.8%;
            left: 6.1%;
            width: 90%;
            justify-content: start;

            img {
                max-height: 80px;
                height: max-content;
                margin: unset;
                margin-left: 5px;
                width: 28%;
                border-radius: 5px;
            }

            dl {
                margin-left: 10px;
            }

            dt {
                color: #40474d;
                font-weight: 600;
                font-size: 14px;
                line-height: 1.1;
                margin-bottom: 3px;
                word-break: keep-all;
            }

            span {
                display: block;
                color: #636c73;
                font-size: 15px;

                font-weight: 700;
                margin-bottom: 2px;
            }

            em {
                color: #636c73;
                font-size: 15px;
                font-weight: 500;
            }
        }
    }

    img {}

    .ad {
        width: 52px;
        height: 20px;
        vertical-align: middle;
        margin-right: 5px;
        display: inline-block;
        background: url('../assets/imgs/ad.png') no-repeat center / cover;
    }

    .han {
        font-weight: 600;
        color: #444444;
    }

    &:first-child {
        .circle {
            &::after {
                height: 220px;
            }
        }
    }

    &:nth-child(2) {
        .circle {
            &::after {
                height: 428px;
            }
        }
    }

    &:nth-child(4) {
        .circle {
            &::after {
                height: 310px;
            }
        }
    }

    &:last-child {
        .circle {
            &::after {
                height: 352px;
            }
        }
    }
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
        font-weight: 500;
    }

    .prevbtn {
        background: #f2f2f4;
    }

    .nextbtn {
        background: #04c75b;
        color: #fff;
    }

    svg {
        position: relative;
        top: 3px;
    }
}

.ad {
    img {
        width: 50px;
        display: inline-block;
        margin: 0 5px;
    }
}

.slide-item {
    position: relative;

    &.third {
        .slide3-txt {
            top: 44%;
            left: 8.7%;
            width: 83%;
        }

        img {
            width: 91%;
        }
    }
}
</style>

function onbeforeMounted(arg0: () => void) { throw new Error('Function not implemented.') } function
onBeforeMounted(arg0: () => void) { throw new Error('Function not implemented.') }
