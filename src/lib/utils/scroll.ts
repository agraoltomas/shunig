import { computed, ref } from 'vue'

export const useScroll = (margin: number = 10) => {
    const y = ref(window.scrollY)
    const x = ref(window.scrollX)
    window.addEventListener('scroll', (e) => {
        y.value = window.scrollY
        x.value = window.scrollX
    })
    const isBottom = computed(() => {
        return window.innerHeight + y.value >= (document.documentElement.scrollHeight - margin)
    })
    const isRight = computed(() => {
        return window.innerWidth + x.value >= (document.documentElement.scrollWidth - margin)
    })

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return {
        x, y,
        isBottom,
        isRight,
        scrollToTop
    }

}