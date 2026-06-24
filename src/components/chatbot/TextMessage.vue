<script setup lang="ts">
const props = defineProps<{ mensaje: }>()
</script>

<template>
    <div
         :class="['p-3 bg-gray-200 rounded-lg flex flex-col ',mensaje.role == 'user' ? 'bg-primary-100/60' : 'bg-refugio-100/60']">
        <div class="">{{ mensaje.content }}</div>
        <div class="text-sm text-gray-500 w-fit self-end">{{ mensaje.time.format('HH:mm') }}</div>
    </div>
</template>

<style scoped>

</style>