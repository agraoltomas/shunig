import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import type { Maybe } from '@/lib/tipos/generics'
import { useJWTToken } from '@/lib/token.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useAxios } from '@/lib/axios.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { rutas_api } from '@/rutas_api.ts'
import { isProcessReponse, useProcess } from '@/lib/utils/process.ts'


export enum TipoNotificacion {
    Prueba = 'prueba',
    SolicitudCreada = 'solicitud_creada',
    IngresoAnimal = 'ingreso_animal',
    SolicitudAdopcion = 'solicitud_adopcion',
    SolicitudTransito = 'solicitud_transito',
    EventoVacunacion = 'evento_vacunacion',
    StockBajo = 'stock_bajo',
    DonacionRecibida = 'donacion_recibida',
    AnimalAdoptado = 'animal_adoptado',
    AnimalEnTratamiento = 'animal_en_tratamiento',
    VacunaVencida = 'vacuna_vencida',
    Recordatorio = 'recordatorio'
}

type MessageListener = (ws: WebSocket, event: MessageEvent<any>) => void

export interface INotificacion {
    tipo: TipoNotificacion,
    id_notificacion: number,
    titulo: string,
    descripcion: string,
    leida: boolean,
    id_usuario: Maybe<string>,
    id_refugio: Maybe<string>,
    url_destino: string,
    fecha_creacion: Maybe<string>,
}

const {axios} = useAxios()
const {unwrap} = useResponse()
const {finish, Process} =useProcess()

export const useWebsocket = (url: string) => {
    let ws: Ref<Maybe<WebSocket>> = ref(null)// WebSocket connection
    const isConnected = ref(false) // Connection status
    const retryInterval = 3000 // Time interval for retrying connection (ms)
    let retryTimeout: Ref<Maybe<number>> = ref(null) // Timeout reference for reconnection
    const onMessage: Ref<MessageListener[]> = ref([
        (ws,ev) => {
            console.log("DEBUG",ws,ev)
        }
    ])
    const connectWebSocket = () => {
        const { getToken } = useJWTToken()
        ws.value = new WebSocket(`ws://${url}`, getToken() ?? '?')
        ws.value.onopen = (ev) => {
            console.log('WebSocket connected.', ev)
            isConnected.value = true
            if (retryTimeout.value) {
                clearTimeout(retryTimeout.value) // Clear the retry timeout on successful connection
                retryTimeout.value = null
            }
        }

        ws.value.onmessage = (ev) => {
            console.log('Received message', ev)
            onMessage.value.forEach((fn) => {
                fn(ws.value!, ev)
            })
        }

        ws.value.onerror = (error) => {
            console.error('WebSocket error:', error)
            isConnected.value = false
        }

        ws.value.onclose = () => {
            console.log('WebSocket closed. Retrying...')
            isConnected.value = false
            attemptReconnect() // Trigger reconnection process when the connection closes
        }
    }

    const attemptReconnect = () => {
        if (!isConnected.value) {
            retryTimeout.value = setTimeout(() => {
                console.log('Attempting to reconnect...')
                connectWebSocket()
            }, retryInterval)
        }
    }
    const addOnMessageListener = (fn: MessageListener) => {
        onMessage.value.push(fn)
    }
    return {
        connectWebSocket,
        attemptReconnect,
        ws,
        isConnected,
        retryInterval,
        retryTimeout,
        addOnMessageListener
    }

}


export const useNotificationStore = defineStore('notificaciones', () => {

    const notificaciones: Ref<INotificacion[]> = ref([])
    const { addOnMessageListener, ws, retryTimeout,connectWebSocket } = useWebsocket('localhost:8080')
    console.log('ACA')

    const addNotification = (message: INotificacion) => {
        notificaciones.value.push(message)
    }

    const count = computed(() => {
        return notificaciones.value.map((n) => {
            return <number>(n.leida ? 0 : 1)
        }).reduce((n, c) => n + c, 0)
    })
    const sortedNotifications = computed(() => {
        return notificaciones.value.sort((a, b) => {
            return a.fecha_creacion ?? '' > (b.fecha_creacion ?? '') ? 1 : -1
        })
    })
    addOnMessageListener((ws, event) => {
        console.log('Received message', event)
        try {
            const notificacion = JSON.parse(event.data)
            if(isProcessReponse(notificacion)) {
                finish(notificacion.process)
            }else{
                addNotification(notificacion)

            }
        } catch (error) {
            console.error(error)
        }
    })
    const leerNotificacion = (n: INotificacion) => {
        const not = notificaciones.value.find((nnot) => n == nnot)
        console.log('!', not)
        if (not) {
            not.leida = true
        }
        ws.value?.send(JSON.stringify({
            tipo: "LEER_NOTIF",
            id:n?.id_notificacion
        }))
    }
    const borrarNotificacion = (n: INotificacion) => {
        console.log("!",n)
        const i = notificaciones.value.findIndex((notificacion) => {
            console.log(notificacion.id_notificacion, n.id_notificacion)
            return notificacion.id_notificacion == n.id_notificacion
        })
        console.log('!', i)
        if (i !== -1){
            notificaciones.value.splice(i, 1);
            notificaciones.value= notificaciones.value
        }
        ws.value?.send(JSON.stringify({
            tipo: "BORRAR_NOTIF",
            id:n.id_notificacion
        }))

    }
    const leerTodas = (ns: number[]) =>{
        const pr = Process()
        ws.value?.send(JSON.stringify({
            tipo: "LEER_NOTIF",
            ids: ns,
            process: pr.id
        }))
        notificaciones.value.forEach((n) => n.leida = true)

        return pr.promise
    }

    const borrarTodas = (ns: number[]) =>{
        const pr = Process()
        ws.value?.send(JSON.stringify({
            tipo: "BORRAR_NOTIF",
            ids: ns,
            process: pr.id
        }))
        notificaciones.value = []
        return pr.promise
    }

    const unmount = () => {
        if (ws.value) {
            ws.value.close()
        }
        if (retryTimeout.value) {
            clearTimeout(retryTimeout.value)
        }
    }
    const getAllNotifications = async () => {
        const authStore = useAuthStore()

        if(!authStore.user)return []
        const r = await unwrap<INotificacion[]>(axios.value.get(rutas_api.usuario.BASE + `/${authStore.user.id_usuario}/notificaciones`))
        console.log(r)
        notificaciones.value = r.data
        return r.data
    }
    connectWebSocket()
    return {
        unmount,
        leerNotificacion,
        borrarNotificacion,
        sortedNotifications,
        notificaciones,
        addNotification,
        count,
        getAllNotifications,
        leerTodas,
        borrarTodas
    }
})