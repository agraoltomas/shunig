<script setup lang="ts">

import { EAlerta } from '@/components/generales/alertas.ts'

const mensajeAlerta = (a: EAlerta) => {
    switch (a) {
        case EAlerta.AlimentoBajo: return "Stock bajo de alimento";
        case EAlerta.AnimalSinReporte: return     "Animal sin reporte ";
        case EAlerta.AnimalCritico: return     "Animal en estado crítico";
        case EAlerta.AnimalEnTratamiento: return "Animal en tratamiento sin actualización reciente";
        case EAlerta.VacunaVencida: return "Vacuna vencida";
    }
}

const props = withDefaults(defineProps<{ tipo: EAlerta, detalle?: string }>(),{});

</script>

<template>
    <div class="w-full grid grid-cols-12 grid-rows-3 border rounded-lg py-1 px-2">
        <div class="col-span-8 row-span-1 font-semibold">{{mensajeAlerta(tipo)}}</div>
    </div>
</template>

<style scoped>

</style>