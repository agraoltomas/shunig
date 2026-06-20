<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import Menubar from '@/components/Menubar.vue'
import { TipoUsuario } from '@/lib/tipos/usuario.ts'
import type { Maybe } from '@/lib/tipos/generics'
import { type User } from '@/lib/tipos/usuarios'
import UsuarioIngreso from '@/components/usuario/UsuarioIngreso.vue'
import RefugioIngreso from '@/components/refugio/RefugioIngreso.vue'
import { useRoute, useRouter } from 'vue-router'
import { useToRedirection } from '@/lib/to_redirection.ts'
import Contenedor from '@/components/generales/Contenedor.vue'
import type { RouteLocationRaw } from 'vue-router/dist/router-BbqN7H95'

const tipo = ref(null)
const router = useRouter()
const route = useRoute()
const {to, parseRoute} = useToRedirection()
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
       const ruta: RouteLocationRaw  = { path: '/login', query: null }
       if(to.value){
            ruta.query = {to: to.value}
       }
       router.push(ruta)
   }
}
onMounted(() => {
    parseRoute()
})
</script>

<template>
    <div v-if="ingresando == EForm.Usuario" class="flex flex-col gap-3 w-[75%] m-auto p-5!">
        <UsuarioIngreso @ingresado="(user) => ingresadoUsuario(user)" v-model:tipo="tipo"></UsuarioIngreso>
    </div>
    <Contenedor v-else class="bg-white flex flex-col gap-3 w-[75%] m-auto p-5!" header="Registro de refugio"
           pt:header="m-auto text-xl font-semibold w-fit py-3">
        <RefugioIngreso v-if="newUser" :admin="newUser"></RefugioIngreso>
    </Contenedor>

</template>

<style scoped></style>
