<script setup lang="ts">
import Fieldset from '@/volt/Fieldset.vue';

</script>

<template>
    <h1 class="text-xl font-semibold text-center flex flex-row gap-3 m-auto w-fit">💉 Sobre vacunación</h1>
       <Fieldset legend="¿Cómo inscribo una mascota en un evento de vacunación?" :toggleable="true" :collapsed="true">
       <span>Ingresá a "Eventos de vacunación", seleccioná el evento deseado y presioná "Inscribirse".</span>
       </Fieldset>
       <Fieldset legend="¿Puedo ver las vacunas aplicadas a mi mascota?" :toggleable="true" :collapsed="true">
       <span>Sí. En la ficha de la mascota encontrarás el historial completo de vacunación.</span>
       </Fieldset>
       <Fieldset legend="¿Qué sucede si una vacuna está vencida?" :toggleable="true" :collapsed="true">
       <span>El sistema genera alertas automáticas para que el refugio pueda gestionar la aplicación correspondiente.</span>
       </Fieldset>
</template>

<style scoped>

</style>