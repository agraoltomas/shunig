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
import Contenedor from '@/components/generales/Contenedor.vue'
import DashboardRefugio from '@/components/refugio/DashboardRefugio.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'

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
    <div class="w-full px-10 mt-10 mb-15">
            <DashboardRefugio></DashboardRefugio>
    </div>
</template>

<style scoped>

</style>