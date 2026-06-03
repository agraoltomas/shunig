import type { User } from '@/lib/tipos/usuarios'
import type { IMascota } from '@/lib/tipos/mascotas'

import type { Maybe, MessageResponse } from '@/lib/tipos/generics'

export enum TipoSolicitud {
    Adopcion = 'adopcion',
    Transito = 'transito'
}
export interface IDetalleSolicitud {
    id_detalle_solicitud: number,
    fecha?: string,
    id_usuario: number,
    tipo_vivienda: string,
    tiene_patio: boolean,
    vive_adentro: boolean,
    cantidad_personas: number,
    hay_ninios: boolean,
    tuvo_mascotas: boolean,
    tiene_mascotas_actualmente: boolean,
    mascotas_vacunadas: boolean,
    mascotas_castradas: boolean,
    horas_solo: number,
    puede_cubrir_gastos: boolean,
    motivo: string,
    experiencia_transito?: boolean,
    tiempo_disponible_dias?: number,
}


export interface ISolicitud {
    fecha?: string,
    id_usuario: number,
    tipo_vivienda: string,
    tiene_patio: boolean,
    vive_adentro: boolean,
    cantidad_personas: number,
    hay_ninios: boolean,
    tuvo_mascotas: boolean,
    tiene_mascotas_actualmente: boolean,
    mascotas_vacunadas: boolean,
    mascotas_castradas: boolean,
    horas_solo: number,
    puede_cubrir_gastos: boolean,
    motivo: string,
    experiencia_transito?: boolean,
    tiempo_disponible_dias?: number,
    responsable_solicitud: string,
    compromiso: boolean,
    animales_transitados: Maybe<number>
}


export interface IDatosSolicitud {
    id_usuario: number,
    id_animal: number,
    tipo_solicitud: TipoSolicitud,
    id_detalle_solicitud: number,
    compromiso: boolean,
    responsable_principal: string,
    fecha_desde?: string,
    fecha_hasta?: string,
    id_solicitud: number,
    animal_nombre?: string,
    fecha_creacion: string,
    raza: string,
    imagen: string,
    motivo: string,
    id_estado: string,
    estado: string
}

export interface ISolicitudCompleta extends IDatosSolicitud {
    detalle: IDetalleSolicitud,
    usuario: User,
    animal: IMascota
}
