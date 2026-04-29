<script setup lang="ts">
import type { User } from '@/lib/tipos/usuarios'

const props = defineProps<{ user: User }>()
</script>

<template>
    <div class="flex flex-col">
        <div  class="size-10 rounded-full border-2 border-white mx-3 p-2 bg-[#eadec6] text-3xl pb-3 leading-[0.5] select-none cursor-pointer ">
            {{ user.nombre[0] }}
        </div>
        <span class="m-auto font-semibold text-white text-xs select-none">{{ user.nombre }}</span>
        <span class="m-auto font-semibold text-white text-xs select-none">{{ user.apellido }}</span>
    </div>
</template>

<style scoped>

</style>