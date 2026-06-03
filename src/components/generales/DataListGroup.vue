<script setup lang="ts">
import paw from '@/assets/images/paw-solid-full-black.svg'
import moment from 'moment/moment'
import Contenedor from '@/components/generales/Contenedor.vue'
export interface DataListItem{
    icon?: string,
    label: string,
    value: string
}
const props = defineProps<{
    title: { label: string; icon?: String },
    items: DataListItem[]
}>()
</script>

<template>
    <Contenedor class="grow flex flex-col">
        <div v-if="title" class="flex flex-row text-xl gap-3 pb-3">
            <div class="bg-primary-200/30 rounded-full p-1 min-w-9 text-center">
                <i v-if="title.icon" :class="['text-primary-500 text-center', title.icon]"></i>
            </div>
            <div class="font-semibold h-fit my-auto">{{ title.label}}</div>
        </div>
        <div class="border-b-slate-400 px-3 flex flex-col gap-3">
            <div v-for="item in items" class="flex flex-row gap-3">
                <slot name="item" v-bind="{item, items}">
                    <div class="flex flex-row gap-1">
                        <i v-if="item.icon" :class="['pi py-3 border-b-slate-200 border-b w-fit']"></i>
                        <div class="border-b-slate-200 border-b py-2 h-fit my-auto">{{item.label}}</div>
                    </div>
                    <div>{{ item.value}}</div>
                </slot>
            </div>

        </div>

    </Contenedor>
</template>

<style scoped>

</style>