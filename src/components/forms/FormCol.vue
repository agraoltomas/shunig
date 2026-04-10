<script setup lang="ts">
enum Modo{
    Horizontal ="horizontal",
    Vertical = "vertical"
}
const props = withDefaults(defineProps<{ gap?: number, span: number, class?: string, modo?: ('horizontal'|'vertical') }>(), {
    gap: 3, modo: Modo.Vertical
})
</script>

<template>
    <div :class="['flex ', props.modo == Modo.Vertical ? 'flex-col' : 'flex-row', `gap-${gap}`, `col-span-${span}`, props.class]">
        <slot></slot>
    </div>
</template>

<style scoped>

</style>