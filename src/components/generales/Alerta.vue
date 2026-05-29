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
        case EAlerta.AlimentoBajo: return "Stock bajo de alimento";
        case EAlerta.AlimentoModerado: return "Stock moderado de alimento, revisar";
        case EAlerta.AlimentoAlto: return "Stock suficiente de alimento";
        case EAlerta.MedicamentoBajo: return "Stock bajo de medicamentos";
        case EAlerta.MedicamentoModerado: return "Stock moderado de medicamentos, revisar";
        case EAlerta.MedicamentoAlto: return "Stock suficiente de medicamentos";
    }
}

const mensajeSeverity = (a: EAlerta) => {
    switch (a) {
        case EAlerta.VacunaVencida: return "info";
        case EAlerta.AnimalSinReporte: return "warn";
        case EAlerta.AnimalCritico: return "error";
        case EAlerta.AnimalEnTratamiento: return "warn";        
        case EAlerta.SolicitudPendiente: return "success";
        case EAlerta.AlimentoBajo: return "error";
        case EAlerta.AlimentoModerado: return "warn";
        case EAlerta.AlimentoAlto: return "success";
        case EAlerta.MedicamentoBajo: return "error";
        case EAlerta.MedicamentoModerado: return "warn";
        case EAlerta.MedicamentoAlto: return "success";
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