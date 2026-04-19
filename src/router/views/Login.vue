<script setup lang="ts">
import { type Ref, ref } from 'vue'
import Menubar from '@/components/Menubar.vue'
import { useRouter } from 'vue-router'
import { rutas_api } from '@/rutas_api.ts'
import axios from '@/lib/axios.ts'
import { useAuthStore } from '@/stores/auth.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import type { User } from '@/lib/tipos/usuarios'
import { useToast } from 'primevue'
import { AxiosError } from 'axios'


const router = useRouter();
const toast = useToast();

const usuario: Ref<string | null> = ref(null)
const password: Ref<string | null> = ref(null)
const authStore = useAuthStore()

const login = async () => {
    if(!(usuario.value||password.value)){
        return;
    }
    try{
        const r = await axios.post(rutas_api.auth.LOGIN(), {
            email: usuario.value,
            password: password.value,
        });
        if(r.status === 200){
            const response: MessageResponse<{ token: string, usuario: User}> = r.data
            authStore.saveToken(response.data.token)
            authStore.user = response.data.usuario
            await router.push("/swap")
        }
    }catch(error){
        if(error instanceof AxiosError){
            const r: MessageResponse<never> = error.response?.data
            toast.add({ summary: "Error en login", detail: r?.message, severity: "error" })
        }

    }


}
</script>

<template>
    <Menubar/>
    <Panel class="w-96 m-auto bg-white">
        <div class="flex flex-col max-w-fit m-auto p-3 gap-3" >
            <div class="text-xl font-semibold px-2 py-3 m-auto">Ingresar</div>
            <InputText required placeholder="Mail" v-model="usuario"></InputText>
            <Password required :feedback="false" placeholder="Contraseña" v-model="password"></Password>
            <Button :disabled="!(usuario && password)" label="Ingresar" @click="login"></Button>
            <RouterLink :to="{path: '/register', query: {r: 'voluntario'}}" class="link my-3 text-primary-400"
            >¿No tenés Cuenta? Registrate
            </RouterLink>
        </div>
    </Panel>
</template>

<style scoped></style>
