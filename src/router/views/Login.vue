<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import { useToast } from '@/lib/toast/toast.ts'
import ProgressSpinner from "primevue/progressspinner"
import { useJWTToken } from '@/lib/token.ts'

const router = useRouter();
const toast = useToast();

const usuario: Ref<string | null> = ref(null)
const password: Ref<string | null> = ref(null)
const authStore = useAuthStore()
const {jwt_token} = useJWTToken()
const ingresando = ref(false)
onMounted(async () => {
    if(!jwt_token.value)return;
    const u = await authStore.revalidarUsuario()
    ingresando.value = true
    if(u){
        toast.add({ detail: "Revalidacion correcta! redireccionando", severity: "success"})
        setTimeout(async () => {
            await router.push('/swap')
        },2000)
    }else{
        toast.add({ detail: "Se ha vencido su sesion, por favor vuelva a ingresar", severity: "warn"})
        ingresando.value = false
    }
})
const login = async () => {
    if(!usuario.value) return
    if(!password.value) return
    const error = await authStore.login(usuario.value, password.value)
    console.log(error)
    if(error){
        toast.add({ summary: "Error de login", detail: error, severity:"error"})
    }else{
        await router.push('/swap')
    }


}
</script>

<template>
    <Panel class="w-[28vw] m-auto bg-white">
        <div v-if="!ingresando" class="flex flex-col  m-auto py-3 gap-3 px-10" >
            <div class="text-3xl font-semibold px-2 py-3 m-auto">Ingresar</div>
            <InputText size="large" required placeholder="Mail" v-model="usuario"></InputText>
            <Password size="large" required :feedback="false" placeholder="Contraseña" v-model="password" fluid></Password>
            <Button size="large" :disabled="!(usuario && password)" label="Ingresar" @click="login"></Button>
            <RouterLink :to="{path: '/register', query: {r: 'voluntario'}}" class="link m-auto text-primary-400"
            >¿No tenés cuenta? Registrate
            </RouterLink>
            <RouterLink :to="{path: '/recuperar-pass', query:{u: usuario}}" class="link  text-primary-400 m-auto"
            >¿Olvidaste tu contraseña?
            </RouterLink>
        </div>

        <div v-else class="flex flex-col  m-auto py-3 gap-3 px-10" >
            <ProgressSpinner class="m-auto h-40! text-center" pt:circle="stroke-red-100 p-progressspinner-circle" pt:root="p-progressspinner w-full!" pt:spin="p-progressspinner-spin"></ProgressSpinner>
        </div>
    </Panel>
</template>

<style scoped></style>
