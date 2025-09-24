<script setup lang="ts">
import { ref, defineProps } from 'vue'

const props = defineProps<{
    type: string
}>()

const feature = ref()
</script>
<template>
    <div class="subbanner" :class="props.type">
        <slot></slot>
    </div>
</template>
<style scoped lang="scss">
.subbanner {
    height: 380px;
    @include flex(center, center);
    flex-direction: column;

    color: #fff;

    :deep(h1) {
        @include font-style(64);
        font-weight: 700;

        margin: 20px 0 40px;
        @include resize(M) {
            @include font-style(32);
            font-weight: 700;
        }
    }
    :deep(.sm-tit) {
        @include font-style(18);
        font-weight: 400;
    }
    :deep(.sub-tit) {
        @include font-style(24);
        font-weight: 500;
        @include resize(M) {
            @include font-style(20);
            font-weight: 600;
        }
    }
    &.overview {
        background: url('../assets/imgs/sub-bg-01.png') no-repeat center / cover;
        @include resize(M) {
            background: url('../assets/imgs/sub-bg-m-01.png') no-repeat center / cover;
        }
    }
    &.about {
        background: url('../assets/imgs/sub-bg-02.png') no-repeat center / cover;
        @include resize(M) {
            background: url('../assets/imgs/sub-bg-m-02.png') no-repeat center / cover;
        }
    }
    &.experience {
        background: url('../assets/imgs/sub-bg-03.png') no-repeat center / cover;
        @include resize(M) {
            background: url('../assets/imgs/sub-bg-m-03.png') no-repeat center / cover;
        }
    }
    &.hearing {
        background: url('../assets/imgs/sub-bg-04.png') no-repeat center / cover;
        @include resize(M) {
            background: url('../assets/imgs/sub-bg-m-04.png') no-repeat center / cover;
        }
    }
}
</style>
