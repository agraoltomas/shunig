<script setup lang="ts">
import Alerta from '@/components/generales/Alerta.vue'
import { EAlerta } from '@/components/generales/alertas.ts'
</script>

<template>
    <div class="grid grid-cols-4">
        <Panel class="col-span-2 m-3  b-white shadow-2xl max-h-[75vh]!"  header="Refugio - resumen">
<!--            <Image :src="graph"></Image>-->
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
<!--            <hr>-->
<!--            <div class="text-2xl font-semibold py-5">Mascotas</div>-->
<!--            <div class="flex flex-row gap-3 justify-around px-3 pb-5">-->
<!--                <span class="border border-gray-800 rounded p-2 bg-primary-400 text-white">En Refugio: 7</span>-->
<!--                <span class="border border-gray-800 rounded p-2 bg-primary-400 text-white">Adoptadas: 10</span>-->
<!--                <span class="border border-gray-800 rounded p-2 bg-primary-400 text-white">En Transito: 3</span>-->
<!--            </div>-->
<!--            <hr>-->
<!--            <div class="text-2xl font-semibold py-5">Campañas</div>-->
<!--            <div class="flex flex-row gap-3 justify-around px-3 pb-5">-->
<!--                <span class="border border-gray-800 rounded p-2 bg-secondary-600 text-white">De Adopción:10</span>-->
<!--                <span class="border border-gray-800 rounded p-2 bg-secondary-600 text-white">De Donaciones: 1</span>-->
<!--                <span class="border border-gray-800 rounded p-2 bg-secondary-600 text-white">De Voluntarios: 3</span>-->
<!--            </div>-->
<!--            <hr>-->
<!--            <div class="text-2xl font-semibold py-5">?</div>-->
<!--            <div class="flex flex-row gap-3 justify-around px-3 pb-5">-->
<!--                <span class="border border-gray-800 rounded p-2 bg-surface-200 text-slate-500">?: ?</span>-->
<!--                <span class="border border-gray-800 rounded p-2 bg-surface-200 text-slate-500">?: ?</span>-->
<!--                <span class="border border-gray-800 rounded p-2 bg-surface-200 text-slate-500">?: ?</span>-->
<!--            </div>-->
        </Panel>
        <Panel class="col-span-2  m-3    border-2 shadow-2xl overflow-y-auto max-h-[75vh]!">
            <template #header>
                <div class="flex flex-row gap-3">
                    <span class="text-lg font-semibold">Alertas</span>
                    <span class="pi pi-exclamation-circle align-middle text-center m-auto"></span>
                </div>
            </template>
            <div class="flex flex-col gap-3">
                <Alerta :tipo="EAlerta.VacunaVencida"></Alerta>
                <Alerta :tipo="EAlerta.AlimentoBajo"></Alerta>
                <Alerta :tipo="EAlerta.AnimalCritico"></Alerta>
                <Alerta :tipo="EAlerta.AnimalSinReporte"></Alerta>
                <Alerta :tipo="EAlerta.AnimalEnTratamiento"></Alerta>
            </div>
        </Panel>
    </div>
</template>

<style scoped>

</style>