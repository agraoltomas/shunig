<script setup lang="ts">
import Fieldset from '@/volt/Fieldset.vue';

</script>

<template>
    <h1 class="text-xl font-semibold text-center flex flex-row gap-3 m-auto w-fit">🤝🏼Patrocinadores</h1>
    <Fieldset legend="¿Qué es un patrocinador?" :toggleable="true" :collapsed="true">
    Un patrocinador es una persona, empresa o institución que colabora regularmente con uno o más refugios mediante donaciones o apoyo económico.
    </Fieldset>
    <Fieldset legend="¿Cómo puedo convertirme en patrocinador?" :toggleable="true" :collapsed="true">
    Podés comunicarte con el refugio o completar el formulario de contacto para conocer las opciones de colaboración disponibles.
    </Fieldset>
</template>

<style scoped>

</style>