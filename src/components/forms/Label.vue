<script setup lang="ts">
const props = withDefaults(defineProps<{
    required?: boolean
}>(),{
    required: false
})
</script>

<template>
        <label :class="['font-semibold text-lg whitespace-nowrap', required ? 'after:pl-1 after:content-[\'*\'] after:font-bold after:text-red-500' : '']">
        <slot></slot>
    </label>
</template>

<style scoped>

</style>