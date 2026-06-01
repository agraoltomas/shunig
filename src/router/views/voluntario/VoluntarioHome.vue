<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
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

const adopciones: Ref<IMascota[]> = ref([])
const transitos: Ref<IMascota[]> = ref([])
const authStore = useAuthStore()
const axiosService = useAxios()
const router = useRouter()

onMounted(async () => {
    if(!authStore.user)return;
    const r = await axiosService.axios.value.get(`/animal/usuario/${authStore.user.id_usuario}/`)
    if (r.status == 200) {
        let response: MessageResponse<IMascotaTransito[]> = r.data
        adopciones.value = response.data.filter((v: IMascotaTransito) => v.tipo == 'adopcion')
        transitos.value = response.data.filter((v: IMascotaTransito) => v.tipo == 'transito')
        console.log(response)
    }

})
const events = [
    {
        title: 'Advanced algebra',
        with: 'Chandler Bing',
        time: { start: moment().add('2days').format('YYYY-MM-DD'), end: moment().add('7days').format('YYYY-MM-DD') },
        color: 'yellow',
        isEditable: true,
        id: '753944708f0f',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!'
    },
    {
        title: 'Evento de vacunación antirrábica',
        time: { start: '2026-04-10', end: '2026-04-22' },
        color: 'green',
        isEditable: true,
        id: '5602b6f589fc'
    }
    // ...
]
const config = {
    locale: 'es-AR',
    defaultMode: 'month',

    style: {
        colorSchemes: {
            meetings: {
                color: '#fff',
                backgroundColor: '#131313'
            },
            sports: {
                color: '#fff',
                backgroundColor: '#ff4081'
            }
        }
    }
}

</script>

<template>
    <div class="grid grid-cols-4 grid-rows-12 max-h-[80vw] gap-5 shadow-amber-50 ">
        <div class="col-span-2 flex flex-col justify-around gap-3">
            <Panel class="  row-span-3" header="Mis adopciones" v-if="adopciones.length">
                <DataTable :value="adopciones">
                    <template #empty>
                        <div class="text-center  py-3text-slate-300">No tiene mascotas adoptadas actualmente</div>
                    </template>
                    <Column header="Nombre" field="nombre">
                    </Column>
                    <Column header="Sexo" field="sexo">
                    </Column>
                    <Column header="Raza" field="raza"></Column>
                    <Column>
                        <template #body="{data}">
                            <Button icon="pi pi-eye" @click="() => router.push(`/usuario/mascota/${data.id_animal}`)"></Button>
                        </template>
                    </Column>
                </DataTable>
            </Panel>

            <Panel class=" " header="Mis tránsitos" v-if="transitos.length">
                <DataTable :value="transitos">
                    <Column header="Nombre" field="nombre">
                    </Column>
                    <Column header="Sexo" field="sexo">
                    </Column>
                    <Column header="Raza" field="raza"></Column>
                    <Column>
                        <template #body="{data}">
                            <Button icon="pi pi-eye" @click="() => router.push(`/usuario/mascota/${data.id_animal}`)"></Button>
                        </template>
                    </Column>
                </DataTable>
            </Panel>
        </div>
        <Panel class="col-span-2 col-start-3 row-span-6 h-full   overflow-y-scroll!">
            <div class=" flex flex-col gap-3">
                <Qalendar
                    :events="events"
                    :config="config"
                />
            </div>
        </Panel>
        <Panel class="col-span-4 row-span-6 h-fit overflow-y-auto border-2 m-3" header="Notificaciones">
            <div class=" flex flex-col gap-3">
                <Message  class="w-fit" severity="warn">
                    Por favor actualiza tus datos de domicilio actuales!
                </Message>
                <Message  class="w-fit" severity="success">
                    Te llevaste a Luna a casa!
                    No te olvides de cargar sus novedades para el: 30/04/2026
                </Message>
                <Message  class="w-fit" severity="warn">
                    Atención: Logan tiene un control veterinario programado para mañana
                </Message>
                <Message  class="w-fit" severity="success">
                    El perfil de Luna está incompleto. Agregá fotos recientes para aumentar sus posibilidades de adopción
                </Message>
                <Message   class="w-fit" severity="warn">
                    Atención: Logan tiene un control veterinario programado para mañana
                </Message>
                <Message   class="w-fit" severity="success">
                    El perfil de Luna está incompleto. Agregá fotos recientes para aumentar sus posibilidades de adopción
                </Message>
            </div>
        </Panel>
    </div>
</template>

<style scoped>

</style>