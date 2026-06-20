<script setup lang="ts">
import { onBeforeMount, onMounted, type Ref, ref } from 'vue'
//@ts-ignore
import { Qalendar } from 'qalendar'
import DataTable from '@/volt/DataTable.vue'
import type { MessageResponse } from '@/lib/tipos/generics'
import type { IMascota, IMascotaTransito } from '@/lib/tipos/mascotas'
import { useAuthStore } from '@/stores/auth.ts'
import { useAxios } from '@/lib/axios.ts'
import { useRouter } from 'vue-router'
import FormAdopcion from '@/components/adopcion/FormAdopcion.vue'
import Modal from '@/components/modal/Modal.vue'
import moment from 'moment'
import Contenedor from '@/components/generales/Contenedor.vue'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'
import { useUsuarioStore } from '@/stores/usuario.ts'
import SinImagen from '@/components/generales/SinImagen.vue'
import Calendario from '@/components/usuario/Calendario.vue'

const adopciones: Ref<IMascota[]> = ref([])
const transitos: Ref<IMascota[]> = ref([])
const authStore = useAuthStore()
const axiosService = useAxios()
const router = useRouter()
const userStore = useUsuarioStore()
const cargarAnimales = () => {
    adopciones.value = userStore.animales.filter((v: IMascotaTransito) => v.tipo == 'adopcion')
    transitos.value = userStore.animales.filter((v: IMascotaTransito) => v.tipo == 'transito')
}
onMounted(async () => {
    await userStore.loadAnimalesUsuario()
    cargarAnimales()
})

</script>

<template>
    <div class="grid grid-cols-4 grid-rows-12 max-h-[80vw] gap-5 shadow-amber-50 ">
        <div class="col-span-2 flex flex-col justify-around gap-3">
            <ContenedorTitulo title="Mis adopciones">
<!--                <div class="flex flex-row gap-3 justify-start">-->
<!--                    <Contenedor v-for="adopcion in adopciones"-->
<!--                                class=" border rounded-xl p-3 bg-primary-200/80 border-primary-200 flex flex-col items-center hover:bg-primary-100 cursor-pointer" @click="() => router.push(`/usuario/mascota/${data.id_animal}`)">-->
<!--                        <img v-if="adopcion.imagen" :src="adopcion.imagen" class="w-20 rounded" />-->
<!--                        <SinImagen v-else class="w-20"></SinImagen>-->
<!--                        <div class="font-semibold">{{ adopcion.nombre }}</div>-->
<!--                        <div class="text-gray-500 text-sm"><i :class="['pi',adopcion.id_sexo == 2 ?'pi-venus' : 'pi-mars']"></i></div>-->
<!--                        <div class="text-gray-500 text-wrap text-sm max-w-20 text-center">{{ adopcion.raza }}</div>-->
<!--                    </Contenedor>-->
<!--                </div>-->
                <DataTable :value="adopciones" class="bg-transparent!" :loading="userStore.loading">
                    <template #empty>
                        <div class="text-center  py-3text-slate-300">No tiene mascotas adoptadas actualmente</div>
                    </template>
                    <Column>
                        <template #body="{data}">
                            <img v-if="data['imagen']" :src="data['imagen']" class="w-20 rounded" />
                            <SinImagen v-else class="w-20"></SinImagen>
                        </template>
                    </Column>
                    <Column header="Nombre" field="nombre">
                    </Column>
                    <Column header="Sexo" field="sexo">
                    </Column>
                    <Column header="Raza" field="raza"></Column>
                    <Column>
                        <template #body="{data}">
                            <Button icon="pi pi-eye"
                                    @click="() => router.push(`/usuario/mascota/${data.id_animal}`)"></Button>
                        </template>
                    </Column>
                </DataTable>
            </ContenedorTitulo>

            <ContenedorTitulo title="Mis tránsitos">
                <DataTable :value="transitos" :loading="userStore.loading">
                    <Column>
                        <template #body="{data}">
                            <img v-if="data['imagen']" :src="data['imagen']" class="w-20 rounded" />
                            <SinImagen v-else class="w-20"></SinImagen>
                        </template>
                    </Column>
                    <Column header="Nombre" field="nombre">
                    </Column>
                    <Column header="Sexo" field="sexo">
                    </Column>
                    <Column header="Raza" field="raza"></Column>
                    <Column>
                        <template #body="{data}">
                            <Button icon="pi pi-eye"
                                    @click="() => router.push(`/usuario/mascota/${data.id_animal}`)"></Button>
                        </template>
                    </Column>
                </DataTable>
            </ContenedorTitulo>
        </div>
        <Contenedor class="col-span-2 col-start-3 row-span-6 h-full   overflow-y-scroll!">
            <Calendario></Calendario>
        </Contenedor>
    </div>
</template>

<style scoped>

</style>