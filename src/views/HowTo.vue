<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import 'vue3-carousel/carousel.css'
import {
    Carousel,
    Slide,
    Pagination as CarouselPagination,
    Navigation as CarouselNavigation,
} from 'vue3-carousel'
import { ref } from 'vue'
const carousel = ref() // Carousel 인스턴스
const carouselConfig = {
    itemsToShow: 1,
    // wrapAround: ,
    touchDrag: true,
}

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
            <li :class="{ active: step === 1 }">1</li>
            <li :class="{ active: step === 2 }">2</li>
            <li :class="{ active: step === 3 }">3</li>
            <li :class="{ active: step === 4 }">4</li>
            <li :class="{ active: step === 5 }">5</li>
        </ul>

        <span class="badge">STEP{{ step }}</span>
        <Carousel v-bind="carouselConfig" ref="carousel" @slide-end="onSlideChange">
            <Slide class="slide-item">
                <h1>
                    네이버 검색창에<br /><em>복사된 키워드</em>를<br />
                    검색해주세요.
                </h1>
                <div class="content-area">
                    <img src="../assets/imgs/step1.png" />
                    <div class="bluearea">
                        <span class="numb">1</span>
                        <p>복사한<br />키워드<br />붙여넣기</p>
                    </div>
                </div>
            </Slide>
            <Slide class="slide-item">
                <h1>
                    네이버 가격비교 탭에서<br /><em>더보기 버튼을</em><br />
                    클릭해주세요.
                </h1>
                <div class="content-area">
                    <img src="../assets/imgs/step2.png" />
                    <div class="bluearea">
                        <span class="numb">2</span>
                        <p>가격비교<br />더보기<br />클릭</p>
                    </div>
                </div>
            </Slide>
            <Slide class="slide-item">
                <h1>
                    상품이 있는 페이지로<br />이동하여<span class="ad"
                        ><img src="../assets/imgs/ad.png" alt="" /></span
                    >표시가 없는<br /><em>미션 상품</em>을 찾아주세요.
                </h1>
                <div class="content-area">
                    <img src="../assets/imgs/step3.png" />
                    <div class="bluearea">
                        <span class="numb">3</span>
                        <p class="sm">
                            상품이 있는<br />페이지로<br />이동 후<br />광고표시 없는<br />상품 찾기
                        </p>
                    </div>
                </div>
            </Slide>
            <Slide class="slide-item">
                <h1>
                    상세페이지 하단의<br /><em>펼쳐보기 버튼</em>을<br />
                    클릭해주세요.
                </h1>
                <div class="content-area">
                    <img src="../assets/imgs/step4.png" />
                    <div class="bluearea">
                        <span class="numb">4</span>
                        <p>상세페이지<br />하단으로<br />이동</p>
                    </div>
                </div>
            </Slide>
            <Slide class="slide-item">
                <h1>
                    <em>첫번째 관련 태그를 암기하고</em><br />
                    미션 화면에서<br />정답을 입력해주세요.
                </h1>
                <div class="content-area">
                    <img src="../assets/imgs/step5.png" />
                    <div class="bluearea">
                        <span class="numb">5</span>
                        <p>첫번째<br />관련 태그<br />기억하기</p>
                    </div>
                </div>
            </Slide>
        </Carousel>

        <div class="foot-btns">
            <button class="prevbtn" @click="prevSlide">
                <Icon name="ic-prev" class="mr-5" />
                이전
            </button>
            <button class="nextbtn" @click="nextSlide">
                다음
                <Icon name="ic-next" class="ml-5" />
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
    justify-content: center;
    align-items: center;
}
.steps {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;

    &::before {
        content: '';
        display: inline-block;
        z-index: -1;
        position: absolute;
        border-top: 2px dotted #afafaf;
        width: 100%;
    }
    gap: 20px;
    li {
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 50%;
        background: #afafaf;
        color: #fff;
        text-align: center;
        font-size: 14px;

        &.active {
            background: #04c75b;
            width: 30px;
            height: 30px;
            line-height: 30px;
            font-size: 20px;
            font-weight: 500;
        }
    }
}

.badge {
    color: #04c75b;
    border: 2px solid #04c75b;
    border-radius: 30px;
    text-align: center;
    display: inline-block;
    padding: 5px 15px;
    font-size: 18px;
    background: #fff;
    margin-top: 25px;
    margin-bottom: 20px;
}
.slide-item {
    display: flex;
    flex-direction: column;
    h1 {
        text-align: center;
        line-height: 1.2;
        font-weight: 600;
        margin-bottom: 30px;
        em {
            color: #04c75b;
        }
    }
}
.content-area {
    position: relative;
    img {
        width: 60%;
    }
    .bluearea {
        position: absolute;
        top: 0;
        width: 50%;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        padding: 35px 0;
        padding-left: 45px;
        z-index: -1;

        background: rgba(0, 107, 255, 0.8);
        .numb {
            background: #bdf4d3;
            display: inline-block;
            width: 33px;
            height: 33px;
            border-radius: 50%;
            text-align: center;
            line-height: 33px;
            font-size: 25px;
            color: rgba(0, 107, 255, 0.8);
            margin-bottom: 15px;
        }
        p {
            color: #fff;
            font-size: 23px;
            line-height: 1.15;
            &.sm {
                font-size: 20px;
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
