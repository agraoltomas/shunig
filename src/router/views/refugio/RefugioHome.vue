<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import { useAxios } from '@/lib/axios.ts'
import type { IDatosSolicitud } from '@/components/adopcion/FormAdopcion.vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import { TipoSolicitud } from '@/lib/tipos/solicitud.ts'
import { EAlerta } from '@/components/generales/alertas.ts'
import Alerta from '@/components/generales/Alerta.vue'
import VisualizarSolicitud from '@/components/solicitud/VisualizarSolicitud.vue'

const {axios} = useAxios()
const solicitudes: Ref<IDatosSolicitud[]> = ref([]);
const {refugio} = useRefugioStore();
onMounted(async ()=>{
    await loadSolicitudes();
})

const loadSolicitudes = async () => {
    if(!refugio)return;
    try{
        const r = await axios.value.get(`solicitud/refugio/${refugio.id_refugio}`);
        const response: MessageResponse<IDatosSolicitud[]> = r.data;
        solicitudes.value = response.data;
    }catch(e){

    }

}
</script>

<template>
    <div class="grid grid-cols-4 mt-5 mb-15">
        <Panel class="col-span-2 m-3  b-white shadow-2xl max-h-[75vh]!"  header="Refugio - resumen">
            <div class="grid grid-cols-12 grid-rows-5 gap-0.5 h-56 content-center">
                <Panel pt:content="p-0" pt:header="p-0! m-0!" class="col-span-2 row-span-2 flex flex-col py-3">
                    <div class="text-2xl font-bold mx-auto text-center">50</div>
                    <div class="text-[6px] text-center">Animales en refugio</div>
                </Panel>
                <Panel pt:content="p-0" pt:header="p-0! m-0!" class="col-span-2 row-span-2  flex flex-col py-3">
                    <div class="text-2xl font-bold mx-auto text-center">6</div>
                    <div class="text-[6px] text-center">Razas diferentes</div>
                </Panel>
                <Panel pt:content="p-0" pt:header="p-0! m-0!" class="col-span-2 row-span-2  flex flex-col py-3">
                    <div class="text-2xl font-bold mx-auto text-center">2</div>
                    <div class="text-[6px] text-center">Especies diferentes</div>
                </Panel>
                <Panel pt:content="p-0" header="Ingreso animales por mes y año" pt:header="text-[8px]! p-1" class="col-span-6 row-span-3 row-start-3">
                    <div class="text-2xl font-bold mx-auto text-center pt-5">GRAFICO</div>
                </Panel>
                <Panel pt:content="p-0 text-center m-auto" pt:contentcontainer="m-auto h-full content-center" pt:contentwrapper="m-auto" header="Animales por sexo, raza y especie" pt:header="text-[8px]! p-1" class="col-span-6 row-span-5">
                    <div class="text-2xl font-bold mx-auto text-center h-full py-auto my-auto">GRAFICO</div>
                </Panel>
            </div>
        </Panel>
        <Panel class="col-span-2  m-3  border-2 shadow-2xl overflow-y-auto max-h-[75vh]!">
            <template #header>
                <div class="flex flex-row gap-3">
                    <span class="text-lg font-semibold">Alertas</span>
                    <span class="pi pi-exclamation-circle align-middle text-center m-auto"></span>
                </div>
            </template>
            <div class="flex flex-col gap-3 overflow-y-auto max-h-[40vh]">
                <Alerta v-for="solicitud in solicitudes" :tipo="EAlerta.SolicitudPendiente">
                    <div class="flex flex-row gap-3 justify-around w-full">
                        Hay una solicitud de {{solicitud.tipo_solicitud == TipoSolicitud.Adopcion ? 'adopcion' : 'transito'}} pendiente para {{ solicitud.animal_nombre }}
                        <VisualizarSolicitud @updated="loadSolicitudes" :solicitud="solicitud"></VisualizarSolicitud>
                    </div>
                </Alerta>
                <div v-if="solicitudes.length == 0" class="m-auto text-slate-400">
                    No hay alertas por ahora
                </div>
<!--                <Alerta :tipo="EAlerta.VacunaVencida"></Alerta>-->
<!--                <Alerta :tipo="EAlerta.AlimentoBajo"></Alerta>-->
<!--                <Alerta :tipo="EAlerta.AnimalCritico"></Alerta>-->
<!--                <Alerta :tipo="EAlerta.AnimalSinReporte"></Alerta>-->
<!--                <Alerta :tipo="EAlerta.AnimalEnTratamiento"></Alerta>-->
            </div>
        </Panel>
    </div>
</template>

<style scoped>

</style>