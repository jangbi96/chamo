<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <!-- <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink> -->

    <div class="contents-wrap">
        <RouterView />
    </div>
</template>

<style scoped lang="scss">
.contents-wrap {
    max-width: 768px;
    margin: 0 auto;
}
</style>
