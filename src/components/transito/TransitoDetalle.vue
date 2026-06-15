<script setup lang="ts">


import DataBlock from '@/components/generales/DataBlock.vue'
import type { ITransito } from '@/lib/tipos/transito'
import moment from 'moment'
import Contenedor from '@/components/generales/Contenedor.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'

const props = defineProps<{ detalle: ITransito }>();
console.log(moment,props.detalle);
</script>

<!--Componente del detalle de tránsito de la gestión del animal-->
<template>
    <ContenedorTitulo title="Detalle del tránsito" icon="pi pi-info-circle">
        <div class="flex flex-row  gap-5 ">
            <DataBlock label="Inicio" :data="moment(detalle.fecha_inicio).format('DD/MM/YYYY')"></DataBlock>
            <DataBlock label="Fin" :data="detalle.fecha_fin ? moment(detalle.fecha_fin).format('DD/MM/YYYY') : '-'"></DataBlock>
        </div>
    </ContenedorTitulo>
</template>

<style scoped>

</style>