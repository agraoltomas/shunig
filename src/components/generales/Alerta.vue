<script setup lang="ts">

import { EAlerta } from '@/components/generales/alertas.ts'
import VisualizarSolicitud from '@/components/solicitud/VisualizarSolicitud.vue'
import type { IDetalleSolicitud } from '@/components/solicitud/Solicitud.vue'

type Contexto = {
    solicitud?: IDetalleSolicitud
}
const mensajeAlerta = (a: EAlerta) => {
    switch (a) {        
        case EAlerta.AnimalSinReporte: return     "Animal sin reporte ";
        case EAlerta.AnimalCritico: return     "Animal en estado crítico";
        case EAlerta.AnimalEnTratamiento: return "Animal en tratamiento sin actualización reciente";
        case EAlerta.VacunaVencida: return "Vacuna vencida";
        case EAlerta.SolicitudPendiente: return "Solicitud pendiente";
        case EAlerta.StockBajo: return "Stock bajo";
        case EAlerta.StockModerado: return "Stock moderado";
        case EAlerta.StockAlto: return "Stock suficiente";
    }
}

const mensajeSeverity = (a: EAlerta) => {
    switch (a) {
        case EAlerta.VacunaVencida: return "info";
        case EAlerta.AnimalSinReporte: return "warn";
        case EAlerta.AnimalCritico: return "error";
        case EAlerta.AnimalEnTratamiento: return "warn";        
        case EAlerta.SolicitudPendiente: return "success";
        case EAlerta.StockBajo: return "error";
        case EAlerta.StockModerado: return "warn";
        case EAlerta.StockAlto: return "success";
    }
}
const props = withDefaults(defineProps<{ tipo: EAlerta, detalle?: string, contexto?: Contexto }>(), {});

</script>

<template>
        <Message :severity="mensajeSeverity(tipo)" class="col-span-8 row-span-1 font-semibold">
            {{$slots.default ? '' : mensajeAlerta(tipo)}}
            <div class="flex flex-row"><slot></slot></div>
        </Message>
</template>

<style scoped>

</style>