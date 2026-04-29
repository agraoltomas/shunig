<script setup lang="ts">

import Label from '@/components/forms/Label.vue'
import type { Maybe } from '@/lib/tipos/generics'
const props = defineProps<{ label: string, data: Maybe<string|number> }>()
</script>

<template>
    <div class="flex flex-col">
        <Label class="">{{label}}</Label>
        <div class="text-lg! font-normal! text-gray-500 wrap-break-word">{{ data }}</div>
    </div>
</template>

<style scoped>

</style>