<script setup lang="ts">
import logo from '@/assets/images/logo_shunig_blanco_trans.png'
import { type Ref, ref, useTemplateRef } from 'vue'
import moment, { type Moment } from 'moment/moment'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { useAxios } from '@/lib/axios.ts'
import type { Maybe } from '@/lib/tipos/generics'
import type { IMascota } from '@/lib/tipos/mascotas'
import SinImagen from '@/components/generales/SinImagen.vue'
import { useAuthStore } from '@/stores/auth.ts'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modales.ts'

const {unwrap} = useResponse()
const {axios} = useAxios()
const userStore = useAuthStore()
const router = useRouter()
moment.locale('es-ar')
interface BasicMessage{
    content: string,
    role: ('chat'|'user'),
    time: Moment,
    type: ('message'|'content'),
    mascotas?: any[]
}

interface TextMessage extends BasicMessage{
    type: 'message'
}
interface MascotaMessage extends BasicMessage {
    type: 'content',
    mascotas: IMascota[]
}

type Message = TextMessage | MascotaMessage
const isMascotaMessage = (m: Message): m is MascotaMessage => {
    return !!m.mascotas
}

const {loading,stopLoading,startLoading} = useLoadingComposable()
const messages: Ref<Message[]> = ref([{
    content: 'Hola, soy Shuni! en que te puedo ayudar?',
    role: 'chat',
    time: moment(),
    type: "message"
}]);
const messageWindow = useTemplateRef("messageWindow")
const currentMessage = ref(null)
const saveNewMessage = (message: string) => {
    messages.value.push({
        content: message,
        role: 'user',
        time: moment(),
        type: "message"
    })
    console.log(messageWindow.value?.scrollTop, messageWindow.value?.scrollHeight)
    if(messageWindow.value)messageWindow.value.scrollTop = messageWindow.value.scrollHeight

}

interface ChatResponse{
    modulo: ('interaccion_basica'|'mascotas' |'vacunacion' |'solicitudes_adopcion'),
    message: string,
    results: Maybe<(IMascota|any)[]>
}
const ask = async (message: string): Promise<Maybe<ChatResponse>> => {
    try{
        const r = await unwrap(axios.value.post(rutas_api.chatbot.PREGUNTAR(),{
            pregunta:message,
        }))
        console.log(r)
        return r.data
    }catch (e){
        return null
    }
}
const sendMessage = async () => {
    if(!currentMessage.value)return
    startLoading()
    const message = currentMessage.value
    currentMessage.value = null
    saveNewMessage(message)
    const response = await ask(message)
    console.log(response)
    if(response){
        switch (response.modulo){
            case 'interaccion_basica':
                messages.value.push({
                    content: response.message,
                    type: 'message',
                    role: "chat",
                    time: moment(),
                })
                break;
            case 'mascotas':
                messages.value.push({
                    content: response.message,
                    type: 'content',
                    role: 'chat',
                    time: moment(),
                    mascotas: response.results ?? []
                })
                break;
        }
    }else{
        messages.value.push({
            type: "message",
            time: moment(),
            content: "Perdon! parece que estamos teniendo un inconveniente",
            role: "chat"
        })
    }
    if(messageWindow.value)messageWindow.value.scrollTop = messageWindow.value.scrollHeight
    stopLoading()
}

const emit = defineEmits<{close:[]}>()
const modales = useModalStore()
const verAnimal = (m: IMascota) => {
    if(userStore.user){
        router.push(`/usuario/adoptar?m=${m.id_animal}`)
    }else{
        modales.abrir('registro', { to: `/usuario/adoptar?m=${m.id_animal}`})
    }
}
</script>

<template>
    <div
        class="fixed bottom-25 left-5 rounded-xl bg-white w-96 border-2 border-refugio-500 shadow-[0px_0px_10px_10px_rgba(0,0,0,0.15)]">
        <div class="relative p-3 bg-refugio-500 text-white justify-between flex flex-row items-center">
                        <img :src="logo" class="w-15 px-1" />
                <div class="h-fit my-auto text-2xl mx-auto font-bold">SHUNI</div>
            <div>
                <i class="pi pi-times text-white p-1 cursor-pointer" @click="() => $emit('close')"></i>
            </div>
        </div>
        <div class="h-110 flex flex-col">
            <div ref="messageWindow" class="grow p-1 overflow-y-auto flex flex-col gap-3 pt-3 pr-2">
                <div class="w-fit mx-auto p-2 bg-gray-200/60 rounded-lg text-sm">{{moment().locale('es').format('DD [de] MMMM')}}</div>
                <div v-for="mensaje in messages" :class="['max-w-[90%]', mensaje.role =='user' ? 'self-end' : 'self-start']">
                    <div v-if="isMascotaMessage(mensaje)" :class="['p-3 bg-gray-200 rounded-lg flex flex-col ',mensaje.role == 'user' ? 'bg-primary-100/60' : 'bg-refugio-100/60']">
                        <div class="pb-3">{{ mensaje.content }}</div>
                        <div class="flex flex-row gap-3 flex-wrap">
                            <div v-for="mascota in mensaje.mascotas" class="flex flex-col gap-1 border border-refugio-500 rounded-lg p-3  bg-refugio-200 hover:bg-refugio-300 cursor-pointer" @click="() => verAnimal(mascota)">
                                <img v-if="mascota.imagen" :src="mascota.imagen" class="w-20 p-3"/>
                                <SinImagen v-else class="w-20"></SinImagen>
                                <div class="font-bold text-sm">{{ mascota.nombre}}</div>
                                <div class="text-wrap">{{ mascota.raza}}</div>
                            </div>
                        </div>
                        <div class="text-sm text-gray-500 w-fit self-end">{{ mensaje.time.format('HH:mm')}}</div>

                    </div>
                    <div v-else :class="['p-3 bg-gray-200 rounded-lg flex flex-col ',mensaje.role == 'user' ? 'bg-primary-100/60' : 'bg-refugio-100/60']">
                        <div class="">{{ mensaje.content }}</div>
                        <div class="text-sm text-gray-500 w-fit self-end">{{ mensaje.time.format('HH:mm')}}</div>
                    </div>
                </div>
                <div v-if="loading">
                    <div class="p-6 rounded-lg flex flex-col bg-refugio-100/60 w-fit">
                        <div class="dot-typing"></div>
                    </div>
                </div>
            </div>
            <div class="p-2 flex flex-row gap-1">
                <InputText :maxlength="150" v-model="currentMessage" @keyup.enter="() => sendMessage()" fluid placeholder="Escribí tu consulta ..."></InputText>
                <Button class="" icon="pi pi-send" @click="sendMessage" :disabled="loading"></Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dot-typing {
    position: relative;
    left: -9999px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #564394;
    color: #564394;
    box-shadow: 9984px 0 0 0 #564394, 9999px 0 0 0 #564394, 10014px 0 0 0 #564394;
    animation: dot-typing 1.5s infinite linear;
}

@keyframes dot-typing {
    0% {
        box-shadow: 9984px 0 0 0 #564394, 9999px 0 0 0 #564394, 10014px 0 0 0 #564394;
    }
    16.667% {
        box-shadow: 9984px -10px 0 0 #564394, 9999px 0 0 0 #564394, 10014px 0 0 0 #564394;
    }
    33.333% {
        box-shadow: 9984px 0 0 0 #564394, 9999px 0 0 0 #564394, 10014px 0 0 0 #564394;
    }
    50% {
        box-shadow: 9984px 0 0 0 #564394, 9999px -10px 0 0 #564394, 10014px 0 0 0 #564394;
    }
    66.667% {
        box-shadow: 9984px 0 0 0 #564394, 9999px 0 0 0 #564394, 10014px 0 0 0 #564394;
    }
    83.333% {
        box-shadow: 9984px 0 0 0 #564394, 9999px 0 0 0 #564394, 10014px -10px 0 0 #564394;
    }
    100% {
        box-shadow: 9984px 0 0 0 #564394, 9999px 0 0 0 #564394, 10014px 0 0 0 #564394;
    }
}
</style>