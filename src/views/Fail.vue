<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import 'vue3-carousel/carousel.css'
import { onMounted, ref } from 'vue'
import { useMissionStore } from '../stores/useMissionStore'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const close = () => {
    // window.location.href = 'about:blank'
    // window.open('', '_self').close()
    window.close()
}
const missionStore = useMissionStore()
function toQueryString(obj: Record<string, any>): string {
    const params = new URLSearchParams()
    for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
            params.append(key, String(obj[key]))
        }
    }
    return params.toString()
}
async function getData() {
    const queryParams = route.query

    try {
        const params = {
            logId : route.query.logId,
            changeYn : 'N'
        }


        const res: any = await axios.get(
            `https://admin.lightning.ai.kr/api/mission/info?${toQueryString(params)}`,
        )

        // store에 데이터 저장
        // missionStore.setData(res.data)
        missionStore.setData(res.data)

        router.push({ path: '/', query: { ...queryParams, fromfail: 'true' } })
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    if (!missionStore.data) {
        // 현재 쿼리 파라미터 가져오기

        getData()
    }
})
</script>

<template>
    <section class="complete">
        <h1>참여할 수 있는<br />미션이 없어요.😥</h1>
        <p>잠시 후 다시 시도해주세요</p>
        <div class="obs">
            <img src="../assets/imgs/box.png" />
        </div>
        <button class="end" @click="() => getData()">이전 화면으로 돌아가기</button>
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
