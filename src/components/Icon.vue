<!-- src/components/SvgIcon.vue -->

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  class?: string
}>()

  const svgClass = computed(() => ['svg-icon', props.class].filter(Boolean).join(' '))
</script>

<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
