<script setup lang="ts">
import type { IDetalleSolicitud } from '@/components/solicitud/Solicitud.vue'
import { type Ref, type ShallowRef, useTemplateRef } from 'vue'
import type { Maybe } from '@/lib/tipos/generics'
import Popover from '@/volt/Popover.vue'
import type { IDatosSolicitud } from '@/components/adopcion/FormAdopcion.vue'
import DangerButton from '@/volt/DangerButton.vue'
import { useAxios } from '@/lib/axios.ts'

const props = defineProps<{solicitud: IDatosSolicitud}>();
const {axios} = useAxios()
const openPopover = useTemplateRef("openPopover")
const popover= useTemplateRef("detalleSolicitudPopover");
const emit = defineEmits<{ updated: []}>()
 const show = (e: Event) => {
     console.log(e,popover)
     if(!popover.value)return;
     popover.value.show(e)
 }

 const cambiarEstado = async (e: ('aceptar'|'rechazar')) => {
     console.log(e)
     try{
         const r = axios.value.post(`/solicitud/${props.solicitud.id_solicitud}/${e}/`);
         emit('updated')
     }catch(e){

     }
 }
</script>

<template>
    <div>
        <Button ref="openPopover" icon="pi pi-eye" @click="show"></Button>
        <Popover ref="detalleSolicitudPopover">
            <div class="flex flex-col gap-3">
                <div>datos usuario</div>
                <div>datos uascota</div>
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