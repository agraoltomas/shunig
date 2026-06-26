<script setup lang="ts">
import Fieldset from '@/volt/Fieldset.vue'

</script>

<template>
    <h1 class="text-xl font-semibold text-center flex flex-row gap-3 m-auto w-fit"> 👤 Cuenta y perfil</h1>
    <Fieldset legend="¿ Qué hago si olvidé mi contraseña?" :toggleable="true" :collapsed="true">
        Podés recuperar tu acceso utilizando la opción "¿Olvidaste tu contraseña?" disponible en la pantalla de inicio
        de sesión.
    </Fieldset>
    <Fieldset legend="¿Puedo modificar mis datos personales?" :toggleable="true" :collapsed="true">
        Sí. Desde la sección "Mi perfil" podés actualizar tu información de contacto y otros datos personales.
    </Fieldset>
    <Fieldset legend="¿Cómo verifico mi cuenta?" :toggleable="true" :collapsed="true">
        Recibirás un correo electrónico con un enlace de validación luego de registrarte.
    </Fieldset>
</template>

<style scoped>

</style>