<script setup lang="ts">
import type { IDetalleSolicitud } from '@/components/solicitud/SolicitudForm.vue'
import { type Ref, type ShallowRef, useTemplateRef } from 'vue'
import type { Maybe } from '@/lib/tipos/generics'
import Popover from '@/volt/Popover.vue'
import type { IDatosSolicitud } from '@/components/adopcion/FormAdopcion.vue'
import DangerButton from '@/volt/DangerButton.vue'
import { useAxios } from '@/lib/axios.ts'

const props = defineProps<{solicitud: IDatosSolicitud}>();
const {axios} = useAxios()
const openPopover = useTemplateRef("openPopover")
const emit = defineEmits<{ updated: []}>()
const popover= useTemplateRef("detalleSolicitudPopover");
 const show = (e: Event) => {
     console.log(e,popover)
     if(!popover.value)return;
     popover.value.show(e)
 }

</script>

<template>
    <div>
        <Button class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" ref="openPopover" icon="pi pi-eye" @click="show"></Button>
        <Popover ref="detalleSolicitudPopover">
            <div class="flex flex-col gap-3">
                <div>datos usuario</div>
                <div>datos mascota</div>
                <div class="flex flex-row gap-3">
                    <DangerButton label="Rechazar" @click="() => cambiarEstado('rechazar')"></DangerButton>
                    <Button label="Aceptar" @click="() => cambiarEstado('aceptar')"></Button>
                </div>
            </div>
        </Popover>
    </div>
</template>

<style scoped>

</style>