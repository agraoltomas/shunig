<script setup lang="ts">

import Contenedor from '@/components/generales/Contenedor.vue'
const props = defineProps<{title: string, icon?: string, class?: string}>()
</script>

<template>
    <Contenedor :class="[props.class, 'flex flex-col gap-3']">
        <div v-if="title" class="flex flex-row text-xl gap-3 pb-3">
            <div v-if="icon" class="bg-primary-200/30 rounded-full p-1 min-w-9 text-center">
                <i  :class="['text-primary-500 text-center', icon]"></i>
            </div>
            <div class="font-semibold h-fit my-auto">{{ title }}</div>
        </div>
        <slot></slot>
    </Contenedor>
</template>

<style scoped>

</style>