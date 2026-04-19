<script setup lang="ts">
import { type Ref, ref } from 'vue'
import Menubar from '@/components/Menubar.vue'
import { TipoUsuario } from '@/lib/tipos/usuario.ts'
import type { Maybe } from '@/lib/tipos/generics'
import { type User } from '@/lib/tipos/usuarios'
import UsuarioIngreso from '@/components/usuario/UsuarioIngreso.vue'
import RefugioIngreso from '@/components/refugio/RefugioIngreso.vue'
import { useRouter } from 'vue-router'

const tipo = ref(null)
const router = useRouter()
enum EForm {
    Usuario,
    Refugio
}

const ingresando = ref(EForm.Usuario)
const newUser: Ref<Maybe<User>> = ref(null)
const ingresadoUsuario = (u: User) => {
   newUser.value = u;
   if(tipo.value === TipoUsuario.Refugio){
        ingresando.value = EForm.Refugio
   }else{
       router.push("/login")
   }
}
</script>

<template>
    <Menubar></Menubar>
    <Panel v-if="ingresando == EForm.Usuario" class="bg-white flex flex-col gap-3 w-[75%] m-auto p-5!"
           header="Registro de Usuario"
           pt:header="m-auto text-xl font-semibold w-fit py-3">
        <UsuarioIngreso @ingresado="(user) => ingresadoUsuario(user)" v-model:tipo="tipo"></UsuarioIngreso>
    </Panel>
    <Panel v-else class="bg-white flex flex-col gap-3 w-[75%] m-auto p-5!" header="Registro de Refugio"
           pt:header="m-auto text-xl font-semibold w-fit py-3">
        <RefugioIngreso v-if="newUser" :admin="newUser"></RefugioIngreso>
    </Panel>

</template>

<style scoped></style>
