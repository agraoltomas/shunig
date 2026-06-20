<script setup lang="ts">

import SurfaceButton from '@/volt/SurfaceButton.vue'
import SinImagen from '@/components/generales/SinImagen.vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import { useModalStore } from '@/stores/modales.ts'
import { useAuthStore } from '@/stores/auth.ts'
import Contenedor from '@/components/generales/Contenedor.vue'

const props = withDefaults(defineProps<{ animal: IMascota, label?: string }>(), {
    label: 'Seleccionar',
})
const modal = useModalStore()
</script>

<template>

    <Contenedor
        class="p-3 border rounded-lg bg-primary-400/60 flex flex-col justify-between gap-1 min-h-96 hover:bg-primary-300 hover:cursor-pointer"
        title="Click en la imagen para más detalles">
        <div class="text-center font-semibold text-2xl pb-3">{{ animal.nombre }}</div>
        <div class="w-45 my-auto text-center relavite" @click="() => modal.abrir('mostrarAnimal', animal)">
            <Image class="m-auto!" pt:image="rounded-xl object-cover" :src="animal.imagen"
                   v-if="animal.imagen"></Image>
            <SinImagen v-else></SinImagen>
        </div>
        <div class="text-center flex flex-col  flex-wrap">
            <span>{{ animal.raza }}</span>
            <span>{{ animal.es_castrado ? 'Castrado' : 'No castrado' }}</span>
            <span> {{ animal.edad }} años</span>
        </div>
        <div class="text-center">
           <slot ></slot>
        </div>
    </Contenedor>
</template>

<style scoped>

</style>