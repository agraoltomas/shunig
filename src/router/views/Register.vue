<script setup lang="ts">
import { reactive } from 'vue'
import { useToast } from 'primevue'
import { useRouter } from 'vue-router'
const toast = useToast();
const router = useRouter();
const data = reactive({
  cuil: null,
  nombre: null,
  apellido: null,
  mail: null,
  password: null,
  direccion: null,
  telefono: null,
})
const register = () => {
  toast.add({detail: "Registrado exitosamente", summary: "exito", severity: "success"});
    setTimeout(() => {
    router.push("/");
  }, 5000)
}
</script>

<template>
  <div
    class="w-72 m-auto rounded-lg border border-gray-400 pt-5 pb-3 flex flex-col gap-3 px-3 mt-5"
  >
    <div class="m-auto text-md font-semibold">Registrarse</div>
    <InputText placeholder="CUIL" :maxlength="11" v-model="data.cuil"></InputText>
    <InputText placeholder="Nombre" :maxlength="11" v-model="data.nombre"></InputText>
    <InputText placeholder="Apellido" :maxlength="11" v-model="data.apellido"></InputText>
    <InputText placeholder="E-mail" v-model="data.mail"></InputText>
    <InputText placeholder="Contraseña" v-model="data.password"></InputText>
    <InputText placeholder="Direccion" v-model="data.direccion"></InputText>
    <InputText placeholder="Telefono" v-model="data.telefono"></InputText>
    <Button label="Registrase" @click="register"></Button>
  </div>
</template>

<style scoped></style>
