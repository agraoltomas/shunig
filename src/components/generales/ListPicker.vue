<script setup lang="ts" generic="T = any">
import { ref } from 'vue'
import ProgressSpinner from '@/volt/ProgressSpinner.vue'

const props = withDefaults(defineProps<{ data: T[], loading?: boolean }>(),{ loading: false})
const emit = defineEmits<{ selected: [T] }>()
const selected = ref(null);
</script>

<template>
    <Panel>
        <div v-if="loading">
            <ProgressSpinner></ProgressSpinner>
        </div>
        <div v-else-if="!selected" v-for="t in data"
             class="border-b border-surface-300 flex flex-row gap-3 justify-between">
            <slot name="default" :item="t">
                <div class="text-xl font-semibold px-3 py-4  ">
                    {{ t }}
                </div>
            </slot>
            <Button icon="pi pi-arrow-right" class=" my-auto" @click="() => {$emit('selected', t); selected = t}"></Button>
        </div>
    </Panel>
</template>

<style scoped>

</style>