<script setup lang="ts">
import { type Ref, ref, useTemplateRef } from 'vue'
import Image from 'primevue/image'
import Menubar from '@/components/Menubar.vue'
import ContrastButton from '@/volt/ContrastButton.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import { useRouter } from 'vue-router'


const router = useRouter();

const usuario: Ref<string | null> = ref(null)
const password: Ref<string | null> = ref(null)

</script>

<template>
    <Menubar/>
    <Panel class="w-96 m-auto bg-white">
        <div class="flex flex-col max-w-fit m-auto p-3 gap-3" >
            <div class="text-xl font-semibold px-2 py-3 m-auto">Ingresar</div>
            <InputText placeholder="E-mail/CUIL" v-model="usuario"></InputText>
            <Password :feedback="false" placeholder="Contraseña" v-model="password"></Password>
            <Button label="Ingresar" @click="() => router.push('/swap')"></Button>
            <RouterLink :to="{path: '/register', query: {r: 'voluntario'}}" class="link my-3 text-primary-400"
            >¿No tenés Cuenta? Registrate
            </RouterLink>
        </div>
    </Panel>
</template>

<style scoped></style>
