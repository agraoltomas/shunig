<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import Menubar from '@/components/Menubar.vue'
import { useRouter } from 'vue-router'
import { rutas_api } from '@/rutas_api.ts'
import axios from '@/lib/axios.ts'
import { useAuthStore } from '@/stores/auth.ts'
import type { MessageResponse } from '@/lib/tipos/generics'
import type { User } from '@/lib/tipos/usuarios'
import { useToast } from '@/lib/toast/toast.ts'
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
    <Panel class="w-[28vw] m-auto bg-white">
        <div class="flex flex-col  m-auto py-3 gap-3 px-10" >
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
    </Panel>
</template>

<style scoped></style>
