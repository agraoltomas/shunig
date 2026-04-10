<script setup lang="ts">
import Alerta from '@/components/generales/Alerta.vue'
import { EAlerta } from '@/components/generales/alertas.ts'
import Image from "primevue/image"
import graph from "C:\\Users\\tomot\\Downloads\\WhatsApp Image 2026-04-08 at 17.31.20.jpeg";
</script>

<template>
    <div class="grid grid-cols-4">
        <Panel class="col-span-2 m-3  b-white border-surface-800 border-2 shadow-2xl max-h-[75vh]!" pt:header="h-none p-0">
            <Image :src="graph"></Image>
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
<!--                <span class="border border-gray-800 rounded p-2 bg-secondary-600 text-white">De Adopcion:10</span>-->
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
        <Panel class="col-span-2  m-3  bg-gray-200/30! border-surface-800 border-2 shadow-2xl overflow-y-auto max-h-[75vh]!">
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