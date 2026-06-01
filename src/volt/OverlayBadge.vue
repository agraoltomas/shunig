<template>
    <div class="relative inline-flex h-fit self-center py-1">
        <slot />
        <Badge v-bind="$attrs" class="absolute top-0 inset-e-0 translate-x-[50%] translate-y-[-50%] origin-top-right m-0 outline-surface-0 dark:outline-surface-900 px-0.5!" />
    </div>
</template>

<script setup lang="ts">
import Badge, { type BadgeProps } from './Badge.vue';

interface Props extends /* @vue-ignore */ BadgeProps {}
defineProps<Props>();

defineOptions({
    inheritAttrs: false
});
</script>
