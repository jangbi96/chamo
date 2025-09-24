<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './layout/Header.vue'
import Footer from './layout/Footer.vue'
</script>

<template>
    <Header></Header>
    <!-- <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink> -->

    <div class="contents-wrap">
        <RouterView />
    </div>
    <Footer></Footer>
</template>

<style scoped lang="scss">
.contents-wrap {
    padding-top: 72px;
}
</style>
