\
<script setup lang="ts">
import { useTemplateRef, ref, watchEffect, nextTick, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { menu1deptList, menu2deptList } from '@/util'
import { useRoute } from 'vue-router'

const route = useRoute()

const manuState = ref(false)

const menuRef = useTemplateRef<any>('menuRef')
const menuWidths = ref<number[]>([])

const moMenuState = ref(false)
const detailMenuState = ref(Array.from({ length: menu1deptList.length }, () => false))

watchEffect(() => {
    setTimeout(() => {
        if (menuRef.value) {
            menuWidths.value = menuRef.value?.map((el: any) => el.offsetWidth)
        }
    }, 500)
})

watch(
    [() => route.path, () => route.query.secIdx],
    (path) => {
        manuState.value = false
        moMenuState.value = false
    },
    { immediate: true },
)
</script>
<template>
    <div class="dim" v-if="moMenuState" @click="moMenuState = false"></div>

    <div class="header-wrap">
        <div class="mobile-dropdown" v-if="moMenuState">
            <ul class="wrap-one">
                <li v-for="(el1, idx) in menu1deptList">
                    <div
                        class="depth1menu"
                        :class="{ open: detailMenuState[idx] }"
                        @click="detailMenuState[idx] = !detailMenuState[idx]"
                    >
                        <!-- {{ el1.label }} -->
                        <RouterLink v-if="!menu2deptList[idx].length" :to="{ path: el1.url }">{{
                            el1.label
                        }}</RouterLink>
                        <div v-else>{{ el1.label }}</div>
                    </div>
                    <ul class="wrap-two">
                        <li v-for="(el2, i) in menu2deptList[idx]" class="depth2menu">
                            <RouterLink :to="{ path: el1.url, query: el2.query }">{{
                                el2.label
                            }}</RouterLink>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <header class="header">
            <RouterLink to="/">
                <img src="../assets/imgs/logo.png" alt="" class="header-logo" />
            </RouterLink>
            <div class="header-menus">
                <div
                    class="menu-item"
                    ref="menuRef"
                    v-for="item in menu1deptList"
                    @mouseenter="manuState = true"
                    @mouseleave="manuState = false"
                >
                    <RouterLink :to="item.url">{{ item.label }}</RouterLink>
                </div>
                <div class="under-menus" :class="{ active: manuState }">
                    <ul
                        v-for="(item, index) in menu2deptList"
                        :style="{ width: index === 3 ? '200px' : menuWidths?.[index] + 56 + 'px' }"
                    >
                        <li v-for="el in item">
                            <RouterLink :to="{ path: el.path, query: el.query }">{{
                                el.label
                            }}</RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
            <span class="mo-menu" @click="moMenuState = !moMenuState">
                <Icon
                    v-if="!moMenuState"
                    name="ic-ham"
                    class="mr-5 align-middle"
                    :style="{ width: '1.1em' }"
                />
                <Icon v-else name="ic-close" class="mr-5 align-middle" />
            </span>
        </header>
    </div>
</template>

<style scoped lang="scss">
.mobile-dropdown {
    position: fixed;
    top: 72px;
    left: 0;
    width: 100%;
    z-index: 2;
    background: #fff;
    padding: 10px 20px;
    max-height: calc(100vh - 72px);
    overflow: auto;
    display: none;
    @include resize(T) {
        display: block;
    }

    .depth1menu {
        @include font-style(18);
        font-weight: 500;
        height: 64px;
        @include flex(sb, center);
        position: relative;
        &::after {
            position: absolute;
            content: '';
            display: inline-block;
            top: 50%;
            transform: translateY(-50%);
            right: 0;
            height: 7px;
            width: 12px;
            background: url('../assets/imgs/under-arrow.png') no-repeat center / cover;
        }
        &.open {
            &::after {
                transform: translateY(-50%) rotateZ(180deg);
            }
        }
        &.open + .wrap-two {
            max-height: 500px;
            overflow: unset;
        }
    }
    .depth2menu {
        font-weight: 400;
        a {
            display: block;
            padding: 10px 0;
            @include font-style(16);
        }
    }
    .wrap-one {
        position: relative;
        z-index: 3;
    }
    .wrap-two {
        max-height: 0;
        border-radius: 8px;
        background: #f6f6f6;
        padding: 0;
        transition: max-height 0.3s;
        overflow: hidden;
        li {
            padding-bottom: 10px;
            padding-left: 10px;
            &:first-child {
                padding-top: 10px;
            }
        }
    }
}
.dim {
    background: #000000b2;
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    left: 0;
    z-index: 2;
}
.mo-menu {
    display: none;
    @include resize(T) {
        display: block;
    }
}
.header-wrap {
    position: fixed;
    z-index: 5;
    left: 0;
    top: 0;
    width: 100vw;
    background: #fff;
}
.header {
    justify-content: space-between;
    height: 72px;
    width: 70%;
    margin: 0 auto;
    width: 1280px;
    @include flex(sb, center);
    z-index: 2;

    &-menus {
        gap: 56px;
        height: 100%;
        position: relative;
        @include flex(sb, center);
        .menu-item {
            height: 100%;
            font-weight: 500;
            @include font-style(18);
            @include flex(center, center);
            a {
                padding: 10px;
            }
            &:hover {
                a {
                    border-radius: 20px;
                    background: #222;
                    color: #fff;
                }
            }
        }
        .under-menus {
            padding: 20px 0;
            display: none;
            // display: flex;
            position: absolute;
            left: 0;
            z-index: 5;
            top: 72px;
            &.active {
                @include flex(start, start);
            }
            &::before {
                content: '';
                background: rgba(255, 255, 255, 0.95);
                width: 100vw;
                position: fixed;
                height: 180px;
                left: 0;
                z-index: -1;
                top: 72px;
            }

            &:hover {
                @include flex(start, start);
            }
            ul {
                padding: 0 10px;
                @include flex(start, start);
                flex-direction: column;
                gap: 32px;
            }
            a {
                &:hover {
                    font-weight: 500;
                }
                @include font-style(16);
                display: block;
                font-weight: 400;
                color: #333;
            }
        }
        @include resize(T) {
            display: none;
        }
    }

    &-logo {
        // width: 171px;
        height: 40px;
        @include resize(M) {
            max-width: 300px;
            height: auto;
        }
    }
    @include resize(T) {
        width: 100%;
        padding: 0 20px;
    }
    @include resize(M) {
        gap: 20px;
        padding: 0 10px;
    }
}
</style>
