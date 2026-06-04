<script setup lang="ts">

import FormTransito from '@/components/transito/FormTransito.vue'
import Dialog from '@/volt/Dialog.vue'
import { onMounted, reactive } from 'vue'
import { useModalStore,type IModalesContext } from '@/stores/modales.ts'
const store = useModalStore()
const props = defineProps<{nombre:keyof IModalesContext, title?: string}>();
onMounted(() => {
    if(!(props.nombre in store.modales)){
        console.error(`el modal \`${props.nombre}\` no esta registrado`);
    }
})

const close = () => {
    store.cerrar(props.nombre)
}
</script>

<template>
    <Dialog v-model:visible="store.modales[nombre]" :header="title" modal>
        <template #header>
            <slot name="header"></slot>
        </template>
        <slot :closeFn="close" :context="store.context"></slot>
    </Dialog>
</template>

<style scoped>

</style>