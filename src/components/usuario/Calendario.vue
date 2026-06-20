<script setup lang="ts">
//@ts-ignore
import { Qalendar } from 'qalendar'
import moment from 'moment/moment'
import { useUsuarioStore } from '@/stores/usuario.ts'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'
import { useAxios } from '@/lib/axios.ts'
import { useResponse } from '@/lib/utils/response.ts'

const config = {
    locale: 'es-AR',
    defaultMode: 'month',

    style: {
        colorSchemes: {
            past: {
                color: '#FFF',
                backgroundColor: '#aaa7ad'
            },
            yellow: {
                color: '#000000',
                backgroundColor: '#f4b400'
            }
        },
    }
}
const eventos = ref([])
const userStore = useAuthStore()
const { axios } = useAxios()
const { unwrap } = useResponse()

interface IEvento {
    id: string,
    fecha: string,
    titulo: string,
    description: string,
    color: string
}

onMounted(async () => {
    if (!userStore.user) return
    try {
        const r = await unwrap(axios.value.get(`/usuario/${userStore.user.id_usuario}/events`))
        console.log(r.data)
        eventos.value = r.data.map((r: IEvento) => ({
            ...r,
            time: { start: r.fecha, end: r.fecha },
            isEditable: false,
            title: r.titulo
        }))
    } catch (error) {
        console.error(error)
    }
})
</script>

<template>
    <div class=" flex flex-col gap-3 ">
        <div class="flex flex-row justify-around">
            <div class="flex flex-col items-center max-w-20 text-center text-gray-500 ">
                <div class="bg-[#aaa7ad] w-10 h-5 border"></div>
                <div class="text-[10px] text-wrap">pasados</div>
            </div>
            <div class="flex flex-col items-center max-w-20 text-center text-gray-500">
                <div class="bg-[#f4b400] w-10 h-5 border"></div>
                <div class="text-[10px] text-wrap">futuros</div>
            </div>
            <div class="flex flex-col items-center max-w-20 text-center text-gray-500">
                <div class="bg-[#33b679] w-10 h-5 border"></div>
                <div class="text-[10px] text-wrap">inscriptos</div>
            </div>
        </div>
        <Qalendar :events="eventos" :config="config">
            <template #monthEvent="monthEventProps">
                <pre>{{ monthEventProps }}</pre>
                <span>{{ monthEventProps.eventData.title }} OK?</span>
            </template>
        </Qalendar>
    </div>
</template>

<style scoped>
.calendar-event-dot {
    width: 10px; /* Adjust the size here */
    height: 10px;
    border-radius: 50%; /* Ensures it stays a perfect circle */
    background-color: #3b82f6; /* Example color */
}
</style>