<script setup lang="ts">
import Fieldset from '@/volt/Fieldset.vue';

</script>

<template>
    <h1 class="text-xl font-semibold text-center flex flex-row gap-3 m-auto w-fit"><Icon icon="fluent-emoji-flat:house"/> Sobre Tránsitos</h1>
        <Fieldset legend="¿Qué significa ofrecer tránsito?" :toggleable="true" :collapsed="true">
        <span>El tránsito consiste en brindar alojamiento temporal a una mascota hasta que encuentre una familia definitiva o pueda regresar al refugio.</span>
        </Fieldset>
        <Fieldset legend="¿Puedo ofrecer tránsito si nunca tuve mascotas?" :toggleable="true" :collapsed="true">
        <span>Sí. Cada refugio evaluará tu situación y determinará si cumplís con los requisitos necesarios.</span>
        </Fieldset>
        <Fieldset legend="¿Cómo sé si fui seleccionado para un tránsito?" :toggleable="true" :collapsed="true">
        <span>Recibirás una notificación dentro de la plataforma cuando el refugio tome una decisión sobre tu solicitud.</span>
        </Fieldset>
</template>

<style scoped>

</style>