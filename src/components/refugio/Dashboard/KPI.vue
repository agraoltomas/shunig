<script setup lang="ts">

const props = defineProps<{ value: number|string, icon?: string, title: string, subtitle?: string }>()
</script>

<template>
    <div class="flex flex-col items-center ">
        <div class="flex flex-row justify-start gap-3 items-center pb-3">
            <div class="bg-refugio-100 rounded-full p-1 h-fit my-auto">
                <slot name="icon">
                    <i :class="['text-refugio-500 p-1 text-xl',icon]"></i>
                </slot>
            </div>
            <div class="font-bold text-4xl px-3">{{ value }}</div>
        </div>
        <div class="w-fit font-bold text-center">{{ title }}</div>
        <div class="text-gray-500 text-sm w-fit">{{ subtitle }}</div>
    </div>
</template>

<style scoped>

</style>