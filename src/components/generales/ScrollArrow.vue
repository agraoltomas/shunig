<script setup lang="ts">
import { useScroll } from '@/lib/utils/scroll.ts'

const { isBottom, scrollToTop } = useScroll()
</script>

<template>
    <div class="fixed top-[92vh] left-[95vw] mx-auto rounded-full bg-slate-100 p-1">
        <span v-if="!isBottom" class="pi pi-arrow-down text-2xl text-slate-400"></span>
        <span v-else class="pi pi-arrow-up text-xl text-slate-400" @click="scrollToTop"></span>
    </div>
</template>

<style scoped>

</style>