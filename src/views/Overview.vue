<script setup lang="ts">
import {
    ref,
    computed,
    useTemplateRef,
    watchEffect,
    watch,
    nextTick,
    onMounted,
    type ComputedRef,
} from 'vue'
import { RouterLink } from 'vue-router'
import { useScroll } from '@/composables/useScroll'
import SubBanner from '@/layout/SubBanner.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const subGnbRef = useTemplateRef<any>('subGnbRef')
const backSecRef = useTemplateRef<any>('backSecRef')
const visionSecRef = useTemplateRef<any>('visionSecRef')
const subGnbOffsetTop = computed(() => subGnbRef.value?.offsetTop ?? 0)
const { y } = useScroll()

const gnbFixed = ref(false)

const scrollFn = (idx: number) => {
    window.scrollTo({
        top: idx ? visionSecRef.value?.offsetTop : backSecRef.value?.offsetTop - 144,
        behavior: 'smooth',
    })
}

// watchEffect(() => {
//     if (subGnbOffsetTop.value) {
//         const newOffset = y.value + 72
//         gnbFixed.value = newOffset >= subGnbOffsetTop.value
//     }
// })

// watch(
//     () => route.query.secIdx,
//     async (newId) => {
//         if (!newId) return
//         await nextTick()
//         await nextTick()

//         scrollFn(Number(newId))
//     },
//     { immediate: true },
// )
// watchEffect(() => {
//     if (backSecRef.value && visionSecRef.value && route.query.secIdx) {
//         scrollFn(Number(route.query.secIdx))
//     }
// })
</script>
<template>
    <SubBanner type="overview">
        <span class="sm-tit">VR·AR·XR 학습 콘텐츠</span>
        <h1 class="lg-tit">이제 OpenVLab에서 만나다</h1>
        <p class="sub-tit">가상에서 배우고 현실을 바꾸는 연결의 시작</p>
    </SubBanner>
    <!-- <div class="d-flex sub-gnb" ref="subGnbRef" :class="{ fixed: gnbFixed }">
        <div
            class="gnb-item"
            :class="{ active: y + 144 < visionSecRef?.offsetTop }"
            @click="() => scrollFn(0)"
        >
            출범 배경
        </div>
        <div
            class="gnb-item"
            :class="{ active: y + 144 >= visionSecRef?.offsetTop }"
            @click="() => scrollFn(1)"
        >
            비전 및 전략
        </div>
    </div> -->
    <div class="inner" :class="{ fixed: gnbFixed }">
        <section class="back-sec" ref="backSecRef">
            <h2>
                이런 고민,<br class="mo-show" />
                하지 않으셨나요?
            </h2>
            <p class="dsc">
                교육 현장은 기존의 일방향 강의 영상에서 학습자 중심, 상호작용형 콘텐츠가 중심이 되고
                있습니다.<br class="pc-show" />
                AI와 XR 기반 기술을 적용한 실감형 학습 콘텐츠는 꾸준히 늘어나고 있습니다.<br
                    class="pc-show"
                />
                이들 대부분은 개별 기관 내부에 고립되어 있으며 교육 현장을 연결한 공공 시스템은
                여전히 부족합니다.
            </p>
            <ul class="info-list f-column">
                <li>여러 기관에서 제작한 가상실험실습 학습콘텐츠, 어디 있는지 알기 어려워요.</li>
                <li>콘텐츠를 만들었지만, 외부에 공유하거나 확산할 방법이 없어요.</li>
                <li>장비ㆍ플랫폼ㆍ파일 포맷이 제각각이라 확장도, 연동도 어려워요.</li>
                <li>같은 분야의 콘텐츠가 중복으로 구축되고 있어요.</li>
                <li>학습 데이터를 쌓고 분석할 마땅한 기반이 없어요.</li>
            </ul>

            <div class="final-mention">
                <h4>OpenVLab은 이런 현실을 바꾸기 위해<br class="pc-show" />만들어졌습니다.</h4>
                <p>
                    기관과 기술, 학습자와 데이터를 유기적으로 연결하는 <em>공공 공유 플랫폼,</em
                    ><br class="pc-show" />
                    이제<em>실감형 교육의 중심 허브</em>가 되어드립니다.
                </p>
            </div>
        </section>
        <section class="vision-sec" ref="visionSecRef"></section>
    </div>
</template>

<style scoped lang="scss">
.sub-gnb {
    border-bottom: 1px solid #ddd;
    height: 72px;
    @include flex(center, center);
    position: static;
    background: #fff;

    &.fixed {
        position: fixed;
        top: 72px;
        left: 0;
        width: 100%;
    }
    .gnb-item {
        height: 100%;
        max-width: 640px;
        @include font-style(18);
        @include flex(center, center);
        font-weight: 600;
        flex-grow: 1;
        &.active {
            border-bottom: 3px solid #111;
        }
    }
}
section {
    max-width: 1280px;
    margin: 0 auto;
    @include resize(T) {
        padding: 0 20px;
        max-width: unset;
        width: 100%;
    }
}
.inner.fixed {
    padding-top: 72px;
}
.back-sec {
    padding-top: 100px;
    @include flex(center, center);
    flex-direction: column;
    h2 {
        @include font-style(40);
        font-weight: 700;
        margin-bottom: 50px;
        @include resize(T) {
            @include font-style(32);
            text-align: center;
            line-height: 1.5;
            margin-bottom: 20px;
        }
    }
    .dsc {
        @include font-style(18);
        line-height: 2;
        color: #333;
        text-align: center;
        margin-bottom: 55px;
        @include resize(T) {
            @include font-style(18);
            text-align: center;
            line-height: 1.8;
            margin: 32px 0 64px 0;
            font-weight: 300;
        }
    }
}
.info-list {
    @include flex(center, center);
    gap: 24px;
    @include resize(T) {
        gap: 16px;
    }
    li {
        padding: 20px;
        border: 1px solid #111;
        border-radius: 30px;
        font-weight: 500;
        @include font-style(19);
        &:nth-child(2n) {
            border: 1px solid #333;
            background: #fff;
        }
        &:nth-child(2n + 1) {
            background: #111;
            color: #fff;
        }
        @include resize(T) {
            @include font-style(20);
            padding: 15px 20px;

            text-align: center;
            border-radius: 16px;
            line-height: 1.8;
            font-weight: 500;
        }
    }
}
.final-mention {
    width: 100%;
    height: 400px;
    margin-top: 120px;
    background:
        linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
        url('../assets/imgs/overview-bg.png') no-repeat center 0 / cover;
    border-radius: 40px;
    @include flex(center, center);
    flex-direction: column;
    @include resize(T) {
        height: 358px;
        padding: 0 30px;
        background:
            linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
            url('../assets/imgs/overview-bg.png') no-repeat center / cover;
    }
    h4,
    p {
        text-align: center;
        color: #fff;
    }
    h4 {
        @include font-style(40);
        font-weight: 700;
        line-height: 1.5;
        @include resize(T) {
            @include font-style(24);
            line-height: 1.5;
        }
    }
    p {
        @include font-style(18);
        font-weight: 300;
        line-height: 1.8;
        margin-top: 30px;
        em {
            font-weight: 500;
        }
    }
}
.vision-sec {
    padding: 200px 0;
    h2 {
        font-weight: 700;
        @include font-style(40);
        text-align: center;
        line-height: 1.5;
        margin-bottom: 100px;
        strong {
            color: #00a0e9;
        }
        @include resize(T) {
            @include font-style(32);
        }
    }

    .circles {
        position: relative;
        width: 600px;
        margin: 0 auto;
        height: 600px;
        z-index: -1;

        background: url('../assets/imgs/ring-bg.png') no-repeat center / auto 600px;
        @include resize(T) {
            background: none;
            width: 100%;
            height: unset;
            @include flex;
            flex-direction: column;
            gap: 40px;
        }
    }
    .circle {
        display: flex;
        position: absolute;
        ul {
            position: absolute;
            width: max-content;
            display: flex;
            flex-direction: column;
            gap: 15px;
            top: 50%;
            transform: translateY(-50%);

            li {
                @include font-style(18);
                font-weight: 300;
                &::before {
                    content: '';
                    display: inline-block;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #111;
                    margin-right: 8px;
                    vertical-align: middle;
                }
                @include resize(T) {
                    position: static;
                    transform: unset !important;
                    width: 100%;
                    margin-bottom: 15px;
                    line-height: 1.3;
                    text-indent: -12px;
                }
            }
            @include resize(T) {
                position: static;
                transform: unset;
                display: block;
                text-align: left;
                width: 100%;
                margin-top: 35px;
                padding-left: 20px;
            }
        }
        span {
            display: inline-block;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            color: #fff;
            @include font-style(24);
            font-weight: 500;
            @include flex(center, center);
            text-align: center;
            line-height: 1.4;
            @include resize(T) {
                width: 160px;
                height: 160px;
                @include font-style(20);
                font-weight: 600;
            }
        }
        &.one {
            left: 50%;
            transform: translateX(-50%);

            span {
                background: #00a3f5;
                box-shadow: 24px 24px 40px 0 #00a3f53d;
            }
            ul {
                left: calc(100% + 30px);
            }
            @include resize(T) {
                transform: unset;
                left: unset;
            }
        }
        &.two {
            bottom: 0;
            left: 0;
            span {
                background: #0058cc;
                box-shadow: 24px 24px 40px 0 #0058cc3d;
            }
            ul {
                right: calc(100% + 30px);
                text-align: right;
            }
        }
        &.three {
            bottom: 0;
            right: 0;

            span {
                background: #00b1cc;
                box-shadow: 24px 24px 40px 0 #00b1cc3d;
            }
            ul {
                left: calc(100% + 30px);
            }
        }
        @include resize(T) {
            position: static;
            flex-direction: column;
            align-items: center;
            width: 100%;
            li {
                text-align: left;
            }
        }
    }
    @include resize(T) {
        padding: 150px 20px;
    }
}
</style>
