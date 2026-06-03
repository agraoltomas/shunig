<script setup lang="ts">

import Label from '@/components/forms/Label.vue'
import type { Maybe } from '@/lib/tipos/generics'
const props = withDefaults(defineProps<{ label: string, data: Maybe<string|number>, variant?: ('horizontal'|'vertical'), icon?: string }>(),{
    variant: 'vertical',
})
</script>

<template>
    <div v-if="variant == 'vertical'" class="flex flex-col">
        <Label class="">{{label}}</Label>
        <div class="text-lg! font-normal! text-gray-500 wrap-break-word">{{ data }}</div>
    </div>
    <div v-else-if="variant == 'horizontal'" class="flex flex-row justify-between">
        <i v-if="icon" :class="[icon, 'px-2 text-slate-400']"></i>
        <div class=" font-semibold  text-slate-400"> {{ label.toUpperCase() }}</div>
        <div>{{ data }}</div>
    </div>
</template>

<style scoped>

</style>