<script setup lang="ts">
import DataBlock from '@/components/generales/DataBlock.vue'
import moment from 'moment'
import type { IAdopcion } from '@/lib/tipos/adopcion'
import Contenedor from '@/components/generales/Contenedor.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'

const props = defineProps<{ detalle: IAdopcion }>();
console.log(moment,props.detalle);
</script>

<template>
    <ContenedorTitulo title="Detalle de la adopción" icon="pi pi-info-circle">
        <div class="flex flex-row  gap-5 ">
            <DataBlock label="Inicio" :data="moment(detalle.fecha_inicio).format('DD/MM/YYYY')"></DataBlock>
        </div>
    </ContenedorTitulo>
</template>

<style scoped>

</style>