<script setup lang="ts">
import Fieldset from '@/volt/Fieldset.vue';

</script>

<template>
    <h1 class="text-xl font-semibold text-center flex flex-row gap-3 m-auto w-fit"><Icon icon="openmoji:paw-prints"/>Sobre Adopciones</h1>
    <ul>
        <Fieldset legend="¿Como adopto una mascota?" :toggleable="true" :collapsed="true">        <span>
            Para adoptar una mascota, ingresá a la sección "Animales", seleccioná la mascota que te interese y presioná "Solicitar adopción". Luego deberás completar un formulario para que el refugio evalúe tu solicitud.
        </span>
        </Fieldset>
        <Fieldset legend="¿Cuánto tarda una solicitud de adopción?" :toggleable="true" :collapsed="true">
        <span>
            El tiempo depende de cada refugio. Podés consultar el estado de tu solicitud desde la sección "Mis solicitudes".
        </span>
        </Fieldset>
        <Fieldset legend="¿Como funcionan las solicitudes?" :toggleable="true" :collapsed="true">
        <span>
            Una solicitud puede encontrarse en estado:

        • Pendiente
        • En revisión
        • Aprobada
        • Rechazada

        El refugio actualizará el estado a medida que avance la evaluación.
        </span>

        </Fieldset>

    </ul>
</template>

<style scoped>

</style>