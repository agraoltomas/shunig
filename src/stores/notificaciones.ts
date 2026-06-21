import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import type { Maybe } from '@/lib/tipos/generics'
import { useJWTToken } from '@/lib/token.ts'

export enum TipoNotificacion {
    Prueba = "prueba",
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
export const useNotificationStore = defineStore("notificaciones", () => {

    const notificaciones: Ref<INotificacion[]> = ref([
    ])
    const  addNotification = (message: INotificacion) =>  {
        notificaciones.value.push(message);
    }

    const count = computed(() => {
        return notificaciones.value.map((n) => {
            return <number>(n.leida ? 0 : 1)
        }).reduce((n, c ) =>  n + c,0)
    })
    const sortedNotifications = computed(() => {
        return notificaciones.value.sort((a,b) => {
            return a.fecha_creacion ?? '' > (b.fecha_creacion ?? '') ? 1 : -1
        })
    })
    const leerNotificacion = (n: INotificacion) => {
        const not = notificaciones.value.find((nnot) => n == nnot)
        console.log("!",not)
        if(not){
        not.leida = true
        }
    }
    const unmount= () => {
        if (ws.value) {
            ws.value.close()
        }
        if (retryTimeout) {
            clearTimeout(retryTimeout)
        }
    }
    return {
        unmount,
        leerNotificacion,
        sortedNotifications,
        notificaciones,
        addNotification,
        count
    }
});