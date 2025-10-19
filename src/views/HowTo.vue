<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination as CarouselPagination, Navigation as CarouselNavigation } from 'vue3-carousel'
import { ref } from 'vue'
const carousel = ref() // Carousel 인스턴스
const carouselConfig = {
    itemsToShow: 1,
    // wrapAround: ,
    touchDrag: true,
}
const router = useRouter()

const step = ref(1)

const prevSlide = () => {
    carousel.value?.prev()
}
const nextSlide = () => {
    carousel.value?.next()
}

// 슬라이드가 바뀔 때 이벤트로도 자동 갱신 (공식 이벤트)
const onSlideChange = (a: any) => {
    console.log(a)
    step.value = a.currentSlideIndex + 1 // index는 0부터 시작하므로 +1
}
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
                <img src="../assets/imgs/step1.png" />
            </Slide>
            <Slide class="slide-item">
                <h1>가격비교 탭에서<br /><em>더보기 버튼 클릭</em></h1>
                <p>
                    <span class="circle"></span>

                    네이버 앱 가격비교 탭에서<br />가격 더보기를 클릭해주세요.
                </p>
                <img src="../assets/imgs/step2.png" />
            </Slide>
            <Slide class="slide-item">
                <h1>상품이 페이지에서<br /><em>미션상품을 찾기</em></h1>
                <p>
                    <span class="circle"></span>
                    <span class="ad"></span><em class="han">표시 제외</em>하고 상품을<br />
                    찾아주세요.
                </p>
                <img src="../assets/imgs/step3.png" />
            </Slide>
            <Slide class="slide-item">
                <h1>상세페이지 하단의<br /><em>펼쳐보기 버튼 클릭</em></h1>
                <p>
                    <span class="circle"></span>

                    상세페이지 하단으로 이동
                </p>
                <img src="../assets/imgs/step4.png" />
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
                <img src="../assets/imgs/step5.png" />
            </Slide>
        </Carousel>

        <div class="foot-btns">
            <button class="prevbtn" @click="prevSlide">이전</button>
            <button
                class="nextbtn"
                @click="
                    () => {
                        if (step === 5) {
                            router.push({ path: '/main', query: { mission: 'true' } })
                        }
                        {
                            nextSlide()
                        }
                    }
                "
            >
                {{ step == 5 ? '미션 바로하기' : '다음' }}
            </button>
        </div>
    </section>
</template>

<style scoped lang="scss">
.section {
    background: #f8f8f8;
    padding: 50px 0;
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
    margin-bottom: 20px;
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
    h1 {
        text-align: center;
        line-height: 1.2;
        font-weight: 600;
        margin-bottom: 10px;
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
    img {
        width: 90%;
    }
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
        font-weight: 600;
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
</style>
