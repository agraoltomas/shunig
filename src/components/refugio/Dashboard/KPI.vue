<script setup lang="ts">

const props = defineProps<{ value: number|string, icon?: string, title: string, subtitle?: string, to?: string }>()
</script>

<template>
    <div class="flex flex-col items-center ">
        <div class="flex flex-row justify-start gap-3 items-center pb-3">
            <div class="bg-refugio-100 rounded-full p-1 h-fit my-auto">
                <slot name="icon">
                    <i :class="['text-refugio-500 p-1 text-xl',icon]" aria-hidden="true"></i>
                </slot>
            </div>
            <div class="font-bold text-4xl px-3">{{ value }}</div>
        </div>
        <RouterLink v-if="to" :to="to" class="w-fit font-bold text-center text-refugio-500 hover:underline text-md">{{ title }}<i class="my-auto pi pi-arrow-right ml-1" style="font-size:10px;"></i>
        </RouterLink>
        <div v-else class="w-fit font-bold text-center">{{ title }}</div>
        <div class="text-gray-500 text-sm w-fit">{{ subtitle }}</div>
    </div>
</template>

<style scoped>

</style>