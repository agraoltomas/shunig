<script setup lang="ts">
const props = withDefaults(defineProps<{ cols?: number, gap?: number }>(), {
    cols: 12,
    gap: 3
});
</script>

<template>
    <div :class="['grid', `gap-${gap}`, `grid-cols-${cols}`]">
        <slot></slot>
    </div>
</template>

<style scoped>

</style>