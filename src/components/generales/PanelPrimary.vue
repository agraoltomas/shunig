<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ header?: string }>();
const titulo = computed(() => props.header ?? null);
</script>

<template>
    <Panel class="border-surface-800! overflow-auto m-3" pt:header="p-0! text-center">
        <template #header>
            <div v-if="titulo"
                 class="w-full h-full">
                <div class="bg-primary-600 w-full h-full text-center text-3xl font-bold pl-3 py-4 text-white">
                    {{ titulo }}
                </div>
            </div>
        </template>
        <slot></slot>
    </Panel>
</template>

<style scoped>

</style>