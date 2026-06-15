<script setup lang="ts">
//import logo from '@/assets/images/logo_shunig_blanco_trans.png'
import { type Ref, ref, useTemplateRef } from 'vue'
import moment, { type Moment } from 'moment/moment'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { useAxios } from '@/lib/axios.ts'
import type { Maybe } from '@/lib/tipos/generics'

const {unwrap} = useResponse()
const {axios} = useAxios()

moment.locale('es-ar')
interface BasicMessage{
    content: string,
    role: ('chat'|'user'),
    time: Moment,
    type: ('message'|'content')
}

const {loading,stopLoading,startLoading} = useLoadingComposable()
const messages: Ref<BasicMessage[]> = ref([{
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
    modulo: ('interaccion_basica'),
    message: string,
    results: Maybe<any[]>
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
        }
    }
    stopLoading()
}


const emit = defineEmits<{close:[]}>()
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
                <div v-for="mensaje in messages" :class="['max-w-[70%] p-3 bg-gray-200 rounded-lg flex flex-col ',mensaje.role == 'user' ? 'self-end bg-primary-100/60' : 'self-start bg-refugio-100/60']">
                    <div class="">{{ mensaje.content }}</div>
                    <div class="text-sm text-gray-500 w-fit self-end">{{ mensaje.time.format('HH:mm')}}</div>
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

</style>