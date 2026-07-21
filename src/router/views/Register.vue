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
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import { useAuthStore } from '@/stores/auth.ts'

const tipo = ref(null)
const router = useRouter()
const route = useRoute()
const {to, parseRoute} = useToRedirection()
enum EForm {
    Usuario,
    Refugio
}

const ingresando = ref(EForm.Usuario)
const authStore = useAuthStore()
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
    if(authStore.user){
        newUser.value = authStore.user
        ingresando.value = EForm.Refugio
    }
})
</script>

<template>
    <div v-if="ingresando == EForm.Usuario" class="flex flex-col gap-3 w-[75%] m-auto p-5!">
        <div v-if="!newUser">
            <Message icon="pi pi-info-circle" class=" bg-refugio-200! text-black! w-fit m-auto ">
                Ya tenés usuario y querés registrar un refugio? <RouterLink class="text-refugio-500 underline font-semibold" :to="{ path: '/login', query: { to: encodeURIComponent('/register?r=refugio')} }">Ingresá</RouterLink> y registrá el refugio directamente
            </Message>
        </div>
        <UsuarioIngreso @ingresado="(user) => ingresadoUsuario(user)" v-model:tipo="tipo"></UsuarioIngreso>
    </div>
    <ContenedorTitulo v-if="newUser" :title="`Hola, ${newUser.nombre}! Registrá tu refugio`" class="bg-white flex flex-col gap-3 w-[75%] m-auto p-5!" header="Registro de refugio"
           pt:header="m-auto text-xl font-semibold w-fit py-3">
        <RefugioIngreso v-if="newUser" :admin="newUser"></RefugioIngreso>
    </ContenedorTitulo>
</template>

<style scoped></style>
