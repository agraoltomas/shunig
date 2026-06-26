<script setup lang="ts">
import Fieldset from '@/volt/Fieldset.vue';

</script>

<template>
    <h1 class="text-xl font-semibold text-center flex flex-row gap-3 m-auto w-fit">📦 Inventario y donaciones</h1>
    <Fieldset legend="¿Cómo puedo realizar una donación?" :toggleable="true" :collapsed="true">
    Podés comunicarte con el refugio o responder a las solicitudes de donación publicadas dentro de la plataforma.
    </Fieldset>
    <Fieldset legend="¿Qué tipos de donaciones acepta el sistema?" :toggleable="true" :collapsed="true">
    Dependiendo del refugio, pueden aceptarse alimentos, medicamentos, productos de higiene, elementos veterinarios y aportes económicos.
    </Fieldset>
    <Fieldset legend="¿Cómo saben los refugios cuándo les falta stock?" :toggleable="true" :collapsed="true">
        Shunig genera alertas automáticas cuando un producto alcanza niveles bajos de existencias.
    </Fieldset>
</template>

<style scoped>

</style>