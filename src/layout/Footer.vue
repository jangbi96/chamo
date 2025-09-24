\
<script setup lang="ts">
import { useTemplateRef, ref, watchEffect, nextTick, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { menu1deptList, menu2deptList } from '@/util'
import { useRoute } from 'vue-router'
</script>
<template>
    <div class="footer">
        <div class="inner">
            <div class="aaa d-flex">
                <img src="../assets/imgs/logo-footer.svg" alt="" />
                <dl class="d-flex ai-center">
                    <dt>문의</dt>
                    <dd>
                        <a href="mailto:openvlab@knou.ac.kr"
                            >OpenVLab 구축사업단 openvlab@knou.ac.kr</a
                        >
                    </dd>
                </dl>
            </div>
            <span class="copyright">COPYRIGHT(C) OpenVLab. ALL RIGHTS RESERVED</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.footer {
    height: 60px;
    background: #f6f6f6;
    border-top: 1px solid #ddd;
    .inner {
        @include flex(sb, center);
        max-width: 1280px;
        margin: 0 auto;
        height: 100%;
        h5 {
            @include font-style(22);
            font-weight: 600;
            margin-right: 50px;
            @include resize(M) {
                margin-bottom: 20px;
                @include font-style(20);
            }
        }
        dl {
            dt {
                @include font-style(16);
                font-weight: 500;
                color: #333;

                &::after {
                    content: '';
                    width: 1px;
                    display: inline-block;
                    height: 16px;
                    background: #ddd;
                    margin: 0 10px;
                    @include resize(M) {
                        height: 14px;
                    }
                }
                @include resize(M) {
                    @include font-style(14);
                }
            }
            dd {
                @include font-style(16);
                color: #333;
                a {
                    text-decoration: underline;
                }
                // border-bottom: 1px solid #333;
                @include resize(M) {
                    @include font-style(14);
                }
            }
            @include resize(T) {
                margin-bottom: 15px;
            }
        }
        @include resize(T) {
            flex-direction: column;
            align-items: start;
            justify-content: start;
            // padding: 40px 20px;
        }
    }
    @include resize(T) {
        padding: 20px;
        height: auto;
    }
    @include resize(M) {
        padding: 10px 20px;
        height: auto;
    }
}
.copyright {
    color: #555;
    @include font-style(16);
    font-weight: 400;
    @include resize(M) {
        @include font-style(13);
    }
}
.aaa {
    align-items: center;
    img {
        max-width: 255px;
        margin-right: 50px;
        @include resize(M) {
            max-width: 230px;
        }
    }
    @include resize(T) {
        flex-direction: column;
        align-items: start;
        gap: 7px;
    }
}
</style>
