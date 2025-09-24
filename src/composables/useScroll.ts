import { ref, onMounted, onUnmounted } from 'vue'

export function useScroll() {
    const y = ref(0)

    function update(e: Event) {
        y.value = (e.target as Document).scrollingElement?.scrollTop || 0
    }

    onMounted(() => window.addEventListener('scroll', update))
    onUnmounted(() => window.removeEventListener('scroll', update))

    // 관리 상태를 반환 값으로 노출
    return { y }
}
