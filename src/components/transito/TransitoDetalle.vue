<script setup lang="ts">


import DataBlock from '@/components/generales/DataBlock.vue'
import type { ITransito } from '@/lib/tipos/transito'
import moment from 'moment'

const props = defineProps<{ detalle: ITransito }>();
console.log(moment,props.detalle);
</script>

<template>
    <Panel>
        <h1 class="text-2xl pb-3  font-semibold underline text-center">Detalle del transito</h1>
        <div class="flex flex-row  gap-5 ">
            <DataBlock label="Inicio" :data="moment(detalle.fecha_inicio).format('DD/MM/YYYY')"></DataBlock>
            <DataBlock label="Fin" :data="detalle.fecha_fin ? moment(detalle.fecha_fin).format('DD/MM/YYYY') : '-'"></DataBlock>
        </div>
    </Panel>
</template>

<style scoped>

</style>