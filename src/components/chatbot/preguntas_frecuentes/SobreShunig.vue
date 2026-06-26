<script setup lang="ts">
import Fieldset from '@/volt/Fieldset.vue'

</script>
<template>
    <h1 class="text-xl font-semibold text-center flex flex-row gap-3 m-auto w-fit">
        <Icon icon="twemoji:guide-dog"/>Sobre Shunig
    </h1>
    <Fieldset legend="¿Qué es Shunig?" :toggleable="true" :collapsed="true">
        Shunig es una plataforma que conecta refugios, adoptantes, hogares de tránsito y patrocinadores para facilitar
        la gestión y el bienestar animal.
    </Fieldset>
    <Fieldset legend="¿Qué puedo hacer desde Shunig?" :toggleable="true" :collapsed="true">

        Dependiendo de tu rol, podés:

        • Buscar mascotas para adoptar.
        • Ofrecer tránsito.
        • Participar en eventos de vacunación.
        • Gestionar refugios.
        • Administrar inventario y donaciones.
        • Consultar métricas y reportes.
    </Fieldset>
    <Fieldset legend="¿Es gratuito?" :toggleable="true" :collapsed="true">

        El acceso para usuarios particulares es gratuito. Algunas funcionalidades avanzadas para refugios pueden
        depender
        del plan contratado.
    </Fieldset>


</template>

<style scoped>

</style>