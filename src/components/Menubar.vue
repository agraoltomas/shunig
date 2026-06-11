<script setup lang="ts">
import Image from 'primevue/image'
import Menubar, { type MenubarPassThroughOptions } from 'primevue/menubar'

import shunig from '@/assets/images/logo-shunig.png'
import { useRouter } from 'vue-router'
import type { MenuItem } from 'primevue/menuitem'
import { ref, type Ref } from 'vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useAuthStore } from '@/stores/auth.ts'

const router = useRouter()
const props = withDefaults(defineProps<{ model?: MenuItem[], context?: ('refugio'|'usuario') }>(),{
    model: () => [],
    context: 'usuario'
});

const {refugio} = useRefugioStore();
const authStore = useAuthStore()
const pt: Ref<MenubarPassThroughOptions> = ref({
    root: ``,
    rootList: `gap-3 items-center flex flex-row
    top-full w-fit justify-end`,
    item: `gap-3 m-auto bg-secondary-500 border p-2`,
    itemLabel: ``,
    itemIcon: `pr-1 text-black`,
    button: `hidden`,
    buttonIcon: `size-6 text-primary-800`,
    start: "min-w-55",
    end: "w-full"
})
const to = { path: refugio ? '/refugio' : authStore.user ? '/usuario' : '/' }
</script>

<template>
    <Menubar :model="model"
             :class="['mb-3 p-3 border-gray-300 flex flex-row justify-between  ', context == 'refugio' ? 'bg-refugio-500' : 'bg-primary-500']"
             :pt="pt">
        <template #item="{ item }">
        </template>
        <template #start>
            <RouterLink :to="to" class="pl-4 flex flex-row gap-3">
                <div class="rounded-full w-fit overflow-hidden">
                    <Image width="60" :src="shunig"></Image>
                </div>
                <div class="align-middle h-fit self-center pl-4 text-white ">
                    <span class="text-3xl font-semibold">SHUNIG</span>
                </div>
            </RouterLink>
        </template>
        <!--        <template #item="{item}">-->
        <!--            <div class="h-full text-center">{{item.label}}</div>-->
        <!--        </template>-->
        <template #end class="text-center">
            <slot name="end"></slot>
        </template>
    </Menubar>
</template>

<style scoped>

</style>