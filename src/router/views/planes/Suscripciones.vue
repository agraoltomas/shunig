<script setup lang="ts">

import Contenedor from '@/components/generales/Contenedor.vue'
const planes = [
    {
        costo: '0',
        nombre: "Gratuito",
        color: 'primary',
        incluye: [
            'Hasta 20 animales',
            'Gestion de adopciones',
            'Solicitudes de adopcion',
            'Eventos de vacunacion',
            'Control básico de stock',
            'Registro de donaciones'
        ],
        footer: ""
    },{
        costo: '13.999',
        nombre: "Refugio Pro",
        color: 'refugio',
        subtitle: "Todo lo del plan gratuito, más:",
        incluye: [
            'Animales ilimitados',
            'Gestion de transito',
            'Eventos de vacunacion avanzados',
            'Control de stock avanzado',
            'Reportes y estadisticas',
            'Recordatorios automaticos'
        ],
        footer: ""
    },{
        costo: '27.999',
        nombre: "Refugio Premium",
        color: 'orange',
        subtitle: "Todo lo del plan Pro, más:",
        incluye: [
            'Dashboard avanzado',
            'Métricas historicas',
            'Exportación de datos',
            'API para integraciones',
            'Soporte prioritario',
            'Personalización de marca'
        ],
        footer: ""
    },
]
</script>

<template>
    <div hidden class="border-primary-100 border-orange-100 border-refugio-100 text-orange-500"></div>
    <div class="w-3/4 m-auto flex flex-col gap-3">
        <h1 class="text-3xl font-bold">Suscripciones</h1>
        <h3 class="text-xl text-gray-400"> Elegí el plan que mejor se adapta a las necesidades de tu refugio</h3>
        <div class=" flex flex-row gap-3 border-t border-gray-200 justify-center">
            <Contenedor v-for="plan in planes" :class="['min-w-72', `border-${plan.color}-100!`]">
                <div class="flex flex-row gap-3 my-3  border-b border-gray-200">
                    <div :class="[' p-3 rounded-full my-auto', `bg-${plan.color}-50`]">
                        <Icon icon="famicons:paw" :class=" ['text-3xl',`text-${plan.color}-500`]"></Icon>
                    </div>
                    <div class="flex flex-col py-3">
                        <div class="font-bold">Plan {{  plan.nombre }}</div>
                        <div>
                            <span :class="['font-bold  text-4xl',`text-${plan.color}-400`]">${{plan.costo}}</span>
                            <span class="text-sm text-gray-400">/ mes</span>
                        </div>
                    </div>
                </div>
                <div class=" flex flex-col gap-3 h-min-200">
                    <div v-if="plan.subtitle" :class="[`text-${plan.color}-500`, 'font-semibold']">{{ plan.subtitle}}</div>
                    <div v-for="opcion in plan.incluye" class="flex flex-row gap-3 justify-start">
                        <i class="pi pi-check text-primary-500 "></i>
                        <div>{{opcion}}</div>
                    </div>
                </div>
                <div class="p-1 w-full flex flex-row justify-center grow">
                    <Button variant="outlined" :class="['m-auto',`bg-${plan.color}-100 border-${plan.color}-500! text-${plan.color}-500!`]" label="Actualizar plan"></Button>
                </div>
            </Contenedor>

        </div>
    </div>
</template>

<style scoped>

</style>