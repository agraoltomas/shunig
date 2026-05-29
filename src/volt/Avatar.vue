<script setup lang="ts">
defineProps<{
    label?: string
    image?: string
}>()
</script>

<template>
    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-surface-300 font-semibold">
        <img
            v-if="image"
            :src="image"
            alt="Avatar"
            class="h-full w-full rounded-full object-cover"
        />

        <span v-else>
            {{ label?.charAt(0)?.toUpperCase() ?? '?' }}
        </span>
    </div>
</template>

<style scoped>
</style>