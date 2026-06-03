<script setup lang="ts">

import { computed, onMounted, ref, useTemplateRef, watchEffect } from 'vue'
import ProgressSpinner from '@/volt/ProgressSpinner.vue'

const props = defineProps<{ loading: boolean }>()
const loadingAlways = ref(true);
const slot = useTemplateRef("slot")
onMounted(() => {
    console.log(slot.value?.children)
})
watchEffect(() => {})
const classes = computed(() => {
    const mainChild = slot.value?.children[0] as HTMLElement;
    return mainChild ? Array.from(mainChild.classList).join(' ') : '';
})

</script>

<template>
    <div :hidden="!loading" :class="classes">
        <ProgressSpinner></ProgressSpinner>
    </div>
    <div ref="slot" :hidden="loading">
        <slot name="default"></slot>
    </div>
</template>

<style scoped>

</style>