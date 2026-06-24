<script setup lang="ts">
import logo from '@/assets/images/logo_shunig_blanco_trans.png'
import { onMounted, type Ref, ref, useTemplateRef, watch } from 'vue'
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
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import type {
    ButtonMessage,
    ChatResponse,
    EventoResumen,
    MascotaMessage,
    Message,
    VacunaMessage
} from '@/components/chatbot/chat'

const props = defineProps<{ showing: boolean }>()
const emit = defineEmits<{ close: [] }>()
const userStore = useAuthStore()
const router = useRouter()
const { unwrap } = useResponse()
const { axios } = useAxios()
const { loading, stopLoading, startLoading } = useLoadingComposable()

moment.locale('es-ar')

const messages: Ref<Message[]> = ref([])
const modales = useModalStore()
const firstOpen = ref(false)
const messageWindow = useTemplateRef('messageWindow')
const currentMessage = ref(null)
type Contexts = ('main'|'buscar'|'cuidado'|'vacunacion')
const context = ref('main')

const isMascotaMessage = (m: Message): m is MascotaMessage => {
    return !!m.mascotas
}
const isVacunasMessage = (m: Message): m is VacunaMessage => {
    return !!m.vacunas
}
const isButtonMessage = (m: Message): m is ButtonMessage => {
    return !!m.botones
}


const saveNewMessage = (message: string) => {
    messages.value.push({
        content: message,
        role: 'user',
        time: moment(),
        type: 'message'
    })
    console.log(messageWindow.value?.scrollTop, messageWindow.value?.scrollHeight)
    if (messageWindow.value) messageWindow.value.scrollTop = messageWindow.value.scrollHeight

}
const ask = async (message: string): Promise<Maybe<ChatResponse>> => {
    try {
        const r = await unwrap(axios.value.post(rutas_api.chatbot.PREGUNTAR(), {
            pregunta: message
        }))
        console.log(r)
        return r.data
    } catch (e) {
        return null
    }
}
const sendMessage = async () => {
    if (!currentMessage.value) return
    startLoading()
    const message = currentMessage.value
    currentMessage.value = null
    saveNewMessage(message)
    const response = await ask(message)
    console.log(response)
    if (response) {
        switch (response.modulo) {
            case 'interaccion_basica':
                messages.value.push({
                    content: response.message,
                    type: 'message',
                    role: 'chat',
                    time: moment()
                })
                break
            case 'mascotas':
                if (response.results && response.results.length > 0) {
                    messages.value.push({
                        content: response.message,
                        type: 'content',
                        role: 'chat',
                        time: moment(),
                        mascotas: <IMascota[]>response.results
                    })
                } else {
                    messages.value.push({
                        content: 'Parece que no hay resultados para tu busqueda, te recomiendo ampliar la busqueda un poco',
                        type: 'content',
                        role: 'chat',
                        time: moment(),
                        mascotas: []
                    })
                }
                break
            case 'vacunacion':
                if (response.results && response.results.length > 0) {
                    messages.value.push({
                        content: response.message,
                        type: 'content',
                        role: 'chat',
                        time: moment(),
                        vacunas: <EventoResumen[]>response.results
                    })
                } else {
                    messages.value.push({
                        content: 'Parece que no hay resultados para tu busqueda, te recomiendo ampliar la busqueda un poco',
                        type: 'content',
                        role: 'chat',
                        time: moment(),
                        vacunas: []
                    })
                }
        }
    } else {
        messages.value.push({
            type: 'message',
            time: moment(),
            content: 'Perdon! parece que estamos teniendo un inconveniente',
            role: 'chat'
        })
    }
    if (messageWindow.value) messageWindow.value.scrollTop = messageWindow.value.scrollHeight
    stopLoading()
}
const verAnimal = (m: IMascota) => {
    if (userStore.user) {
        router.push(`/usuario/adoptar?m=${m.id_animal}`)
    } else {
        modales.abrir('registro', { to: `/usuario/adoptar?m=${m.id_animal}` })
    }
}
const verEvento = (v: any) => {

}
onMounted(async () => {

})
const showButtons = (botones: ChatButton[]) => {

    messages.value.push({
        content: '',
        role: 'chat',
        time: moment(),
        type: 'content',
        botones: botones,
    })
}
const addChatMessage = (message: string) => {
    messages.value.push({
        content: message,
        role: 'chat',
        time: moment(),
        type: 'message'
    })
}
watch(() => props.showing, () => {
    if (props.showing && !firstOpen.value) {
        startLoading()
        setTimeout(() => {
            addChatMessage('Hola, soy Shuni! en que te puedo ayudar?')
            addChatMessage('Podes preguntarme sobre los siguientes temas')
            showButtons([{
                action: () => {
                    if(context.value != 'main')return;
                    context.value = 'buscar'
                    addChatMessage('¡Qué alegría enorme que estés pensando en dar este paso!')
                    addChatMessage('Ya sea que decidas adoptar para darle un hogar definitivo o transitar para ser su puente hacia una vida mejor, le estás cambiando el destino a un animal que lo necesita un montón. El mundo necesita más corazones dispuestos como el tuyo.')
                    if (!userStore.user) {
                        addChatMessage('Te recomendamos registrarte primero.')
                        showButtons([{
                            label: 'Registrarme', action:  () => {
                                modales.abrir('registro', { to: `/usuario/adoptar` })
                                emit('close')
                            }
                        }])
                    }
                    addChatMessage('Contame un poco sobre la mascota que estas buscando')
                    }, label: 'Buscar mascotas'
                },
                {
                    action: () => {
                    }, label: 'Tips de cuidado'
                },
                {
                    action: () => {
                    }, label: 'Eventos de vacunacion'
                }])
            firstOpen.value = true
            stopLoading()
        }, 1000)
    }
})
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
            <div ref="messageWindow" class="grow p-1 px-2 overflow-y-auto flex flex-col gap-3 pt-3 pr-2">
                <div class="w-fit mx-auto p-2 bg-gray-200/60 rounded-lg text-sm">
                    {{ moment().locale('es').format('DD [de] MMMM') }}
                </div>
                <div v-for="mensaje in messages"
                     :class="['max-w-[90%]', mensaje.role =='user' ? 'self-end' : 'self-start']">
                    <div v-if="isMascotaMessage(mensaje)"
                         :class="['p-3 rounded-lg flex flex-col ',mensaje.role == 'user' ? '' : '']">
                        <!--                        <div class="pb-3">{{ mensaje.content }}</div>-->
                        <div class="flex flex-row gap-3 flex-wrap">
                            <div v-for="mascota in mensaje.mascotas"
                                 class="flex flex-col gap-1 border border-refugio-500 rounded-lg p-3  bg-refugio-200 hover:bg-refugio-300 cursor-pointer"
                                 @click="() => verAnimal(mascota)">
                                <img v-if="mascota.imagen" :src="mascota.imagen" class="w-20 p-3" />
                                <SinImagen v-else class="w-20"></SinImagen>
                                <div class="font-bold text-sm">{{ mascota.nombre }}</div>
                                <div class="text-wrap">{{ mascota.raza }}</div>
                            </div>
                        </div>
                        <div class="text-sm text-gray-500 w-fit self-end">{{ mensaje.time.format('HH:mm') }}</div>

                    </div>
                    <div v-else-if="isVacunasMessage(mensaje)"
                         :class="['p-3 bg-gray-200 rounded-lg flex flex-col ',mensaje.role == 'user' ? '' : '']">
                        <!--                        <div class="pb-3">{{ mensaje.content }}</div>-->
                        <div class="flex flex-col gap-3 flex-wrap">
                            <div v-for="evento in mensaje.vacunas"
                                 class="flex flex-row gap-1 border border-refugio-500 rounded-lg p-3  bg-refugio-200 hover:bg-refugio-300 cursor-pointer"
                                 @click="() => verEvento(evento)">
                                <div
                                    class="flex flex-col gap-1 px-3 bg-primary-100 rounded-lg items-center justify-between py-4 w-fit h-fit">
                                    <i class="pi pi-calendar text-primary-600 text-xl"></i>
                                    <span class="text-2xl text-bold">{{ moment(evento.fecha).format('DD') }}</span>
                                    <span
                                        class="text-2xl text-bold text-primary-400">{{ moment(evento.fecha).format('MMM')
                                        }}</span>
                                </div>
                                <div class="flex flex-col pl-3">
                                    <span
                                        class="text-sm pt-2 text-gray-800 font-bold text-3xl">{{ evento.vacuna }}</span>
                                    <span class="flex flex-row gap-1"> <i class="pi pi-home p-1"></i><div>{{ evento.refugio }}</div></span>
                                    <span class="py-3"><i
                                        class="pi pi-users p-1"></i>Cupo Total: {{ evento.cupo }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="text-sm text-gray-500 w-fit self-end">{{ mensaje.time.format('HH:mm') }}</div>

                    </div>
                    <div v-else-if="isButtonMessage(mensaje)"
                         :class="['rounded-lg flex flex-col pl-3',mensaje.role == 'user' ? '' : '']">
                        <!--                        <div class="pb-3">{{ mensaje.content }}</div>-->
                        <div class="flex flex-col gap-3 flex-wrap">
                            <div v-for="boton in mensaje.botones" class="flex flex-row gap-1 rounded-lg cursor-pointer"
                                 @click="() => boton.action()">
                                <Button :label="boton.label" class="bg-refugio-500/80 border-refugio-500"></Button>
                            </div>
                        </div>
                    </div>
                   <TextMessage v-else :mensaje="mensaje"></TextMessage>
                </div>
                <div v-if="loading">
                    <div class="p-6 rounded-lg flex flex-col bg-refugio-100/60 w-fit">
                        <div class="dot-typing"></div>
                    </div>
                </div>
            </div>
            <div class="p-2 flex flex-row gap-1">
                <InputText :maxlength="150" v-model="currentMessage" @keyup.enter="() => sendMessage()" fluid
                           placeholder="Escribí tu consulta ..."></InputText>
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